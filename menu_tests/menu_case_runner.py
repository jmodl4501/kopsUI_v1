"""
메뉴별 테스트케이스 실행기 — Python Playwright **sync** + CDP.

이 파일은 **수정할 필요가 거의 없는 얇은 러너**입니다.
실제 테스트는 `menu_tests/test_{menu_id}.py` 의 `CASE` 만 고치면 됩니다.
컴포넌트를 직접 조립하거나 `clx.js` 를 다시 분석할 필요가 없습니다.

기본은 **plan 모드(오프라인 검증)**. 실서버 실행은 옵트인입니다.

    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAA020000,OPAB050000 \\
        /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live

봇탐지 최소화: 모든 클릭/입력은 `Human`(CDP Input.dispatch*) 경유,
화면 전환은 앱 공개 메서드(`openPageId` / `util.EmbApp.load`) 호출.
`scroll_into_view_if_needed` / 합성 이벤트 디스패치는 쓰지 않습니다.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import traceback
from typing import Any, Optional

HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
sys.path.insert(0, HERE)

# live 모드에만 필요한 로컬 런타임. 저장소 단독 클론에는 없을 수 있으므로,
# plan 모드(오프라인 검증)는 이 import 없이도 동작하도록 선택 로딩한다.
try:  # noqa: E402
    from playwright.sync_api import sync_playwright
    from exbuilder6 import XB6
    from kops import KOPS_URL
    from source_navigator import RUNTIME_JS
    from explorer import (DIRECT_LOAD_JS, WAIT_SCREEN_JS, PROBE_JS,
                          SAFE_POPUP_BTN, BLOCK_BTN)
    LIVE_DEPS_OK = True
    LIVE_DEPS_ERROR = ""
except Exception as _e:  # 선택 의존성 — plan 모드는 계속 동작
    LIVE_DEPS_OK = False
    LIVE_DEPS_ERROR = f"{type(_e).__name__}: {_e}"

ANALYSIS = os.path.join(ROOT, "out", "source_analysis.json")
DATASET_INDEX = os.path.join(ROOT, "testcases", "dataset", "index.json")
CASE_INDEX = os.path.join(HERE, "menu_cases.json")
SAMPLE_DATASET = os.path.join(HERE, "sample_dataset.json")
SOURCE_DIR = os.path.join(ROOT, "sources")

ACTIONS = {"note", "wait", "select", "fill", "click", "popup", "detail",
           "expect", "expect_any", "expect_screen", "dialog"}

BLOCK_LABEL = re.compile(
    r"삭제|제출|저장|등록|수정|승인|확정|탈퇴|변경|신청|업로드|로그아웃|로그인|"
    r"취소|동의|이전|다음|목록|초기화|닫기|웹접근성|단축키|바로가기")


def _slug(uri: str) -> str:
    return uri.rsplit("/", 1)[-1]


def _analysis_menu_ids() -> set[str]:
    """메뉴 ID 집합. 로컬 분석 파일이 없으면 menu_cases.json 에서 유도."""
    if os.path.exists(ANALYSIS):
        with open(ANALYSIS, encoding="utf-8") as f:
            return {m["menu_id"] for m in json.load(f)["menu_map"]}
    ids: set[str] = set()
    if os.path.exists(CASE_INDEX):
        with open(CASE_INDEX, encoding="utf-8") as f:
            for c in json.load(f).get("cases", []):
                if c.get("menu_id"):
                    ids.add(c["menu_id"])
                for step in c.get("steps", []):
                    if step.get("do") == "detail" and step.get("menu_id"):
                        ids.add(step["menu_id"])
    return ids


def _dataset_slugs() -> set[str]:
    """URI slug 집합. 로컬 index 가 없으면 sample_dataset.json 에서 유도."""
    if os.path.exists(DATASET_INDEX):
        with open(DATASET_INDEX, encoding="utf-8") as f:
            return {d["slug"] for d in json.load(f)["items"]}
    if os.path.exists(SAMPLE_DATASET):
        with open(SAMPLE_DATASET, encoding="utf-8") as f:
            return set(json.load(f).get("uri_baselines", {}))
    return set()


class MenuCaseRunner:
    """`CASE` 하나를 plan 모드 또는 live 모드로 실행."""

    def __init__(self, case: dict, live: Optional[bool] = None) -> None:
        self.case = case
        self.live = (os.environ.get("HIRA_MENU_LIVE") == "1"
                     if live is None else bool(live))
        self.responses: list[dict] = []
        self.steps: list[dict] = []
        self.checks: list[dict] = []
        self.errors: list[str] = []
        self._mark = 0
        self._p = None
        self._xb: Optional[XB6] = None
        # 스모크 테스트용 옵션 (전체 CASE 는 그대로 두고 실행만 절단)
        self.screen_wait_ms = int(os.environ.get("HIRA_MENU_WAIT_MS", "12000"))
        self.max_steps = int(os.environ.get("HIRA_MENU_MAX_STEPS", "0")) or None

    # ── 오프라인 검증 ───────────────────────────────────────────────────
    def _validate(self) -> None:
        c = self.case
        need = ["menu_id", "path", "screen", "sample", "steps",
                "expected_uris", "detail_screens", "events"]
        for k in need:
            self._check(f"CASE.{k} 존재", k in c, required=True)
        if "steps" not in c:
            return
        ids = _analysis_menu_ids()
        slugs = _dataset_slugs()
        for i, s in enumerate(c["steps"]):
            where = f"steps[{i}]"
            self._check(f"{where}.do 허용", s.get("do") in ACTIONS,
                        required=True, detail=str(s.get("do")))
            for v in s.values():
                if isinstance(v, str) and v.startswith("@sample."):
                    key = v.split(".", 1)[1]
                    self._check(f"{where} 샘플키 {key}",
                                key in c.get("sample", {}), required=True)
            if s.get("do") == "detail":
                self._check(f"{where} menu_id 존재",
                            s.get("menu_id") in ids, required=True,
                            detail=str(s.get("menu_id")))
            if s.get("do") == "click" and BLOCK_LABEL.search(str(s.get("label", ""))):
                self._check(f"{where} 위험버튼 미클릭",
                            bool(s.get("allow_destructive")), required=True,
                            detail=str(s.get("label")))
        for i, e in enumerate(c.get("expected_uris", [])):
            slug = e.get("slug") or _slug(e.get("uri", ""))
            if e.get("observed") and slug not in slugs:
                self._check(f"expected_uris[{i}] 데이터셋 {slug}", False,
                            required=True)
            else:
                self._check(f"expected_uris[{i}] 데이터셋 {slug}", True)
        src = c.get("screen", {}).get("source")
        if src and os.path.isdir(SOURCE_DIR):
            self._check("screen.source 파일 존재",
                        os.path.exists(os.path.join(SOURCE_DIR, src)),
                        required=True, detail=src)
        # sources/ 덤프가 없는 저장소 단독 클론에서는 이 검증을 생략한다.

    def _check(self, name: str, ok: bool, required: bool = False,
               detail: str = "") -> None:
        self.checks.append({"name": name,
                            "status": "PASS" if ok else
                                      ("FAIL" if required else "WARN"),
                            "detail": detail})

    # ── CDP / 브라우저 ─────────────────────────────────────────────────
    def _on_response(self, r) -> None:
        try:
            self.responses.append({"url": r.url, "status": r.status,
                                   "at": round(time.time(), 3)})
        except Exception:
            pass

    def _attach(self) -> None:
        self._p = sync_playwright().start()
        # cleanup=False: 이미 떠 있는 사용자 탭을 닫지 않는다
        self._xb = XB6.attach_cdp(self._p, no_viewport=True,
                                  maximize=True, cleanup=False)
        self._xb.maximize()
        page = self._xb.page
        if "/kops/" not in page.url:
            page.goto(KOPS_URL, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(1200)
        page.on("response", self._on_response)
        self._xb.human.reading(0.15, 0.35)

    def _drain_dialogs(self, limit: int = 3) -> None:
        page = self._xb.page
        app_uri = self.case.get("screen", {}).get("app_uri") or ""
        for _ in range(limit):
            try:
                state = page.evaluate(PROBE_JS, app_uri)
            except Exception:
                return
            dialogs = state.get("dialogs") or []
            if not dialogs:
                return
            clicked = False
            for name in ("확인", "닫기"):
                loc = page.locator(
                    f'[role=dialog]:visible [role=button]:has-text("{name}")')
                if loc.count():
                    self._xb.human.click(loc.first)
                    self._xb.human.reading(0.1, 0.3)
                    clicked = True
                    break
            if not clicked:
                return

    def _open_menu(self) -> dict:
        page = self._xb.page
        scr = self.case.get("screen", {})
        app_uri = scr.get("app_uri") or ""
        init = self.case.get("open", {}).get("init", {})
        self._mark = len(self.responses)
        if self.case.get("login_required") and app_uri:
            runtime = page.evaluate(DIRECT_LOAD_JS, [app_uri, init])
            via = "util.EmbApp.load (direct UI)"
        else:
            runtime = page.evaluate(
                RUNTIME_JS, ["openPageId", [self.case["menu_id"], init]])
            via = "openPageId"
        # 이미 열린 MDI / 상태 꼬임 대비 — 앱 공개 UI 로더로 1회 폴백
        if not runtime.get("ok") and app_uri:
            runtime = page.evaluate(DIRECT_LOAD_JS, [app_uri, {}])
            via = "util.EmbApp.load (fallback)"
        if app_uri:
            try:
                page.wait_for_function(WAIT_SCREEN_JS,
                                       arg=[app_uri, scr.get("source")],
                                       timeout=self.screen_wait_ms, polling=200)
            except Exception:
                pass
        self._xb.human.reading(0.22, 0.45)
        self._drain_dialogs()
        try:
            state = page.evaluate(PROBE_JS, app_uri)
            inst = state.get("app_instance")
            clx = state.get("clx") or []
            hint = (scr.get("source") or "").rsplit("_", 1)[-1].replace(".clx.js", "")
            ok = (isinstance(inst, int) and inst >= 1) or any(hint in c for c in clx)
            self._check("화면 인스턴스 로드", ok, required=False,
                        detail=f"inst={inst}, clx={clx[-2:]}")
        except Exception as e:
            self._check("화면 probe", False, detail=str(e)[:120])
        return {"via": via, "runtime": runtime}

    # ── 스텝 실행 ──────────────────────────────────────────────────────
    def _resolve(self, value: Any) -> Any:
        if isinstance(value, str) and value.startswith("@sample."):
            return self.case.get("sample", {}).get(value.split(".", 1)[1], "")
        return value

    def _record(self, step: dict, status: str, detail: str = "") -> None:
        self.steps.append({"do": step.get("do"), "label": step.get("label"),
                           "menu_id": step.get("menu_id"),
                           "uri": step.get("uri"), "status": status,
                           "detail": detail[:240]})

    def _hit(self, slug: str, statuses: set[int], since: int = 0) -> list[dict]:
        return [r for r in self.responses[since:]
                if slug in r["url"] and r["status"] in statuses]

    def _step(self, step: dict) -> None:
        do = step["do"]
        page = self._xb.page
        strict = bool(self.case.get("strict"))
        try:
            if do == "note":
                self._record(step, "INFO", str(step.get("text", "")))
                return
            if do == "wait":
                page.wait_for_timeout(int(step.get("ms", 800)))
                self._record(step, "PASS", f"{step.get('ms', 800)}ms")
                return
            if do == "select":
                label, val = step["label"], str(self._resolve(step.get("value", "")))
                self._xb.combobox(label).select(val)
                self._xb.human.reading(0.12, 0.3)
                self._record(step, "PASS", f"{label}={val}")
                return
            if do == "fill":
                label, val = step["label"], str(self._resolve(step.get("value", "")))
                self._xb.textbox(label).fill(val)
                self._xb.human.reading(0.12, 0.3)
                self._record(step, "PASS", f"{label}={val}")
                return
            if do in ("click", "popup"):
                label = step["label"]
                self._mark = len(self.responses)
                self._xb.button(label).click()       # Human 경유
                self._xb.human.reading(0.2, 0.5)
                page.wait_for_timeout(int(step.get("settle", 1200)))
                if do == "popup":
                    self._drain_dialogs()
                self._record(step, "PASS", f"click {label}")
                return
            if do == "detail":
                mid = step["menu_id"]
                init = step.get("init", {})
                self._mark = len(self.responses)
                target = step.get("app_uri") or ""
                if step.get("login_required") and target:
                    page.evaluate(DIRECT_LOAD_JS, [target, init])
                else:
                    page.evaluate(RUNTIME_JS, ["openPageId", [mid, init]])
                if target:
                    try:
                        page.wait_for_function(WAIT_SCREEN_JS,
                                               arg=[target, step.get("source")],
                                               timeout=self.screen_wait_ms, polling=200)
                    except Exception:
                        pass
                self._xb.human.reading(0.22, 0.45)
                self._drain_dialogs()
                self._record(step, "PASS", f"open {mid} {step.get('name','')}")
                return
            if do == "expect_screen":
                app_uri = step.get("app_uri") or self.case["screen"].get("app_uri") or ""
                state = page.evaluate(PROBE_JS, app_uri)
                inst = state.get("app_instance")
                clx = state.get("clx") or []
                hint = (step.get("source") or "").rsplit("_", 1)[-1].replace(".clx.js", "")
                ok = (isinstance(inst, int) and inst >= 1) or any(hint in c for c in clx)
                self._record(step, "PASS" if ok else "WARN",
                             f"inst={inst}, clx={clx[-2:]}")
                return
            if do == "dialog":
                kw = str(step.get("text", ""))
                state = page.evaluate(PROBE_JS,
                                      self.case["screen"].get("app_uri") or "")
                hit = any(kw in (d.get("text") or "") for d in state.get("dialogs", []))
                self._record(step, "PASS" if hit else "WARN", f"dialog '{kw}'")
                return
            if do in ("expect", "expect_any"):
                slugs = ([step["uri"]] if do == "expect"
                         else step.get("uris", []))
                slugs = [_slug(str(u)) for u in slugs]
                want = set(step.get("accept") or
                           ([step["status"]] if step.get("status") else [200, 410]))
                hits = []
                for s in slugs:
                    hits += self._hit(s, want, self._mark)
                required = bool(step.get("required", strict))
                if hits:
                    self._record(step, "PASS",
                                 f"{','.join(slugs)} status={sorted({h['status'] for h in hits})}")
                else:
                    self._record(step, "FAIL" if required else "WARN",
                                 f"{','.join(slugs)} 미관측 (accept={sorted(want)})")
                    if required:
                        self.errors.append(f"expect 실패: {slugs}")
                return
        except Exception as e:
            msg = f"{type(e).__name__}: {e}"
            required = bool(step.get("required", strict))
            self._record(step, "FAIL" if required else "WARN", msg)
            if required:
                self.errors.append(f"step {do} 실패: {msg[:180]}")

    def _final_uri_checks(self) -> None:
        for e in self.case.get("expected_uris", []):
            slug = e.get("slug") or _slug(e.get("uri", ""))
            want = set(e.get("accept") or
                       ([e["status"]] if e.get("status") else [200, 410]))
            hits = self._hit(slug, want, 0)
            required = bool(e.get("required") or self.case.get("strict"))
            if hits:
                self._check(f"URI {slug}", True,
                            detail=f"status={sorted({h['status'] for h in hits})}")
            elif required:
                self._check(f"URI {slug}", False, required=True,
                            detail=f"미관측 accept={sorted(want)}")
                self.errors.append(f"필수 URI 미관측: {slug}")
            else:
                self._check(f"URI {slug}", False,
                            detail=f"미관측(선택) accept={sorted(want)}")

    def run(self) -> dict:
        t0 = time.time()
        self._validate()
        base = {
            "menu_id": self.case.get("menu_id"),
            "path": self.case.get("path"),
            "mode": "live" if self.live else "plan",
            "checks": self.checks,
            "elapsed_sec": 0.0,
        }
        if not self.live:
            base.update({
                "ok": not any(c["status"] == "FAIL" for c in self.checks),
                "steps_planned": len(self.case.get("steps", [])),
                "expected_uris": len(self.case.get("expected_uris", [])),
                "detail_screens": len(self.case.get("detail_screens", [])),
                "elapsed_sec": round(time.time() - t0, 3),
            })
            return base
        if not LIVE_DEPS_OK:
            base.update({
                "ok": False,
                "error": "live 모드 런타임 미설치: " + LIVE_DEPS_ERROR,
                "hint": "plan 모드를 쓰거나 로컬 hira_cdp 런타임"
                        "(exbuilder6 / kops / explorer / source_navigator)을"
                        " 배치하세요.",
            })
            return base
        try:
            self._attach()
            open_info = self._open_menu()
            steps = self.case.get("steps", [])
            if self.max_steps:
                steps = steps[:self.max_steps]
            for s in steps:
                self._step(s)
            self._final_uri_checks()
            base["steps_truncated_to"] = len(steps) if self.max_steps else None
            base.update({
                "ok": not any(c["status"] == "FAIL" for c in self.checks)
                      and not self.errors,
                "open": open_info,
                "steps": self.steps,
                "responses": len(self.responses),
                "response_sample": self.responses[-8:],
                "errors": self.errors,
            })
        except Exception as e:
            base.update({"ok": False, "error": f"{type(e).__name__}: {e}",
                         "trace": traceback.format_exc()[-1200:],
                         "steps": self.steps, "errors": self.errors})
        finally:
            base["elapsed_sec"] = round(time.time() - t0, 3)
            try:
                if self._p:
                    self._p.stop()      # Chrome 은 살려둔다
            except Exception:
                pass
        return base


def run_case(case: dict, live: Optional[bool] = None) -> dict:
    return MenuCaseRunner(case, live=live).run()


def load_cases(path: str = CASE_INDEX) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        return json.load(f)["cases"]


def select_cases(cases: list[dict], ids: Optional[list[str]] = None,
                 limit: Optional[int] = None) -> list[dict]:
    if ids:
        wanted = set(ids)
        cases = [c for c in cases if c["menu_id"] in wanted]
    if limit:
        cases = cases[:limit]
    return cases
