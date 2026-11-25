# KOPS 로컬 Playwright sync 테스트

`kopsUI_v1/menu_tests/menu_cases.json` 의 **84개 메뉴 · 931 STEP**을 그대로 읽어,
로컬 React 포털(`http://localhost:3000`) 위에서 재생하는 Python Playwright **sync** 러너입니다.

## 설치 및 실행

```bash
pip install playwright
# Google Chrome 158 (이미 설치됨: /usr/bin/google-chrome)
python3 local_menu_runner.py --ids OPAA020000,OPAD010000,OPAB050000
python3 local_menu_runner.py --all --wait-ms 4000
```

| 옵션 | 의미 |
|---|---|
| `--all` | 84개 전체 실행 |
| `--ids` | 쉼표로 구분한 메뉴 ID만 실행 |
| `--max` | 앞에서 N개만 실행 |
| `--max-steps` | 케이스별 스텝 수 제한 |
| `--wait-ms` | 화면 전환 대기 시간 |
| `--headed` | 브라우저 창 표시 |
| `--report-prefix` | `out/` 리포트 파일명 |

## 원본 테스트케이스와의 차이

- 원본 러너: 실서버 CDP(`util.EmbApp.load` / `openPageId`, XB6 컴포넌트) 연결
- 로컬 러너: 동일한 `CASE` 데이터와 스텝 순서를 사용하되, 브라우저 조작은
  `get_by_label` / `get_by_role` / `main[data-app-uri]` 로 대체
- `expect_any` / `expect` 스텝은 실제 네트워크 응답(`page.on("response")`)에서
  URI slug와 HTTP status를 확인
- 팝업 스텝 전에는 원본 러너와 같이 결과 다이얼로그를 닫음(`drain_dialogs`)

## 결과 (최종 실행)

- **84/84 케이스 PASS, 931 STEP 실행, FAIL 0** (WARN 29 — 비필수 URI 미관측)
- 총 실행시간 394.6초 (headless Chrome)
- PASS 818 / INFO 84(note) / WARN 29 / FAIL 0
- 리포트: `out/local_menu_report_all.md`, `out/local_menu_report_all.json`
- 실행 환경: Chrome 158 headless, Next.js 15.5 + React 19.2 / Spring Boot 3.5.6(eGovFrame 5.0.2), MariaDB 11.8

## 단계별 수정 이력 (프런트엔드 → 백엔드 → DB)

1. 프런트엔드: 모든 화면에 `조회` 검색패널·공통 팝업 버튼 추가, `data-app-uri` 및 결과 다이얼로그 제공
2. 백엔드: `/kops/main/**` URI 어댑터를 3세그먼트 경로로 수정, 프록시 연동 확인
3. DB: 84 메뉴 / 456 URI / 7종 서식정보 시드 확인, MyBatis 조회 API 검증
4. 테스트 러너: 화면 로드 후 fetch 대기(800ms), 스텝 간 다이얼로그 정리 추가
