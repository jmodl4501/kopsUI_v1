# 메뉴 기준 Playwright sync 테스트케이스

**84개 메뉴 각각** `test_{menu_id}.py` 로 분리했습니다. 가독성과 수정 편의가 핵심입니다.

## 한 파일만 열면 됨

```bash
sed -n '1,120p' menu_tests/test_OPAB050000.py    # 지출보고서 정정 예시
sed -n '1,120p' menu_tests/test_OPAA020000.py    # 공개자료조회 예시
```

각 파일 구조:

```python
SAMPLE = {...}          # ① 입력값만 수정
EVENTS / HANDLERS / ...   # ② 소스 분석 참고용 (수정 불필요)
STEPS  = [...]            # ③ 순서만 직관적으로 수정
CASE   = {...}
def test_OPAB050000(): ...
```

## 컴포넌트를 딸 필요 없음

| 하고 싶은 일 | 이렇게만 추가 |
|---|---|
| 콤보박스 값 변경 | `{"do":"select","label":"제출연도","value":"@sample.제출연도"}` |
| 텍스트 입력 | `{"do":"fill","label":"업체명","value":"@sample.업체명"}` |
| 버튼 클릭 | `{"do":"click","label":"조회"}` |
| URI 확인 | `{"do":"expect","uri":"selectBizWrtMbList.do","status":410}` |
| 상세 화면 진입 | `{"do":"detail","menu_id":"OPAB050200","name":"지출보고서 정정"}` |
| 팝업 진입 | `{"do":"popup","label":"지출보고서 정정 현황"}` |
| 화면 로드 확인 | `{"do":"expect_screen","app_uri":"app/op/opb/OggBriefFormUpdList1"}` |

`label` 은 화면에 보이는 한글 라벨입니다. `component_3`, `subSearch`, `clx.js` 를
직접 찾거나 조립하지 않습니다. 공통 러너가 `XB6.button/combobox/textbox` +
`Human`(CDP 입력)으로 처리합니다.

## 실행

```bash
# 1) 오프라인 plan 검증 (기본, 브라우저 안 열림)
/opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py
/opt/hira-pwenv/bin/python -m pytest menu_tests/ -q

# 2) 실서버 재생 (옵트인, 메뉴 지정 권장)
HIRA_MENU_IDS=OPAA020000,OPAB050000 \
  /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live

# 2-1) 빠른 스모크 — STEP 6개만, 화면대기 1초, 별도 리포트
HIRA_MENU_IDS=OPAA020000,OPAB050000,OPAD010000 \
  /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live \
  --max 3 --max-steps 6 --wait-ms 1000 \
  --report-prefix menu_case_live_report

# 3) pytest 로 특정 메뉴만 live
HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAB050000 \
  /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAB050000.py -q
```

- 저장소 단독 클론에서도 **plan 모드 / pytest 는 외부 런타임 없이 동작**합니다.
  `--live` 만 로컬 `hira_cdp` 헬퍼(`exbuilder6`/`explorer`/`kops`)가 필요합니다.
- `HIRA_MENU_LIVE=1` 또는 `--live` 일 때만 CDP `<LOCAL_CDP_ENDPOINT>` 에 **sync** 로 붙습니다.
- `HIRA_MENU_IDS` 로 메뉴를 좁히고 `--max` 로 개수를 제한하세요.
- `--max-steps` / `--wait-ms` 는 **실행만** 절단합니다. `test_*.py` 의 전체 STEP 은 그대로입니다.
- `--report-prefix menu_case_live_report` 는 84건 plan 리포트를 덮어쓰지 않고
  `out/menu_case_live_report.json/.md` 로 따로 저장합니다.
- `--strict` 는 미관측 URI·스텝 경고를 FAIL 로 승격합니다(기본은 WARN).
- 로그인 필요 화면은 비로그인에서 `util.EmbApp.load` 로 UI 만 열고 서버 `.do` 는
  **410 차단**을 기대합니다. 직접 로그인 후 쓰면 같은 STEP이 200 데이터까지 검증합니다.
- 상태변경(`save/delete/upload/...`) 버튼은 STEP에 넣지 않았습니다.

## 데이터셋

- `menu_tests/sample_dataset.json` — 84메뉴 샘플 + **59 URI baseline 전수**
- `menu_tests/sample_dataset.csv` — `menu_id / sample_key / sample_value` 평탄형
- `testcases/dataset/{slug}.json` — 기존 요청/응답·경계값·악성입력 데이터셋
- `out/MENU_MASTER.md` — **모든 소스/메뉴/이벤트/URI/데이터셋 단일 MD**

민감값(`license_key`, `SESSION`, `regpId`, `mobileNo` 등)은 `<MASKED>` 유지.

## 예시 경로

`지출보고서 작성ㆍ정정 > 지출보고서 정정` → `menu_tests/test_OPAB050000.py`

STEP 29개 / 상세화면 10개 /
기대 URI 18개. 목록 → 조회 → 업체별 정정 현황 →
서식별 정정 1~7 → 최종확정 → 팝업까지 한 파일에 들어 있습니다.
