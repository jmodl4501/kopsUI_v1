"""Run the repository's menu_cases.json steps against the local React + eGovFrame app.

Uses Python Playwright **sync** with the installed Google Chrome.
The case data, step order, labels, sample values, screen URIs and expected URI
slugs are taken verbatim from kopsUI_v1/menu_tests/menu_cases.json; only the
browser bridge (CDP on the real HIRA site -> local DOM) is replaced.

Usage:
  python3 local_menu_runner.py --max 5
  python3 local_menu_runner.py --ids OPAA020000,OPAB050000
  python3 local_menu_runner.py --all --workers 4
"""
from __future__ import annotations

import argparse
import json
import os
import re
import time
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
CASE_FILE = Path("/home/user/kops-react/data/menu_cases.json")
OUT = ROOT / "out"
BASE = os.environ.get("KOPS_BASE_URL", "http://127.0.0.1:3000")
CHROME = os.environ.get("CHROME_PATH", "/usr/bin/google-chrome")
SLUG = lambda uri: str(uri).rsplit("/", 1)[-1]  # noqa: E731
ALLOWED = {"note", "wait", "select", "fill", "click", "popup", "detail",
           "expect", "expect_any", "expect_screen", "dialog"}


class CaseRunner:
    def __init__(self, case: dict, page: Any, options: argparse.Namespace):
        self.case = case
        self.page = page
        self.options = options
        self.responses: list[dict] = []
        self.steps: list[dict] = []
        self.errors: list[str] = []
        self.mark = 0
        self._on_response = lambda response: self.responses.append({
            "url": response.url, "status": response.status,
        })
        page.on("response", self._on_response)

    def resolve(self, value: Any) -> str:
        if isinstance(value, str) and value.startswith("@sample."):
            return str(self.case.get("sample", {}).get(value.split(".", 1)[1], ""))
        return "" if value is None else str(value)

    def record(self, step: dict, status: str, detail: str = "") -> None:
        self.steps.append({
            "do": step.get("do"), "label": step.get("label"),
            "menu_id": step.get("menu_id"), "uri": step.get("uri"),
            "status": status, "detail": detail[:240],
        })
        if status == "FAIL":
            self.errors.append(f"{step.get('do')} {step.get('label') or step.get('uri') or ''}: {detail[:120]}")

    def current_app_uri(self) -> str:
        return self.page.locator("main[data-app-uri]").get_attribute("data-app-uri") or ""

    def wait_screen(self, app_uri: str) -> bool:
        try:
            self.page.wait_for_function(
                "(uri) => document.querySelector('main[data-app-uri]')?.getAttribute('data-app-uri') === uri",
                arg=app_uri, timeout=self.options.wait_ms,
            )
            return True
        except Exception:
            return False

    def hit(self, slugs: list[str], accept: set[int], since: int) -> list[dict]:
        return [r for r in self.responses[since:]
                if any(SLUG(s) in r["url"] for s in slugs) and r["status"] in accept]

    def open(self) -> None:
        self.page.goto(f"{BASE}/menu/{self.case['menu_id']}", wait_until="domcontentloaded")
        app_uri = (self.case.get("screen") or {}).get("app_uri") or ""
        if app_uri:
            self.wait_screen(app_uri)
        self.page.wait_for_timeout(600)

    def drain_dialogs(self) -> None:
        """Close result dialogs between steps (same idea as the original runner)."""
        for _ in range(3):
            dialog = self.page.locator('[role="dialog"]:visible')
            if dialog.count() == 0:
                return
            confirm = dialog.locator('button:has-text("확인")').first
            if confirm.count() == 0:
                return
            try:
                confirm.click(timeout=1500)
                self.page.wait_for_timeout(100)
            except Exception:
                return

    def step(self, item: dict) -> None:
        do = item.get("do")
        if do in ("select", "fill", "click", "popup"):
            self.drain_dialogs()
        if do == "note":
            self.record(item, "INFO", str(item.get("text", "")))
            return
        if do == "wait":
            self.page.wait_for_timeout(int(item.get("ms", 300)))
            self.record(item, "PASS")
            return
        if do in ("select", "fill"):
            label = item["label"]
            value = self.resolve(item.get("value"))
            try:
                field = self.page.get_by_label(label, exact=True).first
                if do == "select":
                    field.select_option(value)
                else:
                    field.fill(value)
                self.record(item, "PASS", f"{label}={value}")
            except Exception as error:
                self.record(item, "FAIL", f"{type(error).__name__}: {str(error)[:150]}")
            return
        if do in ("click", "popup"):
            label = item["label"]
            self.mark = len(self.responses)
            try:
                self.page.get_by_role("button", name=re.compile(f"^{re.escape(label)}$")).first.click()
                self.page.wait_for_timeout(min(int(item.get("settle", 600)), 2500))
                if do == "popup":
                    dialog = self.page.locator('[role="dialog"]:visible')
                    if dialog.count() == 0:
                        self.record(item, "WARN", "dialog 미관측")
                        return
                self.record(item, "PASS", f"click {label}")
            except Exception as error:
                self.record(item, "FAIL", f"{type(error).__name__}: {str(error)[:150]}")
            return
        if do == "detail":
            target = item.get("menu_id")
            self.mark = len(self.responses)
            self.page.goto(f"{BASE}/menu/{target}", wait_until="domcontentloaded")
            app_uri = item.get("app_uri") or ""
            ok = self.wait_screen(app_uri) if app_uri else True
            self.page.wait_for_timeout(800)  # let client-side URI fetches land
            self.record(item, "PASS" if ok else "WARN",
                        f"open {target} -> {self.current_app_uri()}")
            return
        if do == "expect_screen":
            app_uri = item.get("app_uri") or (self.case.get("screen") or {}).get("app_uri") or ""
            actual = self.current_app_uri()
            ok = bool(app_uri) and actual == app_uri
            self.record(item, "PASS" if ok else "WARN", f"expect={app_uri} actual={actual}")
            return
        if do == "dialog":
            keyword = str(item.get("text", ""))
            dialogs = self.page.locator('[role="dialog"]:visible').all_text_contents()
            ok = any(keyword in text for text in dialogs)
            self.record(item, "PASS" if ok else "WARN", f"dialog '{keyword}'")
            return
        if do in ("expect", "expect_any"):
            slugs = ([SLUG(item["uri"])] if do == "expect"
                     else [SLUG(uri) for uri in item.get("uris", [])])
            accept = set(item.get("accept") or ([item["status"]] if item.get("status") else [200, 410]))
            hits = self.hit(slugs, accept, self.mark)
            required = bool(item.get("required", False))
            status = "PASS" if hits else ("FAIL" if required else "WARN")
            self.record(item, status,
                        f"{','.join(slugs[:3])} ({len(slugs)} 종류) hits={len(hits)} status={sorted({h['status'] for h in hits})}")
            return
        self.record(item, "WARN", f"unknown action {do}")

    def run(self) -> dict:
        started = time.time()
        try:
            self.open()
            steps = self.case.get("steps", [])
            if self.options.max_steps:
                steps = steps[:self.options.max_steps]
            for item in steps:
                if item.get("do") not in ALLOWED:
                    self.record(item, "WARN", "not in ALLOWED")
                    continue
                self.step(item)
        except Exception as error:
            self.errors.append(f"runner: {type(error).__name__}: {error}")
        statuses = [s["status"] for s in self.steps]
        return {
            "menu_id": self.case["menu_id"],
            "path": self.case.get("path", ""),
            "ok": not any(s == "FAIL" for s in statuses) and not self.errors,
            "steps": len(self.steps),
            "pass": statuses.count("PASS"),
            "warn": statuses.count("WARN"),
            "fail": statuses.count("FAIL"),
            "errors": self.errors,
            "detail": self.steps,
            "elapsed_sec": round(time.time() - started, 2),
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="run all 84 cases")
    parser.add_argument("--max", type=int, default=0, help="limit number of cases")
    parser.add_argument("--ids", type=str, default="", help="comma-separated menu ids")
    parser.add_argument("--max-steps", type=int, default=0, help="truncate steps per case")
    parser.add_argument("--wait-ms", type=int, default=4000, help="screen wait timeout")
    parser.add_argument("--headed", action="store_true", help="show browser window")
    parser.add_argument("--report-prefix", default="local_menu_report")
    options = parser.parse_args()

    cases = json.loads(CASE_FILE.read_text(encoding="utf-8"))["cases"]
    if options.ids:
        wanted = set(options.ids.split(","))
        cases = [c for c in cases if c["menu_id"] in wanted]
    elif options.max:
        cases = cases[:options.max]
    elif not options.all:
        cases = cases[:5]

    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=CHROME,
            headless=not options.headed,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        for index, case in enumerate(cases, start=1):
            result = CaseRunner(case, page, options).run()
            results.append(result)
            flag = "PASS" if result["ok"] else "FAIL"
            print(f"[{index:02d}/{len(cases)}] {case['menu_id']} {flag} "
                  f"pass={result['pass']} warn={result['warn']} fail={result['fail']} "
                  f"({result['elapsed_sec']}s)", flush=True)
        browser.close()

    summary = {
        "base_url": BASE,
        "total": len(results),
        "passed": sum(1 for r in results if r["ok"]),
        "failed": sum(1 for r in results if not r["ok"]),
        "results": results,
    }
    (OUT / f"{options.report_prefix}.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = [f"# KOPS local Playwright sync report", "",
             f"- cases: {summary['total']} / pass: {summary['passed']} / fail: {summary['failed']}",
             ""]
    for result in results:
        lines.append(f"## {result['menu_id']} — {'PASS' if result['ok'] else 'FAIL'}")
        lines.append(f"- {result['path']} · pass={result['pass']} warn={result['warn']} fail={result['fail']}")
        for error in result["errors"][:6]:
            lines.append(f"  - {error}")
        lines.append("")
    (OUT / f"{options.report_prefix}.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"\nTOTAL {summary['passed']}/{summary['total']} PASS — report: {OUT / (options.report_prefix + '.md')}")
    raise SystemExit(0 if summary["failed"] == 0 else 1)


if __name__ == "__main__":
    main()
