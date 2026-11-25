"""
메뉴 기준 테스트 일괄 실행기.

    /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py
        → 84개 CASE 전부 **plan 모드** 오프라인 검증

    HIRA_MENU_IDS=OPAA020000,OPAB050000 \\
        /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live
        → 지정 메뉴만 CDP sync 로 실서버 재생

    /opt/hira-pwenv/bin/python -m pytest menu_tests/ -q
        → pytest 로도 동일한 plan 검증 (기본)

산출물: out/menu_case_report.json / out/menu_case_report.md
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "out")
sys.path.insert(0, HERE)

from menu_case_runner import load_cases, run_case, select_cases  # noqa: E402

KST = timezone(timedelta(hours=9))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true",
                    help="CDP 로 실서버 재생 (기본은 plan 모드)")
    ap.add_argument("--ids", default=os.environ.get("HIRA_MENU_IDS", ""),
                    help="쉼표 구분 menu_id (미지정 시 전체)")
    ap.add_argument("--max", type=int, default=0,
                    help="최대 실행 메뉴 수 (0=전체)")
    ap.add_argument("--strict", action="store_true",
                    help="CASE.strict 를 True 로 덮어써 경고도 실패 처리")
    ap.add_argument("--max-steps", type=int, default=0,
                    help="live 스모크용 STEP 절단 (0=전체)")
    ap.add_argument("--wait-ms", type=int, default=12000,
                    help="화면 로드 대기 ms (스모크는 1000~3000 권장)")
    ap.add_argument("--report-prefix", default="menu_case_report",
                    help="리포트 파일 접두어 (기본 menu_case_report)")
    a = ap.parse_args()

    if a.max_steps:
        os.environ["HIRA_MENU_MAX_STEPS"] = str(a.max_steps)
    os.environ["HIRA_MENU_WAIT_MS"] = str(a.wait_ms)

    cases = load_cases()
    ids = [x.strip() for x in a.ids.split(",") if x.strip()] or None
    picked = select_cases(cases, ids=ids, limit=a.max or None)
    if a.strict:
        for c in picked:
            c["strict"] = True

    results = []
    for c in picked:
        r = run_case(c, live=True if a.live else False)
        r["title"] = c.get("screen", {}).get("title") or c["path"].split(" > ")[-1]
        r["login_required"] = bool(c.get("login_required"))
        results.append(r)

    counts = Counter("PASS" if r.get("ok") else "FAIL" for r in results)
    report = {
        "generated_at": datetime.now(KST).isoformat(timespec="seconds"),
        "mode": "live" if a.live else "plan",
        "cases_total": len(cases), "cases_run": len(results),
        "counts": dict(counts),
        "PASS": counts.get("FAIL", 0) == 0,
        "results": results,
    }
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, a.report_prefix + ".json"), "w",
              encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    lines = [
        "# 메뉴별 테스트케이스 실행 리포트", "",
        f"- 생성: {report['generated_at']} / mode `{report['mode']}`",
        f"- 전체 CASE **{report['cases_total']}개** / 실행 **{report['cases_run']}개**",
        f"- **PASS {counts.get('PASS',0)} · FAIL {counts.get('FAIL',0)}** → "
        f"`{'PASS' if report['PASS'] else 'FAIL'}`", "",
        "| 메뉴 | 경로 | 모드 | 판정 | 스텝 | URI | 오류 |",
        "|---|---|---|---|---:|---:|---|",
    ]
    for r in results:
        err = (r.get("error") or "; ".join(r.get("errors", [])))[:90]
        lines.append(
            f"| `{r['menu_id']}` | {r['path']} | {r['mode']} | "
            f"{'PASS' if r.get('ok') else 'FAIL'} | "
            f"{len(r.get('steps', [])) or r.get('steps_planned', 0)} | "
            f"{r.get('responses', r.get('expected_uris', 0))} | {err or '-'} |")
    lines += ["", "## plan 모드", "",
              "기본 실행은 브라우저를 열지 않고 `CASE` 구조·샘플키·데이터셋 경로·"
              "상세화면 menu_id·위험버튼 여부를 검증합니다.", "",
              "## live 모드", "",
              "`--live` 또는 `HIRA_MENU_LIVE=1` 일 때만 CDP sync 로 재생합니다. "
              "`HIRA_MENU_IDS` 로 메뉴를 좁히고, `--max` 로 개수를 제한하세요.", ""]
    with open(os.path.join(OUT, a.report_prefix + ".md"), "w",
              encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"[+] {report['mode']} / {report['cases_run']}/{report['cases_total']}건 / "
          f"PASS {counts.get('PASS',0)} FAIL {counts.get('FAIL',0)}")
    print(f"    → out/{a.report_prefix}.json / out/{a.report_prefix}.md")
    for r in results:
        if not r.get("ok"):
            print("    [FAIL]", r["menu_id"],
                  (r.get("error") or "; ".join(r.get("errors", [])))[:160])
    return 0 if report["PASS"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
