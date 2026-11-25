# KOPS React Portal (테스트케이스 재현용 프론트엔드)

`jmodl4501/kopsUI_v1` 의 `menu_tests/`(84개 메뉴 · 931 STEP)와 `docs/`를 기준으로,
`JCodesMore/ai-website-cloner-template` 의 Next.js/React 구조 위에 KOPS
(`www.hira.or.kr/kops`) 포털을 재구현한 프론트엔드입니다.

## 실행

```bash
cd /home/user/kops-react
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
```

- 홈: `/`
- 메뉴: `/menu/{menu_id}` (예: `/menu/OPAB050000`)
- API 어댑터: `/kops/main/{op/opb|op/opa|...}/{URI}.ndo|.do`

## 구성

| 경로 | 내용 |
|---|---|
| `data/menu_cases.json` | 원본 84개 메뉴 테스트케이스(복사본) |
| `data/kops-datasets.json` | 비식별 KOPS 샘플 데이터셋(59 URI) |
| `src/data/menuCases.ts` | `scripts/gen_menu_data.py` 로 생성한 메뉴 카탈로그 |
| `src/components/KopsShell.tsx` | 헤더/GNB/메가메뉴/LNB/검색/목록/상세/팝업 등 전체 UI |
| `src/app/menu/[menuId]/page.tsx` | 84개 메뉴 라우트(정적 생성) |
| `src/app/kops/main/[...path]/route.ts` | 브라우저 → 백엔드 프록시/샘플 API 어댑터 |
| `src/app/portal.css` | 원본 KOPS UI 포털 스타일(유틸리티바·브랜드·테이블·다이얼로그) |

## 테스트케이스 대응

- `data-app-uri` 속성: `expect_screen` 스텝이 확인하는 화면 식별자
- `제출연도`, `영업구분` `<select role=combobox>` / `업체명`, `요양기관명`, `품목명` `<input role=textbox>`: `select`/`fill` 스텝의 라벨
- `조회` 버튼: 클릭 시 화면별 `.ndo`/`.do` URI를 호출하고 결과 다이얼로그(`role=dialog`) 표시
- 화면 로드 시 해당 메뉴의 `expected_uris`/`expect_any` URI를 `fetch` 하여 네트워크 관측 가능
- `window.openPageId(menuId)` / `window.util.EmbApp.load(appUri)` 브리지 제공
- 로그인 필요 화면은 데모 배너를 표시하되 화면 자체는 조회 가능

## 백엔드 연동

기본값은 저장된 샘플 데이터셋으로 동작합니다. eGovFrame 백엔드가 준비되면:

```bash
KOPS_API_UPSTREAM=http://127.0.0.1:8080 npm run dev
```

` /kops/main/**` 요청을 서버 사이드에서 백엔드로 프록시합니다(브라우저 CORS/혼합콘텐츠 문제 없음).
