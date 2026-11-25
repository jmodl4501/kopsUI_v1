# docs — 메뉴 기준 테스트 산출물

`jmodl4501/kopsUI_v1` 에 추가된 문서 모음입니다. 기존 샘플 UI(`src/`, `design/`,
`README.md`, `sql/`, `pom.xml`)는 **변경하지 않았습니다**.

## 제일 먼저 열 파일

- **[`MENU_MASTER.md`](MENU_MASTER.md)** — 요청한 **단일 MD**
  - 84메뉴 / 84소스 / 235 화면전환 / 59 관측 URI / 931 STEP 전체 정리
  - 상세화면 259 · 기대 URI 456 · 팝업 37 · 7,013줄

## 문서

| 파일 | 내용 |
|---|---|
| [`TESTCASE_GUIDE.md`](TESTCASE_GUIDE.md) | 메뉴별 Playwright sync 테스트 수정 가이드 |
| [`DATASET_GUIDE.md`](DATASET_GUIDE.md) | 59 URI 요청/응답·경계값 데이터셋 설명 |
| [`TESTCASE_REPORT.md`](TESTCASE_REPORT.md) | plan 모드 84/84 PASS |
| [`LIVE_SMOKE_REPORT.md`](LIVE_SMOKE_REPORT.md) | CDP sync 스모크 3/3 PASS |

## 코드 · 데이터 (`../menu_tests/`)

| 파일 | 내용 |
|---|---|
| `test_{menu_id}.py` | **84개** 메뉴별 Python Playwright sync 테스트 |
| `menu_case_runner.py` | 공통 러너 (CDP sync + Human 입력) |
| `run_all_menu_tests.py` | 배치 CLI (`--live`, `--max-steps`, `--wait-ms`, `--report-prefix`) |
| `menu_cases.json` | 84 CASE 원본 (MD·러너 공용) |
| `sample_dataset.json` | 84메뉴 샘플 + 59 URI baseline |
| `sample_dataset.csv` | `menu_id / sample_key / sample_value` 평탄형 |
| `README.md` | STEP 수정 가이드 |

## 실행

저장소 단독 클론에서도 **plan 모드 / pytest 는 외부 런타임 없이 동작**합니다.

```bash
/opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py     # plan 84/84
/opt/hira-pwenv/bin/python -m pytest menu_tests/ -q           # 84 passed
```

실서버 재생은 **옵트인**(`--live`)이며, `<LOCAL_CDP_ENDPOINT>` 는 로컬 Chrome
DevTools 주소를 가리키는 자리표시자입니다. 비로그인 기준이라 `.do` 는 410 차단을
기대하고, 상태변경(`save/delete/upload`) 버튼은 STEP에 포함하지 않았습니다.

## 공개 저장소 정책

- **보안검토 문서 및 실측 보안 증거는 미포함**
  (실서버 취약점·실측 증거는 로컬 워크스페이스에만 보관).
- 내부 IP · 내부 포트 · 로컬 CDP 엔드포인트 · 워크스페이스 절대경로는
  `<INTERNAL_IP>`, `<INTERNAL_PORT>`, `<LOCAL_CDP_ENDPOINT>`, `<WORKSPACE>` 로 치환.
- 라이선스 키 · `SESSION` 값 · 개인정보 후보는 기존 생성 단계에서 `<MASKED>` 유지.
- 원본 XHR 캡처, 소스 덤프, 리포트 원본 파일은 미포함.
