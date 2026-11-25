# KOPS 전 메뉴 · 소스 · 이벤트 · URI · 데이터셋 마스터

- 생성: `2026-11-24T23:42:38+09:00` (Asia/Seoul)
- 근거: 최종 수행 #5 `PASS=True` — `out/source_analysis.json` (84소스 / 84메뉴 / 235화면전환 / 65endpoint), `out/menu_exploration.json` (84메뉴 / 50팝업), `out/xhr_pairs.csv` (350 XHR / 59 URI), `out/cases/src_*.json`, `testcases/dataset/*.json`.
- **재크롤링 없음 / 비로그인 캡처**. 로그인 필요 화면은 UI 직접 로드 + 서버 `.do` 410 차단까지 기록. 실제 인증 데이터는 없습니다.
- 이 파일 하나에 **모든 소스 → 메뉴 → 사용화면 → 이벤트 → URI → 데이터셋 → 상세화면/팝업 → 테스트파일**을 정리했습니다.

## 0. 한 장 요약

| 구분 | 수 | 산출물 |
|---|---:|---|
| L1 그룹 | 6 | 메뉴 트리 |
| 전체 메뉴 | 84 | `menu_tests/test_*.py` 84개 |
| 소스 파일 | 84 | 아래 소스 색인 |
| 화면전환 이벤트 | 235 | 메뉴별 `<details>` |
| 관측 URI | 59 | `testcases/dataset/*.json` |
| 캡처 XHR | 350 | `out/xhr_pairs.csv` |
| 팝업 방문 | 50 | 메뉴별 팝업 표 |
| 테스트 STEP | 931 | `menu_cases.json` |
| 상세화면 매핑 | 259 | 아래 표 |

### 수정은 이렇게

`menu_tests/test_{menu_id}.py` 를 열어 **`SAMPLE`**(입력값)과 **`STEPS`**(순서)만 고치면 됩니다. 예:

```python
SAMPLE = {"제출연도": "2025", "영업구분": "S", "검색어": "테스트"}
STEPS = [
    {"do": "select", "label": "제출연도", "value": "@sample.제출연도"},
    {"do": "click",  "label": "조회"},
    {"do": "expect", "uri": "selectOggBriefPubDataSrchList.ndo", "status": 200},
    {"do": "detail", "menu_id": "OPAB050200", "name": "지출보고서 정정"},
]
```

컴포넌트를 `따로 조립`할 필요 없이 라벨만 씁니다. 공통 러너 `menu_case_runner.py` 가 Playwright sync + CDP + `Human` 입력을 처리합니다.

## 1. 메뉴 트리 (84)

- `OPAA000000` 🌐 지출보고서 정보공개  → `지출보고서 정보공개`
-   `OPAA010000` 🌐 지출보고서 공표자료  → `지출보고서 정보공개 > 지출보고서 공표자료`
-   `OPAA020000` 🌐 지출보고서 공개자료조회  → `지출보고서 정보공개 > 지출보고서 공개자료조회`
-     `OPAA020100` 🌐 업체별 지출보고서 공개 현황  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황`
-     `OPAA020200` 🌐 지출보고서 서식별 공개(견본품 제공)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공)`
-     `OPAA020300` 🌐 지출보고서 서식별 공개(학술대회 지원)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원)`
-     `OPAA020400` 🌐 지출보고서 서식별 공개(임상시험 등의 지원)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원)`
-     `OPAA020500` 🌐 지출보고서 서식별 공개(제품설명회)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회)`
-     `OPAA020600` 🌐 지출보고서 서식별 공개(시판 후 조사)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사)`
-     `OPAA020700` 🌐 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인)`
-     `OPAA020800` 🌐 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용)  → `지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용)`
-   `OPAA030000` 🌐 한눈에 보는 지출보고서 통계  → `지출보고서 정보공개 > 한눈에 보는 지출보고서 통계`
-     `OPAA030100` 🌐 합법적 경제적 이익 제공자  → `지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자`
-     `OPAA030200` 🌐 합법적 경제적 이익 제공내역  → `지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역`
-     `OPAA030300` 🌐 합법적 경제적 이익 수수내역  → `지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역`
- `OPAB000000` 🔒 지출보고서 작성ㆍ정정  → `지출보고서 작성ㆍ정정`
-   `OPAB010000` 🔒 지출보고서 현황 조회  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회`
-     `OPAB010100` 🔒 지출보고서 현황 조회  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회`
-     `OPAB010200` 🔒 지출보고서 서식별 조회(견본품 제공)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공)`
-     `OPAB010300` 🔒 지출보고서 서식별 조회(학술대회 지원)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원)`
-     `OPAB010400` 🔒 지출보고서 서식별 조회(임상시험 등의 지원)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원)`
-     `OPAB010500` 🔒 지출보고서 서식별 조회(제품설명회)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회)`
-     `OPAB010600` 🔒 지출보고서 서식별 조회(시판 후 조사)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사)`
-     `OPAB010700` 🔒 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인)`
-     `OPAB010800` 🔒 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용)  → `지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용)`
-   `OPAB020000` 🔒 지출보고서 상시작성  → `지출보고서 작성ㆍ정정 > 지출보고서 상시작성`
-   `OPAB030000` 🔒 지출보고서 실태조사  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사`
-     `OPAB030100` 🔒 업체별 지출보고서 작성 현황  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황`
-     `OPAB030200` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030300` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030400` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030500` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030600` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030700` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030800` 🔒 지출보고서 작성  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성`
-     `OPAB030900` 🔒 최종확정  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 최종확정`
-     `OPAB031000` 🔒 지출보고서 기본사항  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항`
-     `OPAB031100` 🔒 업체정보 작성하기  → `지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기`
-   `OPAB040000` 🔒 대량 지출보고서 업로드  → `지출보고서 작성ㆍ정정 > 대량 지출보고서 업로드`
-   `OPAB050000` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정`
-     `OPAB050100` 🔒 업체별 지출보고서 정정 현황  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황`
-     `OPAB050200` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050300` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050400` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050500` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050600` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050700` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050800` 🔒 지출보고서 정정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정`
-     `OPAB050900` 🔒 최종확정  → `지출보고서 작성ㆍ정정 > 지출보고서 정정 > 최종확정`
- `OPAC000000` 🔒 지출보고서 기초정보 조회  → `지출보고서 기초정보 조회`
-   `OPAC010000` 🔒 요양기관 정보조회  → `지출보고서 기초정보 조회 > 요양기관 정보조회`
-   `OPAC020000` 🔒 의약품 정보조회  → `지출보고서 기초정보 조회 > 의약품 정보조회`
-   `OPAC030000` 🔒 의료기기 정보조회  → `지출보고서 기초정보 조회 > 의료기기 정보조회`
- `OPAD000000` 🌐 고객지원  → `고객지원`
-   `OPAD010000` 🌐 공지사항  → `고객지원 > 공지사항`
-     `OPAD010100` 🌐 공지사항 상세  → `고객지원 > 공지사항 > 공지사항 상세`
-   `OPAD020000` 🌐 자주 찾는 질문(FAQ)  → `고객지원 > 자주 찾는 질문(FAQ)`
-   `OPAD030000` 🌐 자료실  → `고객지원 > 자료실`
-     `OPAD030100` 🌐 자료실 상세  → `고객지원 > 자료실 > 자료실 상세`
-   `OPAD040000` 🔒 교육서비스  → `고객지원 > 교육서비스`
-     `OPAD040100` 🔒 교육서비스 상세  → `고객지원 > 교육서비스 > 교육서비스 상세`
-     `OPAD040200` 🔒 교육서비스 신청 상세내역  → `고객지원 > 교육서비스 > 교육서비스 신청 상세내역`
-     `OPAD040300` 🔒 교육신청  → `고객지원 > 교육서비스 > 교육신청`
-   `OPAD050000` 🔒 정보이관 및 비공개(폐업) 신청  → `고객지원 > 정보이관 및 비공개(폐업) 신청`
-     `OPAD050200` 🔒 정보이관 및 비공개 신청  → `고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청`
-   `OPAD060000` 🌐 웹 접근성 안내  → `고객지원 > 웹 접근성 안내`
- `OPAE000000` 🌐 제도소개  → `제도소개`
-   `OPAE010000` 🌐 제도개요  → `제도소개 > 제도개요`
-   `OPAE020000` 🌐 조직현황  → `제도소개 > 조직현황`
-   `OPAE030000` 🌐 조직연혁  → `제도소개 > 조직연혁`
-   `OPAE040000` 🌐 관련법령  → `제도소개 > 관련법령`
-   `OPAE050000` 🌐 오시는길  → `제도소개 > 오시는길`
- `OPAF000000` 🔒 마이페이지  → `마이페이지`
-   `OPAF010000` 🔒 나의 지출보고서 현황  → `마이페이지 > 나의 지출보고서 현황`
-   `OPAF020000` 🔒 추가 자료 요구 현황 및 제출  → `마이페이지 > 추가 자료 요구 현황 및 제출`
-   `OPAF030000` 🔒 회원정보관리  → `마이페이지 > 회원정보관리`
-     `OPAF031000` 🔒 회원정보수정  → `마이페이지 > 회원정보관리 > 회원정보수정`
-     `OPAF032000` 🔒 비밀번호 변경  → `마이페이지 > 회원정보관리 > 비밀번호 변경`
-     `OPAF033000` 🔒 회원탈퇴  → `마이페이지 > 회원정보관리 > 회원탈퇴`
-     `OPAF034000` 🔒 회원탈퇴 완료  → `마이페이지 > 회원정보관리 > 회원탈퇴 완료`
-     `OPAF035000` 🔒 회원정보 수정(사업자CSO)  → `마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO)`
-     `OPAF036000` 🔒 회원정보 수정(개인CSO)  → `마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO)`
-     `OPAF037000` 🔒 CSO회원비밀번호변경  → `마이페이지 > 회원정보관리 > CSO회원비밀번호변경`
-   `OPAF070000` 🔒 요양기관 수수내역 조회  → `마이페이지 > 요양기관 수수내역 조회`

## 2. L1 그룹 요약

| 그룹 | 메뉴 | 로그인 | 하위 L2 | 하위 L3 | 대표 화면 |
|---|---|---:|---:|---:|---|
| 지출보고서 정보공개 | `OPAA000000` | 불요 | 3 | 11 | 지출보고서 공표자료 |
| 지출보고서 작성ㆍ정정 | `OPAB000000` | 필요 | 5 | 28 | 지출보고서 현황 조회 |
| 지출보고서 기초정보 조회 | `OPAC000000` | 필요 | 3 | 0 | 요양기관 정보조회 |
| 고객지원 | `OPAD000000` | 불요 | 6 | 6 | 공지사항 |
| 제도소개 | `OPAE000000` | 불요 | 5 | 0 | 제도개요 |
| 마이페이지 | `OPAF000000` | 필요 | 4 | 7 | 나의 지출보고서 현황 |

## 3. 전체 소스 색인 (84)

| 소스 | 연결 메뉴 | app_uri | bytes | 컴포넌트 | 이벤트 | 핸들러 | endpoint |
|---|---|---|---:|---:|---:|---:|---:|
| `app_com_main_Main.clx.js` | 공통/라이브러리 | `app/com/main/Main` | 119715 | 76 | 35 | 72 | 5 |
| `app_com_main_index.clx.js` | 공통/라이브러리 | `app/com/main/index` | 97496 | 70 | 33 | 31 | 4 |
| `app_op_opa_AllSeeOggWrptStc.clx.js` | OPAA030000 | `app/op/opa/AllSeeOggWrptStc` | 37350 | 17 | 12 | 8 | 44 |
| `app_op_opa_EntpOggBriefPubInfoList.clx.js` | OPAA020100 | `app/op/opa/EntpOggBriefPubInfoList` | 26218 | 9 | 10 | 7 | 6 |
| `app_op_opa_LawEcnmyPftAcpDtlList.clx.js` | OPAA030300 | `app/op/opa/LawEcnmyPftAcpDtlList` | 95107 | 17 | 8 | 27 | 12 |
| `app_op_opa_LawEcnmyPftOffrrDtlList.clx.js` | OPAA030200 | `app/op/opa/LawEcnmyPftOffrrDtlList` | 107248 | 16 | 8 | 28 | 26 |
| `app_op_opa_LawEcnmyPftOffrrList.clx.js` | OPAA030100 | `app/op/opa/LawEcnmyPftOffrrList` | 52339 | 15 | 8 | 24 | 4 |
| `app_op_opa_OggBriefOfanDataList.clx.js` | OPAA010000 | `app/op/opa/OggBriefOfanDataList` | 52417 | 19 | 9 | 7 | 4 |
| `app_op_opa_OggBriefPubDataSrch.clx.js` | OPAA020000 | `app/op/opa/OggBriefPubDataSrch` | 42495 | 21 | 7 | 19 | 8 |
| `app_op_opa_OggBriefPubDataSrchDtl1.clx.js` | OPAA020200 | `app/op/opa/OggBriefPubDataSrchDtl1` | 9694 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl2.clx.js` | OPAA020300 | `app/op/opa/OggBriefPubDataSrchDtl2` | 9687 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl3.clx.js` | OPAA020400 | `app/op/opa/OggBriefPubDataSrchDtl3` | 9689 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl4.clx.js` | OPAA020500 | `app/op/opa/OggBriefPubDataSrchDtl4` | 9686 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl5.clx.js` | OPAA020600 | `app/op/opa/OggBriefPubDataSrchDtl5` | 9685 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl6.clx.js` | OPAA020700 | `app/op/opa/OggBriefPubDataSrchDtl6` | 9737 | 8 | 3 | 3 | 0 |
| `app_op_opa_OggBriefPubDataSrchDtl7.clx.js` | OPAA020800 | `app/op/opa/OggBriefPubDataSrchDtl7` | 9765 | 8 | 3 | 3 | 0 |
| `app_op_opb_EntpInfmWrt.clx.js` | OPAB031100 | `app/op/opb/EntpInfmWrt` | 177622 | 43 | 25 | 57 | 5 |
| `app_op_opb_EntpOggBriefFormPrsntList.clx.js` | OPAB010100 | `app/op/opb/EntpOggBriefFormPrsntList` | 21824 | 6 | 9 | 6 | 1 |
| `app_op_opb_EntpOggBriefFormUpdList.clx.js` | OPAB050100 | `app/op/opb/EntpOggBriefFormUpdList` | 25706 | 8 | 10 | 7 | 4 |
| `app_op_opb_EntpOggBriefFormWrtList.clx.js` | OPAB030100 | `app/op/opb/EntpOggBriefFormWrtList` | 35464 | 8 | 11 | 10 | 4 |
| `app_op_opb_FileExmPrsntList.clx.js` | OPAB040000 | `app/op/opb/FileExmPrsntList` | 49664 | 26 | 4 | 15 | 6 |
| `app_op_opb_LastFdecList.clx.js` | OPAB030900, OPAB050900 | `app/op/opb/LastFdecList` | 61279 | 62 | 4 | 8 | 1 |
| `app_op_opb_OggBriefBseLte.clx.js` | OPAB031000 | `app/op/opb/OggBriefBseLte` | 23126 | 16 | 4 | 5 | 0 |
| `app_op_opb_OggBriefFormPrsntList1.clx.js` | OPAB010200 | `app/op/opb/OggBriefFormPrsntList1` | 11451 | 4 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormPrsntList2.clx.js` | OPAB010300 | `app/op/opb/OggBriefFormPrsntList2` | 11119 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormPrsntList3.clx.js` | OPAB010400 | `app/op/opb/OggBriefFormPrsntList3` | 11117 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormPrsntList4.clx.js` | OPAB010500 | `app/op/opb/OggBriefFormPrsntList4` | 11109 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormPrsntList5.clx.js` | OPAB010600 | `app/op/opb/OggBriefFormPrsntList5` | 11111 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormPrsntList6.clx.js` | OPAB010700 | `app/op/opb/OggBriefFormPrsntList6` | 11157 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormPrsntList7.clx.js` | OPAB010800 | `app/op/opb/OggBriefFormPrsntList7` | 11159 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList1.clx.js` | OPAB050200 | `app/op/opb/OggBriefFormUpdList1` | 11060 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList2.clx.js` | OPAB050300 | `app/op/opb/OggBriefFormUpdList2` | 11089 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList3.clx.js` | OPAB050400 | `app/op/opb/OggBriefFormUpdList3` | 11094 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList4.clx.js` | OPAB050500 | `app/op/opb/OggBriefFormUpdList4` | 11083 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList5.clx.js` | OPAB050600 | `app/op/opb/OggBriefFormUpdList5` | 11086 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList6.clx.js` | OPAB050700 | `app/op/opb/OggBriefFormUpdList6` | 11129 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormUpdList7.clx.js` | OPAB050800 | `app/op/opb/OggBriefFormUpdList7` | 11156 | 5 | 2 | 4 | 0 |
| `app_op_opb_OggBriefFormWrtList1.clx.js` | OPAB030200 | `app/op/opb/OggBriefFormWrtList1` | 8455 | 1 | 4 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList2.clx.js` | OPAB030300 | `app/op/opb/OggBriefFormWrtList2` | 10164 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList3.clx.js` | OPAB030400 | `app/op/opb/OggBriefFormWrtList3` | 8967 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList4.clx.js` | OPAB030500 | `app/op/opb/OggBriefFormWrtList4` | 8445 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList5.clx.js` | OPAB030600 | `app/op/opb/OggBriefFormWrtList5` | 8442 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList6.clx.js` | OPAB030700 | `app/op/opb/OggBriefFormWrtList6` | 8619 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefFormWrtList7.clx.js` | OPAB030800 | `app/op/opb/OggBriefFormWrtList7` | 8574 | 1 | 3 | 5 | 0 |
| `app_op_opb_OggBriefOrtmWrtList.clx.js` | OPAB020000 | `app/op/opb/OggBriefOrtmWrtList` | 47910 | 27 | 8 | 19 | 3 |
| `app_op_opb_OggBriefWrtList.clx.js` | OPAB030000 | `app/op/opb/OggBriefWrtList` | 55703 | 31 | 9 | 22 | 13 |
| `app_op_opb_OggBriefWrtPrsntList.clx.js` | OPAB010000 | `app/op/opb/OggBriefWrtPrsntList` | 42181 | 22 | 5 | 13 | 3 |
| `app_op_opb_OggBriefWrtUpdList.clx.js` | OPAB050000 | `app/op/opb/OggBriefWrtUpdList` | 52688 | 28 | 9 | 21 | 8 |
| `app_op_opc_MeqipInfmList.clx.js` | OPAC030000 | `app/op/opc/MeqipInfmList` | 34085 | 24 | 4 | 9 | 1 |
| `app_op_opc_MsupInfmList.clx.js` | OPAC020000 | `app/op/opc/MsupInfmList` | 36413 | 30 | 4 | 9 | 1 |
| `app_op_opc_YadmInfmList.clx.js` | OPAC010000 | `app/op/opc/YadmInfmList` | 44336 | 23 | 8 | 15 | 2 |
| `app_op_opd_EduApl.clx.js` | OPAD040000 | `app/op/opd/EduApl` | 33177 | 6 | 28 | 8 | 10 |
| `app_op_opd_EduAplDtl.clx.js` | OPAD040100 | `app/op/opd/EduAplDtl` | 46036 | 30 | 11 | 11 | 3 |
| `app_op_opd_EduAplDtlDesc.clx.js` | OPAD040200 | `app/op/opd/EduAplDtlDesc` | 28073 | 15 | 5 | 8 | 2 |
| `app_op_opd_EduAplWrt.clx.js` | OPAD040300 | `app/op/opd/EduAplWrt` | 43912 | 40 | 3 | 7 | 2 |
| `app_op_opd_Faq.clx.js` | OPAD020000 | `app/op/opd/Faq` | 19225 | 10 | 5 | 9 | 1 |
| `app_op_opd_InfmTrfrAplList.clx.js` | OPAD050000 | `app/op/opd/InfmTrfrAplList` | 38107 | 30 | 5 | 8 | 7 |
| `app_op_opd_InfmTrfrAplWrt.clx.js` | OPAD050200 | `app/op/opd/InfmTrfrAplWrt` | 94873 | 56 | 10 | 22 | 6 |
| `app_op_opd_Ntfclte.clx.js` | OPAD010000 | `app/op/opd/Ntfclte` | 22199 | 14 | 3 | 8 | 4 |
| `app_op_opd_NtfclteDtl.clx.js` | OPAD010100 | `app/op/opd/NtfclteDtl` | 28895 | 16 | 6 | 9 | 3 |
| `app_op_opd_Rfrm.clx.js` | OPAD030000 | `app/op/opd/Rfrm` | 23232 | 15 | 3 | 7 | 5 |
| `app_op_opd_RfrmDtl.clx.js` | OPAD030100 | `app/op/opd/RfrmDtl` | 28952 | 18 | 6 | 8 | 4 |
| `app_op_ope_MapLoadM01.clx.js` | OPAE050000 | `app/op/ope/MapLoadM01` | 4897 | 5 | 0 | 0 | 0 |
| `app_op_ope_RelLawInfoM01.clx.js` | OPAE040000 | `app/op/ope/RelLawInfoM01` | 34877 | 57 | 9 | 1 | 1 |
| `app_op_ope_SysSmryInfoM01.clx.js` | OPAE010000 | `app/op/ope/SysSmryInfoM01` | 18666 | 33 | 0 | 0 | 0 |
| `app_op_ope_TxtrHistoryInfoM01.clx.js` | OPAE030000 | `app/op/ope/TxtrHistoryInfoM01` | 26776 | 65 | 0 | 0 | 0 |
| `app_op_ope_TxtrPrsntInfoM01.clx.js` | OPAE020000 | `app/op/ope/TxtrPrsntInfoM01` | 12737 | 22 | 0 | 0 | 0 |
| `app_op_ope_WebAccessibilityM01.clx.js` | OPAD060000 | `app/op/ope/WebAccessibilityM01` | 10932 | 15 | 0 | 0 | 0 |
| `app_op_opf_AddDataDmndPrsntSmit.clx.js` | OPAF020000 | `app/op/opf/AddDataDmndPrsntSmit` | 18033 | 8 | 3 | 5 | 1 |
| `app_op_opf_MbInfmOt.clx.js` | OPAF033000 | `app/op/opf/MbInfmOt` | 15200 | 12 | 3 | 5 | 2 |
| `app_op_opf_MbInfmOtEnd.clx.js` | OPAF034000 | `app/op/opf/MbInfmOtEnd` | 7223 | 9 | 1 | 1 | 0 |
| `app_op_opf_MbInfmUpd.clx.js` | OPAF031000 | `app/op/opf/MbInfmUpd` | 15028 | 10 | 3 | 4 | 1 |
| `app_op_opf_MbInfmUpdFirmCso.clx.js` | OPAF035000 | `app/op/opf/MbInfmUpdFirmCso` | 33431 | 23 | 15 | 9 | 2 |
| `app_op_opf_MbInfmUpdIndvCso.clx.js` | OPAF036000 | `app/op/opf/MbInfmUpdIndvCso` | 30090 | 22 | 11 | 9 | 2 |
| `app_op_opf_MbInfmUpdInfmCfr.clx.js` | OPAF032000 | `app/op/opf/MbInfmUpdInfmCfr` | 14681 | 11 | 3 | 4 | 1 |
| `app_op_opf_MbInfmUpdPwd.clx.js` | OPAF037000 | `app/op/opf/MbInfmUpdPwd` | 27061 | 26 | 7 | 7 | 1 |
| `app_op_opf_MyOggBriefPrsnt.clx.js` | OPAF010000 | `app/op/opf/MyOggBriefPrsnt` | 33627 | 37 | 4 | 6 | 2 |
| `app_op_opf_YoyangOggBriefList.clx.js` | OPAF070000 | `app/op/opf/YoyangOggBriefList` | 68671 | 69 | 3 | 12 | 1 |
| `app_op_pop_ScnAccesNtfcP01.clx.js` | 공통/라이브러리 | `app/op/pop/ScnAccesNtfcP01` | 25669 | 25 | 3 | 8 | 0 |
| `cpr-lib_language.js` | 공통/라이브러리 | `-` | 6716 | 0 | 0 | 0 | 0 |
| `cpr-lib_udc.js` | 공통/라이브러리 | `udc/com/udcComAppHeader` | 939371 | 31 | 120 | 201 | 15 |
| `cpr-lib_user-modules.js` | 공통/라이브러리 | `waTotalCheck` | 953080 | 38 | 23 | 96 | 2 |
| `defaults-kops.js` | 공통/라이브러리 | `-` | 5814 | 0 | 0 | 0 | 0 |
| `runtime_cleopatra.js` | 공통/라이브러리 | `-` | 2915984 | 0 | 45 | 194 | 0 |

## 4. 전체 URI · 데이터셋 색인

### 4.1 관측 URI 59개

| URI | slug | 상태 | 호출 | 요청키 | 데이터셋 | call stack | 정적 호출자 |
|---|---|---|---:|---|---|---|---|
| `/kops/main/op/com/getUserSessionInfo.ndo` | `getUserSessionInfo.ndo` | 200 | 7 | 0 | `testcases/dataset/getUserSessionInfo.ndo.json` | `out/cases/src_getUserSessionInfo.ndo.json` | app_com_main_Main.clx.js:getSessionInfo |
| `/kops/main/raonk/raonkUploadCustom.ndo` | `raonkUploadCustom.ndo` | 200 | 2 | 1 | `testcases/dataset/raonkUploadCustom.ndo.json` | `out/cases/src_raonkUploadCustom.ndo.json` | cpr-lib_udc.js:initRaonkUpload |
| `/kops/main/op/opa/selectAcpDescPecnyAstc1.ndo` | `selectAcpDescPecnyAstc1.ndo` | 200 | 1 | 1 | `testcases/dataset/selectAcpDescPecnyAstc1.ndo.json` | `out/cases/src_selectAcpDescPecnyAstc1.ndo.json` | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnScrnTrnCall |
| `/kops/main/op/opa/selectAcpDescPrdAstc1Gsum.ndo` | `selectAcpDescPrdAstc1Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectAcpDescPrdAstc1Gsum.ndo.json` | `out/cases/src_selectAcpDescPrdAstc1Gsum.ndo.json` | - |
| `/kops/main/op/opf/selectAddDataDmndPrsntSmit.do` | `selectAddDataDmndPrsntSmit.do` | 410 | 1 | 1 | `testcases/dataset/selectAddDataDmndPrsntSmit.do.json` | `out/cases/src_selectAddDataDmndPrsntSmit.do.json` | - |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | `selectAllSeeStcInfoPgList.ndo` | 200 | 8 | 1 | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | `out/cases/src_selectAllSeeStcInfoPgList.ndo.json` | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcInfoRcmd.ndo` | `selectAllSeeStcInfoRcmd.ndo` | 200 | 1 | 0 | `testcases/dataset/selectAllSeeStcInfoRcmd.ndo.json` | `out/cases/src_selectAllSeeStcInfoRcmd.ndo.json` | app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcList.ndo` | `selectAllSeeStcList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectAllSeeStcList.ndo.json` | `out/cases/src_selectAllSeeStcList.ndo.json` | app_op_opa_LawEcnmyPftOffrrList.clx.js:fnDataSetGet |
| `/kops/main/op/opa/selectAllSeeStcListGSum.ndo` | `selectAllSeeStcListGSum.ndo` | 200 | 2 | 0 | `testcases/dataset/selectAllSeeStcListGSum.ndo.json` | `out/cases/src_selectAllSeeStcListGSum.ndo.json` | - |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | `selectBizInfoSubTitle.ndo` | 200 | 191 | 1 | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | `out/cases/src_selectBizInfoSubTitle.ndo.json` | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opb/selectBizWrtMbList.do` | `selectBizWrtMbList.do` | 410 | 6 | 1 | `testcases/dataset/selectBizWrtMbList.do.json` | `out/cases/src_selectBizWrtMbList.do.json` | - |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | `selectBizWrtTgtList.do` | 410 | 24 | 1 | `testcases/dataset/selectBizWrtTgtList.do.json` | `out/cases/src_selectBizWrtTgtList.do.json` | - |
| `/kops/main/op/com/selectComCodeList.do` | `selectComCodeList.do` | 410 | 8 | 1 | `testcases/dataset/selectComCodeList.do.json` | `out/cases/src_selectComCodeList.do.json` | - |
| `/kops/main/op/com/selectComCodeList.ndo` | `selectComCodeList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectComCodeList.ndo.json` | `out/cases/src_selectComCodeList.ndo.json` | app_op_opa_OggBriefPubDataSrch.clx.js:fnCommCdSerach |
| `/kops/main/op/opd/selectEduAplDtl.do` | `selectEduAplDtl.do` | 410 | 1 | 1 | `testcases/dataset/selectEduAplDtl.do.json` | `out/cases/src_selectEduAplDtl.do.json` | - |
| `/kops/main/op/opd/selectEduAplDtlDesc.do` | `selectEduAplDtlDesc.do` | 410 | 1 | 1 | `testcases/dataset/selectEduAplDtlDesc.do.json` | `out/cases/src_selectEduAplDtlDesc.do.json` | - |
| `/kops/main/op/opd/selectEduAplList.do` | `selectEduAplList.do` | 410 | 1 | 1 | `testcases/dataset/selectEduAplList.do.json` | `out/cases/src_selectEduAplList.do.json` | - |
| `/kops/main/op/opa/selectExttOnoList.ndo` | `selectExttOnoList.ndo` | 200 | 3 | 1 | `testcases/dataset/selectExttOnoList.ndo.json` | `out/cases/src_selectExttOnoList.ndo.json` | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchExttOno; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchExttOno |
| `/kops/main/op/opd/selectFaqList.ndo` | `selectFaqList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectFaqList.ndo.json` | `out/cases/src_selectFaqList.ndo.json` | app_op_opd_Faq.clx.js:doSearch |
| `/kops/main/op/opd/selectInfmTrfrAplWrtList.do` | `selectInfmTrfrAplWrtList.do` | 410 | 1 | 1 | `testcases/dataset/selectInfmTrfrAplWrtList.do.json` | `out/cases/src_selectInfmTrfrAplWrtList.do.json` | - |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | `selectMainNtfclteList.ndo` | 200 | 7 | 1 | `testcases/dataset/selectMainNtfclteList.ndo.json` | `out/cases/src_selectMainNtfclteList.ndo.json` | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | `selectMainStcList.ndo` | 200 | 7 | 1 | `testcases/dataset/selectMainStcList.ndo.json` | `out/cases/src_selectMainStcList.ndo.json` | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/opf/selectMbInfmPwd.do` | `selectMbInfmPwd.do` | 410 | 3 | 1 | `testcases/dataset/selectMbInfmPwd.do.json` | `out/cases/src_selectMbInfmPwd.do.json` | - |
| `/kops/main/op/opf/selectMbInfo.do` | `selectMbInfo.do` | 410 | 2 | 1 | `testcases/dataset/selectMbInfo.do.json` | `out/cases/src_selectMbInfo.do.json` | - |
| `/kops/main/op/com/selectMenuList.ndo` | `selectMenuList.ndo` | 200 | 7 | 0 | `testcases/dataset/selectMenuList.ndo.json` | `out/cases/src_selectMenuList.ndo.json` | app_com_main_Main.clx.js:onBodyInit |
| `/kops/main/op/opf/selectMyPermCertList.do` | `selectMyPermCertList.do` | 410 | 2 | 0 | `testcases/dataset/selectMyPermCertList.do.json` | `out/cases/src_selectMyPermCertList.do.json` | - |
| `/kops/main/op/opf/selectMyPubOggBriefList.do` | `selectMyPubOggBriefList.do` | 410 | 1 | 1 | `testcases/dataset/selectMyPubOggBriefList.do.json` | `out/cases/src_selectMyPubOggBriefList.do.json` | - |
| `/kops/main/op/com/selectNoticePopupSliderList.ndo` | `selectNoticePopupSliderList.ndo` | 200 | 7 | 1 | `testcases/dataset/selectNoticePopupSliderList.ndo.json` | `out/cases/src_selectNoticePopupSliderList.ndo.json` | app_com_main_Main.clx.js:setNoticePopupSlider |
| `/kops/main/op/opd/selectNtfclteDtl.ndo` | `selectNtfclteDtl.ndo` | 410 | 1 | 1 | `testcases/dataset/selectNtfclteDtl.ndo.json` | `out/cases/src_selectNtfclteDtl.ndo.json` | app_op_opd_NtfclteDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectNtfclteList.ndo` | `selectNtfclteList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectNtfclteList.ndo.json` | `out/cases/src_selectNtfclteList.ndo.json` | app_op_opd_Ntfclte.clx.js:doSearch |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1.ndo` | `selectOffrDescPecnyAstc1.ndo` | 200 | 1 | 1 | `testcases/dataset/selectOffrDescPecnyAstc1.ndo.json` | `out/cases/src_selectOffrDescPecnyAstc1.ndo.json` | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnDataSetGet,fnPrgDataSetGet; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:fnScrnTrnCall,fnDataSetGet |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1Gsum.ndo` | `selectOffrDescPecnyAstc1Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAstc1Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAstc1Gsum.ndo.json` | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3Gsum.ndo` | `selectOffrDescPecnyAstc3Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAstc3Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAstc3Gsum.ndo.json` | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4Gsum.ndo` | `selectOffrDescPecnyAstc4Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAstc4Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAstc4Gsum.ndo.json` | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5Gsum.ndo` | `selectOffrDescPecnyAstc5Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAstc5Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAstc5Gsum.ndo.json` | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1Gsum.ndo` | `selectOffrDescPecnyAvg1Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAvg1Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAvg1Gsum.ndo.json` | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2Gsum.ndo` | `selectOffrDescPecnyAvg2Gsum.ndo` | 200 | 1 | 0 | `testcases/dataset/selectOffrDescPecnyAvg2Gsum.ndo.json` | `out/cases/src_selectOffrDescPecnyAvg2Gsum.ndo.json` | - |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | `selectOggBriefForm1List.do` | 410 | 5 | 2 | `testcases/dataset/selectOggBriefForm1List.do.json` | `out/cases/src_selectOggBriefForm1List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | `selectOggBriefForm2List.do` | 410 | 3 | 1 | `testcases/dataset/selectOggBriefForm2List.do.json` | `out/cases/src_selectOggBriefForm2List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | `selectOggBriefForm3List.do` | 410 | 3 | 2 | `testcases/dataset/selectOggBriefForm3List.do.json` | `out/cases/src_selectOggBriefForm3List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | `selectOggBriefForm4List.do` | 410 | 3 | 2 | `testcases/dataset/selectOggBriefForm4List.do.json` | `out/cases/src_selectOggBriefForm4List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | `selectOggBriefForm5List.do` | 410 | 3 | 2 | `testcases/dataset/selectOggBriefForm5List.do.json` | `out/cases/src_selectOggBriefForm5List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | `selectOggBriefForm6List.do` | 410 | 3 | 2 | `testcases/dataset/selectOggBriefForm6List.do.json` | `out/cases/src_selectOggBriefForm6List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | `selectOggBriefForm7List.do` | 410 | 3 | 2 | `testcases/dataset/selectOggBriefForm7List.do.json` | `out/cases/src_selectOggBriefForm7List.do.json` | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | `selectOggBriefFormAllCnt.do` | 410 | 3 | 1 | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | `out/cases/src_selectOggBriefFormAllCnt.do.json` | - |
| `/kops/main/op/opa/selectOggBriefOfanDataSrchList.ndo` | `selectOggBriefOfanDataSrchList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectOggBriefOfanDataSrchList.ndo.json` | `out/cases/src_selectOggBriefOfanDataSrchList.ndo.json` | app_op_opa_OggBriefOfanDataList.clx.js:doSearch_backup,doSearch |
| `/kops/main/op/opa/selectOggBriefPub1List.ndo` | `selectOggBriefPub1List.ndo` | 200 | 1 | 1 | `testcases/dataset/selectOggBriefPub1List.ndo.json` | `out/cases/src_selectOggBriefPub1List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub2List.ndo` | `selectOggBriefPub2List.ndo` | 200 | 1 | 1 | `testcases/dataset/selectOggBriefPub2List.ndo.json` | `out/cases/src_selectOggBriefPub2List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub3List.ndo` | `selectOggBriefPub3List.ndo` | 200 | 1 | 2 | `testcases/dataset/selectOggBriefPub3List.ndo.json` | `out/cases/src_selectOggBriefPub3List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub4List.ndo` | `selectOggBriefPub4List.ndo` | 200 | 1 | 2 | `testcases/dataset/selectOggBriefPub4List.ndo.json` | `out/cases/src_selectOggBriefPub4List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub5List.ndo` | `selectOggBriefPub5List.ndo` | 200 | 1 | 2 | `testcases/dataset/selectOggBriefPub5List.ndo.json` | `out/cases/src_selectOggBriefPub5List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub6List.ndo` | `selectOggBriefPub6List.ndo` | 200 | 1 | 2 | `testcases/dataset/selectOggBriefPub6List.ndo.json` | `out/cases/src_selectOggBriefPub6List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPub7List.ndo` | `selectOggBriefPub7List.ndo` | 200 | 1 | 2 | `testcases/dataset/selectOggBriefPub7List.ndo.json` | `out/cases/src_selectOggBriefPub7List.ndo.json` | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | `selectOggBriefPubAllCnt.ndo` | 200 | 2 | 1 | `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | `out/cases/src_selectOggBriefPubAllCnt.ndo.json` | app_op_opa_EntpOggBriefPubInfoList.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPubDataSrchList.ndo` | `selectOggBriefPubDataSrchList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectOggBriefPubDataSrchList.ndo.json` | `out/cases/src_selectOggBriefPubDataSrchList.ndo.json` | app_op_opa_OggBriefPubDataSrch.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefSmitYrList.ndo` | `selectOggBriefSmitYrList.ndo` | 200 | 3 | 1 | `testcases/dataset/selectOggBriefSmitYrList.ndo.json` | `out/cases/src_selectOggBriefSmitYrList.ndo.json` | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchYear; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchYear |
| `/kops/main/op/opd/selectRfrmDtl.ndo` | `selectRfrmDtl.ndo` | 410 | 1 | 1 | `testcases/dataset/selectRfrmDtl.ndo.json` | `out/cases/src_selectRfrmDtl.ndo.json` | app_op_opd_RfrmDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectRfrmList.ndo` | `selectRfrmList.ndo` | 200 | 1 | 1 | `testcases/dataset/selectRfrmList.ndo.json` | `out/cases/src_selectRfrmList.ndo.json` | app_op_opd_Rfrm.clx.js:doSearch |
| `/kops/main/op/opf/selectYoyangOggBriefList.do` | `selectYoyangOggBriefList.do` | 410 | 1 | 1 | `testcases/dataset/selectYoyangOggBriefList.do.json` | `out/cases/src_selectYoyangOggBriefList.do.json` | - |

### 4.2 소스에만 있는 endpoint (미관측·상태변경 포함)

| 소스 경로 | 예상 URI | slug | 상태변경 | 소스 |
|---|---|---|---|---|
| `file/insertFileInfoSample.do` | `-` | `insertFileInfoSample.do` | ⚠️ | app_op_opd_InfmTrfrAplList.clx.js, app_op_opd_InfmTrfrAplWrt.clx.js |
| `main/com/selectStdCds.do` | `-` | `selectStdCds.do` | - | cpr-lib_user-modules.js |
| `main/com/selectStdCdsNonDs.do` | `-` | `selectStdCdsNonDs.do` | - | cpr-lib_user-modules.js |
| `op/com/downloadFile.do` | `/kops/main/op/com/downloadFile.do` | `downloadFile.do` | - | app_op_opb_FileExmPrsntList.clx.js, app_op_opd_EduApl.clx.js |
| `op/com/downloadFile.ndo` | `/kops/main/op/com/downloadFile.ndo` | `downloadFile.ndo` | - | app_op_opa_OggBriefOfanDataList.clx.js, app_op_opd_Ntfclte.clx.js |
| `op/com/downloadNonFile.ndo` | `/kops/main/op/com/downloadNonFile.ndo` | `downloadNonFile.ndo` | - | app_com_main_index.clx.js |
| `op/opa/selectAcpDescPecnyAvg1.ndo` | `/kops/main/op/opa/selectAcpDescPecnyAvg1.ndo` | `selectAcpDescPecnyAvg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPecnyPrg1.ndo` | `/kops/main/op/opa/selectAcpDescPecnyPrg1.ndo` | `selectAcpDescPecnyPrg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdAstc1.ndo` | `/kops/main/op/opa/selectAcpDescPrdAstc1.ndo` | `selectAcpDescPrdAstc1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdAstc2.ndo` | `/kops/main/op/opa/selectAcpDescPrdAstc2.ndo` | `selectAcpDescPrdAstc2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdAvg1.ndo` | `/kops/main/op/opa/selectAcpDescPrdAvg1.ndo` | `selectAcpDescPrdAvg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdAvg2.ndo` | `/kops/main/op/opa/selectAcpDescPrdAvg2.ndo` | `selectAcpDescPrdAvg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdPrg1.ndo` | `/kops/main/op/opa/selectAcpDescPrdPrg1.ndo` | `selectAcpDescPrdPrg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAcpDescPrdPrg2.ndo` | `/kops/main/op/opa/selectAcpDescPrdPrg2.ndo` | `selectAcpDescPrdPrg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `op/opa/selectAllSeeStcEntpSclList.ndo` | `/kops/main/op/opa/selectAllSeeStcEntpSclList.ndo` | `selectAllSeeStcEntpSclList.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrList.clx.js |
| `op/opa/selectOffrDescPecnyAstc2.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAstc2.ndo` | `selectOffrDescPecnyAstc2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAstc3.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAstc3.ndo` | `selectOffrDescPecnyAstc3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAstc4.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAstc4.ndo` | `selectOffrDescPecnyAstc4.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAstc5.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAstc5.ndo` | `selectOffrDescPecnyAstc5.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAvg1.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAvg1.ndo` | `selectOffrDescPecnyAvg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAvg2.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAvg2.ndo` | `selectOffrDescPecnyAvg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAvg3.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAvg3.ndo` | `selectOffrDescPecnyAvg3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAvg4.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAvg4.ndo` | `selectOffrDescPecnyAvg4.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyAvg5.ndo` | `/kops/main/op/opa/selectOffrDescPecnyAvg5.ndo` | `selectOffrDescPecnyAvg5.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyPrg1.ndo` | `/kops/main/op/opa/selectOffrDescPecnyPrg1.ndo` | `selectOffrDescPecnyPrg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyPrg2.ndo` | `/kops/main/op/opa/selectOffrDescPecnyPrg2.ndo` | `selectOffrDescPecnyPrg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyPrg3.ndo` | `/kops/main/op/opa/selectOffrDescPecnyPrg3.ndo` | `selectOffrDescPecnyPrg3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyPrg4.ndo` | `/kops/main/op/opa/selectOffrDescPecnyPrg4.ndo` | `selectOffrDescPecnyPrg4.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPecnyPrg5.ndo` | `/kops/main/op/opa/selectOffrDescPecnyPrg5.ndo` | `selectOffrDescPecnyPrg5.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAstc1.ndo` | `/kops/main/op/opa/selectOffrDescPrdAstc1.ndo` | `selectOffrDescPrdAstc1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAstc2.ndo` | `/kops/main/op/opa/selectOffrDescPrdAstc2.ndo` | `selectOffrDescPrdAstc2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAstc3.ndo` | `/kops/main/op/opa/selectOffrDescPrdAstc3.ndo` | `selectOffrDescPrdAstc3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAvg1.ndo` | `/kops/main/op/opa/selectOffrDescPrdAvg1.ndo` | `selectOffrDescPrdAvg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAvg2.ndo` | `/kops/main/op/opa/selectOffrDescPrdAvg2.ndo` | `selectOffrDescPrdAvg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdAvg3.ndo` | `/kops/main/op/opa/selectOffrDescPrdAvg3.ndo` | `selectOffrDescPrdAvg3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdPrg1.ndo` | `/kops/main/op/opa/selectOffrDescPrdPrg1.ndo` | `selectOffrDescPrdPrg1.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdPrg2.ndo` | `/kops/main/op/opa/selectOffrDescPrdPrg2.ndo` | `selectOffrDescPrdPrg2.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOffrDescPrdPrg3.ndo` | `/kops/main/op/opa/selectOffrDescPrdPrg3.ndo` | `selectOffrDescPrdPrg3.ndo` | - | app_op_opa_AllSeeOggWrptStc.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `op/opa/selectOggBriefOfanDataFileList.ndo` | `/kops/main/op/opa/selectOggBriefOfanDataFileList.ndo` | `selectOggBriefOfanDataFileList.ndo` | - | app_op_opa_OggBriefOfanDataList.clx.js |
| `op/opa/selectOggBriefOfanDataThumbnailList.ndo` | `/kops/main/op/opa/selectOggBriefOfanDataThumbnailList.ndo` | `selectOggBriefOfanDataThumbnailList.ndo` | - | app_op_opa_OggBriefOfanDataList.clx.js |
| `op/opa/selectOggBriefPub3Cnt.do` | `/kops/main/op/opa/selectOggBriefPub3Cnt.do` | `selectOggBriefPub3Cnt.do` | - | app_op_opa_EntpOggBriefPubInfoList.clx.js, app_op_opa_OggBriefPubDataSrch.clx.js |
| `op/opa/selectOggBriefPub3Cnt.ndo` | `/kops/main/op/opa/selectOggBriefPub3Cnt.ndo` | `selectOggBriefPub3Cnt.ndo` | - | app_op_opa_EntpOggBriefPubInfoList.clx.js, app_op_opa_OggBriefPubDataSrch.clx.js |
| `op/opa/selectOggBriefPub4Cnt.do` | `/kops/main/op/opa/selectOggBriefPub4Cnt.do` | `selectOggBriefPub4Cnt.do` | - | app_op_opa_EntpOggBriefPubInfoList.clx.js, app_op_opa_OggBriefPubDataSrch.clx.js |
| `op/opa/selectOggBriefPub4Cnt.ndo` | `/kops/main/op/opa/selectOggBriefPub4Cnt.ndo` | `selectOggBriefPub4Cnt.ndo` | - | app_op_opa_EntpOggBriefPubInfoList.clx.js, app_op_opa_OggBriefPubDataSrch.clx.js |
| `op/opa/selectOggBriefPubAllCnt.do` | `/kops/main/op/opa/selectOggBriefPubAllCnt.do` | `selectOggBriefPubAllCnt.do` | - | app_op_opa_EntpOggBriefPubInfoList.clx.js, app_op_opa_OggBriefPubDataSrch.clx.js |
| `op/opa/userLogout.do` | `/kops/main/op/opa/userLogout.do` | `userLogout.do` | - | app_com_main_Main.clx.js, cpr-lib_udc.js |
| `op/opb/chkDupEntpInfo.do` | `/kops/main/op/opb/chkDupEntpInfo.do` | `chkDupEntpInfo.do` | - | app_op_opb_EntpInfmWrt.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/saveBizWrtMb.do` | `/kops/main/op/opb/saveBizWrtMb.do` | `saveBizWrtMb.do` | ⚠️ | app_op_opb_EntpInfmWrt.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/saveComFileUpload.do` | `/kops/main/op/opb/saveComFileUpload.do` | `saveComFileUpload.do` | ⚠️ | app_op_opb_FileExmPrsntList.clx.js |
| `op/opb/saveEntpDel.do` | `/kops/main/op/opb/saveEntpDel.do` | `saveEntpDel.do` | ⚠️ | app_op_opb_OggBriefOrtmWrtList.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/saveLastFdecList.do` | `/kops/main/op/opb/saveLastFdecList.do` | `saveLastFdecList.do` | ⚠️ | app_op_opb_EntpOggBriefFormWrtList.clx.js, app_op_opb_LastFdecList.clx.js |
| `op/opb/saveWrtByLrg.do` | `/kops/main/op/opb/saveWrtByLrg.do` | `saveWrtByLrg.do` | ⚠️ | app_op_opb_FileExmPrsntList.clx.js |
| `op/opb/selectBizWrtTgtInfo.do` | `/kops/main/op/opb/selectBizWrtTgtInfo.do` | `selectBizWrtTgtInfo.do` | - | app_op_opb_EntpInfmWrt.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/selectOggBriefFormCnt1.do` | `/kops/main/op/opb/selectOggBriefFormCnt1.do` | `selectOggBriefFormCnt1.do` | - | cpr-lib_udc.js |
| `op/opb/selectOggBriefFormCnt2.do` | `/kops/main/op/opb/selectOggBriefFormCnt2.do` | `selectOggBriefFormCnt2.do` | - | cpr-lib_udc.js |
| `op/opb/selectOggBriefFormCnt3.do` | `/kops/main/op/opb/selectOggBriefFormCnt3.do` | `selectOggBriefFormCnt3.do` | - | app_op_opb_EntpOggBriefFormWrtList.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/selectOggBriefFormCnt4.do` | `/kops/main/op/opb/selectOggBriefFormCnt4.do` | `selectOggBriefFormCnt4.do` | - | app_op_opb_EntpOggBriefFormWrtList.clx.js, app_op_opb_OggBriefWrtList.clx.js |
| `op/opb/selectOggBriefFormCnt5.do` | `/kops/main/op/opb/selectOggBriefFormCnt5.do` | `selectOggBriefFormCnt5.do` | - | cpr-lib_udc.js |
| `op/opb/selectOggBriefFormCnt6.do` | `/kops/main/op/opb/selectOggBriefFormCnt6.do` | `selectOggBriefFormCnt6.do` | - | cpr-lib_udc.js |
| `op/opb/selectOggBriefFormCnt7.do` | `/kops/main/op/opb/selectOggBriefFormCnt7.do` | `selectOggBriefFormCnt7.do` | - | cpr-lib_udc.js |
| `op/opb/selectOggBriefFormUpdAllCnt.do` | `/kops/main/op/opb/selectOggBriefFormUpdAllCnt.do` | `selectOggBriefFormUpdAllCnt.do` | - | app_op_opb_EntpOggBriefFormUpdList.clx.js, app_op_opb_OggBriefWrtUpdList.clx.js |
| `op/opb/selectOggBriefFormUpdCnt3.do` | `/kops/main/op/opb/selectOggBriefFormUpdCnt3.do` | `selectOggBriefFormUpdCnt3.do` | - | app_op_opb_EntpOggBriefFormUpdList.clx.js, app_op_opb_OggBriefWrtUpdList.clx.js |
| `op/opb/selectOggBriefFormUpdCnt4.do` | `/kops/main/op/opb/selectOggBriefFormUpdCnt4.do` | `selectOggBriefFormUpdCnt4.do` | - | app_op_opb_EntpOggBriefFormUpdList.clx.js, app_op_opb_OggBriefWrtUpdList.clx.js |
| `op/opb/selectVsDsgFileList.do` | `/kops/main/op/opb/selectVsDsgFileList.do` | `selectVsDsgFileList.do` | - | app_op_opb_FileExmPrsntList.clx.js |
| `op/opc/selectOggBriefCommBiz1List.do` | `/kops/main/op/opc/selectOggBriefCommBiz1List.do` | `selectOggBriefCommBiz1List.do` | - | app_op_opc_MsupInfmList.clx.js |
| `op/opc/selectOggBriefCommBiz2List.do` | `/kops/main/op/opc/selectOggBriefCommBiz2List.do` | `selectOggBriefCommBiz2List.do` | - | app_op_opc_MeqipInfmList.clx.js |
| `op/opc/selectOggBriefCommBiz3List.do` | `/kops/main/op/opc/selectOggBriefCommBiz3List.do` | `selectOggBriefCommBiz3List.do` | - | app_op_opc_YadmInfmList.clx.js |
| `op/opd/sampleFIleDownloadList.do` | `/kops/main/op/opd/sampleFIleDownloadList.do` | `sampleFIleDownloadList.do` | - | app_op_opd_Rfrm.clx.js, app_op_opd_RfrmDtl.clx.js |
| `op/opd/saveEduAplWrt.do` | `/kops/main/op/opd/saveEduAplWrt.do` | `saveEduAplWrt.do` | ⚠️ | app_op_opd_EduApl.clx.js, app_op_opd_EduAplWrt.clx.js |
| `op/opd/saveInfmTrfrAplWrt.do` | `/kops/main/op/opd/saveInfmTrfrAplWrt.do` | `saveInfmTrfrAplWrt.do` | ⚠️ | app_op_opd_InfmTrfrAplList.clx.js, app_op_opd_InfmTrfrAplWrt.clx.js |
| `op/opd/saveInfmTrfrCloRptWrt.do` | `/kops/main/op/opd/saveInfmTrfrCloRptWrt.do` | `saveInfmTrfrCloRptWrt.do` | ⚠️ | app_op_opd_InfmTrfrAplList.clx.js, app_op_opd_InfmTrfrAplWrt.clx.js |
| `op/opd/saveNtfclteInqCnt.ndo` | `/kops/main/op/opd/saveNtfclteInqCnt.ndo` | `saveNtfclteInqCnt.ndo` | ⚠️ | app_op_opd_Ntfclte.clx.js, app_op_opd_NtfclteDtl.clx.js |
| `op/opd/saveRfrmInqCnt.ndo` | `/kops/main/op/opd/saveRfrmInqCnt.ndo` | `saveRfrmInqCnt.ndo` | ⚠️ | app_op_opd_Rfrm.clx.js, app_op_opd_RfrmDtl.clx.js |
| `op/opd/selectAplPsblNop.do` | `/kops/main/op/opd/selectAplPsblNop.do` | `selectAplPsblNop.do` | - | app_op_opd_EduApl.clx.js, app_op_opd_EduAplWrt.clx.js |
| `op/opd/selectEduAplInfo.do` | `/kops/main/op/opd/selectEduAplInfo.do` | `selectEduAplInfo.do` | - | app_op_opd_EduApl.clx.js, app_op_opd_EduAplDtl.clx.js |
| `op/opd/selectInfmTrfrAplCnt.do` | `/kops/main/op/opd/selectInfmTrfrAplCnt.do` | `selectInfmTrfrAplCnt.do` | - | app_com_main_Main.clx.js |
| `op/opd/updateEduApl.do` | `/kops/main/op/opd/updateEduApl.do` | `updateEduApl.do` | ⚠️ | app_op_opd_EduApl.clx.js, app_op_opd_EduAplDtlDesc.clx.js |
| `op/opf/saveMbInfo.do` | `/kops/main/op/opf/saveMbInfo.do` | `saveMbInfo.do` | ⚠️ | app_op_opf_MbInfmUpdFirmCso.clx.js, app_op_opf_MbInfmUpdIndvCso.clx.js |
| `op/opf/updateMbPwd.do` | `/kops/main/op/opf/updateMbPwd.do` | `updateMbPwd.do` | ⚠️ | app_op_opf_MbInfmUpdPwd.clx.js |
| `op/opf/updateUsrOut.do` | `/kops/main/op/opf/updateUsrOut.do` | `updateUsrOut.do` | ⚠️ | app_op_opf_MbInfmOt.clx.js |
| `op/opg/chkMbIdSbscYn.ndo` | `/kops/main/op/opg/chkMbIdSbscYn.ndo` | `chkMbIdSbscYn.ndo` | - | app_op_opd_InfmTrfrAplList.clx.js, app_op_opd_InfmTrfrAplWrt.clx.js |
| `raonk/raonkViewerCustom.ndo` | `/kops/main/raonk/raonkViewerCustom.ndo` | `raonkViewerCustom.ndo` | - | cpr-lib_udc.js |

> ⚠️ 표시는 `save/delete/update/upload/...` 계열. 테스트 STEP에서는 **클릭하지 않고 기록만** 합니다.

## 5. 메뉴별 상세 (84)

### `OPAA000000` — 지출보고서 정보공개

- 수준 L1 / 로그인 **불요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `public`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `0`, body `1645`, clx히트 `False`, 로드 `Main.clx.js, index.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA000000.py` / STEP **25** / 기대 URI **62** / 상세화면 **14** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAcpDescPrdAstc1Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectAcpDescPrdAstc1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcInfoRcmd.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcInfoRcmd.ndo.json` |  경계1/악성6 | app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcListGSum.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | popup_button/cl | `testcases/dataset/selectAllSeeStcListGSum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 74 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/com/selectComCodeList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectComCodeList.ndo.json` | dmParam 경계1/악성6 | app_op_opa_OggBriefPubDataSrch.clx.js:fnCommCdSerach |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc3Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc4Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc5Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAvg1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2Gsum.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAvg2Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOggBriefOfanDataSrchList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefOfanDataSrchList.ndo.json` | dmParam 경계6/악성6 | app_op_opa_OggBriefOfanDataList.clx.js:doSearch_backup,doSearch |
| `/kops/main/op/opa/selectOggBriefPub1List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub1List.ndo.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub2List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub2List.ndo.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub3List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub3List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub4List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub4List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub5List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefPub5List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub6List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefPub6List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub7List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub7List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | dmParam 경계4/악성6 | app_op_opa_EntpOggBriefPubInfoList.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPubDataSrchList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefPubDataSrchList.ndo.json` | dmParam 경계6/악성6 | app_op_opa_OggBriefPubDataSrch.clx.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAllSeeStcEntpSclList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefOfanDataFileList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefOfanDataThumbnailList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAcpDescPrdAstc1Gsum.ndo.json` | - | - | `cases/req_selectAcpDescPrdAstc1Gsum.ndo.csv` / `cases/res_selectAcpDescPrdAstc1Gsum.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoRcmd.ndo.json` | - | - | `cases/req_selectAllSeeStcInfoRcmd.ndo.csv` / `cases/res_selectAllSeeStcInfoRcmd.ndo.csv` |
| `testcases/dataset/selectAllSeeStcListGSum.ndo.json` | - | - | `cases/req_selectAllSeeStcListGSum.ndo.csv` / `cases/res_selectAllSeeStcListGSum.ndo.csv` |
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectComCodeList.ndo.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,PLC_CD | - | `cases/req_selectComCodeList.ndo.csv` / `cases/res_selectComCodeList.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc1Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc1Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc1Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc3Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc3Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc3Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc4Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc4Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc4Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc5Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc5Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc5Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAvg1Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAvg1Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAvg1Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAvg2Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAvg2Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAvg2Gsum.ndo.csv` |
| `testcases/dataset/selectOggBriefOfanDataSrchList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=6; pageIndexerCount=6 | chgpId,regpId | `cases/req_selectOggBriefOfanDataSrchList.ndo.csv` / `cases/res_selectOggBriefOfanDataSrchList.ndo.csv` |
| `testcases/dataset/selectOggBriefPub1List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub1List.ndo.csv` / `cases/res_selectOggBriefPub1List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub2List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub2List.ndo.csv` / `cases/res_selectOggBriefPub2List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub3List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub3List.ndo.csv` / `cases/res_selectOggBriefPub3List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub4List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub4List.ndo.csv` / `cases/res_selectOggBriefPub4List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub5List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub5List.ndo.csv` / `cases/res_selectOggBriefPub5List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub6List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub6List.ndo.csv` / `cases/res_selectOggBriefPub6List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub7List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub7List.ndo.csv` / `cases/res_selectOggBriefPub7List.ndo.csv` |
| `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | - | - | `cases/req_selectOggBriefPubAllCnt.ndo.csv` / `cases/res_selectOggBriefPubAllCnt.ndo.csv` |
| `testcases/dataset/selectOggBriefPubDataSrchList.ndo.json` | 영업구분=S; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10; 제출연도(시작)=2025 | chgpId,emailAddr,regpId,telno | `cases/req_selectOggBriefPubDataSrchList.ndo.csv` / `cases/res_selectOggBriefPubDataSrchList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA010000` | 지출보고서 정보공개 > 지출보고서 공표자료 | `app/op/opa/OggBriefOfanDataList` | `openPageId` | selectOggBriefOfanDataSrchList.ndo | ok |
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020200` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공) | `app/op/opa/OggBriefPubDataSrchDtl1` | `openPageId` | - | ok |
| `OPAA020300` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원) | `app/op/opa/OggBriefPubDataSrchDtl2` | `openPageId` | - | ok |
| `OPAA020400` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원) | `app/op/opa/OggBriefPubDataSrchDtl3` | `openPageId` | - | ok |
| `OPAA020500` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회) | `app/op/opa/OggBriefPubDataSrchDtl4` | `openPageId` | - | ok |
| `OPAA020600` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사) | `app/op/opa/OggBriefPubDataSrchDtl5` | `openPageId` | - | ok |
| `OPAA020700` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인) | `app/op/opa/OggBriefPubDataSrchDtl6` | `openPageId` | - | ok |
| `OPAA020800` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opa/OggBriefPubDataSrchDtl7` | `openPageId` | - | ok |
| `OPAA030000` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 | `app/op/opa/AllSeeOggWrptStc` | `openPageId` | selectAllSeeStcInfoPgList.ndo,selectAllSeeStcInfoRcmd.ndo | ok |
| `OPAA030100` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자 | `app/op/opa/LawEcnmyPftOffrrList` | `openPageId` | selectAllSeeStcList.ndo,selectExttOnoList.ndo,selectOggBriefSmitYrList.ndo | ok |
| `OPAA030200` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역 | `app/op/opa/LawEcnmyPftOffrrDtlList` | `openPageId` | selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo,selectOggBriefSmitYrList.ndo | ok |
| `OPAA030300` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역 | `app/op/opa/LawEcnmyPftAcpDtlList` | `openPageId` | selectAcpDescPecnyAstc1.ndo,selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo,selectOggBriefSmitYrList.ndo | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectAcpDescPrdAstc1Gsum.ndo,selectAllSeeStcInfoRcmd.ndo,selectAllSeeStcListGSum.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAA010000 |  |  |
| 4 | `expect_screen` | app/op/opa/OggBriefOfanDataList |  |  |
| 5 | `expect_any` |  | selectOggBriefOfanDataSrchList.ndo | 지출보고서 공표자료 상세 URI |
| 6 | `detail` | OPAA020000 |  |  |
| 7 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 8 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo | 지출보고서 공개자료조회 상세 URI |
| 9 | `detail` | OPAA020100 |  |  |
| 10 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 11 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 12 | `detail` | OPAA020200 |  |  |
| 13 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl1 |  |  |
| 14 | `detail` | OPAA020300 |  |  |
| 15 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl2 |  |  |
| 16 | `detail` | OPAA020400 |  |  |
| 17 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl3 |  |  |
| 18 | `detail` | OPAA020500 |  |  |
| 19 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl4 |  |  |
| 20 | `detail` | OPAA020600 |  |  |
| 21 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl5 |  |  |
| 22 | `detail` | OPAA020700 |  |  |
| 23 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl6 |  |  |
| 24 | `detail` | OPAA020800 |  |  |
| 25 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl7 |  |  |

</details>

### `OPAA010000` — 지출보고서 정보공개 > 지출보고서 공표자료

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefOfanDataList`, 소스 `app_op_opa_OggBriefOfanDataList.clx.js` (52417B, 컴포넌트 19, 이벤트 9, 핸들러 7)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `index.clx.js, .clx.js, OggBriefOfanDataList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA010000.py` / STEP **4** / 기대 URI **4** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=6`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_2 | click | `onBtnFileDownClick` | 1119 | Submit.send |
| 이벤트 | button_3 | click | `onBtnFileDownClick` | 1206 | Submit.send |
| 이벤트 | button_4 | click | `onBtnFileDownClick` | 1291 | Submit.send |
| 이벤트 | button_5 | click | `onBtnFileDownClick` | 1376 | Submit.send |
| 이벤트 | button_6 | click | `onBtnFileDownClick` | 1461 | Submit.send |
| 이벤트 | button_7 | click | `onBtnFileDownClick` | 1546 | Submit.send |
| 이벤트 | userDefinedControl_2 | pagechange | `onUdcPagePagechange` | 1579 | - |
| 이벤트 | app | init | `onBodyInit` | 1598 | - |
| 이벤트 | app | load | `onBodyLoad` | 1601 | - |
| Submission | `subSearch` | - | - | 844 | send@[69, 340] |
| Submission | `subSampleFileList` | - | - | 853 | send@[244] |
| Submission | `subFileDownload` | - | - | 861 | send@[208, 275, 308] |
| Submission | `subThumbnailList` | - | - | 870 | send@[405] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 34 | e | [] | [] | [] |
| `onBodyLoad` | 47 | e | [] | [] | [] |
| `doSearch` | 64 |  | ['subSearch'] | [] | [] |
| `onBtnFileDownClick` | 194 | e | ['subFileDownload', 'subSampleFileList', 'subFileDownload'] | [] | [] |
| `onBtnFileViewClick` | 294 | e | ['subFileDownload'] | [] | [] |
| `onUdcPagePagechange` | 326 | e | [] | [] | [] |
| `doSearch_backup` | 331 |  | ['subSearch', 'subThumbnailList'] | [] | ['op/opa/selectOggBriefOfanDataSrchList.ndo', 'op/opa/selectOggBriefOfanDataFileList.ndo', 'op/com/downloadFile.ndo', 'op/opa/selectOggBriefOfanDataThumbnailList.ndo'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectOggBriefOfanDataSrchList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefOfanDataSrchList.ndo.json` | dmParam 경계6/악성6 | app_op_opa_OggBriefOfanDataList.clx.js:doSearch_backup,doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefOfanDataFileList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefOfanDataThumbnailList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefOfanDataSrchList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=6; pageIndexerCount=6 | chgpId,regpId | `cases/req_selectOggBriefOfanDataSrchList.ndo.csv` / `cases/res_selectOggBriefOfanDataSrchList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공표자료 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefOfanDataList |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectOggBriefOfanDataSrchList.ndo | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAA020000` — 지출보고서 정보공개 > 지출보고서 공개자료조회

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrch`, 소스 `app_op_opa_OggBriefPubDataSrch.clx.js` (42495B, 컴포넌트 21, 이벤트 7, 핸들러 19)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `.clx.js, OggBriefOfanDataList.clx.js, OggBriefPubDataSrch.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020000.py` / STEP **24** / 기대 URI **16** / 상세화면 **8** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `공통코드셋=SAL_TP_CD,SAL_FRM_CD,PLC_CD`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_3 | click | `onCmbSalFrmCdClick` | 825 | - |
| 이벤트 | button_1 | click | `onBtnInitClick` | 920 | - |
| 이벤트 | button_1 | keydown | `onBtnInitKeydown` | 923 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 935 | - |
| 이벤트 | 상세보기 | click | `onBtnLinkClick` | 1202 | menu:OPAA020100 |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1255 | - |
| 이벤트 | app | init | `onBodyInit` | 1275 | - |
| 전환 | `openPageId` | - | target `OPAA020100` | 436 | "OPAA020100", param |
| Submission | `subSearch` | - | - | 629 | send@[307] |
| Submission | `subComCodeList` | - | - | 639 | send@[145] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `getCookie` | 49 | name | [] | [] | [] |
| `onBodyInit` | 63 | e | [] | [] | [] |
| `fn_init` | 114 |  | [] | [] | [] |
| `fnPageInit` | 125 |  | [] | [] | [] |
| `fnCommCdSerach` | 135 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 185 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnCodeProc` | 208 | dataSetNm,comboBxNm | [] | [] | [] |
| `fnArrSalFrmCdCombo` | 218 |  | [] | [] | [] |
| `onUdcPagePagechange` | 242 | e | [] | [] | [] |
| `onBtnSearchClick` | 251 | e | [] | [] | [] |
| `doSearch` | 271 | type | ['subSearch'] | [] | [] |
| `fnValidationChk` | 351 |  | [] | [] | [] |
| `onBtnInitClick` | 376 | e | [] | [] | [] |
| `onUdcGridTitleUdcSelectionChange` | 386 | e | [] | [] | [] |
| `onBtnLinkClick` | 405 | e | [] | [] | ['OPAA020100'] |
| `onBtnInitKeydown` | 446 | e | [] | [] | [] |
| `onCmbSalTpCdItemClick` | 456 | e | [] | [] | [] |
| `onCmbSalFrmCdClick` | 475 | e | [] | [] | [] |
| `multiComboClick` | 488 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 37 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/com/selectComCodeList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectComCodeList.ndo.json` | dmParam 경계1/악성6 | app_op_opa_OggBriefPubDataSrch.clx.js:fnCommCdSerach |
| `/kops/main/op/opa/selectOggBriefPub1List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub1List.ndo.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub2List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub2List.ndo.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub3List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub3List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub4List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub4List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub5List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefPub5List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub6List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefPub6List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub7List.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefPub7List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | dmParam 경계4/악성6 | app_op_opa_EntpOggBriefPubInfoList.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPubDataSrchList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefPubDataSrchList.ndo.json` | dmParam 경계6/악성6 | app_op_opa_OggBriefPubDataSrch.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectComCodeList.ndo.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,PLC_CD | - | `cases/req_selectComCodeList.ndo.csv` / `cases/res_selectComCodeList.ndo.csv` |
| `testcases/dataset/selectOggBriefPub1List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub1List.ndo.csv` / `cases/res_selectOggBriefPub1List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub2List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub2List.ndo.csv` / `cases/res_selectOggBriefPub2List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub3List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub3List.ndo.csv` / `cases/res_selectOggBriefPub3List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub4List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub4List.ndo.csv` / `cases/res_selectOggBriefPub4List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub5List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub5List.ndo.csv` / `cases/res_selectOggBriefPub5List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub6List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub6List.ndo.csv` / `cases/res_selectOggBriefPub6List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub7List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub7List.ndo.csv` / `cases/res_selectOggBriefPub7List.ndo.csv` |
| `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | - | - | `cases/req_selectOggBriefPubAllCnt.ndo.csv` / `cases/res_selectOggBriefPubAllCnt.ndo.csv` |
| `testcases/dataset/selectOggBriefPubDataSrchList.ndo.json` | 영업구분=S; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10; 제출연도(시작)=2025 | chgpId,emailAddr,regpId,telno | `cases/req_selectOggBriefPubDataSrchList.ndo.csv` / `cases/res_selectOggBriefPubDataSrchList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020200` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공) | `app/op/opa/OggBriefPubDataSrchDtl1` | `openPageId` | - | ok |
| `OPAA020300` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원) | `app/op/opa/OggBriefPubDataSrchDtl2` | `openPageId` | - | ok |
| `OPAA020400` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원) | `app/op/opa/OggBriefPubDataSrchDtl3` | `openPageId` | - | ok |
| `OPAA020500` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회) | `app/op/opa/OggBriefPubDataSrchDtl4` | `openPageId` | - | ok |
| `OPAA020600` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사) | `app/op/opa/OggBriefPubDataSrchDtl5` | `openPageId` | - | ok |
| `OPAA020700` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인) | `app/op/opa/OggBriefPubDataSrchDtl6` | `openPageId` | - | ok |
| `OPAA020800` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opa/OggBriefPubDataSrchDtl7` | `openPageId` | - | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `fill` | 업체명 | @sample.업체명 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPub1List.ndo,selectOggBriefPub2List.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `detail` | OPAA020200 |  |  |
| 11 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl1 |  |  |
| 12 | `detail` | OPAA020300 |  |  |
| 13 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl2 |  |  |
| 14 | `detail` | OPAA020400 |  |  |
| 15 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl3 |  |  |
| 16 | `detail` | OPAA020500 |  |  |
| 17 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl4 |  |  |
| 18 | `detail` | OPAA020600 |  |  |
| 19 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl5 |  |  |
| 20 | `detail` | OPAA020700 |  |  |
| 21 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl6 |  |  |
| 22 | `detail` | OPAA020800 |  |  |
| 23 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl7 |  |  |
| 24 | `popup` | 조회 |  |  |

</details>

### `OPAA020100` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/EntpOggBriefPubInfoList`, 소스 `app_op_opa_EntpOggBriefPubInfoList.clx.js` (26218B, 컴포넌트 9, 이벤트 10, 핸들러 7)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `OggBriefPubDataSrch.clx.js, ScnAccesNtfcP01.clx.js, EntpOggBriefPubInfoList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020100.py` / STEP **7** / 기대 URI **6** / 상세화면 **1** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onBtnList` | 445 | menu:OPAA020100,OPAA020000 |
| 이벤트 | button_2 | click | `onBtnExlDwndClick` | 558 | - |
| 이벤트 | userDefinedControl_4 | udcClick | `onUdcPubcardUdcClick` | 599 | - |
| 이벤트 | userDefinedControl_5 | udcClick | `onUdcPubcardUdcClick` | 609 | - |
| 이벤트 | userDefinedControl_6 | udcClick | `onUdcPubcardUdcClick` | 619 | - |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcPubcardUdcClick` | 632 | - |
| 이벤트 | userDefinedControl_8 | udcClick | `onUdcPubcardUdcClick` | 645 | - |
| 이벤트 | userDefinedControl_9 | udcClick | `onUdcPubcardUdcClick` | 655 | - |
| 이벤트 | userDefinedControl_10 | udcClick | `onUdcPubcardUdcClick` | 665 | - |
| 이벤트 | app | init | `onBodyInit` | 690 | - |
| 전환 | `openPageId` | - | target `OPAA020100` | 236 | "OPAA020100", param |
| 전환 | `openPageId` | - | target `OPAA020000` | 237 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| Submission | `subSearch` | - | - | 324 | send@[] |
| Submission | `subSearchDtl` | - | - | 332 | send@[] |
| Submission | `excelExport` | - | - | 340 | send@[] |
| Submission | `excelExport1` | - | - | 348 | send@[] |
| Submission | `excelExport2` | - | - | 356 | send@[] |
| Submission | `excelExport3` | - | - | 364 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 40 | e | [] | [] | [] |
| `onUdcPubcardUdcSelectionChange` | 64 | e | [] | [] | [] |
| `doSearch` | 81 |  | [] | [] | ['op/opa/selectOggBriefPubAllCnt.ndo'] |
| `doSrchDtl` | 136 |  | [] | [] | ['op/opa/selectOggBriefPub3Cnt.ndo', 'op/opa/selectOggBriefPub4Cnt.ndo'] |
| `onUdcPubcardUdcClick` | 169 | e | [] | [] | [] |
| `onBtnList` | 231 |  | [] | [] | ['OPAA020100', 'OPAA020000'] |
| `onBtnExlDwndClick` | 259 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | dmParam 경계4/악성6 | app_op_opa_EntpOggBriefPubInfoList.clx.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub3Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPub4Cnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | - | - | `cases/req_selectOggBriefPubAllCnt.ndo.csv` / `cases/res_selectOggBriefPubAllCnt.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAA020000 |  |  |
| 6 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 7 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |

</details>

### `OPAA020200` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl1`, 소스 `app_op_opa_OggBriefPubDataSrchDtl1.clx.js` (9694B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `875`, clx히트 `True`, 로드 `ScnAccesNtfcP01.clx.js, EntpOggBriefPubInfoList.clx.js, OggBriefPubDataSrchDtl1.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020200.py` / STEP **11** / 기대 URI **3** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 165 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 177 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 256 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 50 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 72 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 48 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 70 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 6 | 본문 | popup_button,screen/cl | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub1List.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPub1List.ndo.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | dmParam 경계4/악성6 | app_op_opa_EntpOggBriefPubInfoList.clx.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOggBriefPub1List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub1List.ndo.csv` / `cases/res_selectOggBriefPub1List.ndo.csv` |
| `testcases/dataset/selectOggBriefPubAllCnt.ndo.json` | - | - | `cases/req_selectOggBriefPubAllCnt.ndo.csv` / `cases/res_selectOggBriefPubAllCnt.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개 현황 | ✅ | selectOggBriefPub1List.ndo,selectOggBriefPubAllCnt.ndo,selectBizInfoSubTitle.ndo | click_지출보고서 공개 현황 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl1 |  |  |
| 3 | `expect_any` |  | selectOggBriefPub1List.ndo,selectOggBriefPubAllCnt.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAA020000 |  |  |
| 5 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `popup` | 지출보고서 공개 현황 |  |  |
| 11 | `expect_any` |  | selectOggBriefPub1List.ndo,selectOggBriefPubAllCnt.ndo,selectBizInfoSubTitle.ndo | 팝업 지출보고서 공개 현황 |

</details>

### `OPAA020300` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl2`, 소스 `app_op_opa_OggBriefPubDataSrchDtl2.clx.js` (9687B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `877`, clx히트 `True`, 로드 `OggBriefPubDataSrchDtl1.clx.js, OggBriefPubList1.clx.js, OggBriefPubDataSrchDtl2.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020300.py` / STEP **11** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 162 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 174 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 253 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 48 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 69 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 47 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 68 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 4 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub2List.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPub2List.ndo.json` | dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOggBriefPub2List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub2List.ndo.csv` / `cases/res_selectOggBriefPub2List.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개 현황 | ⚠️ | selectOggBriefPub2List.ndo |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl2 |  |  |
| 3 | `expect_any` |  | selectOggBriefPub2List.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAA020000 |  |  |
| 5 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `popup` | 지출보고서 공개 현황 |  |  |
| 11 | `expect_any` |  | selectOggBriefPub2List.ndo | 팝업 지출보고서 공개 현황 |

</details>

### `OPAA020400` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl3`, 소스 `app_op_opa_OggBriefPubDataSrchDtl3.clx.js` (9689B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `883`, clx히트 `True`, 로드 `OggBriefPubDataSrchDtl2.clx.js, OggBriefPubList2.clx.js, OggBriefPubDataSrchDtl3.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020400.py` / STEP **11** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 162 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 174 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 253 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 48 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 69 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 47 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 68 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 5 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub3List.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPub3List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOggBriefPub3List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub3List.ndo.csv` / `cases/res_selectOggBriefPub3List.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개 현황 | ⚠️ | selectOggBriefPub3List.ndo |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl3 |  |  |
| 3 | `expect_any` |  | selectOggBriefPub3List.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAA020000 |  |  |
| 5 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `popup` | 지출보고서 공개 현황 |  |  |
| 11 | `expect_any` |  | selectOggBriefPub3List.ndo | 팝업 지출보고서 공개 현황 |

</details>

### `OPAA020500` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl4`, 소스 `app_op_opa_OggBriefPubDataSrchDtl4.clx.js` (9686B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `873`, clx히트 `True`, 로드 `OggBriefPubDataSrchDtl3.clx.js, OggBriefPubList3.clx.js, OggBriefPubDataSrchDtl4.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020500.py` / STEP **11** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 163 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 175 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 254 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 49 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 70 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 48 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 69 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 6 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub4List.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPub4List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOggBriefPub4List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub4List.ndo.csv` / `cases/res_selectOggBriefPub4List.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개 현황 | ⚠️ | selectOggBriefPub4List.ndo |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl4 |  |  |
| 3 | `expect_any` |  | selectOggBriefPub4List.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAA020000 |  |  |
| 5 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `popup` | 지출보고서 공개 현황 |  |  |
| 11 | `expect_any` |  | selectOggBriefPub4List.ndo | 팝업 지출보고서 공개 현황 |

</details>

### `OPAA020600` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl5`, 소스 `app_op_opa_OggBriefPubDataSrchDtl5.clx.js` (9685B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `OggBriefPubDataSrchDtl4.clx.js, OggBriefPubList4.clx.js, OggBriefPubDataSrchDtl5.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020600.py` / STEP **8** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 162 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 174 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 253 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 48 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 69 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 47 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 68 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 6 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl5 |  |  |
| 3 | `detail` | OPAA020000 |  |  |
| 4 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 5 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 6 | `detail` | OPAA020100 |  |  |
| 7 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 8 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |

</details>

### `OPAA020700` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl6`, 소스 `app_op_opa_OggBriefPubDataSrchDtl6.clx.js` (9737B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `OggBriefPubList4.clx.js, OggBriefPubDataSrchDtl5.clx.js, OggBriefPubDataSrchDtl6.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020700.py` / STEP **8** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 162 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 174 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 253 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 48 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 69 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 47 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 68 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 2 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl6 |  |  |
| 3 | `detail` | OPAA020000 |  |  |
| 4 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 5 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 6 | `detail` | OPAA020100 |  |  |
| 7 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 8 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |

</details>

### `OPAA020800` — 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용)

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/OggBriefPubDataSrchDtl7`, 소스 `app_op_opa_OggBriefPubDataSrchDtl7.clx.js` (9765B, 컴포넌트 8, 이벤트 3, 핸들러 3)
- 런타임: instance `1`, body `613`, clx히트 `True`, 로드 `OggBriefPubList5.clx.js, OggBriefPubDataSrchDtl6.clx.js, OggBriefPubDataSrchDtl7.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA020800.py` / STEP **11** / 기대 URI **4** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 업체전체목록 | click | `onPubDataSrch` | 162 | menu:OPAA020000 |
| 이벤트 | 지출보고서 공개 현황 | click | `onBtnPubInfoList` | 174 | menu:OPAA020100 |
| 이벤트 | app | init | `onBodyInit` | 253 | - |
| 전환 | `openPageId` | - | target `OPAA020000` | 48 | "OPAA020000",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |
| 전환 | `openPageId` | - | target `OPAA020100` | 69 | "OPAA020100",  {	  "oggBriefSmitYr" 	: initValue.oggBriefSmitYr 																						, "o |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onPubDataSrch` | 47 |  | [] | [] | ['OPAA020000'] |
| `onBtnPubInfoList` | 68 |  | [] | [] | ['OPAA020100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 8 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOggBriefPub5List.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefPub5List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub6List.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefPub6List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectOggBriefPub7List.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefPub7List.ndo.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOggBriefPub5List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub5List.ndo.csv` / `cases/res_selectOggBriefPub5List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub6List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub6List.ndo.csv` / `cases/res_selectOggBriefPub6List.ndo.csv` |
| `testcases/dataset/selectOggBriefPub7List.ndo.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefPub7List.ndo.csv` / `cases/res_selectOggBriefPub7List.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `app/op/opa/OggBriefPubDataSrch` | `openPageId` | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | ok |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개 현황 | ⚠️ | selectOggBriefPub7List.ndo |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/OggBriefPubDataSrchDtl7 |  |  |
| 3 | `expect_any` |  | selectOggBriefPub5List.ndo,selectOggBriefPub6List.ndo,selectOggBriefPub7List.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAA020000 |  |  |
| 5 | `expect_screen` | app/op/opa/OggBriefPubDataSrch |  |  |
| 6 | `expect_any` |  | selectComCodeList.ndo,selectOggBriefPubDataSrchList.ndo,selectOggBriefPubAllCnt.ndo | 지출보고서 공개자료조회 상세 URI |
| 7 | `detail` | OPAA020100 |  |  |
| 8 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 9 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 10 | `popup` | 지출보고서 공개 현황 |  |  |
| 11 | `expect_any` |  | selectOggBriefPub7List.ndo | 팝업 지출보고서 공개 현황 |

</details>

### `OPAA030000` — 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/AllSeeOggWrptStc`, 소스 `app_op_opa_AllSeeOggWrptStc.clx.js` (37350B, 컴포넌트 17, 이벤트 12, 핸들러 8)
- 런타임: instance `1`, body `793`, clx히트 `True`, 로드 `OggBriefPubDataSrchDtl7.clx.js, OggBriefPubList7.clx.js, AllSeeOggWrptStc.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA030000.py` / STEP **15** / 기대 URI **43** / 상세화면 **3** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnSearchClick` | 598 | - |
| 이벤트 | userDefinedControl_3 | udcClick | `onUdcAllSeeCardUdcClick` | 675 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_4 | udcClick | `onUdcAllSeeCardUdcClick` | 705 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_5 | udcClick | `onUdcAllSeeCardUdcClick` | 735 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcAllSeeCardUdcClick` | 882 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_8 | udcClick | `onUdcAllSeeCardUdcClick` | 910 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_9 | udcClick | `onUdcAllSeeCardUdcClick` | 938 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_10 | udcClick | `onUdcAllSeeCardUdcClick` | 966 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_11 | udcClick | `onUdcAllSeeCardUdcClick` | 994 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_12 | udcClick | `onUdcAllSeeCardUdcClick` | 1022 | menu:OPAA030100,OPA1,OPA2,OPA3,OPA4,OPA5,OPV1 |
| 이벤트 | userDefinedControl_13 | pagechange | `onUdcPagePagechange` | 1044 | - |
| 이벤트 | app | init | `onBodyInit` | 1080 | - |
| 전환 | `openPageId` | - | target `OPAA030100` | 250 | "OPAA030100",  {	  "stcGubn" 	: vStcGubn    } |
| 전환 | `openPageId` | - | target `OPAA030200` | 259 | "OPAA030200",  {	  "stcGubn" 	: vStcGubn	 } |
| 전환 | `openPageId` | - | target `OPAA030300` | 264 | "OPAA030300",  {	  "stcGubn" 	: vStcGubn	 } |
| Submission | `subSearch` | - | - | 471 | send@[] |
| Submission | `subSearchPg` | - | - | 480 | send@[] |
| Submission | `subSearchRcmd` | - | - | 490 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 33 | e | [] | [] | [] |
| `getCookie` | 94 | name | [] | [] | [] |
| `doSearchRcmd` | 109 |  | [] | [] | [] |
| `doSearch` | 146 |  | [] | [] | [] |
| `doSearchSum` | 208 | url, gbn | [] | [] | [] |
| `onUdcAllSeeCardUdcClick` | 243 | e | [] | [] | ['OPAA030100', 'OPA1', 'OPA2', 'OPA3', 'OPA4', 'OPA5', 'OPV1', 'OPV2', 'OPV3', 'OPV4', 'OPV5', 'OPAA030200', 'OPAA030300'] |
| `onUdcPagePagechange` | 272 | e | [] | [] | [] |
| `onBtnSearchClick` | 281 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAcpDescPrdAstc1Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectAcpDescPrdAstc1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcInfoRcmd.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAllSeeStcInfoRcmd.ndo.json` |  경계1/악성6 | app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opa/selectAllSeeStcListGSum.ndo` | ✅ | 200 / 200 | 2 | 본문 | popup_button/cl | `testcases/dataset/selectAllSeeStcListGSum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 37 | 본문,하위화면 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc3Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc4Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAstc5Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAvg1Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2Gsum.ndo` | ✅ | 200 / 200 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOffrDescPecnyAvg2Gsum.ndo.json` |  경계1/악성6 | - |
| `/kops/main/op/opa/selectAcpDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAllSeeStcEntpSclList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAcpDescPrdAstc1Gsum.ndo.json` | - | - | `cases/req_selectAcpDescPrdAstc1Gsum.ndo.csv` / `cases/res_selectAcpDescPrdAstc1Gsum.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoRcmd.ndo.json` | - | - | `cases/req_selectAllSeeStcInfoRcmd.ndo.csv` / `cases/res_selectAllSeeStcInfoRcmd.ndo.csv` |
| `testcases/dataset/selectAllSeeStcListGSum.ndo.json` | - | - | `cases/req_selectAllSeeStcListGSum.ndo.csv` / `cases/res_selectAllSeeStcListGSum.ndo.csv` |
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc1Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc1Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc1Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc3Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc3Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc3Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc4Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc4Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc4Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc5Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAstc5Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAstc5Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAvg1Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAvg1Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAvg1Gsum.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAvg2Gsum.ndo.json` | - | - | `cases/req_selectOffrDescPecnyAvg2Gsum.ndo.csv` / `cases/res_selectOffrDescPecnyAvg2Gsum.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAA030100` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자 | `app/op/opa/LawEcnmyPftOffrrList` | `openPageId` | selectAllSeeStcList.ndo,selectExttOnoList.ndo,selectOggBriefSmitYrList.ndo | ok |
| `OPAA030200` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역 | `app/op/opa/LawEcnmyPftOffrrDtlList` | `openPageId` | selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo,selectOggBriefSmitYrList.ndo | ok |
| `OPAA030300` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역 | `app/op/opa/LawEcnmyPftAcpDtlList` | `openPageId` | selectAcpDescPecnyAstc1.ndo,selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo,selectOggBriefSmitYrList.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | selectAcpDescPrdAstc1Gsum.ndo,selectAllSeeStcListGSum.ndo,selectOffrDescPecnyAstc1Gsum.ndo,selectOffrDescPecnyAstc3Gsum.ndo,selectOffrDescPecnyAstc4Gsum.ndo |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/AllSeeOggWrptStc |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectAcpDescPrdAstc1Gsum.ndo,selectAllSeeStcInfoRcmd.ndo,selectAllSeeStcListGSum.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAA030100 |  |  |
| 6 | `expect_screen` | app/op/opa/LawEcnmyPftOffrrList |  |  |
| 7 | `expect_any` |  | selectAllSeeStcList.ndo,selectExttOnoList.ndo,selectOggBriefSmitYrList.ndo | 합법적 경제적 이익 제공자 상세 URI |
| 8 | `detail` | OPAA030200 |  |  |
| 9 | `expect_screen` | app/op/opa/LawEcnmyPftOffrrDtlList |  |  |
| 10 | `expect_any` |  | selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo,selectOggBriefSmitYrList.ndo | 합법적 경제적 이익 제공내역 상세 URI |
| 11 | `detail` | OPAA030300 |  |  |
| 12 | `expect_screen` | app/op/opa/LawEcnmyPftAcpDtlList |  |  |
| 13 | `expect_any` |  | selectAcpDescPecnyAstc1.ndo,selectExttOnoList.ndo,selectOffrDescPecnyAstc1.ndo | 합법적 경제적 이익 수수내역 상세 URI |
| 14 | `popup` | 조회 |  |  |
| 15 | `expect_any` |  | selectAcpDescPrdAstc1Gsum.ndo,selectAllSeeStcListGSum.ndo,selectOffrDescPecnyAstc1Gsum.ndo | 팝업 조회 |

</details>

### `OPAA030100` — 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/LawEcnmyPftOffrrList`, 소스 `app_op_opa_LawEcnmyPftOffrrList.clx.js` (52339B, 컴포넌트 15, 이벤트 8, 핸들러 24)
- 런타임: instance `1`, body `660`, clx히트 `True`, 로드 `AllSeeOggWrptStc.clx.js, ScnAccesNtfcP02.clx.js, LawEcnmyPftOffrrList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA030100.py` / STEP **3** / 기대 URI **2** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_2 | mousemove | `onCmbOggBriefSmitYrMousemove` | 988 | - |
| 이벤트 | button_1 | click | `onBtnSearchClick` | 1069 | - |
| 이벤트 | button_3 | click | `onBtnChartClick` | 1163 | - |
| 이벤트 | button_4 | click | `onBtnChartClick` | 1176 | - |
| 이벤트 | button_5 | click | `onBtnChartClick` | 1189 | - |
| 이벤트 | button_6 | click | `onBtnDwndClick` | 1354 | - |
| 이벤트 | app | load | `onBodyLoad` | 1444 | - |
| 이벤트 | app | init | `onBodyInit` | 1447 | - |
| Submission | `subSearch` | - | - | 798 | send@[299, 332] |
| Submission | `subSearchExttOno` | - | - | 804 | send@[145] |
| Submission | `subSearchYear` | - | - | 813 | send@[165] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 44 | e | [] | [] | [] |
| `onBodyInit` | 81 | e | [] | [] | [] |
| `fnCodeProc` | 131 | dataSetNm,comboBxNm | [] | [] | [] |
| `doSearchExttOno` | 143 |  | ['subSearchExttOno'] | [] | [] |
| `doSearchYear` | 161 |  | ['subSearchYear'] | [] | [] |
| `onBtnChartClick` | 200 | e | [] | [] | [] |
| `fnGridDraw` | 232 | grdSelectType | [] | [] | [] |
| `fnDataMake` | 272 |  | [] | [] | [] |
| `fnDataSetGet` | 290 |  | ['subSearch'] | [] | ['op/opa/selectAllSeeStcList.ndo'] |
| `fnDataSetGetB` | 324 | paramData, dataSetId | ['subSearch'] | [] | ['op/opa/selectAllSeeStcEntpSclList.ndo'] |
| `fnGrd` | 347 | vColIndx, clmnCd, clmnNm, gheader | [] | [] | [] |
| `fnAddFrmLyrt` | 411 | selectType,vTitle,vColor | [] | [] | [] |
| `fnDelFrmLyrt` | 483 | selectType | [] | [] | [] |
| `fnChartDraw` | 494 | grdSelectType | [] | [] | [] |
| `onCmbGubunSelectionChange` | 588 | e | [] | [] | [] |
| `onBodyScreenChange` | 626 | e | [] | [] | [] |
| `onBtnDwndClick` | 639 | e | [] | [] | [] |
| `onCmbSalTpCdSelectionChange` | 653 | e | [] | [] | [] |
| `onBtnSearchClick` | 661 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrSelectionChange` | 669 | e | [] | [] | [] |
| `onCmbExttOnoSelectionChange` | 677 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrMousemove` | 686 | e | [] | [] | [] |
| `getCookie` | 693 | name | [] | [] | [] |
| `fnGuideSetting` | 708 |  | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectAllSeeStcEntpSclList.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/LawEcnmyPftOffrrList |  |  |
| 3 | `click` | 조회 |  |  |

</details>

### `OPAA030200` — 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/LawEcnmyPftOffrrDtlList`, 소스 `app_op_opa_LawEcnmyPftOffrrDtlList.clx.js` (107248B, 컴포넌트 16, 이벤트 8, 핸들러 28)
- 런타임: instance `1`, body `660`, clx히트 `True`, 로드 `ScnAccesNtfcP02.clx.js, LawEcnmyPftOffrrList.clx.js, LawEcnmyPftOffrrDtlList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA030200.py` / STEP **3** / 기대 URI **24** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_2 | mousemove | `onCmbOggBriefSmitYrMousemove` | 1951 | - |
| 이벤트 | button_1 | click | `onBtnSearchClick` | 2091 | - |
| 이벤트 | button_3 | click | `onBtnChartClick` | 2188 | - |
| 이벤트 | button_4 | click | `onBtnChartClick` | 2201 | - |
| 이벤트 | button_5 | click | `onBtnChartClick` | 2214 | - |
| 이벤트 | button_6 | click | `onBtnDwndClick` | 2416 | - |
| 이벤트 | grid_1 | mousemove | `onGrd1Mousemove` | 2494 | - |
| 이벤트 | app | load | `onBodyLoad` | 2538 | - |
| Submission | `subSearch` | - | - | 1755 | send@[496, 669] |
| Submission | `subSearchExttOno` | - | - | 1761 | send@[244] |
| Submission | `subSearchYear` | - | - | 1770 | send@[264] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 78 | e | [] | [] | [] |
| `fnInit` | 133 |  | [] | [] | ['OPA1', 'OPA2', 'OPA3', 'OPA4', 'OPA5', 'OPV1', 'OPV2', 'OPV3', 'OPV4', 'OPV5'] |
| `getCookie` | 187 | name | [] | [] | [] |
| `fnCommCdCombox` | 202 | vDataSetNm, vComboxNm | [] | [] | ['OPA1', 'OPV1', 'OPA2', 'OPV2', 'OPA3', 'OPV3', 'OPA4', 'OPV4', 'OPA5', 'OPV5'] |
| `fnCodeProc` | 230 | dataSetNm,comboBxNm | [] | [] | [] |
| `doSearchExttOno` | 242 |  | ['subSearchExttOno'] | [] | [] |
| `doSearchYear` | 260 |  | ['subSearchYear'] | [] | [] |
| `onBtnChartClick` | 299 | e | [] | [] | [] |
| `fnGridDraw` | 321 |  | [] | [] | [] |
| `fnDataMake` | 459 |  | [] | [] | [] |
| `fnDataSetGet` | 482 | paramData, dataSetId | ['subSearch'] | [] | [] |
| `fnPrgDataSetGet` | 659 |  | ['subSearch'] | [] | [] |
| `fnScrnTrnCall` | 685 |  | [] | [] | ['op/opa/selectOffrDescPecnyAstc1.ndo', 'op/opa/selectOffrDescPecnyAstc2.ndo', 'op/opa/selectOffrDescPecnyAstc3.ndo', 'op/opa/selectOffrDescPecnyAstc4.ndo', 'op/opa/selectOffrDescPecnyAstc5.ndo', 'op/opa/selectOffrDescPecnyAvg1.ndo', 'op/opa/selectOffrDescPecnyAvg2.ndo', 'op/opa/selectOffrDescPecnyAvg3.ndo', 'op/opa/selectOffrDescPecnyAvg4.ndo', 'op/opa/selectOffrDescPecnyAvg5.ndo', 'op/opa/selectOffrDescPecnyPrg1.ndo', 'op/opa/selectOffrDescPecnyPrg2.ndo', 'op/opa/selectOffrDescPecnyPrg3.ndo', 'op/opa/selectOffrDescPecnyPrg4.ndo', 'op/opa/selectOffrDescPecnyPrg5.ndo', 'op/opa/selectOffrDescPrdAstc1.ndo', 'op/opa/selectOffrDescPrdAstc2.ndo', 'op/opa/selectOffrDescPrdAstc3.ndo', 'op/opa/selectOffrDescPrdAvg1.ndo', 'op/opa/selectOffrDescPrdAvg2.ndo', 'op/opa/selectOffrDescPrdAvg3.ndo', 'op/opa/selectOffrDescPrdPrg1.ndo', 'op/opa/selectOffrDescPrdPrg2.ndo', 'op/opa/selectOffrDescPrdPrg3.ndo'] |
| `fnGrd` | 798 | vColIndx, gubun, comHeader, clmnCd, clmnNm, gheader | [] | [] | [] |
| `fnChartDraw` | 975 |  | [] | [] | [] |
| `onBtnDwndClick` | 1222 | e | [] | [] | [] |
| `onCmbGubunSelectionChange` | 1236 | e | [] | [] | [] |
| `onCmbScNoSelectionChange` | 1300 | e | [] | [] | [] |
| `fnDspTtl` | 1311 |  | [] | [] | [] |
| `onBtnSearchClick` | 1478 | e | [] | [] | [] |
| `onBodyScreenChange` | 1488 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrSelectionChange` | 1501 | e | [] | [] | [] |
| `onCmbSalTpCdSelectionChange` | 1512 | e | [] | [] | [] |
| `onCmbExttOnoSelectionChange` | 1529 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrMousemove` | 1542 | e | [] | [] | [] |
| `fnGuideSetting` | 1550 |  | [] | [] | [] |
| `onGrd1Mousemove` | 1559 | e | [] | [] | [] |
| `onGrd1CellMouseover` | 1568 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectOffrDescPecnyAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg4.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPecnyPrg5.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAstc3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdAvg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectOffrDescPrdPrg3.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/LawEcnmyPftOffrrDtlList |  |  |
| 3 | `click` | 조회 |  |  |

</details>

### `OPAA030300` — 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opa/LawEcnmyPftAcpDtlList`, 소스 `app_op_opa_LawEcnmyPftAcpDtlList.clx.js` (95107B, 컴포넌트 17, 이벤트 8, 핸들러 27)
- 런타임: instance `1`, body `660`, clx히트 `True`, 로드 `LawEcnmyPftOffrrList.clx.js, LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAA030300.py` / STEP **3** / 기대 URI **9** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_2 | mousemove | `onCmbOggBriefSmitYrMousemove` | 1698 | - |
| 이벤트 | button_1 | click | `onBtnSearchClick` | 1850 | - |
| 이벤트 | button_2 | click | `chartDownLoad` | 1928 | - |
| 이벤트 | button_3 | click | `onBtnChartClick` | 1949 | - |
| 이벤트 | button_4 | click | `onBtnChartClick` | 1963 | - |
| 이벤트 | button_5 | click | `onBtnChartClick` | 1977 | - |
| 이벤트 | button_6 | click | `onBtnDwndClick` | 2181 | - |
| 이벤트 | app | load | `onBodyLoad` | 2297 | - |
| Submission | `subSearch` | - | - | 1502 | send@[429, 602] |
| Submission | `subSearchExttOno` | - | - | 1508 | send@[211] |
| Submission | `subSearchYear` | - | - | 1517 | send@[231] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 56 | e | [] | [] | [] |
| `fnInit` | 110 |  | [] | [] | [] |
| `fnCommCdCombox` | 165 | vDataSetNm, vComboxNm | [] | [] | [] |
| `getCookie` | 182 | name | [] | [] | [] |
| `fnCodeProc` | 197 | dataSetNm,comboBxNm | [] | [] | [] |
| `doSearchExttOno` | 209 |  | ['subSearchExttOno'] | [] | [] |
| `doSearchYear` | 227 |  | ['subSearchYear'] | [] | [] |
| `onBtnChartClick` | 266 | e | [] | [] | [] |
| `fnGridDraw` | 297 |  | [] | [] | [] |
| `fnDataMake` | 391 |  | [] | [] | [] |
| `fnDataSetGet` | 414 | paramData, dataSetId | ['subSearch'] | [] | [] |
| `fnPrgDataSetGet` | 591 |  | ['subSearch'] | [] | [] |
| `fnScrnTrnCall` | 618 |  | [] | [] | ['op/opa/selectAcpDescPecnyAstc1.ndo', 'op/opa/selectAcpDescPecnyAvg1.ndo', 'op/opa/selectAcpDescPecnyPrg1.ndo', 'op/opa/selectAcpDescPrdAstc1.ndo', 'op/opa/selectAcpDescPrdAstc2.ndo', 'op/opa/selectAcpDescPrdAvg1.ndo', 'op/opa/selectAcpDescPrdAvg2.ndo', 'op/opa/selectAcpDescPrdPrg1.ndo', 'op/opa/selectAcpDescPrdPrg2.ndo'] |
| `fnGrd` | 683 | vColIndx, gubun , comHeader, clmnCd, clmnNm, gheader | [] | [] | [] |
| `fnChartDraw` | 838 |  | [] | [] | [] |
| `onBtnDwndClick` | 1051 | e | [] | [] | [] |
| `onCmbGubunSelectionChange` | 1065 | e | [] | [] | [] |
| `onCmbScNoSelectionChange` | 1131 | e | [] | [] | [] |
| `fnDspTtl` | 1142 |  | [] | [] | [] |
| `onBtnSearchClick` | 1222 | e | [] | [] | [] |
| `onBodyScreenChange` | 1233 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrSelectionChange` | 1246 | e | [] | [] | [] |
| `onCmbSalTpCdSelectionChange` | 1257 | e | [] | [] | [] |
| `chartDownLoad` | 1271 |  | [] | [] | [] |
| `onCmbExttOnoSelectionChange` | 1315 | e | [] | [] | [] |
| `onCmbOggBriefSmitYrMousemove` | 1328 | e | [] | [] | [] |
| `fnGuideSetting` | 1336 |  | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectAcpDescPecnyAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPecnyPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAstc2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdAvg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg1.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opa/selectAcpDescPrdPrg2.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opa/LawEcnmyPftAcpDtlList |  |  |
| 3 | `click` | 조회 |  |  |

</details>

### `OPAB000000` — 지출보고서 작성ㆍ정정

- 수준 L1 / 로그인 **필요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `err`, body `0`, clx히트 `False`, 로드 ``, 팝업 `1`/`0트라이`, 다이얼로그 `알림 이 서비스는 로그인이 필요합니다. 로그인 후 이용하시기 바랍니다. 확인`
- 테스트: `menu_tests/test_OPAB000000.py` / STEP **25** / 기대 URI **32** / 상세화면 **14** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/com/getUserSessionInfo.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/getUserSessionInfo.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:getSessionInfo |
| `/kops/main/raonk/raonkUploadCustom.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | popup/sc | `testcases/dataset/raonkUploadCustom.ndo.json` | __raw__ 경계1/악성6 | cpr-lib_udc.js:initRaonkUpload |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 5 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 23 | 하위화면 | popup,popup_button,screen/cl | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 5 | 하위화면 | popup,screen/op | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMainNtfclteList.ndo.json` | dmParam 경계1/악성6 | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMainStcList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/com/selectMenuList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMenuList.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:onBodyInit |
| `/kops/main/op/com/selectNoticePopupSliderList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectNoticePopupSliderList.ndo.json` | dmUserInfo 경계6/악성6 | app_com_main_Main.clx.js:setNoticePopupSlider |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 5 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button,screen/cl | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 3 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/chkDupEntpInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveBizWrtMb.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveComFileUpload.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveEntpDel.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveWrtByLrg.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectBizWrtTgtInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectVsDsgFileList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/getUserSessionInfo.ndo.json` | - | - | `cases/req_getUserSessionInfo.ndo.csv` / `cases/res_getUserSessionInfo.ndo.csv` |
| `testcases/dataset/raonkUploadCustom.ndo.json` | - | - | `cases/req_raonkUploadCustom.ndo.csv` / `cases/res_raonkUploadCustom.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |
| `testcases/dataset/selectMainNtfclteList.ndo.json` | - | - | `cases/req_selectMainNtfclteList.ndo.csv` / `cases/res_selectMainNtfclteList.ndo.csv` |
| `testcases/dataset/selectMainStcList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectMainStcList.ndo.csv` / `cases/res_selectMainStcList.ndo.csv` |
| `testcases/dataset/selectMenuList.ndo.json` | - | - | `cases/req_selectMenuList.ndo.csv` / `cases/res_selectMenuList.ndo.csv` |
| `testcases/dataset/selectNoticePopupSliderList.ndo.json` | infmTrfrAlarmInfo=0; hmrLoginTpCd=0 | regpId,userId,userNm | `cases/req_selectNoticePopupSliderList.ndo.csv` / `cases/res_selectNoticePopupSliderList.ndo.csv` |
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010000` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 | `app/op/opb/OggBriefWrtPrsntList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB020000` | 지출보고서 작성ㆍ정정 > 지출보고서 상시작성 | `app/op/opb/OggBriefOrtmWrtList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do | ok_direct |
| `OPAB030000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 | `app/op/opb/OggBriefWrtList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB030200` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList1` | `direct_ui` | - | ok_direct |
| `OPAB030300` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList2` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectBizWrtMbList.do,selectBizWrtTgtList.do,selectComCodeList.do | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAB010000 |  |  |
| 4 | `expect_screen` | app/op/opb/OggBriefWrtPrsntList |  |  |
| 5 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do | 지출보고서 현황 조회 상세 URI |
| 6 | `detail` | OPAB010100 |  |  |
| 7 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 8 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 9 | `detail` | OPAB010200 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 11 | `detail` | OPAB010300 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 13 | `detail` | OPAB010400 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 15 | `detail` | OPAB010500 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 17 | `detail` | OPAB010600 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 19 | `detail` | OPAB010700 |  |  |
| 20 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 21 | `detail` | OPAB010800 |  |  |
| 22 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 23 | `detail` | OPAB020000 |  |  |
| 24 | `expect_screen` | app/op/opb/OggBriefOrtmWrtList |  |  |
| 25 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do | 지출보고서 상시작성 상세 URI |

</details>

### `OPAB010000` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefWrtPrsntList`, 소스 `app_op_opb_OggBriefWrtPrsntList.clx.js` (42181B, 컴포넌트 22, 이벤트 5, 핸들러 13)
- 런타임: instance `1`, body `949`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, OggBriefWrtPrsntList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010000.py` / STEP **31** / 기대 URI **9** / 상세화면 **10** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `문서유형=list`, `선택유형=UPDATE`, `시작화면=UPD`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnInitClick` | 874 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 886 | - |
| 이벤트 | button_3 | click | `onBtnPrsntListClick` | 1208 | menu:OPAB010100,OPAA020100,OPAB050100,OPAB010 |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1305 | - |
| 이벤트 | app | init | `onBodyInit` | 1325 | - |
| 전환 | `openPageId` | - | target `OPAB010100` | 182 | "OPAB010100", param |
| 전환 | `openPageId` | - | target `OPAA020100` | 184 | "OPAA020100", param |
| 전환 | `openPageId` | - | target `OPAB050100` | 186 | "OPAB050100", param |
| 전환 | `openPageId` | - | target `OPAB010100` | 190 | "OPAB010100", param |
| Submission | `subSearch` | - | - | 571 | send@[144] |
| Submission | `subComCodeList` | - | - | 581 | send@[89] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 37 | e | [] | [] | [] |
| `fnGuideSetting` | 52 |  | [] | [] | [] |
| `fnInit` | 60 |  | [] | [] | [] |
| `fnPageInit` | 70 |  | [] | [] | [] |
| `fnCommCdSerach` | 80 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 116 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `onBtnSearchClick` | 129 | e | [] | [] | [] |
| `doSearch` | 139 |  | ['subSearch'] | [] | [] |
| `onBtnInitClick` | 159 | e | [] | [] | [] |
| `onBtnPrsntListClick` | 168 | e | [] | [] | ['OPAB010100', 'OPAA020100', 'OPAB050100', 'OPAB010100'] |
| `onCmbSalTpCdItemClick` | 196 | e | [] | [] | [] |
| `onUdcPagePagechange` | 219 | e | [] | [] | [] |
| `fnGridBtnEnabled` | 223 |  | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `app/op/opa/EntpOggBriefPubInfoList` | `openPageId` | selectOggBriefPubAllCnt.ndo | ok |
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ✅ | selectBizWrtMbList.do | click_조회 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefWrtPrsntList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectOggBriefForm1List.do,selectOggBriefForm2List.do | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `detail` | OPAB010100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 10 | `detail` | OPAA020100 |  |  |
| 11 | `expect_screen` | app/op/opa/EntpOggBriefPubInfoList |  |  |
| 12 | `expect_any` |  | selectOggBriefPubAllCnt.ndo | 업체별 지출보고서 공개 현황 상세 URI |
| 13 | `detail` | OPAB050100 |  |  |
| 14 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 15 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 16 | `detail` | OPAB010200 |  |  |
| 17 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 18 | `detail` | OPAB010300 |  |  |
| 19 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 20 | `detail` | OPAB010400 |  |  |
| 21 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 22 | `detail` | OPAB010500 |  |  |
| 23 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 24 | `detail` | OPAB010600 |  |  |
| 25 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 26 | `detail` | OPAB010700 |  |  |
| 27 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 28 | `detail` | OPAB010800 |  |  |
| 29 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 30 | `popup` | 조회 |  |  |
| 31 | `expect_any` |  | selectBizWrtMbList.do | 팝업 조회 |

</details>

### `OPAB010100` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/EntpOggBriefFormPrsntList`, 소스 `app_op_opb_EntpOggBriefFormPrsntList.clx.js` (21824B, 컴포넌트 6, 이벤트 9, 핸들러 6)
- 런타임: instance `1`, body `1009`, clx히트 `True`, 로드 `index.clx.js, OggBriefWrtPrsntList.clx.js, EntpOggBriefFormPrsntList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010100.py` / STEP **8** / 기대 URI **1** / 상세화면 **1** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 목록 | click | `onButtonClick` | 389 | menu:OPAB010000 |
| 이벤트 | userDefinedControl_4 | udcClick | `onUdcFormCardUdcClick` | 487 | - |
| 이벤트 | userDefinedControl_5 | udcClick | `onUdcFormCardUdcClick` | 502 | - |
| 이벤트 | userDefinedControl_6 | udcClick | `onUdcFormCardUdcClick` | 517 | - |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcFormCardUdcClick` | 532 | - |
| 이벤트 | userDefinedControl_8 | udcClick | `onUdcFormCardUdcClick` | 547 | - |
| 이벤트 | userDefinedControl_9 | udcClick | `onUdcFormCardUdcClick` | 562 | - |
| 이벤트 | userDefinedControl_10 | udcClick | `onUdcFormCardUdcClick` | 577 | - |
| 이벤트 | app | init | `onBodyInit` | 602 | - |
| 전환 | `openPageId` | - | target `OPAB010000` | 211 | "OPAB010000", params |
| Submission | `subSearch` | - | - | 308 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 38 | e | [] | [] | [] |
| `fnGuideSetting` | 59 |  | [] | [] | [] |
| `doSearch` | 71 |  | [] | [] | [] |
| `onUdcFormCardUdcClick` | 133 | e | [] | [] | [] |
| `onUdcFormCardUdcSelectionChange` | 188 | e | [] | [] | [] |
| `onButtonClick` | 201 | e | [] | [] | ['OPAB010000'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010000` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 | `app/op/opb/OggBriefWrtPrsntList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회하기 | ✅ | - | click_조회하기 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectOggBriefFormAllCnt.do | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAB010000 |  |  |
| 6 | `expect_screen` | app/op/opb/OggBriefWrtPrsntList |  |  |
| 7 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 8 | `popup` | 조회하기 |  |  |

</details>

### `OPAB010200` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList1`, 소스 `app_op_opb_OggBriefFormPrsntList1.clx.js` (11451B, 컴포넌트 4, 이벤트 3, 핸들러 5)
- 런타임: instance `2`, body `760`, clx히트 `True`, 로드 `EntpOggBriefFormPrsntList.clx.js, OggBriefFormPrsntList1.clx.js, OggBriefFormWrt1.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010200.py` / STEP **19** / 기대 URI **1** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `보고유형=10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnListClick` | 214 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 308 | - |
| 이벤트 | app | load | `onBodyLoad` | 311 | - |
| 전환 | `openPageId` | - | target `OPAB010100` | 67 | "OPAB010100", params |
| 전환 | `openPageId` | - | target `OPAB010200` | 83 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 90 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 97 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 104 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 111 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 118 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 125 | "OPAB010800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 25 | e | [] | [] | [] |
| `onBodyLoad` | 34 | e | [] | [] | [] |
| `fnGuideSetting` | 48 |  | [] | [] | [] |
| `onBtnListClick` | 56 | e | [] | [] | ['OPAB010100'] |
| `onCmb1SelectionChange` | 74 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 작성 현황 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm1List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB010100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 7 | `detail` | OPAB010300 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 9 | `detail` | OPAB010400 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 11 | `detail` | OPAB010500 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 13 | `detail` | OPAB010600 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 15 | `detail` | OPAB010700 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 17 | `detail` | OPAB010800 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 19 | `popup` | 지출보고서 작성 현황 |  |  |

</details>

### `OPAB010300` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList2`, 소스 `app_op_opb_OggBriefFormPrsntList2.clx.js` (11119B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `766`, clx히트 `True`, 로드 `OggBriefFormWrt1.clx.js, OggBriefFormWrt.clx.js, OggBriefFormPrsntList2.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010300.py` / STEP **20** / 기대 URI **1** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 작성 현황 | ⚠️ | selectOggBriefForm2List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm2List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB010200 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 6 | `detail` | OPAB010400 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 8 | `detail` | OPAB010500 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 10 | `detail` | OPAB010600 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 12 | `detail` | OPAB010700 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 14 | `detail` | OPAB010800 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 16 | `detail` | OPAB010100 |  |  |
| 17 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 18 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 19 | `popup` | 지출보고서 작성 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm2List.do | 팝업 지출보고서 작성 현황 |

</details>

### `OPAB010400` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList3`, 소스 `app_op_opb_OggBriefFormPrsntList3.clx.js` (11117B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `769`, clx히트 `True`, 로드 `OggBriefFormPrsntList2.clx.js, OggBriefFormWrt2.clx.js, OggBriefFormPrsntList3.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010400.py` / STEP **20** / 기대 URI **1** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 작성 현황 | ⚠️ | selectOggBriefForm3List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm3List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB010200 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 6 | `detail` | OPAB010300 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 8 | `detail` | OPAB010500 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 10 | `detail` | OPAB010600 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 12 | `detail` | OPAB010700 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 14 | `detail` | OPAB010800 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 16 | `detail` | OPAB010100 |  |  |
| 17 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 18 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 19 | `popup` | 지출보고서 작성 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm3List.do | 팝업 지출보고서 작성 현황 |

</details>

### `OPAB010500` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList4`, 소스 `app_op_opb_OggBriefFormPrsntList4.clx.js` (11109B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormPrsntList3.clx.js, OggBriefFormWrt3.clx.js, OggBriefFormPrsntList4.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010500.py` / STEP **17** / 기대 URI **0** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 3 | `detail` | OPAB010200 |  |  |
| 4 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 5 | `detail` | OPAB010300 |  |  |
| 6 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 7 | `detail` | OPAB010400 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 9 | `detail` | OPAB010600 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 11 | `detail` | OPAB010700 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 13 | `detail` | OPAB010800 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 15 | `detail` | OPAB010100 |  |  |
| 16 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 17 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |

</details>

### `OPAB010600` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList5`, 소스 `app_op_opb_OggBriefFormPrsntList5.clx.js` (11111B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormWrt3.clx.js, OggBriefFormPrsntList4.clx.js, OggBriefFormPrsntList5.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010600.py` / STEP **17** / 기대 URI **0** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 3 | `detail` | OPAB010200 |  |  |
| 4 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 5 | `detail` | OPAB010300 |  |  |
| 6 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 7 | `detail` | OPAB010400 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 9 | `detail` | OPAB010500 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 11 | `detail` | OPAB010700 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 13 | `detail` | OPAB010800 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 15 | `detail` | OPAB010100 |  |  |
| 16 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 17 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |

</details>

### `OPAB010700` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList6`, 소스 `app_op_opb_OggBriefFormPrsntList6.clx.js` (11157B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `788`, clx히트 `True`, 로드 `OggBriefFormPrsntList4.clx.js, OggBriefFormPrsntList5.clx.js, OggBriefFormPrsntList6.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010700.py` / STEP **20** / 기대 URI **3** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `app/op/opb/OggBriefFormPrsntList7` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 작성 현황 | ⚠️ | selectOggBriefForm4List.do,selectOggBriefForm5List.do,selectOggBriefForm6List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm4List.do,selectOggBriefForm5List.do,selectOggBriefForm6List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB010200 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 6 | `detail` | OPAB010300 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 8 | `detail` | OPAB010400 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 10 | `detail` | OPAB010500 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 12 | `detail` | OPAB010600 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 14 | `detail` | OPAB010800 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 16 | `detail` | OPAB010100 |  |  |
| 17 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 18 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 19 | `popup` | 지출보고서 작성 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm4List.do,selectOggBriefForm5List.do,selectOggBriefForm6List.do | 팝업 지출보고서 작성 현황 |

</details>

### `OPAB010800` — 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormPrsntList7`, 소스 `app_op_opb_OggBriefFormPrsntList7.clx.js` (11159B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `809`, clx히트 `True`, 로드 `OggBriefFormPrsntList6.clx.js, OggBriefFormWrt6.clx.js, OggBriefFormPrsntList7.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB010800.py` / STEP **20** / 기대 URI **1** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 작성 현황 | click | `onButtonClick` | 210 | menu:OPAB010100 |
| 이벤트 | app | init | `onBodyInit` | 298 | - |
| 전환 | `openPageId` | - | target `OPAB010200` | 68 | "OPAB010200", initValue |
| 전환 | `openPageId` | - | target `OPAB010300` | 75 | "OPAB010300", initValue |
| 전환 | `openPageId` | - | target `OPAB010400` | 82 | "OPAB010400", initValue |
| 전환 | `openPageId` | - | target `OPAB010500` | 89 | "OPAB010500", initValue |
| 전환 | `openPageId` | - | target `OPAB010600` | 96 | "OPAB010600", initValue |
| 전환 | `openPageId` | - | target `OPAB010700` | 103 | "OPAB010700", initValue |
| 전환 | `openPageId` | - | target `OPAB010800` | 110 | "OPAB010800", initValue |
| 전환 | `openPageId` | - | target `OPAB010100` | 131 | "OPAB010100", params |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onCmb1SelectionChange` | 59 | e | [] | [] | ['OPAB010200', 'OPAB010300', 'OPAB010400', 'OPAB010500', 'OPAB010600', 'OPAB010700', 'OPAB010800'] |
| `onButtonClick` | 118 | e | [] | [] | ['OPAB010100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `app/op/opb/OggBriefFormPrsntList1` | `direct_ui` | - | ok_direct |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `app/op/opb/OggBriefFormPrsntList2` | `direct_ui` | - | ok_direct |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `app/op/opb/OggBriefFormPrsntList3` | `direct_ui` | - | ok_direct |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `app/op/opb/OggBriefFormPrsntList4` | `direct_ui` | - | ok_direct |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `app/op/opb/OggBriefFormPrsntList5` | `direct_ui` | - | ok_direct |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `app/op/opb/OggBriefFormPrsntList6` | `direct_ui` | - | ok_direct |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `app/op/opb/EntpOggBriefFormPrsntList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 작성 현황 | ⚠️ | selectOggBriefForm7List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormPrsntList7 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm7List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB010200 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefFormPrsntList1 |  |  |
| 6 | `detail` | OPAB010300 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormPrsntList2 |  |  |
| 8 | `detail` | OPAB010400 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormPrsntList3 |  |  |
| 10 | `detail` | OPAB010500 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormPrsntList4 |  |  |
| 12 | `detail` | OPAB010600 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormPrsntList5 |  |  |
| 14 | `detail` | OPAB010700 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormPrsntList6 |  |  |
| 16 | `detail` | OPAB010100 |  |  |
| 17 | `expect_screen` | app/op/opb/EntpOggBriefFormPrsntList |  |  |
| 18 | `expect_any` |  | selectOggBriefFormAllCnt.do | 지출보고서 현황 조회 상세 URI |
| 19 | `popup` | 지출보고서 작성 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm7List.do | 팝업 지출보고서 작성 현황 |

</details>

### `OPAB020000` — 지출보고서 작성ㆍ정정 > 지출보고서 상시작성

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefOrtmWrtList`, 소스 `app_op_opb_OggBriefOrtmWrtList.clx.js` (47910B, 컴포넌트 27, 이벤트 8, 핸들러 19)
- 런타임: instance `1`, body `924`, clx히트 `True`, 로드 `OggBriefFormPrsntList7.clx.js, OggBriefFormWrt7.clx.js, OggBriefOrtmWrtList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB020000.py` / STEP **14** / 기대 URI **3** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `문서유형=list`, `선택유형=UPDATE`, `시작화면=UPD`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_4 | click | `onCmbSalFrmCdClick` | 932 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 1036 | - |
| 이벤트 | button_3 | click | `onBtnNewWrtClick` | 1110 | menu:OPAB031000,OPAB031100 |
| 이벤트 | button_4 | click | `onBtnUpdClick` | 1123 | menu:OPAB031100 |
| 이벤트 | button_5 | click | `onBtnDelClick` | 1136 | Submit.send |
| 이벤트 | button_6 | click | `onBtnUpdLinkClick` | 1413 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1444 | - |
| 이벤트 | app | init | `onBodyInit` | 1464 | - |
| 전환 | `openPageId` | - | target `OPAB030100` | 267 | "OPAB030100", param |
| 전환 | `openPageId` | - | target `-` | 337 | OPAB031000 {} |
| 전환 | `openPageId` | - | target `-` | 338 | OPAB031100 {'mode': 'NEW', 'startScreen': 'WRT'} |
| 전환 | `openPageId` | - | target `OPAB031100` | 395 | "OPAB031100", {"mode" : "UPDATE" 																							, "oggBriefSmitYr" : oggBriefSmitY |
| Submission | `subSearch` | - | - | 670 | send@[245] |
| Submission | `subComCodeList` | - | - | 679 | send@[78] |
| Submission | `subDelEntpInfo` | - | - | 688 | send@[444] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 37 | e | [] | [] | [] |
| `fnInit` | 48 |  | [] | [] | [] |
| `fnPageInit` | 59 |  | [] | [] | [] |
| `fnCommCdSerach` | 69 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 109 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnArrSalFrmCdCombo` | 131 |  | [] | [] | [] |
| `onBtnSearchClick` | 181 | e | [] | [] | [] |
| `fnValidationChk` | 188 |  | [] | [] | [] |
| `doSearch` | 234 |  | ['subSearch'] | [] | [] |
| `onBtnUpdLinkClick` | 259 | e | [] | [] | ['OPAB030100'] |
| `onUdcGridTitleUdcSelectionChange` | 273 | e | [] | [] | [] |
| `onCmbSalTpCdItemClick` | 291 | e | [] | [] | [] |
| `onCmbSalFrmCdSelectionChange` | 314 | e | [] | [] | [] |
| `onBtnNewWrtClick` | 336 | e | [] | [] | ['OPAB031000', 'OPAB031100'] |
| `onCmbSalFrmCdClick` | 347 | e | [] | [] | [] |
| `multiComboClick` | 362 | e | [] | [] | [] |
| `onBtnUpdClick` | 370 | e | [] | [] | ['OPAB031100'] |
| `onBtnDelClick` | 414 | e | ['subDelEntpInfo'] | [] | [] |
| `onUdcPagePagechange` | 462 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/opb/saveEntpDel.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | selectBizWrtMbList.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 상시작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefOrtmWrtList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectComCodeList.do | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 10 | `detail` | OPAB031100 |  |  |
| 11 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 12 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 13 | `popup` | 조회 |  |  |
| 14 | `expect_any` |  | selectBizWrtMbList.do | 팝업 조회 |

</details>

### `OPAB030000` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefWrtList`, 소스 `app_op_opb_OggBriefWrtList.clx.js` (55703B, 컴포넌트 31, 이벤트 9, 핸들러 22)
- 런타임: instance `1`, body `1177`, clx히트 `True`, 로드 `OggBriefFormWrt7.clx.js, OggBriefOrtmWrtList.clx.js, OggBriefWrtList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030000.py` / STEP **31** / 기대 URI **25** / 상세화면 **12** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnInitClick` | 1167 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 1179 | - |
| 이벤트 | button_3 | click | `onBtnNewWrtClick` | 1244 | menu:OPAB031100 |
| 이벤트 | button_4 | click | `onBtnUpdClick` | 1258 | menu:OPAB031100 |
| 이벤트 | button_5 | click | `onBtnDelClick` | 1271 | Submit.send |
| 이벤트 | button_6 | click | `onBtnUpdLinkClick` | 1534 | menu:OPAB050100,OPAB030100 |
| 이벤트 | button_7 | click | `onBtnEntpLinkClick` | 1607 | menu:OPAB031100 |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1656 | - |
| 이벤트 | app | init | `onBodyInit` | 1676 | - |
| 전환 | `openPageId` | - | target `OPAB050100,OPAB030100` | 269 | /*"OPAB050100"*/ "OPAB030100", params |
| 전환 | `openPageId` | - | target `OPAB031100` | 352 | "OPAB031100", initValues |
| 전환 | `openPageId` | - | target `OPAB031100` | 412 | "OPAB031100", {"mode" : "UPDATE" 																							, "oggBriefSmitYr" : oggBriefSmitY |
| 전환 | `openPageId` | - | target `OPAB031100` | 494 | "OPAB031100", 						{"mode" : "UPDATE", 						 "oggBriefSmitYr" : oggBriefSmitYr, 						 " |
| Submission | `subSearch` | - | - | 788 | send@[246] |
| Submission | `subComCodeList` | - | - | 797 | send@[99] |
| Submission | `subDelEntpInfo` | - | - | 806 | send@[460] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 37 | e | [] | [] | [] |
| `fnInit` | 64 |  | [] | [] | [] |
| `fnPageInit` | 80 |  | [] | [] | [] |
| `fnCommCdSerach` | 90 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 128 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnArrSalFrmCdCombo` | 150 |  | [] | [] | [] |
| `onBtnSearchClick` | 200 | e | [] | [] | [] |
| `fnValidationChk` | 210 |  | [] | [] | [] |
| `fnEntpSearch` | 232 |  | ['subSearch'] | [] | [] |
| `onBtnUpdLinkClick` | 261 | e | [] | [] | ['OPAB050100', 'OPAB030100'] |
| `onUdcGridTitleUdcSelectionChange` | 278 | e | [] | [] | [] |
| `onCmbSalTpCdItemClick` | 296 | e | [] | [] | [] |
| `onCmbSalFrmCdSelectionChange` | 322 | e | [] | [] | [] |
| `onBtnNewWrtClick` | 344 | e | [] | [] | ['OPAB031100'] |
| `onCmbSalFrmCdClick` | 362 | e | [] | [] | [] |
| `multiComboClick` | 379 | e | [] | [] | [] |
| `onBtnUpdClick` | 387 | e | [] | [] | ['OPAB031100'] |
| `onBtnDelClick` | 430 | e | ['subDelEntpInfo'] | [] | [] |
| `onUdcPagePagechange` | 478 | e | [] | [] | [] |
| `onBtnEntpLinkClick` | 486 | e | [] | [] | ['OPAB031100'] |
| `onBtnInitClick` | 509 | e | [] | [] | [] |
| `siltaeJoSaLimit` | 522 | param,e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/com/getUserSessionInfo.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/getUserSessionInfo.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:getSessionInfo |
| `/kops/main/raonk/raonkUploadCustom.ndo` | ✅ | 200 / 200 | 2 | 하위화면 | popup/sc | `testcases/dataset/raonkUploadCustom.ndo.json` | __raw__ 경계1/악성6 | cpr-lib_udc.js:initRaonkUpload |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 22 | 하위화면 | popup,popup_button,screen/cl | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 2 | 본문,하위화면 | popup,screen/op | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMainNtfclteList.ndo.json` | dmParam 경계1/악성6 | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMainStcList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/com/selectMenuList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMenuList.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:onBodyInit |
| `/kops/main/op/com/selectNoticePopupSliderList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectNoticePopupSliderList.ndo.json` | dmUserInfo 경계6/악성6 | app_com_main_Main.clx.js:setNoticePopupSlider |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/opb/chkDupEntpInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveBizWrtMb.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveEntpDel.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectBizWrtTgtInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/getUserSessionInfo.ndo.json` | - | - | `cases/req_getUserSessionInfo.ndo.csv` / `cases/res_getUserSessionInfo.ndo.csv` |
| `testcases/dataset/raonkUploadCustom.ndo.json` | - | - | `cases/req_raonkUploadCustom.ndo.csv` / `cases/res_raonkUploadCustom.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |
| `testcases/dataset/selectMainNtfclteList.ndo.json` | - | - | `cases/req_selectMainNtfclteList.ndo.csv` / `cases/res_selectMainNtfclteList.ndo.csv` |
| `testcases/dataset/selectMainStcList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectMainStcList.ndo.csv` / `cases/res_selectMainStcList.ndo.csv` |
| `testcases/dataset/selectMenuList.ndo.json` | - | - | `cases/req_selectMenuList.ndo.csv` / `cases/res_selectMenuList.ndo.csv` |
| `testcases/dataset/selectNoticePopupSliderList.ndo.json` | infmTrfrAlarmInfo=0; hmrLoginTpCd=0 | regpId,userId,userNm | `cases/req_selectNoticePopupSliderList.ndo.csv` / `cases/res_selectNoticePopupSliderList.ndo.csv` |
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030200` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList1` | `direct_ui` | - | ok_direct |
| `OPAB030300` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList2` | `direct_ui` | - | ok_direct |
| `OPAB030400` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList3` | `direct_ui` | - | ok_direct |
| `OPAB030500` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList4` | `direct_ui` | - | ok_direct |
| `OPAB030600` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList5` | `direct_ui` | - | ok_direct |
| `OPAB030700` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList6` | `direct_ui` | - | ok_direct |
| `OPAB030800` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `app/op/opb/OggBriefFormWrtList7` | `direct_ui` | - | ok_direct |
| `OPAB030900` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 최종확정 | `app/op/opb/LastFdecList` | `direct_ui` | - | ok_direct |
| `OPAB031000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항 | `app/op/opb/OggBriefBseLte` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | selectBizWrtMbList.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefWrtList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectBizWrtTgtList.do,selectComCodeList.do | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `detail` | OPAB050100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 10 | `detail` | OPAB030100 |  |  |
| 11 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 12 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 13 | `detail` | OPAB031100 |  |  |
| 14 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 15 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 16 | `detail` | OPAB030200 |  |  |
| 17 | `expect_screen` | app/op/opb/OggBriefFormWrtList1 |  |  |
| 18 | `detail` | OPAB030300 |  |  |
| 19 | `expect_screen` | app/op/opb/OggBriefFormWrtList2 |  |  |
| 20 | `detail` | OPAB030400 |  |  |
| 21 | `expect_screen` | app/op/opb/OggBriefFormWrtList3 |  |  |
| 22 | `detail` | OPAB030500 |  |  |
| 23 | `expect_screen` | app/op/opb/OggBriefFormWrtList4 |  |  |
| 24 | `detail` | OPAB030600 |  |  |
| 25 | `expect_screen` | app/op/opb/OggBriefFormWrtList5 |  |  |
| 26 | `detail` | OPAB030700 |  |  |
| 27 | `expect_screen` | app/op/opb/OggBriefFormWrtList6 |  |  |
| 28 | `detail` | OPAB030800 |  |  |
| 29 | `expect_screen` | app/op/opb/OggBriefFormWrtList7 |  |  |
| 30 | `popup` | 조회 |  |  |
| 31 | `expect_any` |  | selectBizWrtMbList.do | 팝업 조회 |

</details>

### `OPAB030100` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/EntpOggBriefFormWrtList`, 소스 `app_op_opb_EntpOggBriefFormWrtList.clx.js` (35464B, 컴포넌트 8, 이벤트 11, 핸들러 10)
- 런타임: instance `1`, body `1008`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, EntpOggBriefFormWrtList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030100.py` / STEP **11** / 기대 URI **11** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStepClick | `onUdcStepBoxUdcStepClick` | 636 | - |
| 이벤트 | 목록 | click | `onButtonClick` | 684 | menu:OPAB030000 |
| 이벤트 | userDefinedControl_6 | udcClick | `onUdcFormCardUdcClick` | 796 | - |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcFormCardUdcClick` | 806 | - |
| 이벤트 | userDefinedControl_8 | udcClick | `onUdcFormCardUdcClick` | 819 | - |
| 이벤트 | userDefinedControl_9 | udcClick | `onUdcFormCardUdcClick` | 832 | - |
| 이벤트 | userDefinedControl_10 | udcClick | `onUdcFormCardUdcClick` | 842 | - |
| 이벤트 | userDefinedControl_11 | udcClick | `onUdcFormCardUdcClick` | 852 | - |
| 이벤트 | userDefinedControl_12 | udcClick | `onUdcFormCardUdcClick` | 862 | - |
| 이벤트 | button_2 | click | `onBtnLastFdecClick` | 901 | menu:OPAB040000 |
| 이벤트 | app | init | `onBodyInit` | 932 | - |
| 전환 | `openPageId` | - | target `OPAB040000` | 269 | "OPAB040000", params |
| 전환 | `openPageId` | - | target `OPAB030000` | 357 | "OPAB030000", params |
| Submission | `subSearch` | - | - | 496 | send@[] |
| Submission | `subSearchDtl` | - | - | 504 | send@[] |
| Submission | `subSave` | - | - | 512 | send@[] |
| Submission | `excelExport` | - | - | 518 | send@[] |
| Submission | `excelExport1` | - | - | 526 | send@[] |
| Submission | `excelExport2` | - | - | 534 | send@[] |
| Submission | `excelExport3` | - | - | 542 | send@[] |
| Submission | `excelExport4` | - | - | 550 | send@[] |
| Submission | `csvExport3` | - | - | 558 | send@[] |
| Submission | `csvExport1` | - | - | 566 | send@[] |
| Submission | `csvExport2` | - | - | 574 | send@[] |
| Submission | `csvExport4` | - | - | 582 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 43 | e | [] | [] | [] |
| `onUdcFormCardUdcSelectionChange` | 84 | e | [] | [] | [] |
| `doSrch` | 96 | docType | [] | [] | [] |
| `doSrchDtl` | 118 | docType | [] | [] | [] |
| `onUdcFormCardUdcClick` | 154 | e | [] | [] | [] |
| `onBtnLastFdecClick` | 238 | e | [] | [] | ['OPAB040000'] |
| `onUdcStepBoxUdcStepClick` | 289 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepSelectionChange` | 296 | e | [] | [] | [] |
| `onButtonClick` | 347 | e | [] | [] | ['OPAB030000'] |
| `siltaeJoSaLimit` | 365 | param,e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/com/getUserSessionInfo.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/getUserSessionInfo.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:getSessionInfo |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 3 | 본문 | popup_button,screen/cl | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectMainNtfclteList.ndo.json` | dmParam 경계1/악성6 | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectMainStcList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/com/selectMenuList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectMenuList.ndo.json` |  경계1/악성6 | app_com_main_Main.clx.js:onBodyInit |
| `/kops/main/op/com/selectNoticePopupSliderList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectNoticePopupSliderList.ndo.json` | dmUserInfo 경계6/악성6 | app_com_main_Main.clx.js:setNoticePopupSlider |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/getUserSessionInfo.ndo.json` | - | - | `cases/req_getUserSessionInfo.ndo.csv` / `cases/res_getUserSessionInfo.ndo.csv` |
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectMainNtfclteList.ndo.json` | - | - | `cases/req_selectMainNtfclteList.ndo.csv` / `cases/res_selectMainNtfclteList.ndo.csv` |
| `testcases/dataset/selectMainStcList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectMainStcList.ndo.csv` / `cases/res_selectMainStcList.ndo.csv` |
| `testcases/dataset/selectMenuList.ndo.json` | - | - | `cases/req_selectMenuList.ndo.csv` / `cases/res_selectMenuList.ndo.csv` |
| `testcases/dataset/selectNoticePopupSliderList.ndo.json` | infmTrfrAlarmInfo=0; hmrLoginTpCd=0 | regpId,userId,userNm | `cases/req_selectNoticePopupSliderList.ndo.csv` / `cases/res_selectNoticePopupSliderList.ndo.csv` |
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB040000` | 지출보고서 작성ㆍ정정 > 대량 지출보고서 업로드 | `app/op/opb/FileExmPrsntList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do | ok_direct |
| `OPAB030000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 | `app/op/opb/OggBriefWrtList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do,selectComCodeList.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회하기 | ✅ | selectBizWrtTgtList.do | click_조회하기 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do,selectOggBriefFormAllCnt.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB040000 |  |  |
| 5 | `expect_screen` | app/op/opb/FileExmPrsntList |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do | 대량 지출보고서 업로드 상세 URI |
| 7 | `detail` | OPAB030000 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefWrtList |  |  |
| 9 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 실태조사 상세 URI |
| 10 | `popup` | 조회하기 |  |  |
| 11 | `expect_any` |  | selectBizWrtTgtList.do | 팝업 조회하기 |

</details>

### `OPAB030200` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList1`, 소스 `app_op_opb_OggBriefFormWrtList1.clx.js` (8455B, 컴포넌트 1, 이벤트 4, 핸들러 5)
- 런타임: instance `2`, body `703`, clx히트 `True`, 로드 `index.clx.js, EntpOggBriefFormWrtList.clx.js, OggBriefFormWrtList1.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030200.py` / STEP **8** / 기대 URI **2** / 상세화면 **1** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 167 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 170 | - |
| 이벤트 | app | init | `onBodyInit` | 219 | - |
| 이벤트 | app | load | `onBodyLoad` | 222 | - |
| 전환 | `openPageId` | - | target `-` | 93 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 104 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onBodyLoad` | 41 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 103 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 107 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 2 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | selectOggBriefForm1List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList1 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do,selectOggBriefForm1List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB030100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 7 | `popup` | 작성현황(서식이동) |  |  |
| 8 | `expect_any` |  | selectOggBriefForm1List.do | 팝업 작성현황(서식이동) |

</details>

### `OPAB030300` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList2`, 소스 `app_op_opb_OggBriefFormWrtList2.clx.js` (10164B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `704`, clx히트 `True`, 로드 `OggBriefFormWrt1.clx.js, OggBriefFormWrt.clx.js, OggBriefFormWrtList2.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030300.py` / STEP **11** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 204 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 207 | - |
| 이벤트 | app | init | `onBodyInit` | 256 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 49 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 128 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 142 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 47 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 141 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 145 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | selectOggBriefForm2List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList2 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do,selectOggBriefForm2List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 10 | `popup` | 작성현황(서식이동) |  |  |
| 11 | `expect_any` |  | selectOggBriefForm2List.do | 팝업 작성현황(서식이동) |

</details>

### `OPAB030400` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList3`, 소스 `app_op_opb_OggBriefFormWrtList3.clx.js` (8967B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `713`, clx히트 `True`, 로드 `OggBriefFormWrtList2.clx.js, OggBriefFormWrt2.clx.js, OggBriefFormWrtList3.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030400.py` / STEP **11** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 172 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 175 | - |
| 이벤트 | app | init | `onBodyInit` | 224 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 55 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 98 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 112 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 53 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 62 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 111 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 115 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | selectOggBriefForm3List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList3 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do,selectOggBriefForm3List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 10 | `popup` | 작성현황(서식이동) |  |  |
| 11 | `expect_any` |  | selectOggBriefForm3List.do | 팝업 작성현황(서식이동) |

</details>

### `OPAB030500` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList4`, 소스 `app_op_opb_OggBriefFormWrtList4.clx.js` (8445B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormWrtList3.clx.js, OggBriefFormWrt3.clx.js, OggBriefFormWrtList4.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030500.py` / STEP **9** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 166 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 169 | - |
| 이벤트 | app | init | `onBodyInit` | 218 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 49 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 93 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 107 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 47 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 106 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 110 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList4 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |

</details>

### `OPAB030600` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList5`, 소스 `app_op_opb_OggBriefFormWrtList5.clx.js` (8442B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormWrt3.clx.js, OggBriefFormWrtList4.clx.js, OggBriefFormWrtList5.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030600.py` / STEP **9** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 165 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 168 | - |
| 이벤트 | app | init | `onBodyInit` | 217 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 49 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 92 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 106 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 47 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 105 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 109 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList5 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |

</details>

### `OPAB030700` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList6`, 소스 `app_op_opb_OggBriefFormWrtList6.clx.js` (8619B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormWrtList4.clx.js, OggBriefFormWrtList5.clx.js, OggBriefFormWrtList6.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030700.py` / STEP **9** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 167 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 170 | - |
| 이벤트 | app | init | `onBodyInit` | 219 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 49 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 92 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 108 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 47 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 106 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 111 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList6 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |

</details>

### `OPAB030800` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormWrtList7`, 소스 `app_op_opb_OggBriefFormWrtList7.clx.js` (8574B, 컴포넌트 1, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `720`, clx히트 `True`, 로드 `OggBriefFormWrt5.clx.js, OggBriefFormWrtList6.clx.js, OggBriefFormWrtList7.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030800.py` / STEP **11** / 기대 URI **5** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 167 | menu:OPAB030100 |
| 이벤트 | userDefinedControl_2 | udcStep3Click | `onUdcStepBoxUdcStep3Click` | 170 | - |
| 이벤트 | app | init | `onBodyInit` | 219 | - |
| 전환 | `openPageId` | - | target `OPAB031100` | 49 | "OPAB031100", { "paramData" : e.option.userData } |
| 전환 | `openPageId` | - | target `-` | 93 | appUrl, {   "oggBriefSmitYr" 	: vEmbAppOggBriefSmitYr 																 			    ,	"oggBriefS |
| 전환 | `openPageId` | - | target `OPAB030100` | 108 | "OPAB030100", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `onUdcStepBoxUdcStepClick` | 47 | e | [] | [] | ['OPAB031100'] |
| `onUdcStepBoxUdcStepSelectionChange` | 56 | e | [] | [] | ['OPAB030200', 'OPAB030300', 'OPAB030400', 'OPAB030500', 'OPAB030600', 'OPAB030700', 'OPAB030800'] |
| `onUdcStepBoxUdcStep2Click` | 107 | e | [] | [] | ['OPAB030100'] |
| `onUdcStepBoxUdcStep3Click` | 111 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 3 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | selectOggBriefForm6List.do,selectOggBriefForm7List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormWrtList7 |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do,selectOggBriefForm4List.do,selectOggBriefForm5List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB031100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 7 | `detail` | OPAB030100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 10 | `popup` | 작성현황(서식이동) |  |  |
| 11 | `expect_any` |  | selectOggBriefForm6List.do,selectOggBriefForm7List.do | 팝업 작성현황(서식이동) |

</details>

### `OPAB030900` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 최종확정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/LastFdecList`, 소스 `app_op_opb_LastFdecList.clx.js` (61279B, 컴포넌트 62, 이벤트 4, 핸들러 8)
- 런타임: instance `1`, body `2096`, clx히트 `True`, 로드 `OggBriefFormWrtList7.clx.js, OggBriefFormWrt7.clx.js, LastFdecList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB030900.py` / STEP **10** / 기대 URI **2** / 상세화면 **2** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 251 | menu:OPAB030100,OPAB030100,OPAB050100 |
| 이벤트 | button_1 | click | `onBtnAgreeClick` | 1449 | - |
| 이벤트 | button_2 | click | `onButtonClick` | 1695 | Submit.send; menu:OPAB030000,OPAB050000 |
| 이벤트 | app | init | `onBodyInit` | 1715 | - |
| 전환 | `openPageId` | - | target `OPAB030000` | 86 | "OPAB030000", params |
| 전환 | `openPageId` | - | target `OPAB050000` | 88 | "OPAB050000", params |
| 전환 | `openPageId` | - | target `-` | 133 | menuID, initValue |
| Submission | `subSave` | - | - | 203 | send@[73] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 26 | e | [] | [] | [] |
| `onButtonClick` | 44 | e | ['subSave'] | [] | ['OPAB030000', 'OPAB050000'] |
| `onBtnNonDstgExeClick` | 103 | e | [] | [] | [] |
| `onBtnAgreeClick` | 118 | e | [] | [] | [] |
| `onUdcStepBoxUdcStep2Click` | 124 | e | [] | [] | ['OPAB030100', 'OPAB030100', 'OPAB050100'] |
| `siltaeJoSaLimit` | 141 | param,e | [] | [] | [] |
| `onCbxAllValueChange` | 171 | e | [] | [] | [] |
| `onBtnLastConfirm2Click` | 185 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB030000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 | `app/op/opb/OggBriefWrtList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do,selectComCodeList.do | ok_direct |
| `OPAB050000` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 | `app/op/opb/OggBriefWrtUpdList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 최종확정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/LastFdecList |  |  |
| 3 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB030000 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefWrtList |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 실태조사 상세 URI |
| 7 | `detail` | OPAB050000 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefWrtUpdList |  |  |
| 9 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do | 지출보고서 정정 상세 URI |
| 10 | `popup` | 작성현황(서식이동) |  |  |

</details>

### `OPAB031000` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefBseLte`, 소스 `app_op_opb_OggBriefBseLte.clx.js` (23126B, 컴포넌트 16, 이벤트 4, 핸들러 5)
- 런타임: instance `1`, body `922`, clx히트 `True`, 로드 `OggBriefFormWrt7.clx.js, LastFdecList.clx.js, OggBriefBseLte.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB031000.py` / STEP **6** / 기대 URI **1** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnPopViewClick` | 560 | - |
| 이벤트 | 지출보고서 무실적 작성하기 | click | `onButtonClick` | 727 | - |
| 이벤트 | button_3 | click | `onBtnWrtClick` | 738 | - |
| 이벤트 | app | init | `onBodyInit` | 758 | - |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnPopViewClick` | 21 | e | [] | [] | [] |
| `onBodyInit` | 53 | e | [] | [] | [] |
| `onButtonClick` | 74 | e | [] | [] | [] |
| `onBtnWrtClick` | 83 | e | [] | [] | [] |
| `fnGuideSetting` | 122 |  | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성대상 보기 | ✅ | - | click_작성대상 보기 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefBseLte |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 6 | `popup` | 작성대상 보기 |  |  |

</details>

### `OPAB031100` — 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/EntpInfmWrt`, 소스 `app_op_opb_EntpInfmWrt.clx.js` (177622B, 컴포넌트 43, 이벤트 25, 핸들러 57)
- 런타임: instance `1`, body `1279`, clx히트 `True`, 로드 `WrtTgtP01.clx.js, EntpInfmWrt.clx.js, OggBriefWrtAtnGdPop.clx.js`, 팝업 `3`/`1트라이`, 다이얼로그 `지출보고서 작성대상 - 「이전 지출보고서 불러오기」는 이전연도 작성한 업체정보를 그대로 가져와 자동 입력하는 서비스입니다. - 새롭게 작성하려는 지출보고서의 영업구분(의약품/의료기`
- 테스트: `menu_tests/test_OPAB031100.py` / STEP **13** / 기대 URI **6** / 상세화면 **3** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onEntpLoadBtnClick` | 2548 | - |
| 이벤트 | button_2 | click | `onBtnWrtNoticeClick2` | 2559 | - |
| 이벤트 | 작성 | click | `onRpprBthClick` | 2910 | - |
| 이벤트 | button_4 | click | `onUpdateBtnClick` | 3235 | - |
| 이벤트 | button_5 | click | `onAddrSrchClick` | 3299 | - |
| 이벤트 | 작성 | click | `onRpprBthClick` | 3408 | - |
| 이벤트 | button_7 | click | `onBtnToggleClick` | 3478 | - |
| 이벤트 | button_8 | click | `onBtnToggleClick` | 3825 | - |
| 이벤트 | userDefinedControl_6 | uploadComplete | `onRaonkUploadUploadComplete` | 3892 | - |
| 이벤트 | userDefinedControl_6 | afterAddFile | `onRaonkUploadAfterAddFile` | 3895 | - |
| 이벤트 | button_9 | click | `onBtnToggleClick` | 3967 | - |
| 이벤트 | button_10 | click | `onBtnSmMgtAddClick` | 4070 | - |
| 이벤트 | button_11 | click | `onBtnSmMgtDelClick` | 4081 | Submit.send; menu:OPAB031000,OPAB030100,OPAB050100,OPAB030 |
| 이벤트 | comboBox_13 | open | `onCmbGrdSmMgtSalFrmCdOpen` | 4207 | - |
| 이벤트 | button_12 | click | `onBtnToggleClick` | 4300 | - |
| 이벤트 | button_13 | click | `onExcelFormXlsDownClick` | 4405 | - |
| 이벤트 | button_14 | click | `onBtnExcelUploadClick` | 4418 | - |
| 이벤트 | button_15 | click | `onCmbReqAddClick` | 4429 | - |
| 이벤트 | button_16 | click | `onCmbReqDelClick` | 4440 | Submit.send; menu:OPAB030100,OPAB050100,OPAB030100,OPAB030 |
| 이벤트 | comboBox_14 | open | `onCmbGrdReqFomCdOpen` | 4639 | - |
| 이벤트 | 이전 | click | `onButtonClick` | 4884 | menu:OPAB031000 |
| 이벤트 | button_18 | click | `onBtnJustNextClick` | 4897 | - |
| 이벤트 | button_19 | click | `onBtnSaveClick` | 4909 | Submit.send |
| 이벤트 | app | load | `onBodyLoad` | 4929 | - |
| 이벤트 | app | init | `onBodyInit` | 4932 | - |
| 전환 | `openPageId` | - | target `OPAB030100` | 830 | "OPAB030100", reqParam |
| 전환 | `openPageId` | - | target `OPAB050100` | 832 | "OPAB050100", reqParam |
| 전환 | `openPageId` | - | target `OPAB030100` | 834 | "OPAB030100", reqParam |
| 전환 | `openPageId` | - | target `OPAB030100` | 836 | "OPAB030100", reqParam |
| 전환 | `openPageId` | - | target `OPAB031000` | 1407 | "OPAB031000", reqParam |
| 전환 | `openPageId` | - | target `OPAB030100` | 1893 | "OPAB030100", reqParam |
| 전환 | `openPageId` | - | target `OPAB050100` | 1895 | "OPAB050100", reqParam |
| 전환 | `openPageId` | - | target `OPAB030100` | 1897 | "OPAB030100", reqParam |
| 전환 | `openPageId` | - | target `OPAB030100` | 1899 | "OPAB030100", reqParam |
| Submission | `subComCodeList` | - | - | 2402 | send@[234] |
| Submission | `subSave` | - | - | 2411 | send@[800] |
| Submission | `subExtraInfoSearch` | - | - | 2423 | send@[394] |
| Submission | `subEntpSearch` | - | - | 2433 | send@[298] |
| Submission | `subChkDupEntpInfo` | - | - | 2441 | send@[1710, 1743] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnToggleClick` | 33 | e | [] | [] | [] |
| `onBodyInit` | 81 | e | [] | [] | [] |
| `onBodyLoad` | 173 | e | [] | [] | [] |
| `fnCodeProc` | 200 | dataSetNm,comboBxNm, data | [] | [] | [] |
| `fnCommCdCombox` | 210 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnCommCdSerach` | 221 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdRadio` | 285 | vDataSetNm, vCommCdTy, vRadioNm, vFilterStr | [] | [] | [] |
| `fnEntpSearch` | 296 |  | ['subEntpSearch'] | [] | [] |
| `fnEntpLoadComplete` | 313 | dataSet | [] | [] | [] |
| `fnSrchEntpExtraInfo` | 393 |  | ['subExtraInfoSearch'] | [] | [] |
| `fnValidate` | 435 |  | [] | [] | [] |
| `fnSave` | 782 | saveType | ['subSave'] | [] | ['OPAB030100', 'OPAB050100', 'OPAB030100', 'OPAB030100'] |
| `onRaonkUploadUploadComplete` | 852 | e | [] | [] | [] |
| `importExcel` | 905 | pcFileInput, dsNm, grdNm | [] | [] | [] |
| `onFi1ValueChange` | 1037 | e | [] | [] | [] |
| `onRaonkUploadAfterAddFile` | 1057 | e | [] | [] | [] |
| `onCmbAdmsEstbYmSelectionChange` | 1063 | e | [] | [] | [] |
| `onCmbTelnoSelectionChange` | 1071 | e | [] | [] | [] |
| `onIpbChrgpEmailAddrValueChange` | 1084 | e | [] | [] | [] |
| `onMseChrgpHtelTelnoValueChange` | 1097 | e | [] | [] | [] |
| `onIpbAddrValueChange` | 1112 | e | [] | [] | [] |
| `onAddrSrchClick` | 1125 | e | [] | [] | [] |
| `onRdbSalTpCdSelectionChange` | 1148 | e | [] | [] | [] |
| `onCmbEmailAddr3SelectionChange` | 1180 | e | [] | [] | [] |
| `onCmbGrdSmMgtSalFrmCdOpen` | 1194 | e | [] | [] | [] |
| `onCmbSalFrmCdSelectionChange` | 1202 | e | [] | [] | [] |
| `btnProc` | 1317 | formId, formIdVal, btnId, btnIdVal, grpId, grpIdVal, grpIdMargin, btnGrpId, btnGrpIdVal, grdId, grdIdval | [] | [] | [] |
| `onRdbCnsgTrtYnSelectionChange` | 1336 | e | [] | [] | [] |
| `onRdbJntMgtYnSelectionChange` | 1351 | e | [] | [] | [] |
| `onBtnSmMgtDelClick` | 1365 | e | ['subChkDupEntpInfo', 'subChkDupEntpInfo'] | [] | ['OPAB031000', 'OPAB030100', 'OPAB050100', 'OPAB030100', 'OPAB030100'] |
| `onButtonClick` | 1405 | e | [] | [] | ['OPAB031000'] |
| `onCmbChrgpEmailAddr3SelectionChange` | 1414 | e | [] | [] | [] |
| `onButtonClick2` | 1430 | e | [] | [] | [] |
| `onEntpLoadBtnClick` | 1437 | e | [] | [] | [] |
| `onUpdateBtnClick` | 1465 |  | [] | [] | [] |
| `onExcelFormXlsDownClick` | 1483 | e | [] | [] | [] |
| `exportExcelJsStyle` | 1495 | grdNm, type, exTension | [] | [] | [] |
| `grdSmMgtSelectionChange` | 1506 | e | [] | [] | [] |
| `onIpbOggBriefSmitYrSelectionChange` | 1529 | e | [] | [] | [] |
| `onRpprBthClick` | 1559 |  | [] | [] | [] |
| `onCmbGrdReqFomCdOpen` | 1594 | e | [] | [] | [] |
| `fnAdmEstbMonthSet` | 1608 |  | [] | [] | [] |
| `areaControl` | 1628 |  | [] | [] | [] |
| `onCmbReqDelClick` | 1640 | e | ['subChkDupEntpInfo', 'subChkDupEntpInfo'] | [] | ['OPAB030100', 'OPAB050100', 'OPAB030100', 'OPAB030100'] |
| `onCmbReqAddClick` | 1665 | e | [] | [] | [] |
| `onBtnExcelUploadClick` | 1677 | e | [] | [] | [] |
| `fnExcelProc` | 1684 | grdType,fileId | [] | [] | [] |
| `onBtnSmMgtAddClick` | 1692 | e | [] | [] | [] |
| `onBtnSaveClick` | 1704 | e | ['subChkDupEntpInfo'] | [] | [] |
| `onBtnJustNextClick` | 1736 | e | [] | [] | [] |
| `fnChkDupEntpInfo` | 1742 |  | ['subChkDupEntpInfo'] | [] | [] |
| `onCmbTelnoTypeSelectionChange` | 1754 | e | [] | [] | [] |
| `onBtnWrtNoticeClick` | 1776 | e | [] | [] | [] |
| `onBtnWrtNoticeClick2` | 1785 | e | [] | [] | [] |
| `dataset_validation` | 1790 | dataset,chkDict | [] | [] | [] |
| `cnsgTrt_validation` | 1808 | dataset,cnsgDict | [] | [] | [] |
| `siltaeJoSaLimit` | 1843 | param,param2 | [] | [] | ['OPAB030100', 'OPAB050100', 'OPAB030100', 'OPAB030100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/raonk/raonkUploadCustom.ndo` | ✅ | 200 / 200 | 2 | 본문 | popup/sc | `testcases/dataset/raonkUploadCustom.ndo.json` | __raw__ 경계1/악성6 | cpr-lib_udc.js:initRaonkUpload |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 2 | 본문 | popup,screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup/sc | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/opb/chkDupEntpInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveBizWrtMb.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectBizWrtTgtInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/raonkUploadCustom.ndo.json` | - | - | `cases/req_raonkUploadCustom.ndo.csv` / `cases/res_raonkUploadCustom.ndo.csv` |
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `app/op/opb/EntpOggBriefFormWrtList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB031000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항 | `app/op/opb/OggBriefBseLte` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 작성현황(서식이동) | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectBizWrtTgtList.do,selectComCodeList.do | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAB030100 |  |  |
| 6 | `expect_screen` | app/op/opb/EntpOggBriefFormWrtList |  |  |
| 7 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 작성 현황 상세 URI |
| 8 | `detail` | OPAB050100 |  |  |
| 9 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 10 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 11 | `detail` | OPAB031000 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefBseLte |  |  |
| 13 | `popup` | 작성현황(서식이동) |  |  |

</details>

### `OPAB040000` — 지출보고서 작성ㆍ정정 > 대량 지출보고서 업로드

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/FileExmPrsntList`, 소스 `app_op_opb_FileExmPrsntList.clx.js` (49664B, 컴포넌트 26, 이벤트 4, 핸들러 15)
- 런타임: instance `1`, body `961`, clx히트 `True`, 로드 `EntpInfmWrt.clx.js, OggBriefWrtAtnGdPop.clx.js, FileExmPrsntList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB040000.py` / STEP **7** / 기대 URI **7** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `문서유형=list`, `선택유형=UPDATE`, `시작화면=UPD`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnSearchClick` | 1064 | - |
| 이벤트 | button_2 | click | `onBtnSubmitListClick` | 1221 | - |
| 이벤트 | userDefinedControl_2 | pagechange | `onUdcPagePagechange` | 1290 | - |
| 이벤트 | app | init | `onBodyInit` | 1611 | - |
| Submission | `subSearch` | - | - | 757 | send@[170] |
| Submission | `subComCodeList` | - | - | 766 | send@[126] |
| Submission | `subSave` | - | - | 775 | send@[254] |
| Submission | `subFileDownload` | - | - | 784 | send@[] |
| Submission | `subSaveToWrt` | - | - | 792 | send@[325] |
| Submission | `subOggBriefSearch` | - | - | 801 | send@[65] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 35 | e | [] | [] | [] |
| `fnOggBriefSearch` | 62 |  | ['subOggBriefSearch'] | [] | [] |
| `fnYearSearch` | 75 |  | [] | [] | [] |
| `onCmbSalTpCdSelectionChange` | 98 | e | [] | [] | [] |
| `fnCommCdSerach` | 118 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 140 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `doSearch` | 155 | dataOggBriefSmitYr, dataOggBriefSmitNo, dataSalFrmCd | ['subSearch'] | [] | [] |
| `onGrd1CellClick` | 182 | e | [] | [] | [] |
| `fnDelSend` | 220 | grdType | ['subSave'] | [] | [] |
| `onBtnSaveClick` | 271 | e | [] | [] | [] |
| `fnSave` | 278 | grdType | ['subSaveToWrt'] | [] | [] |
| `onBtnSearchClick` | 345 | e | [] | [] | [] |
| `onBtnSubmitListClick` | 352 | e | [] | [] | [] |
| `fnExlInstProc` | 376 | oggBriefSmitYr, oggBriefSmitNo, salFrmCd, entpNm | [] | [] | [] |
| `onUdcPagePagechange` | 402 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveComFileUpload.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveWrtByLrg.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectVsDsgFileList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 대량 지출보고서 업로드 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/FileExmPrsntList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectBizWrtTgtList.do,selectComCodeList.do | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `popup` | 조회 |  |  |

</details>

### `OPAB050000` — 지출보고서 작성ㆍ정정 > 지출보고서 정정

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefWrtUpdList`, 소스 `app_op_opb_OggBriefWrtUpdList.clx.js` (52688B, 컴포넌트 28, 이벤트 9, 핸들러 21)
- 런타임: instance `1`, body `1020`, clx히트 `True`, 로드 `OggBriefWrtAtnGdPop.clx.js, FileExmPrsntList.clx.js, OggBriefWrtUpdList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050000.py` / STEP **29** / 기대 URI **18** / 상세화면 **10** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=8`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | comboBox_3 | click | `onCmbSalFrmCdClick` | 930 | - |
| 이벤트 | 초기화 | click | `onBtnInitClick` | 1060 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 1072 | - |
| 이벤트 | button_3 | click | `onBtnNewWrtClick` | 1146 | menu:OPAB031100 |
| 이벤트 | button_4 | click | `onBtnDelClick` | 1159 | Submit.send |
| 이벤트 | button_5 | click | `onBtnUpdClick` | 1422 | menu:OPAB050100 |
| 이벤트 | button_6 | click | `onBtnEntpLinkClick` | 1495 | menu:OPAB031100 |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1544 | - |
| 이벤트 | app | init | `onBodyInit` | 1564 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 270 | "OPAB050100", params |
| 전환 | `openPageId` | - | target `OPAB050100` | 376 | "OPAB050100", {"mode" : "UPDATE" 																							, "oggBriefSmitYr" : oggBriefSmitY |
| 전환 | `openPageId` | - | target `OPAB031100` | 486 | "OPAB031100", 						{"mode" : "UPDATE", 						 "oggBriefSmitYr" : oggBriefSmitYr, 						 " |
| Submission | `subSearch` | - | - | 706 | send@[252] |
| Submission | `subComCodeList` | - | - | 715 | send@[89] |
| Submission | `subDelEntpInfo` | - | - | 724 | send@[422] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 37 | e | [] | [] | [] |
| `fnInit` | 57 |  | [] | [] | [] |
| `fnPageInit` | 70 |  | [] | [] | [] |
| `fnCommCdSerach` | 80 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 119 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnArrSalFrmCdCombo` | 131 |  | [] | [] | [] |
| `onBtnSearchClick` | 181 | e | [] | [] | [] |
| `fnValidationChk` | 191 |  | [] | [] | [] |
| `doSearch` | 238 |  | ['subSearch'] | [] | [] |
| `onBtnUpdLinkClick` | 263 | e | [] | [] | ['OPAB050100'] |
| `onUdcGridTitleUdcSelectionChange` | 279 | e | [] | [] | [] |
| `onCmbSalTpCdItemClick` | 297 | e | [] | [] | [] |
| `onCmbSalFrmCdSelectionChange` | 320 | e | [] | [] | [] |
| `onCmbSalFrmCdClick` | 343 | e | [] | [] | [] |
| `multiComboClick` | 360 | e | [] | [] | [] |
| `onBtnUpdClick` | 368 | e | [] | [] | ['OPAB050100'] |
| `onBtnDelClick` | 392 | e | ['subDelEntpInfo'] | [] | [] |
| `onBtnNewWrtClick` | 442 | e | [] | [] | ['OPAB031100'] |
| `onUdcPagePagechange` | 461 | e | [] | [] | [] |
| `onBtnInitClick` | 469 | e | [] | [] | [] |
| `onBtnEntpLinkClick` | 478 | e | [] | [] | ['OPAB031100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/opb/selectBizWrtMbList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtMbList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMainNtfclteList.ndo.json` | dmParam 경계1/악성6 | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectMainStcList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/opb/saveEntpDel.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectBizWrtMbList.do.json` | 문서유형=list; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectBizWrtMbList.do.csv` / `cases/res_selectBizWrtMbList.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |
| `testcases/dataset/selectMainNtfclteList.ndo.json` | - | - | `cases/req_selectMainNtfclteList.ndo.csv` / `cases/res_selectMainNtfclteList.ndo.csv` |
| `testcases/dataset/selectMainStcList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectMainStcList.ndo.csv` / `cases/res_selectMainStcList.ndo.csv` |
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `app/op/opb/EntpInfmWrt` | `direct_ui` | selectComCodeList.do,selectBizWrtTgtList.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |
| `OPAB050900` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 최종확정 | `app/op/opb/LastFdecList` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefWrtUpdList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `click` | 조회 |  |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectComCodeList.do,selectOggBriefForm1List.do | 조회/화면로드 후 메뉴 전용 URI |
| 7 | `detail` | OPAB050100 |  |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 10 | `detail` | OPAB031100 |  |  |
| 11 | `expect_screen` | app/op/opb/EntpInfmWrt |  |  |
| 12 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do | 업체정보 작성하기 상세 URI |
| 13 | `detail` | OPAB050200 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 15 | `detail` | OPAB050300 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 17 | `detail` | OPAB050400 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 19 | `detail` | OPAB050500 |  |  |
| 20 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 21 | `detail` | OPAB050600 |  |  |
| 22 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 23 | `detail` | OPAB050700 |  |  |
| 24 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 25 | `detail` | OPAB050800 |  |  |
| 26 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |
| 27 | `detail` | OPAB050900 |  |  |
| 28 | `expect_screen` | app/op/opb/LastFdecList |  |  |
| 29 | `popup` | 조회 |  |  |

</details>

### `OPAB050100` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/EntpOggBriefFormUpdList`, 소스 `app_op_opb_EntpOggBriefFormUpdList.clx.js` (25706B, 컴포넌트 8, 이벤트 10, 핸들러 7)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `FileExmPrsntList.clx.js, OggBriefWrtUpdList.clx.js, EntpOggBriefFormUpdList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050100.py` / STEP **6** / 기대 URI **4** / 상세화면 **1** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 목록 | click | `onButtonClick` | 498 | menu:OPAB050000 |
| 이벤트 | userDefinedControl_4 | udcClick | `onUdcFormCardUdcClick` | 592 | - |
| 이벤트 | userDefinedControl_5 | udcClick | `onUdcFormCardUdcClick` | 603 | - |
| 이벤트 | userDefinedControl_6 | udcClick | `onUdcFormCardUdcClick` | 614 | - |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcFormCardUdcClick` | 628 | - |
| 이벤트 | userDefinedControl_8 | udcClick | `onUdcFormCardUdcClick` | 642 | - |
| 이벤트 | userDefinedControl_9 | udcClick | `onUdcFormCardUdcClick` | 653 | - |
| 이벤트 | userDefinedControl_10 | udcClick | `onUdcFormCardUdcClick` | 664 | - |
| 이벤트 | button_2 | click | `onBtnLastFdecClick` | 702 | - |
| 이벤트 | app | init | `onBodyInit` | 733 | - |
| 전환 | `openPageId` | - | target `OPAB050000` | 233 | "OPAB050000", params |
| Submission | `subSearch` | - | - | 409 | send@[67] |
| Submission | `subSearchDtl` | - | - | 417 | send@[161] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 35 | e | [] | [] | [] |
| `doSrch` | 59 | docType | ['subSearch'] | [] | [] |
| `onUdcFormCardUdcClick` | 102 | e | [] | [] | [] |
| `onUdcFormCardUdcSelectionChange` | 139 | e | [] | [] | [] |
| `doSrchDtl` | 152 | comboVal | ['subSearchDtl'] | [] | [] |
| `onBtnLastFdecClick` | 189 | e | [] | [] | [] |
| `onButtonClick` | 224 | e | [] | [] | ['OPAB050000'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefFormAllCnt.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/opb/selectOggBriefFormUpdAllCnt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt3.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opb/selectOggBriefFormUpdCnt4.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefFormAllCnt.do.json` | - | - | `cases/req_selectOggBriefFormAllCnt.do.csv` / `cases/res_selectOggBriefFormAllCnt.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050000` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 | `app/op/opb/OggBriefWrtUpdList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 3 | `expect_any` |  | selectOggBriefFormAllCnt.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB050000 |  |  |
| 5 | `expect_screen` | app/op/opb/OggBriefWrtUpdList |  |  |
| 6 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 정정 상세 URI |

</details>

### `OPAB050200` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList1`, 소스 `app_op_opb_OggBriefFormUpdList1.clx.js` (11060B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `808`, clx히트 `True`, 로드 `OggBriefWrtUpdList.clx.js, EntpOggBriefFormUpdList.clx.js, OggBriefFormUpdList1.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050200.py` / STEP **20** / 기대 URI **1** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `보고유형=10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm1List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm1List.do.json` | dmParam, dsResult 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm1List.do.json` | 보고유형=10; recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm1List.do.csv` / `cases/res_selectOggBriefForm1List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 정정 현황 | ✅ | selectOggBriefForm1List.do | click_지출보고서 정정 현황 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm1List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB050100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 7 | `detail` | OPAB050300 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 9 | `detail` | OPAB050400 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 11 | `detail` | OPAB050500 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 13 | `detail` | OPAB050600 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 15 | `detail` | OPAB050700 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 17 | `detail` | OPAB050800 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |
| 19 | `popup` | 지출보고서 정정 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm1List.do | 팝업 지출보고서 정정 현황 |

</details>

### `OPAB050300` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList2`, 소스 `app_op_opb_OggBriefFormUpdList2.clx.js` (11089B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `485`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, OggBriefFormUpdList2.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050300.py` / STEP **17** / 기대 URI **0** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 3 | `detail` | OPAB050100 |  |  |
| 4 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 5 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 6 | `detail` | OPAB050200 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 8 | `detail` | OPAB050400 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 10 | `detail` | OPAB050500 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 12 | `detail` | OPAB050600 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 14 | `detail` | OPAB050700 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 16 | `detail` | OPAB050800 |  |  |
| 17 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |

</details>

### `OPAB050400` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList3`, 소스 `app_op_opb_OggBriefFormUpdList3.clx.js` (11094B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `688`, clx히트 `True`, 로드 `OggBriefFormUpdList2.clx.js, OggBriefFormUpd2.clx.js, OggBriefFormUpdList3.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050400.py` / STEP **20** / 기대 URI **5** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=8`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 201 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 289 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 63 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 79 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 86 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 93 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 100 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 107 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 114 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 121 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 47 |  | [] | [] | [] |
| `onButtonClick` | 61 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 70 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doCard; app_op_opa_AllSeeOggWrptStc.clx.js: |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectMainNtfclteList.ndo.json` | dmParam 경계1/악성6 | app_com_main_index.clx.js:doSearch |
| `/kops/main/op/opa/selectMainStcList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectMainStcList.ndo.json` | dmParam 경계6/악성6 | app_com_main_index.clx.js:doSearchSum |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectOggBriefForm2List.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm3List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAllSeeStcInfoPgList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectAllSeeStcInfoPgList.ndo.csv` / `cases/res_selectAllSeeStcInfoPgList.ndo.csv` |
| `testcases/dataset/selectMainNtfclteList.ndo.json` | - | - | `cases/req_selectMainNtfclteList.ndo.csv` / `cases/res_selectMainNtfclteList.ndo.csv` |
| `testcases/dataset/selectMainStcList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=8; pageIndexerCount=4; searchNm= ; searchScreen=MAIN | - | `cases/req_selectMainStcList.ndo.csv` / `cases/res_selectMainStcList.ndo.csv` |
| `testcases/dataset/selectOggBriefForm2List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm2List.do.csv` / `cases/res_selectOggBriefForm2List.do.csv` |
| `testcases/dataset/selectOggBriefForm3List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm3List.do.csv` / `cases/res_selectOggBriefForm3List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 정정 현황 | ⚠️ | selectOggBriefForm3List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm2List.do,selectOggBriefForm3List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB050100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 7 | `detail` | OPAB050200 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 9 | `detail` | OPAB050300 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 11 | `detail` | OPAB050500 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 13 | `detail` | OPAB050600 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 15 | `detail` | OPAB050700 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 17 | `detail` | OPAB050800 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |
| 19 | `popup` | 지출보고서 정정 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm3List.do | 팝업 지출보고서 정정 현황 |

</details>

### `OPAB050500` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList4`, 소스 `app_op_opb_OggBriefFormUpdList4.clx.js` (11083B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormUpdList3.clx.js, OggBriefFormUpd3.clx.js, OggBriefFormUpdList4.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050500.py` / STEP **17** / 기대 URI **0** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 3 | `detail` | OPAB050100 |  |  |
| 4 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 5 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 6 | `detail` | OPAB050200 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 8 | `detail` | OPAB050300 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 10 | `detail` | OPAB050400 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 12 | `detail` | OPAB050600 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 14 | `detail` | OPAB050700 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 16 | `detail` | OPAB050800 |  |  |
| 17 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |

</details>

### `OPAB050600` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList5`, 소스 `app_op_opb_OggBriefFormUpdList5.clx.js` (11086B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `809`, clx히트 `True`, 로드 `OggBriefFormUpd3.clx.js, OggBriefFormUpdList4.clx.js, OggBriefFormUpdList5.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050600.py` / STEP **20** / 기대 URI **2** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm4List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm4List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm5List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm4List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm4List.do.csv` / `cases/res_selectOggBriefForm4List.do.csv` |
| `testcases/dataset/selectOggBriefForm5List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm5List.do.csv` / `cases/res_selectOggBriefForm5List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 정정 현황 | ⚠️ | selectOggBriefForm4List.do,selectOggBriefForm5List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm4List.do,selectOggBriefForm5List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB050100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 7 | `detail` | OPAB050200 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 9 | `detail` | OPAB050300 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 11 | `detail` | OPAB050400 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 13 | `detail` | OPAB050500 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 15 | `detail` | OPAB050700 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 17 | `detail` | OPAB050800 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |
| 19 | `popup` | 지출보고서 정정 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm4List.do,selectOggBriefForm5List.do | 팝업 지출보고서 정정 현황 |

</details>

### `OPAB050700` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList6`, 소스 `app_op_opb_OggBriefFormUpdList6.clx.js` (11129B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormUpdList5.clx.js, OggBriefFormUpd5.clx.js, OggBriefFormUpdList6.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050700.py` / STEP **17** / 기대 URI **0** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList7` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 3 | `detail` | OPAB050100 |  |  |
| 4 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 5 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 6 | `detail` | OPAB050200 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 8 | `detail` | OPAB050300 |  |  |
| 9 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 10 | `detail` | OPAB050400 |  |  |
| 11 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 12 | `detail` | OPAB050500 |  |  |
| 13 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 14 | `detail` | OPAB050600 |  |  |
| 15 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 16 | `detail` | OPAB050800 |  |  |
| 17 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |

</details>

### `OPAB050800` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/OggBriefFormUpdList7`, 소스 `app_op_opb_OggBriefFormUpdList7.clx.js` (11156B, 컴포넌트 5, 이벤트 2, 핸들러 4)
- 런타임: instance `1`, body `823`, clx히트 `True`, 로드 `OggBriefFormUpd5.clx.js, OggBriefFormUpdList6.clx.js, OggBriefFormUpdList7.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050800.py` / STEP **20** / 기대 URI **2** / 상세화면 **7** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 지출보고서 정정 현황 | click | `onButtonClick` | 200 | menu:OPAB050100 |
| 이벤트 | app | init | `onBodyInit` | 288 | - |
| 전환 | `openPageId` | - | target `OPAB050100` | 62 | "OPAB050100", initValue |
| 전환 | `openPageId` | - | target `OPAB050200` | 78 | "OPAB050200", initValue |
| 전환 | `openPageId` | - | target `OPAB050300` | 85 | "OPAB050300", initValue |
| 전환 | `openPageId` | - | target `OPAB050400` | 92 | "OPAB050400", initValue |
| 전환 | `openPageId` | - | target `OPAB050500` | 99 | "OPAB050500", initValue |
| 전환 | `openPageId` | - | target `OPAB050600` | 106 | "OPAB050600", initValue |
| 전환 | `openPageId` | - | target `OPAB050700` | 113 | "OPAB050700", initValue |
| 전환 | `openPageId` | - | target `OPAB050800` | 120 | "OPAB050800", initValue |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 32 | e | [] | [] | [] |
| `fnGuideSetting` | 46 |  | [] | [] | [] |
| `onButtonClick` | 60 | e | [] | [] | ['OPAB050100'] |
| `onCmb1SelectionChange` | 69 | e | [] | [] | ['OPAB050200', 'OPAB050300', 'OPAB050400', 'OPAB050500', 'OPAB050600', 'OPAB050700', 'OPAB050800'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectOggBriefForm6List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm6List.do.json` | _dmParam, dmParam 경계6/악성6 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectOggBriefForm7List.do.json` | _dmParam, dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectOggBriefForm6List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm6List.do.csv` / `cases/res_selectOggBriefForm6List.do.csv` |
| `testcases/dataset/selectOggBriefForm7List.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectOggBriefForm7List.do.csv` / `cases/res_selectOggBriefForm7List.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `app/op/opb/EntpOggBriefFormUpdList` | `direct_ui` | selectOggBriefFormAllCnt.do | ok_direct |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList1` | `direct_ui` | - | ok_direct |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList2` | `direct_ui` | - | ok_direct |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList3` | `direct_ui` | - | ok_direct |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList4` | `direct_ui` | - | ok_direct |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList5` | `direct_ui` | - | ok_direct |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `app/op/opb/OggBriefFormUpdList6` | `direct_ui` | - | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 정정 현황 | ⚠️ | selectOggBriefForm6List.do,selectOggBriefForm7List.do |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |  |
| 3 | `expect_any` |  | selectOggBriefForm6List.do,selectOggBriefForm7List.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `detail` | OPAB050100 |  |  |
| 5 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |  |
| 6 | `expect_any` |  | selectOggBriefFormAllCnt.do | 업체별 지출보고서 정정 현황 상세 URI |
| 7 | `detail` | OPAB050200 |  |  |
| 8 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |  |
| 9 | `detail` | OPAB050300 |  |  |
| 10 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |  |
| 11 | `detail` | OPAB050400 |  |  |
| 12 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |  |
| 13 | `detail` | OPAB050500 |  |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |  |
| 15 | `detail` | OPAB050600 |  |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |  |
| 17 | `detail` | OPAB050700 |  |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |  |
| 19 | `popup` | 지출보고서 정정 현황 |  |  |
| 20 | `expect_any` |  | selectOggBriefForm6List.do,selectOggBriefForm7List.do | 팝업 지출보고서 정정 현황 |

</details>

### `OPAB050900` — 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 최종확정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opb/LastFdecList`, 소스 `app_op_opb_LastFdecList.clx.js` (61279B, 컴포넌트 62, 이벤트 4, 핸들러 8)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `OggBriefFormUpdList7.clx.js, OggBriefFormUpd7.clx.js, LastFdecList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAB050900.py` / STEP **8** / 기대 URI **1** / 상세화면 **2** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | userDefinedControl_2 | udcStep2Click | `onUdcStepBoxUdcStep2Click` | 251 | menu:OPAB030100,OPAB030100,OPAB050100 |
| 이벤트 | button_1 | click | `onBtnAgreeClick` | 1449 | - |
| 이벤트 | button_2 | click | `onButtonClick` | 1695 | Submit.send; menu:OPAB030000,OPAB050000 |
| 이벤트 | app | init | `onBodyInit` | 1715 | - |
| 전환 | `openPageId` | - | target `OPAB030000` | 86 | "OPAB030000", params |
| 전환 | `openPageId` | - | target `OPAB050000` | 88 | "OPAB050000", params |
| 전환 | `openPageId` | - | target `-` | 133 | menuID, initValue |
| Submission | `subSave` | - | - | 203 | send@[73] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 26 | e | [] | [] | [] |
| `onButtonClick` | 44 | e | ['subSave'] | [] | ['OPAB030000', 'OPAB050000'] |
| `onBtnNonDstgExeClick` | 103 | e | [] | [] | [] |
| `onBtnAgreeClick` | 118 | e | [] | [] | [] |
| `onUdcStepBoxUdcStep2Click` | 124 | e | [] | [] | ['OPAB030100', 'OPAB030100', 'OPAB050100'] |
| `siltaeJoSaLimit` | 141 | param,e | [] | [] | [] |
| `onCbxAllValueChange` | 171 | e | [] | [] | [] |
| `onBtnLastConfirm2Click` | 185 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/saveLastFdecList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAB030000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 | `app/op/opb/OggBriefWrtList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do,selectComCodeList.do | ok_direct |
| `OPAB050000` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 | `app/op/opb/OggBriefWrtUpdList` | `direct_ui` | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 최종확정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opb/LastFdecList |  |  |
| 3 | `detail` | OPAB030000 |  |  |
| 4 | `expect_screen` | app/op/opb/OggBriefWrtList |  |  |
| 5 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 실태조사 상세 URI |
| 6 | `detail` | OPAB050000 |  |  |
| 7 | `expect_screen` | app/op/opb/OggBriefWrtUpdList |  |  |
| 8 | `expect_any` |  | selectComCodeList.do,selectBizWrtMbList.do,selectOggBriefFormAllCnt.do | 지출보고서 정정 상세 URI |

</details>

### `OPAC000000` — 지출보고서 기초정보 조회

- 수준 L1 / 로그인 **필요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `err`, body `0`, clx히트 `False`, 로드 ``, 팝업 `1`/`0트라이`, 다이얼로그 `알림 이 서비스는 로그인이 필요합니다. 로그인 후 이용하시기 바랍니다. 확인`
- 테스트: `menu_tests/test_OPAC000000.py` / STEP **9** / 기대 URI **4** / 상세화면 **3** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizWrtTgtList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectBizWrtTgtList.do.json` | dmParam 경계3/악성6 | - |
| `/kops/main/op/opc/selectOggBriefCommBiz1List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opc/selectOggBriefCommBiz2List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opc/selectOggBriefCommBiz3List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizWrtTgtList.do.json` | - | - | `cases/req_selectBizWrtTgtList.do.csv` / `cases/res_selectBizWrtTgtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAC010000` | 지출보고서 기초정보 조회 > 요양기관 정보조회 | `app/op/opc/YadmInfmList` | `direct_ui` | selectComCodeList.do | ok_direct |
| `OPAC020000` | 지출보고서 기초정보 조회 > 의약품 정보조회 | `app/op/opc/MsupInfmList` | `direct_ui` | - | ok_direct |
| `OPAC030000` | 지출보고서 기초정보 조회 > 의료기기 정보조회 | `app/op/opc/MeqipInfmList` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 기초정보 조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectBizWrtTgtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAC010000 |  |  |
| 4 | `expect_screen` | app/op/opc/YadmInfmList |  |  |
| 5 | `expect_any` |  | selectComCodeList.do | 요양기관 정보조회 상세 URI |
| 6 | `detail` | OPAC020000 |  |  |
| 7 | `expect_screen` | app/op/opc/MsupInfmList |  |  |
| 8 | `detail` | OPAC030000 |  |  |
| 9 | `expect_screen` | app/op/opc/MeqipInfmList |  |  |

</details>

### `OPAC010000` — 지출보고서 기초정보 조회 > 요양기관 정보조회

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opc/YadmInfmList`, 소스 `app_op_opc_YadmInfmList.clx.js` (44336B, 컴포넌트 23, 이벤트 8, 핸들러 15)
- 런타임: instance `1`, body `485`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, YadmInfmList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAC010000.py` / STEP **4** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 요양기관기호로 명칭 일괄찾기 | click | `onButtonClick` | 906 | - |
| 이벤트 | radioButton_1 | click | `onBtnSearchStandard` | 1048 | - |
| 이벤트 | button_2 | click | `onBtnInit1Click` | 1163 | - |
| 이벤트 | button_3 | click | `onBtnSearchClick2` | 1175 | - |
| 이벤트 | output_10 | dblclick | `onYadmNmDblclick` | 1368 | - |
| 이벤트 | output_16 | dblclick | `onYkihoDblclick` | 1441 | - |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1460 | - |
| 이벤트 | app | init | `onBodyInit` | 1480 | - |
| Submission | `subSearch` | - | - | 808 | send@[196] |
| Submission | `subComCodeList` | - | - | 818 | send@[56] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 40 | e | [] | [] | [] |
| `fnCommCdSerach` | 49 |  | ['subComCodeList'] | [] | [] |
| `fnCommCdCombox` | 75 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnPageInit` | 88 |  | [] | [] | [] |
| `onBtnInit1Click` | 104 | e | [] | [] | [] |
| `onUdcPagePagechange` | 120 | e | [] | [] | [] |
| `onUdcGridTitleUdcSelectionChange` | 128 | e | [] | [] | [] |
| `onBtnInit` | 146 | e | [] | [] | [] |
| `doSearch` | 166 |  | ['subSearch'] | [] | [] |
| `onBtnSearchClick2` | 210 | e | [] | [] | [] |
| `onButtonClick` | 222 | e | [] | [] | [] |
| `onBtnYadmInfo` | 244 | e | [] | [] | [] |
| `onBtnSearchStandard` | 281 | e | [] | [] | [] |
| `onYkihoDblclick` | 303 | e | [] | [] | [] |
| `onYadmNmDblclick` | 313 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opc/selectOggBriefCommBiz3List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 기초정보 조회 > 요양기관 정보조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opc/YadmInfmList |  |  |
| 3 | `fill` | 요양기관명 | @sample.요양기관명 |  |
| 4 | `click` | 조회 |  |  |

</details>

### `OPAC020000` — 지출보고서 기초정보 조회 > 의약품 정보조회

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opc/MsupInfmList`, 소스 `app_op_opc_MsupInfmList.clx.js` (36413B, 컴포넌트 30, 이벤트 4, 핸들러 9)
- 런타임: instance `1`, body `492`, clx히트 `True`, 로드 `index.clx.js, YadmInfmList.clx.js, MsupInfmList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAC020000.py` / STEP **4** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 초기화 | click | `onBtnInit` | 658 | - |
| 이벤트 | button_2 | click | `onBtnSearch` | 670 | - |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 1069 | - |
| 이벤트 | app | load | `onBodyLoad` | 1089 | - |
| Submission | `subSearch` | - | - | 364 | send@[113] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onBodyLoad` | 47 | e | [] | [] | [] |
| `onBtnInit` | 67 | e | [] | [] | [] |
| `onUdcPagePagechange` | 85 | e | [] | [] | [] |
| `onBtnSearch` | 93 | e | [] | [] | [] |
| `doSearch` | 112 |  | ['subSearch'] | [] | [] |
| `onBtnBizNoClick` | 122 | e | [] | [] | [] |
| `onBtnPrdNmClick` | 160 | e | [] | [] | [] |
| `onUdcGridTitleUdcSelectionChange` | 212 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opc/selectOggBriefCommBiz1List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 기초정보 조회 > 의약품 정보조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opc/MsupInfmList |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |
| 4 | `click` | 조회 |  |  |

</details>

### `OPAC030000` — 지출보고서 기초정보 조회 > 의료기기 정보조회

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opc/MeqipInfmList`, 소스 `app_op_opc_MeqipInfmList.clx.js` (34085B, 컴포넌트 24, 이벤트 4, 핸들러 9)
- 런타임: instance `1`, body `569`, clx히트 `True`, 로드 `YadmInfmList.clx.js, MsupInfmList.clx.js, MeqipInfmList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAC030000.py` / STEP **5** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 초기화 | click | `onBtnInit` | 708 | - |
| 이벤트 | button_2 | click | `onBtnSearch` | 720 | - |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPagePagechange` | 997 | - |
| 이벤트 | app | load | `onBodyLoad` | 1017 | - |
| Submission | `subSearch` | - | - | 394 | send@[209] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `onBodyLoad` | 47 | e | [] | [] | [] |
| `onBtnInit` | 65 | e | [] | [] | [] |
| `onBtnItemInfo` | 90 | e | [] | [] | [] |
| `onBtnBizInfo` | 137 | e | [] | [] | [] |
| `onUdcPagePagechange` | 181 | e | [] | [] | [] |
| `onBtnSearch` | 189 | e | [] | [] | [] |
| `doSearch` | 208 |  | ['subSearch'] | [] | [] |
| `onUdcGridTitleUdcSelectionChange` | 220 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opc/selectOggBriefCommBiz2List.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 지출보고서 기초정보 조회 > 의료기기 정보조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opc/MeqipInfmList |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |
| 4 | `fill` | 품목명 | @sample.품목명 |  |
| 5 | `click` | 조회 |  |  |

</details>

### `OPAD000000` — 고객지원

- 수준 L1 / 로그인 **불요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `public`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `0`, body `613`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD000000.py` / STEP **31** / 기대 URI **28** / 상세화면 **12** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAcpDescPecnyAstc1.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAcpDescPecnyAstc1.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnScrnTrnCall |
| `/kops/main/op/opa/selectAllSeeStcList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAllSeeStcList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftOffrrList.clx.js:fnDataSetGet |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 63 | 본문,하위화면 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opd/selectEduAplDtl.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectEduAplDtl.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opd/selectEduAplDtlDesc.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectEduAplDtlDesc.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opd/selectEduAplList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectEduAplList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opa/selectExttOnoList.ndo` | ✅ | 200 / 200 | 3 | 하위화면 | screen/op | `testcases/dataset/selectExttOnoList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchExttOno; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchExttOno |
| `/kops/main/op/opd/selectFaqList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectFaqList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Faq.clx.js:doSearch |
| `/kops/main/op/opd/selectInfmTrfrAplWrtList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectInfmTrfrAplWrtList.do.json` | dmParam 경계4/악성6 | - |
| `/kops/main/op/opd/selectNtfclteDtl.ndo` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectNtfclteDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_NtfclteDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectNtfclteList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Ntfclte.clx.js:doSearch |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectOffrDescPecnyAstc1.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnDataSetGet,fnPrgDataSetGet; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:fnScrnTrnCall,fnDataSetGet |
| `/kops/main/op/opa/selectOggBriefSmitYrList.ndo` | ✅ | 200 / 200 | 3 | 하위화면 | screen/op | `testcases/dataset/selectOggBriefSmitYrList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchYear; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchYear |
| `/kops/main/op/opd/selectRfrmDtl.ndo` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectRfrmDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_RfrmDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectRfrmList.ndo` | ✅ | 200 / 200 | 1 | 하위화면 | screen/op | `testcases/dataset/selectRfrmList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Rfrm.clx.js:doSearch |
| `file/insertFileInfoSample.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/sampleFIleDownloadList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveEduAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrCloRptWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveNtfclteInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveRfrmInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectAplPsblNop.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectEduAplInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/updateEduApl.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opg/chkMbIdSbscYn.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAcpDescPecnyAstc1.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectAcpDescPecnyAstc1.ndo.csv` / `cases/res_selectAcpDescPecnyAstc1.ndo.csv` |
| `testcases/dataset/selectAllSeeStcList.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectAllSeeStcList.ndo.csv` / `cases/res_selectAllSeeStcList.ndo.csv` |
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectEduAplDtl.do.json` | 페이지행수=6 | aplpEmailAddr,aplpTelno,chgpId,regpId,telno | `cases/req_selectEduAplDtl.do.csv` / `cases/res_selectEduAplDtl.do.csv` |
| `testcases/dataset/selectEduAplDtlDesc.do.json` | 페이지=1; recordsTotal=0; 페이지행수=10; pageIndexerCount=10 | ansPwd,aplpEmailAddr,aplpTelno,chgpId,regpId | `cases/req_selectEduAplDtlDesc.do.csv` / `cases/res_selectEduAplDtlDesc.do.csv` |
| `testcases/dataset/selectEduAplList.do.json` | 페이지=1; recordsTotal=0; 페이지행수=6; pageIndexerCount=6; comboType=all | aplpEmailAddr,aplpTelno,chgpId,regpId,telno | `cases/req_selectEduAplList.do.csv` / `cases/res_selectEduAplList.do.csv` |
| `testcases/dataset/selectExttOnoList.ndo.json` | - | dsExttOno | `cases/req_selectExttOnoList.ndo.csv` / `cases/res_selectExttOnoList.ndo.csv` |
| `testcases/dataset/selectFaqList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=10; pageIndexerCount=10; comboType=all | chgpId,regpId | `cases/req_selectFaqList.ndo.csv` / `cases/res_selectFaqList.ndo.csv` |
| `testcases/dataset/selectInfmTrfrAplWrtList.do.json` | pageIndexerCount=10; recordsTotal=0; 페이지행수=10; 페이지=1 | - | `cases/req_selectInfmTrfrAplWrtList.do.csv` / `cases/res_selectInfmTrfrAplWrtList.do.csv` |
| `testcases/dataset/selectNtfclteDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectNtfclteDtl.ndo.csv` / `cases/res_selectNtfclteDtl.ndo.csv` |
| `testcases/dataset/selectNtfclteList.ndo.json` | delYn=　; fdecDd=　; regDt=　; chgDt=　; 페이지=1; recordsTotal=0 | chgpId,regpId | `cases/req_selectNtfclteList.ndo.csv` / `cases/res_selectNtfclteList.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc1.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectOffrDescPecnyAstc1.ndo.csv` / `cases/res_selectOffrDescPecnyAstc1.ndo.csv` |
| `testcases/dataset/selectOggBriefSmitYrList.ndo.json` | exttOno=202603 | - | `cases/req_selectOggBriefSmitYrList.ndo.csv` / `cases/res_selectOggBriefSmitYrList.ndo.csv` |
| `testcases/dataset/selectRfrmDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectRfrmDtl.ndo.csv` / `cases/res_selectRfrmDtl.ndo.csv` |
| `testcases/dataset/selectRfrmList.ndo.json` | delYn=　; fdecDd=　; regDt=　; chgDt=　; comboType=all; sortType=desc | chgpId,regpId | `cases/req_selectRfrmList.ndo.csv` / `cases/res_selectRfrmList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD010000` | 고객지원 > 공지사항 | `app/op/opd/Ntfclte` | `openPageId` | selectNtfclteList.ndo | ok |
| `OPAD010100` | 고객지원 > 공지사항 > 공지사항 상세 | `app/op/opd/NtfclteDtl` | `openPageId` | selectNtfclteDtl.ndo | ok |
| `OPAD020000` | 고객지원 > 자주 찾는 질문(FAQ) | `app/op/opd/Faq` | `openPageId` | selectFaqList.ndo | ok |
| `OPAD030000` | 고객지원 > 자료실 | `app/op/opd/Rfrm` | `openPageId` | selectRfrmList.ndo | ok |
| `OPAD030100` | 고객지원 > 자료실 > 자료실 상세 | `app/op/opd/RfrmDtl` | `openPageId` | selectRfrmDtl.ndo | ok |
| `OPAD040000` | 고객지원 > 교육서비스 | `app/op/opd/EduApl` | `direct_ui` | selectEduAplList.do | ok_direct |
| `OPAD040100` | 고객지원 > 교육서비스 > 교육서비스 상세 | `app/op/opd/EduAplDtl` | `direct_ui` | selectEduAplDtl.do | ok_direct |
| `OPAD040200` | 고객지원 > 교육서비스 > 교육서비스 신청 상세내역 | `app/op/opd/EduAplDtlDesc` | `direct_ui` | selectEduAplDtlDesc.do | ok_direct |
| `OPAD040300` | 고객지원 > 교육서비스 > 교육신청 | `app/op/opd/EduAplWrt` | `direct_ui` | - | ok_direct |
| `OPAD050000` | 고객지원 > 정보이관 및 비공개(폐업) 신청 | `app/op/opd/InfmTrfrAplList` | `direct_ui` | selectInfmTrfrAplWrtList.do | ok_direct |
| `OPAD050200` | 고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청 | `app/op/opd/InfmTrfrAplWrt` | `direct_ui` | selectComCodeList.do | ok_direct |
| `OPAD060000` | 고객지원 > 웹 접근성 안내 | `app/op/ope/WebAccessibilityM01` | `openPageId` | - | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectAcpDescPecnyAstc1.ndo,selectAllSeeStcList.ndo,selectEduAplDtl.do | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAD010000 |  |  |
| 4 | `expect_screen` | app/op/opd/Ntfclte |  |  |
| 5 | `expect_any` |  | selectNtfclteList.ndo | 공지사항 상세 URI |
| 6 | `detail` | OPAD010100 |  |  |
| 7 | `expect_screen` | app/op/opd/NtfclteDtl |  |  |
| 8 | `expect_any` |  | selectNtfclteDtl.ndo | 공지사항 상세 상세 URI |
| 9 | `detail` | OPAD020000 |  |  |
| 10 | `expect_screen` | app/op/opd/Faq |  |  |
| 11 | `expect_any` |  | selectFaqList.ndo | 자주 찾는 질문(FAQ) 상세 URI |
| 12 | `detail` | OPAD030000 |  |  |
| 13 | `expect_screen` | app/op/opd/Rfrm |  |  |
| 14 | `expect_any` |  | selectRfrmList.ndo | 자료실 상세 URI |
| 15 | `detail` | OPAD030100 |  |  |
| 16 | `expect_screen` | app/op/opd/RfrmDtl |  |  |
| 17 | `expect_any` |  | selectRfrmDtl.ndo | 자료실 상세 상세 URI |
| 18 | `detail` | OPAD040000 |  |  |
| 19 | `expect_screen` | app/op/opd/EduApl |  |  |
| 20 | `expect_any` |  | selectEduAplList.do | 교육서비스 상세 URI |
| 21 | `detail` | OPAD040100 |  |  |
| 22 | `expect_screen` | app/op/opd/EduAplDtl |  |  |
| 23 | `expect_any` |  | selectEduAplDtl.do | 교육서비스 상세 상세 URI |
| 24 | `detail` | OPAD040200 |  |  |
| 25 | `expect_screen` | app/op/opd/EduAplDtlDesc |  |  |
| 26 | `expect_any` |  | selectEduAplDtlDesc.do | 교육서비스 신청 상세내역 상세 URI |
| 27 | `detail` | OPAD040300 |  |  |
| 28 | `expect_screen` | app/op/opd/EduAplWrt |  |  |
| 29 | `detail` | OPAD050000 |  |  |
| 30 | `expect_screen` | app/op/opd/InfmTrfrAplList |  |  |
| 31 | `expect_any` |  | selectInfmTrfrAplWrtList.do | 정보이관 및 비공개(폐업) 신청 상세 URI |

</details>

### `OPAD010000` — 고객지원 > 공지사항

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opd/Ntfclte`, 소스 `app_op_opd_Ntfclte.clx.js` (22199B, 컴포넌트 14, 이벤트 3, 핸들러 8)
- 런타임: instance `1`, body `1150`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `3`/`1트라이`, 다이얼로그 `한눈에 보는 지출보고서통계 활용 시 유의사항 안내 한눈에 보는 지출보고서 통계 활용 시 유의사항 안내 ① (참고자료) 한눈에 보는 지출보고서 통계 정보는 국민의 이해를 돕고자 제공; 한눈에 보는 지출보고서통계 활용 시 유의사항 안내 한눈에 보는 지출보고서 통계 활용 시 유의사항 안내 ① (참고자료) 한눈에 보는 지출보고서 통계 정보는 국민의 이해를 돕고자 제공; 한눈에 보는 지출보고서통계 활용 시 유의사항 안내 한눈에 보는 지출보고서 통계 활용 시 유의사항 안내 ① (참고자료) 한눈에 보는 지출보고서 통계 정보는 국민의 이해를 돕고자 제공`
- 테스트: `menu_tests/test_OPAD010000.py` / STEP **8** / 기대 URI **10** / 상세화면 **1** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnSrchClick` | 349 | - |
| 이벤트 | userDefinedControl_2 | pagechange | `onUdcPagePagechange` | 661 | - |
| 이벤트 | app | init | `onBodyInit` | 681 | - |
| 전환 | `openPageId` | - | target `OPAD010100` | 104 | "OPAD010100", {"bltNo":tgtData} |
| Submission | `subSearch` | - | - | 254 | send@[52] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `doSearch` | 50 |  | ['subSearch'] | [] | [] |
| `onBtnSrchClick` | 65 | e | [] | [] | [] |
| `fnPageInit` | 73 |  | [] | [] | [] |
| `onUdcPagePagechange` | 84 | e | [] | [] | [] |
| `onGrd1CellClick` | 92 | e | [] | [] | ['OPAD010100'] |
| `onCmbListCntSelectionChange` | 126 | e | [] | [] | [] |
| `onSrtTypeSelectionChange` | 145 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opa/selectAcpDescPecnyAstc1.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAcpDescPecnyAstc1.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnScrnTrnCall |
| `/kops/main/op/opa/selectAllSeeStcList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectAllSeeStcList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftOffrrList.clx.js:fnDataSetGet |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 18 | 본문,하위화면 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opa/selectExttOnoList.ndo` | ✅ | 200 / 200 | 3 | 본문 | screen/op | `testcases/dataset/selectExttOnoList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchExttOno; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchExttOno |
| `/kops/main/op/opd/selectNtfclteDtl.ndo` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectNtfclteDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_NtfclteDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectNtfclteList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectNtfclteList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Ntfclte.clx.js:doSearch |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectOffrDescPecnyAstc1.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:fnDataSetGet,fnPrgDataSetGet; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:fnScrnTrnCall,fnDataSetGet |
| `/kops/main/op/opa/selectOggBriefSmitYrList.ndo` | ✅ | 200 / 200 | 3 | 본문 | screen/op | `testcases/dataset/selectOggBriefSmitYrList.ndo.json` | dmParam 경계3/악성6 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js:doSearchYear; app_op_opa_LawEcnmyPftOffrrDtlList.clx.js:doSearchYear |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveNtfclteInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAcpDescPecnyAstc1.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectAcpDescPecnyAstc1.ndo.csv` / `cases/res_selectAcpDescPecnyAstc1.ndo.csv` |
| `testcases/dataset/selectAllSeeStcList.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectAllSeeStcList.ndo.csv` / `cases/res_selectAllSeeStcList.ndo.csv` |
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectExttOnoList.ndo.json` | - | dsExttOno | `cases/req_selectExttOnoList.ndo.csv` / `cases/res_selectExttOnoList.ndo.csv` |
| `testcases/dataset/selectNtfclteDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectNtfclteDtl.ndo.csv` / `cases/res_selectNtfclteDtl.ndo.csv` |
| `testcases/dataset/selectNtfclteList.ndo.json` | delYn=　; fdecDd=　; regDt=　; chgDt=　; 페이지=1; recordsTotal=0 | chgpId,regpId | `cases/req_selectNtfclteList.ndo.csv` / `cases/res_selectNtfclteList.ndo.csv` |
| `testcases/dataset/selectOffrDescPecnyAstc1.ndo.json` | 제출연도=2025; exttOno=202603 | - | `cases/req_selectOffrDescPecnyAstc1.ndo.csv` / `cases/res_selectOffrDescPecnyAstc1.ndo.csv` |
| `testcases/dataset/selectOggBriefSmitYrList.ndo.json` | exttOno=202603 | - | `cases/req_selectOggBriefSmitYrList.ndo.csv` / `cases/res_selectOggBriefSmitYrList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD010100` | 고객지원 > 공지사항 > 공지사항 상세 | `app/op/opd/NtfclteDtl` | `openPageId` | selectNtfclteDtl.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 공지사항 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/Ntfclte |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectAcpDescPecnyAstc1.ndo,selectAllSeeStcList.ndo,selectExttOnoList.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAD010100 |  |  |
| 6 | `expect_screen` | app/op/opd/NtfclteDtl |  |  |
| 7 | `expect_any` |  | selectNtfclteDtl.ndo | 공지사항 상세 상세 URI |
| 8 | `popup` | 조회 |  |  |

</details>

### `OPAD010100` — 고객지원 > 공지사항 > 공지사항 상세

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opd/NtfclteDtl`, 소스 `app_op_opd_NtfclteDtl.clx.js` (28895B, 컴포넌트 16, 이벤트 6, 핸들러 9)
- 런타임: instance `1`, body `680`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD010100.py` / STEP **4** / 기대 URI **4** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 다운로드 | click | `onBtnDwnd1Click` | 165 | Submit.send |
| 이벤트 | 바로보기 | click | `onBtnDwnd2Click` | 182 | - |
| 이벤트 | 다운로드 | click | `onOutput1Click` | 895 | - |
| 이벤트 | 바로보기 | click | `onNxt2Click` | 934 | - |
| 이벤트 | 목록 | click | `onBtnSerach1Click2` | 973 | menu:OPAD010000 |
| 이벤트 | app | init | `onBodyInit` | 993 | - |
| 전환 | `openPageId` | - | target `-` | 256 | OPAD010000 {} |
| Submission | `subSearch` | - | - | 659 | send@[74] |
| Submission | `subFileDownload` | - | - | 668 | send@[274] |
| Submission | `subSaveInqCnt` | - | - | 677 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 40 | e | [] | [] | [] |
| `doSearch` | 55 | page | ['subSearch'] | [] | [] |
| `insertProc` | 106 | index | [] | [] | [] |
| `onButtonClick` | 237 | e | [] | [] | [] |
| `onBtnSerach1Click2` | 252 | e | [] | [] | ['OPAD010000'] |
| `onBtnDwnd1Click` | 260 | e | ['subFileDownload'] | [] | [] |
| `onBtnDwnd2Click` | 283 | e | [] | [] | [] |
| `onOutput1Click` | 293 | e | [] | [] | [] |
| `onNxt2Click` | 307 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opd/selectNtfclteDtl.ndo` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectNtfclteDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_NtfclteDtl.clx.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveNtfclteInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectNtfclteDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectNtfclteDtl.ndo.csv` / `cases/res_selectNtfclteDtl.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 공지사항 > 공지사항 상세 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/NtfclteDtl |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectNtfclteDtl.ndo | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAD020000` — 고객지원 > 자주 찾는 질문(FAQ)

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opd/Faq`, 소스 `app_op_opd_Faq.clx.js` (19225B, 컴포넌트 10, 이벤트 5, 핸들러 9)
- 런타임: instance `1`, body `690`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD020000.py` / STEP **5** / 기대 URI **2** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 조회 | click | `onBtnSrchClick2` | 455 | - |
| 이벤트 | comboBox_3 | change | `onCmbListCntSelectionChange` | 548 | - |
| 이벤트 | accordion_1 | click | `onSampleAcdClick` | 574 | - |
| 이벤트 | userDefinedControl_2 | pagechange | `onUdcPage1Pagechange` | 585 | - |
| 이벤트 | app | load | `onBodyInit` | 605 | - |
| Submission | `subSearch` | - | - | 345 | send@[64] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 34 | e | [] | [] | [] |
| `doSearch` | 54 |  | ['subSearch'] | [] | [] |
| `addItem` | 109 | item, i | [] | [] | [] |
| `insertProc` | 133 | i | [] | [] | [] |
| `onUdcPagePagechange` | 151 | e | [] | [] | [] |
| `onBtnSrchClick2` | 160 | e | [] | [] | [] |
| `onCmbListCntSelectionChange` | 177 | e | [] | [] | [] |
| `onSampleAcdClick` | 196 | e | [] | [] | [] |
| `onUdcPage1Pagechange` | 205 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opd/selectFaqList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectFaqList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Faq.clx.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectFaqList.ndo.json` | 페이지=1; recordsTotal=0; 페이지행수=10; pageIndexerCount=10; comboType=all | chgpId,regpId | `cases/req_selectFaqList.ndo.csv` / `cases/res_selectFaqList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 자주 찾는 질문(FAQ) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/Faq |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectFaqList.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `popup` | 조회 |  |  |

</details>

### `OPAD030000` — 고객지원 > 자료실

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opd/Rfrm`, 소스 `app_op_opd_Rfrm.clx.js` (23232B, 컴포넌트 15, 이벤트 3, 핸들러 7)
- 런타임: instance `1`, body `716`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD030000.py` / STEP **8** / 기대 URI **6** / 상세화면 **1** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 조회 | click | `onBtnSrchClick` | 379 | - |
| 이벤트 | userDefinedControl_2 | pagechange | `onUdcPagePagechange` | 686 | - |
| 이벤트 | app | init | `onBodyInit` | 706 | - |
| 전환 | `openPageId` | - | target `OPAD030100` | 139 | "OPAD030100", {"bltNo":tgtData} |
| 전환 | `openPageId` | - | target `OPAD030100` | 140 | "OPAD030100", {"bltNo":tgtData, "selectCon1" :"" , "selectCon2" : ""} |
| Submission | `subSearch` | - | - | 286 | send@[61] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 35 | e | [] | [] | [] |
| `doSearch` | 54 |  | ['subSearch'] | [] | [] |
| `onBtnSrchClick` | 83 | e | [] | [] | [] |
| `onUdcPagePagechange` | 99 | e | [] | [] | [] |
| `onGrd1CellClick` | 108 | e | [] | [] | ['OPAD030100', 'OPAD030100'] |
| `onCmbListCntSelectionChange` | 162 | e | [] | [] | [] |
| `onSrtTypeSelectionChange` | 181 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 18 | 본문,하위화면 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opd/selectRfrmDtl.ndo` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectRfrmDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_RfrmDtl.clx.js:doSearch |
| `/kops/main/op/opd/selectRfrmList.ndo` | ✅ | 200 / 200 | 1 | 본문 | screen/op | `testcases/dataset/selectRfrmList.ndo.json` | dmParam 경계6/악성6 | app_op_opd_Rfrm.clx.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/sampleFIleDownloadList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveRfrmInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectRfrmDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectRfrmDtl.ndo.csv` / `cases/res_selectRfrmDtl.ndo.csv` |
| `testcases/dataset/selectRfrmList.ndo.json` | delYn=　; fdecDd=　; regDt=　; chgDt=　; comboType=all; sortType=desc | chgpId,regpId | `cases/req_selectRfrmList.ndo.csv` / `cases/res_selectRfrmList.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD030100` | 고객지원 > 자료실 > 자료실 상세 | `app/op/opd/RfrmDtl` | `openPageId` | selectRfrmDtl.ndo | ok |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 자료실 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/Rfrm |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectRfrmDtl.ndo,selectRfrmList.ndo | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAD030100 |  |  |
| 6 | `expect_screen` | app/op/opd/RfrmDtl |  |  |
| 7 | `expect_any` |  | selectRfrmDtl.ndo | 자료실 상세 상세 URI |
| 8 | `popup` | 조회 |  |  |

</details>

### `OPAD030100` — 고객지원 > 자료실 > 자료실 상세

- 수준 L3 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/opd/RfrmDtl`, 소스 `app_op_opd_RfrmDtl.clx.js` (28952B, 컴포넌트 18, 이벤트 6, 핸들러 8)
- 런타임: instance `1`, body `677`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD030100.py` / STEP **4** / 기대 URI **5** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 다운로드 | click | `onBtnDwnd1Click` | 162 | Submit.send |
| 이벤트 | 바로보기 | click | `onBtnDwnd2Click` | 177 | - |
| 이벤트 | 다운로드 | click | `onOutput1Click` | 887 | - |
| 이벤트 | 바로보기 | click | `onNxt2Click` | 925 | - |
| 이벤트 | 목록 | click | `onBtnSerach1Click2` | 964 | menu:OPAD030000 |
| 이벤트 | app | init | `onBodyInit` | 984 | - |
| 전환 | `openPageId` | - | target `-` | 238 | OPAD030000 {} |
| Submission | `subSearch` | - | - | 641 | send@[72] |
| Submission | `subSampleFileList` | - | - | 650 | send@[] |
| Submission | `subFileDownload` | - | - | 658 | send@[255] |
| Submission | `subSaveInqCnt` | - | - | 667 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 39 | e | [] | [] | [] |
| `doSearch` | 53 | page | ['subSearch'] | [] | [] |
| `insertProc` | 102 | index | [] | [] | [] |
| `onBtnSerach1Click2` | 234 | e | [] | [] | ['OPAD030000'] |
| `onBtnDwnd1Click` | 242 | e | ['subFileDownload'] | [] | [] |
| `onBtnDwnd2Click` | 264 | e | [] | [] | [] |
| `onOutput1Click` | 273 | e | [] | [] | [] |
| `onNxt2Click` | 288 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/opd/selectRfrmDtl.ndo` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectRfrmDtl.ndo.json` | dmParam 경계6/악성6 | app_op_opd_RfrmDtl.clx.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/sampleFIleDownloadList.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveRfrmInqCnt.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |
| `testcases/dataset/selectRfrmDtl.ndo.json` | delYn=　; fdecDd=　; chgDt=　 | chgpId,regpId | `cases/req_selectRfrmDtl.ndo.csv` / `cases/res_selectRfrmDtl.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 자료실 > 자료실 상세 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/RfrmDtl |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectRfrmDtl.ndo | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAD040000` — 고객지원 > 교육서비스

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/EduApl`, 소스 `app_op_opd_EduApl.clx.js` (33177B, 컴포넌트 6, 이벤트 28, 핸들러 8)
- 런타임: instance `1`, body `667`, clx히트 `True`, 로드 `MsupInfmList.clx.js, MeqipInfmList.clx.js, EduApl.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD040000.py` / STEP **13** / 기대 URI **8** / 상세화면 **3** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=6`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnSrchClick` | 714 | - |
| 이벤트 | userDefinedControl_2 | udcClick | `onUdcEduAplDtlUdcClick` | 835 | - |
| 이벤트 | userDefinedControl_2 | udcBtnSelectClick | `onUdcBtnSelectClick` | 838 | - |
| 이벤트 | userDefinedControl_2 | udcBtnWrtClick | `onUdcBtnWrtClick` | 841 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_2 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 844 | - |
| 이벤트 | userDefinedControl_3 | udcClick | `onUdcEduAplDtlUdcClick` | 852 | - |
| 이벤트 | userDefinedControl_3 | udcBtnSelectClick | `onUdcBtnSelectClick` | 855 | - |
| 이벤트 | userDefinedControl_3 | udcBtnWrtClick | `onUdcBtnWrtClick` | 858 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_3 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 861 | - |
| 이벤트 | userDefinedControl_4 | udcClick | `onUdcEduAplDtlUdcClick` | 869 | - |
| 이벤트 | userDefinedControl_4 | udcBtnSelectClick | `onUdcBtnSelectClick` | 872 | - |
| 이벤트 | userDefinedControl_4 | udcBtnWrtClick | `onUdcBtnWrtClick` | 875 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_4 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 878 | - |
| 이벤트 | userDefinedControl_5 | udcClick | `onUdcEduAplDtlUdcClick` | 886 | - |
| 이벤트 | userDefinedControl_5 | udcBtnSelectClick | `onUdcBtnSelectClick` | 889 | - |
| 이벤트 | userDefinedControl_5 | udcBtnWrtClick | `onUdcBtnWrtClick` | 892 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_5 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 895 | - |
| 이벤트 | userDefinedControl_6 | udcClick | `onUdcEduAplDtlUdcClick` | 903 | - |
| 이벤트 | userDefinedControl_6 | udcBtnSelectClick | `onUdcBtnSelectClick` | 906 | - |
| 이벤트 | userDefinedControl_6 | udcBtnWrtClick | `onUdcBtnWrtClick` | 909 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_6 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 912 | - |
| 이벤트 | userDefinedControl_7 | udcClick | `onUdcEduAplDtlUdcClick` | 920 | - |
| 이벤트 | userDefinedControl_7 | udcBtnSelectClick | `onUdcBtnSelectClick` | 923 | - |
| 이벤트 | userDefinedControl_7 | udcBtnWrtClick | `onUdcBtnWrtClick` | 926 | Submit.send; menu:OPAD040300 |
| 이벤트 | userDefinedControl_7 | udcTitleClick | `onUdcEduAplDtlUdcClick` | 929 | - |
| 이벤트 | userDefinedControl_8 | pagechange | `onUdcPagePagechange` | 945 | - |
| 이벤트 | app | load | `onBodyLoad` | 965 | - |
| 이벤트 | app | init | `onBodyInit` | 968 | - |
| 전환 | `openPageId` | - | target `OPAD040300` | 256 | "OPAD040300", initValue |
| Submission | `subSearch` | - | - | 580 | send@[93] |
| Submission | `subApplyInfo` | - | - | 590 | send@[224] |
| Submission | `subSelectAplPsblNop` | - | - | 599 | send@[234] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 49 | e | [] | [] | [] |
| `onBodyLoad` | 52 | e | [] | [] | [] |
| `fnSearch` | 76 |  | ['subSearch'] | [] | [] |
| `onBtnSrchClick` | 151 | e | [] | [] | [] |
| `onUdcPagePagechange` | 163 | e | [] | [] | [] |
| `onUdcEduAplDtlUdcClick` | 170 | e | [] | [] | [] |
| `onUdcBtnWrtClick` | 215 | e | ['subApplyInfo', 'subSelectAplPsblNop'] | [] | ['OPAD040300'] |
| `onUdcBtnSelectClick` | 269 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opd/selectEduAplDtl.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectEduAplDtl.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opd/selectEduAplDtlDesc.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectEduAplDtlDesc.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opd/selectEduAplList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectEduAplList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveEduAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectAplPsblNop.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectEduAplInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/updateEduApl.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectEduAplDtl.do.json` | 페이지행수=6 | aplpEmailAddr,aplpTelno,chgpId,regpId,telno | `cases/req_selectEduAplDtl.do.csv` / `cases/res_selectEduAplDtl.do.csv` |
| `testcases/dataset/selectEduAplDtlDesc.do.json` | 페이지=1; recordsTotal=0; 페이지행수=10; pageIndexerCount=10 | ansPwd,aplpEmailAddr,aplpTelno,chgpId,regpId | `cases/req_selectEduAplDtlDesc.do.csv` / `cases/res_selectEduAplDtlDesc.do.csv` |
| `testcases/dataset/selectEduAplList.do.json` | 페이지=1; recordsTotal=0; 페이지행수=6; pageIndexerCount=6; comboType=all | aplpEmailAddr,aplpTelno,chgpId,regpId,telno | `cases/req_selectEduAplList.do.csv` / `cases/res_selectEduAplList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD040300` | 고객지원 > 교육서비스 > 교육신청 | `app/op/opd/EduAplWrt` | `direct_ui` | - | ok_direct |
| `OPAD040100` | 고객지원 > 교육서비스 > 교육서비스 상세 | `app/op/opd/EduAplDtl` | `direct_ui` | selectEduAplDtl.do | ok_direct |
| `OPAD040200` | 고객지원 > 교육서비스 > 교육서비스 신청 상세내역 | `app/op/opd/EduAplDtlDesc` | `direct_ui` | selectEduAplDtlDesc.do | ok_direct |

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 교육서비스 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/EduApl |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectEduAplDtl.do,selectEduAplDtlDesc.do,selectEduAplList.do | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAD040300 |  |  |
| 6 | `expect_screen` | app/op/opd/EduAplWrt |  |  |
| 7 | `detail` | OPAD040100 |  |  |
| 8 | `expect_screen` | app/op/opd/EduAplDtl |  |  |
| 9 | `expect_any` |  | selectEduAplDtl.do | 교육서비스 상세 상세 URI |
| 10 | `detail` | OPAD040200 |  |  |
| 11 | `expect_screen` | app/op/opd/EduAplDtlDesc |  |  |
| 12 | `expect_any` |  | selectEduAplDtlDesc.do | 교육서비스 신청 상세내역 상세 URI |
| 13 | `popup` | 조회 |  |  |

</details>

### `OPAD040100` — 고객지원 > 교육서비스 > 교육서비스 상세

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/EduAplDtl`, 소스 `app_op_opd_EduAplDtl.clx.js` (46036B, 컴포넌트 30, 이벤트 11, 핸들러 11)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `MeqipInfmList.clx.js, EduApl.clx.js, EduAplDtl.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD040100.py` / STEP **12** / 기대 URI **3** / 상세화면 **3** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=6`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 다운로드 | click | `onBtnDwnd1Click` | 251 | Submit.send |
| 이벤트 | 바로보기 | click | `onBtnDwnd2Click` | 265 | - |
| 이벤트 | 다운로드 | click | `onBtnDwnd1Click` | 1464 | Submit.send |
| 이벤트 | 바로보기 | click | `onBtnDwnd2Click` | 1478 | - |
| 이벤트 | button_3 | click | `onBtnSerach1Click2` | 1535 | menu:OPAD040000 |
| 이벤트 | 신청하기 | click | `onBtnPopViewClick` | 1546 | Submit.send; menu:OPAD040300 |
| 이벤트 | 상세내역 | click | `onBtnSerach1Click3` | 1557 | menu:OPAD040200 |
| 이벤트 | 교육만족도 조사 | click | `onBtnEduClick` | 1569 | - |
| 이벤트 | QR생성 | click | `onBtnQrCodeClick` | 1581 | - |
| 이벤트 | app | init | `onBodyInit` | 1601 | - |
| 이벤트 | app | load | `onBodyLoad` | 1604 | - |
| 전환 | `openPageId` | - | target `OPAD040000` | 107 | "OPAD040000", {"searchCond1" : vSearchCond1 																						, "searchCond2" : vSearc |
| 전환 | `openPageId` | - | target `OPAD040200` | 136 | "OPAD040200", {"eduMgmtNo":eduMgmtNo 																						, "searchCond1" : vSearchCond1  |
| 전환 | `openPageId` | - | target `OPAD040300` | 166 | "OPAD040300", {"eduMgmtNo":eduMgmtNo 																									, "searchCond1" : vSearchCon |
| Submission | `subSearch` | - | - | 1070 | send@[89] |
| Submission | `subFileDownload` | - | - | 1079 | send@[332] |
| Submission | `subApplyInfo` | - | - | 1087 | send@[153] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 60 | e | [] | [] | [] |
| `doSearch` | 71 |  | ['subSearch'] | [] | [] |
| `onBtnSerach1Click2` | 104 | e | [] | [] | ['OPAD040000'] |
| `onBtnSerach1Click3` | 121 | e | [] | [] | ['OPAD040200'] |
| `onBtnPopViewClick` | 148 | e | ['subApplyInfo'] | [] | ['OPAD040300'] |
| `insertProc` | 184 | index | [] | [] | [] |
| `onBtnDwnd1Click` | 319 | e | ['subFileDownload'] | [] | [] |
| `onBtnDwnd2Click` | 342 | e | [] | [] | [] |
| `onBodyLoad` | 351 | e | [] | [] | [] |
| `onBtnEduClick` | 362 | e | [] | [] | [] |
| `onBtnQrCodeClick` | 391 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opd/selectEduAplDtl.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectEduAplDtl.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectEduAplInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectEduAplDtl.do.json` | 페이지행수=6 | aplpEmailAddr,aplpTelno,chgpId,regpId,telno | `cases/req_selectEduAplDtl.do.csv` / `cases/res_selectEduAplDtl.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD040000` | 고객지원 > 교육서비스 | `app/op/opd/EduApl` | `direct_ui` | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | ok_direct |
| `OPAD040200` | 고객지원 > 교육서비스 > 교육서비스 신청 상세내역 | `app/op/opd/EduAplDtlDesc` | `direct_ui` | selectEduAplDtlDesc.do | ok_direct |
| `OPAD040300` | 고객지원 > 교육서비스 > 교육신청 | `app/op/opd/EduAplWrt` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 교육서비스 > 교육서비스 상세 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/EduAplDtl |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectEduAplDtl.do | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAD040000 |  |  |
| 6 | `expect_screen` | app/op/opd/EduApl |  |  |
| 7 | `expect_any` |  | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | 교육서비스 상세 URI |
| 8 | `detail` | OPAD040200 |  |  |
| 9 | `expect_screen` | app/op/opd/EduAplDtlDesc |  |  |
| 10 | `expect_any` |  | selectEduAplDtlDesc.do | 교육서비스 신청 상세내역 상세 URI |
| 11 | `detail` | OPAD040300 |  |  |
| 12 | `expect_screen` | app/op/opd/EduAplWrt |  |  |

</details>

### `OPAD040200` — 고객지원 > 교육서비스 > 교육서비스 신청 상세내역

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/EduAplDtlDesc`, 소스 `app_op_opd_EduAplDtlDesc.clx.js` (28073B, 컴포넌트 15, 이벤트 5, 핸들러 8)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `EduApl.clx.js, EduAplDtl.clx.js, EduAplDtlDesc.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD040200.py` / STEP **7** / 기대 URI **2** / 상세화면 **1** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 목록 | click | `onBtnSerach1Click2` | 632 | menu:OPAD040000 |
| 이벤트 | 조회 | click | `onBtnSearch` | 643 | - |
| 이벤트 | 목록 | click | `onBtnSerach1Click2` | 711 | menu:OPAD040000 |
| 이벤트 | 조회 | click | `onBtnSearch` | 722 | - |
| 이벤트 | app | init | `onBodyInit` | 953 | - |
| 전환 | `openPageId` | - | target `OPAD040000` | 84 | "OPAD040000", {"searchCond1" : vSearchCond1 																						, "searchCond2" : vSearc |
| Submission | `subSearch` | - | - | 493 | send@[66] |
| Submission | `subUpdate` | - | - | 502 | send@[148] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 43 | e | [] | [] | [] |
| `fnSearch` | 62 |  | ['subSearch'] | [] | [] |
| `onBtnSerach1Click2` | 82 | e | [] | [] | ['OPAD040000'] |
| `onBtnSearch` | 98 | e | [] | [] | [] |
| `onGrd1CellClick` | 117 | e | [] | [] | [] |
| `fnSave` | 147 |  | ['subUpdate'] | [] | [] |
| `fnValidationChk` | 161 |  | [] | [] | [] |
| `fncBizrnoChk` | 198 | value | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opd/selectEduAplDtlDesc.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectEduAplDtlDesc.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opd/updateEduApl.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectEduAplDtlDesc.do.json` | 페이지=1; recordsTotal=0; 페이지행수=10; pageIndexerCount=10 | ansPwd,aplpEmailAddr,aplpTelno,chgpId,regpId | `cases/req_selectEduAplDtlDesc.do.csv` / `cases/res_selectEduAplDtlDesc.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD040000` | 고객지원 > 교육서비스 | `app/op/opd/EduApl` | `direct_ui` | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 교육서비스 > 교육서비스 신청 상세내역 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/EduAplDtlDesc |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectEduAplDtlDesc.do | 조회/화면로드 후 메뉴 전용 URI |
| 5 | `detail` | OPAD040000 |  |  |
| 6 | `expect_screen` | app/op/opd/EduApl |  |  |
| 7 | `expect_any` |  | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | 교육서비스 상세 URI |

</details>

### `OPAD040300` — 고객지원 > 교육서비스 > 교육신청

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/EduAplWrt`, 소스 `app_op_opd_EduAplWrt.clx.js` (43912B, 컴포넌트 40, 이벤트 3, 핸들러 7)
- 런타임: instance `1`, body `1273`, clx히트 `True`, 로드 `EduAplDtl.clx.js, EduAplDtlDesc.clx.js, EduAplWrt.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD040300.py` / STEP **6** / 기대 URI **2** / 상세화면 **1** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 목록 | click | `onButtonClick` | 1217 | menu:OPAD040000 |
| 이벤트 | 신청 | click | `onBtnSaveClick` | 1228 | Submit.send |
| 이벤트 | app | load | `onBodyLoad` | 1256 | - |
| 전환 | `openPageId` | - | target `OPAD040000` | 97 | "OPAD040000", {"searchCond1" : vSearchCond1 																						, "searchCond2" : vSearc |
| 전환 | `openPageId` | - | target `OPAD040000` | 117 | "OPAD040000", {"searchCond1" : vSearchCond1 																							, "searchCond2" : vSear |
| Submission | `subSave` | - | - | 396 | send@[114] |
| Submission | `subSelectAplPsblNop` | - | - | 404 | send@[53] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 23 | e | [] | [] | [] |
| `onBtnSaveClick` | 47 | e | ['subSelectAplPsblNop'] | [] | [] |
| `onButtonClick` | 92 | e | [] | [] | ['OPAD040000'] |
| `fnSave` | 108 |  | ['subSave'] | [] | ['OPAD040000'] |
| `fnValidationChk` | 131 |  | [] | [] | [] |
| `fncBizrnoChk` | 207 | value | [] | [] | [] |
| `indvChkClick` | 229 | val | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opd/saveEduAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/selectAplPsblNop.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD040000` | 고객지원 > 교육서비스 | `app/op/opd/EduApl` | `direct_ui` | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 교육서비스 > 교육신청 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/EduAplWrt |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |
| 4 | `detail` | OPAD040000 |  |  |
| 5 | `expect_screen` | app/op/opd/EduApl |  |  |
| 6 | `expect_any` |  | selectEduAplList.do,selectEduAplDtl.do,selectEduAplDtlDesc.do | 교육서비스 상세 URI |

</details>

### `OPAD050000` — 고객지원 > 정보이관 및 비공개(폐업) 신청

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/InfmTrfrAplList`, 소스 `app_op_opd_InfmTrfrAplList.clx.js` (38107B, 컴포넌트 30, 이벤트 5, 핸들러 8)
- 런타임: instance `1`, body `1021`, clx히트 `True`, 로드 `EduAplDtlDesc.clx.js, EduAplWrt.clx.js, InfmTrfrAplList.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD050000.py` / STEP **8** / 기대 URI **6** / 상세화면 **1** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_2 | click | `onBtnRegClick` | 661 | menu:OPAD050200 |
| 이벤트 | button_3 | click | `onBtnAplClick` | 855 | menu:OPAD050200 |
| 이벤트 | 상세보기 | click | `onBtnApprOggBrief` | 909 | - |
| 이벤트 | button_5 | click | `onBtnGoToList` | 1221 | - |
| 이벤트 | app | load | `onBodyLoad` | 1248 | - |
| 전환 | `openPageId` | - | target `OPAD050200` | 75 | "OPAD050200", initValue |
| 전환 | `openPageId` | - | target `OPAD050200` | 90 | "OPAD050200", initValue |
| Submission | `subSearch` | - | - | 385 | send@[32] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 21 | e | [] | [] | [] |
| `doSearch` | 31 |  | ['subSearch'] | [] | [] |
| `fnPageInit` | 54 |  | [] | [] | [] |
| `onBtnAplClick` | 65 | e | [] | [] | ['OPAD050200'] |
| `onBtnRegClick` | 81 | e | [] | [] | ['OPAD050200'] |
| `onBtnApprOggBrief` | 96 | e | [] | [] | [] |
| `fnOpenPopup` | 108 | rmkTxt | [] | [] | [] |
| `onBtnGoToList` | 143 |  | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opd/selectInfmTrfrAplWrtList.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectInfmTrfrAplWrtList.do.json` | dmParam 경계4/악성6 | - |
| `file/insertFileInfoSample.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrCloRptWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opg/chkMbIdSbscYn.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectInfmTrfrAplWrtList.do.json` | pageIndexerCount=10; recordsTotal=0; 페이지행수=10; 페이지=1 | - | `cases/req_selectInfmTrfrAplWrtList.do.csv` / `cases/res_selectInfmTrfrAplWrtList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAD050200` | 고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청 | `app/op/opd/InfmTrfrAplWrt` | `direct_ui` | selectComCodeList.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 정보이관 및 비공개(폐업) 신청 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/InfmTrfrAplList |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |
| 4 | `click` | 조회 |  |  |
| 5 | `expect_any` |  | selectInfmTrfrAplWrtList.do | 조회/화면로드 후 메뉴 전용 URI |
| 6 | `detail` | OPAD050200 |  |  |
| 7 | `expect_screen` | app/op/opd/InfmTrfrAplWrt |  |  |
| 8 | `expect_any` |  | selectComCodeList.do | 정보이관 및 비공개 신청 상세 URI |

</details>

### `OPAD050200` — 고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opd/InfmTrfrAplWrt`, 소스 `app_op_opd_InfmTrfrAplWrt.clx.js` (94873B, 컴포넌트 56, 이벤트 10, 핸들러 22)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `EduAplWrt.clx.js, InfmTrfrAplList.clx.js, InfmTrfrAplWrt.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD050200.py` / STEP **3** / 기대 URI **5** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 주소검색 | click | `onAddrSrchClick` | 1614 | - |
| 이벤트 | button_2 | click | `onBtnToggleClick` | 2113 | - |
| 이벤트 | textArea_1 | input | `onInput_txt` | 2183 | - |
| 이벤트 | button_3 | click | `onBtnToggleClick` | 2271 | - |
| 이벤트 | userDefinedControl_8 | uploadComplete | `onRaonkUploadUploadComplete` | 2334 | - |
| 이벤트 | 취소 | click | `onBtnCancelClick` | 2500 | menu:OPAD050300 |
| 이벤트 | 신청하기 | click | `onBtnSaveClick` | 2513 | Submit.send |
| 이벤트 | button_6 | click | `onBtnMoveList` | 2542 | menu:OPAD050300 |
| 이벤트 | app | load | `onBodyLoad` | 2562 | - |
| 이벤트 | app | init | `onBodyInit` | 2565 | - |
| 전환 | `openPageId` | - | target `-` | 295 | OPAD050300 {} |
| 전환 | `openPageId` | - | target `-` | 727 | OPAD050300 {} |
| 전환 | `openPageId` | - | target `-` | 730 | OPAD050300 {} |
| 전환 | `openPageId` | - | target `-` | 744 | OPAD050300 {} |
| 전환 | `openPageId` | - | target `-` | 747 | OPAD050300 {} |
| 전환 | `openPageId` | - | target `OPAD050300` | 767 | "OPAD050300", initValue |
| Submission | `subComCodeList` | - | - | 993 | send@[163] |
| Submission | `subFileUpload` | - | - | 1001 | send@[] |
| Submission | `subFileDownload` | - | - | 1008 | send@[] |
| Submission | `subSave` | - | - | 1016 | send@[723] |
| Submission | `subMbIdSearch` | - | - | 1024 | send@[236] |
| Submission | `subCloseSave` | - | - | 1034 | send@[740] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 30 | e | [] | [] | [] |
| `onBodyLoad` | 41 | e | [] | [] | [] |
| `fnCommCdRadio` | 118 | vDataSetNm, vCommCdTy, vRadioNm, vFilterStr | [] | [] | [] |
| `fnCommCdCombox` | 130 | vDataSetNm, vCommCdTy, vComboxNm, vFilterStr | [] | [] | [] |
| `fnCodeProc` | 142 | dataSetNm,comboBxNm | [] | [] | [] |
| `fnCommCdSerach` | 152 |  | ['subComCodeList'] | [] | [] |
| `onBtnSaveClick` | 187 | e | ['subMbIdSearch'] | [] | [] |
| `onBtnCancelClick` | 292 | e | [] | [] | ['OPAD050300'] |
| `fnValidate` | 306 |  | [] | [] | [] |
| `selectionChange_email` | 496 | e | [] | [] | [] |
| `selectionChange_email2` | 511 | e | [] | [] | [] |
| `selectionChange_pdiRltn` | 526 | e | [] | [] | [] |
| `onAddrSrchClick` | 535 | e | [] | [] | [] |
| `onRdbInfmTrfrTpCdSelectionChange` | 562 | e | [] | [] | [] |
| `onRdbSalTpCdSelectionChange` | 608 | e | [] | [] | [] |
| `onBtnToggleClick` | 621 | e | [] | [] | [] |
| `onRaonkUploadAfterAddFile` | 662 | e | [] | [] | [] |
| `onRaonkUploadUploadComplete` | 681 | e | [] | [] | [] |
| `fnSave` | 722 |  | ['subSave'] | [] | ['OPAD050300', 'OPAD050300'] |
| `fnShutdownSave` | 739 |  | ['subCloseSave'] | [] | ['OPAD050300', 'OPAD050300'] |
| `onInput_txt` | 759 | e | [] | [] | [] |
| `onBtnMoveList` | 763 | e | [] | [] | ['OPAD050300'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `file/insertFileInfoSample.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/com/downloadFile.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrAplWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opd/saveInfmTrfrCloRptWrt.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opg/chkMbIdSbscYn.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opd/InfmTrfrAplWrt |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |

</details>

### `OPAD060000` — 고객지원 > 웹 접근성 안내

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/WebAccessibilityM01`, 소스 `app_op_ope_WebAccessibilityM01.clx.js` (10932B, 컴포넌트 15, 이벤트 0, 핸들러 0)
- 런타임: instance `1`, body `985`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAD060000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 고객지원 > 웹 접근성 안내 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/WebAccessibilityM01 |  |  |

</details>

### `OPAE000000` — 제도소개

- 수준 L1 / 로그인 **불요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `public`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `0`, body `985`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE000000.py` / STEP **11** / 기대 URI **2** / 상세화면 **5** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 54 | 본문,하위화면 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAE010000` | 제도소개 > 제도개요 | `app/op/ope/SysSmryInfoM01` | `openPageId` | - | ok |
| `OPAE020000` | 제도소개 > 조직현황 | `app/op/ope/TxtrPrsntInfoM01` | `openPageId` | - | ok |
| `OPAE030000` | 제도소개 > 조직연혁 | `app/op/ope/TxtrHistoryInfoM01` | `openPageId` | - | ok |
| `OPAE040000` | 제도소개 > 관련법령 | `app/op/ope/RelLawInfoM01` | `openPageId` | - | ok |
| `OPAE050000` | 제도소개 > 오시는길 | `app/op/ope/MapLoadM01` | `openPageId` | - | ok |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 화면 진입 / 소스 이벤트 기반 |
| 2 | `detail` | OPAE010000 |  |  |
| 3 | `expect_screen` | app/op/ope/SysSmryInfoM01 |  |  |
| 4 | `detail` | OPAE020000 |  |  |
| 5 | `expect_screen` | app/op/ope/TxtrPrsntInfoM01 |  |  |
| 6 | `detail` | OPAE030000 |  |  |
| 7 | `expect_screen` | app/op/ope/TxtrHistoryInfoM01 |  |  |
| 8 | `detail` | OPAE040000 |  |  |
| 9 | `expect_screen` | app/op/ope/RelLawInfoM01 |  |  |
| 10 | `detail` | OPAE050000 |  |  |
| 11 | `expect_screen` | app/op/ope/MapLoadM01 |  |  |

</details>

### `OPAE010000` — 제도소개 > 제도개요

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/SysSmryInfoM01`, 소스 `app_op_ope_SysSmryInfoM01.clx.js` (18666B, 컴포넌트 33, 이벤트 0, 핸들러 0)
- 런타임: instance `1`, body `1008`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE010000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 > 제도개요 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/SysSmryInfoM01 |  |  |

</details>

### `OPAE020000` — 제도소개 > 조직현황

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/TxtrPrsntInfoM01`, 소스 `app_op_ope_TxtrPrsntInfoM01.clx.js` (12737B, 컴포넌트 22, 이벤트 0, 핸들러 0)
- 런타임: instance `1`, body `887`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE020000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 > 조직현황 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/TxtrPrsntInfoM01 |  |  |

</details>

### `OPAE030000` — 제도소개 > 조직연혁

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/TxtrHistoryInfoM01`, 소스 `app_op_ope_TxtrHistoryInfoM01.clx.js` (26776B, 컴포넌트 65, 이벤트 0, 핸들러 0)
- 런타임: instance `1`, body `1310`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE030000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 > 조직연혁 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/TxtrHistoryInfoM01 |  |  |

</details>

### `OPAE040000` — 제도소개 > 관련법령

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/RelLawInfoM01`, 소스 `app_op_ope_RelLawInfoM01.clx.js` (34877B, 컴포넌트 57, 이벤트 9, 핸들러 1)
- 런타임: instance `1`, body `1539`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE040000.py` / STEP **2** / 기대 URI **2** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onButtonClick` | 242 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_2 | click | `onButtonClick` | 330 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_3 | click | `onButtonClick` | 473 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_4 | click | `onButtonClick` | 589 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_5 | click | `onButtonClick` | 627 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_6 | click | `onButtonClick` | 796 | menu:OPAD030100,OPAD030100 |
| 이벤트 | 지출보고서 공개 및 실태조사 운영 지침 | click | `onButtonClick` | 846 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_7 | click | `onButtonClick` | 864 | menu:OPAD030100,OPAD030100 |
| 이벤트 | button_8 | click | `onButtonClick` | 878 | menu:OPAD030100,OPAD030100 |
| 전환 | `openPageId` | - | target `-` | 97 | OPAD030100 {'bltNo': '81'} {'isRegisted': False} |
| 전환 | `openPageId` | - | target `-` | 100 | OPAD030100 {'bltNo': '82'} {'isRegisted': False} |
| Submission | `subFileDownload` | - | - | 165 | send@[] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onButtonClick` | 21 | e | [] | [] | ['OPAD030100', 'OPAD030100'] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |
| `/kops/main/op/com/downloadFile.ndo` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 > 관련법령 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/RelLawInfoM01 |  |  |

</details>

### `OPAE050000` — 제도소개 > 오시는길

- 수준 L2 / 로그인 **불요** / 실행 `ok` / 진입 `openPageId` / 접근 `public`
- 화면: `app/op/ope/MapLoadM01`, 소스 `app_op_ope_MapLoadM01.clx.js` (4897B, 컴포넌트 5, 이벤트 0, 핸들러 0)
- 런타임: instance `1`, body `713`, clx히트 `False`, 로드 `LawEcnmyPftOffrrDtlList.clx.js, LawEcnmyPftAcpDtlList.clx.js, .clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAE050000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ✅ | 200 / 200 | 9 | 본문 | screen/op | `testcases/dataset/selectBizInfoSubTitle.ndo.json` | dmParam 경계3/악성6 | cpr-lib_udc.js:doSearch |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectBizInfoSubTitle.ndo.json` | - | - | `cases/req_selectBizInfoSubTitle.ndo.csv` / `cases/res_selectBizInfoSubTitle.ndo.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 제도소개 > 오시는길 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/ope/MapLoadM01 |  |  |

</details>

### `OPAF000000` — 마이페이지

- 수준 L1 / 로그인 **필요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `0`, body `562`, clx히트 `False`, 로드 `EduAplWrt.clx.js, InfmTrfrAplList.clx.js, InfmTrfrAplWrt.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF000000.py` / STEP **28** / 기대 URI **10** / 상세화면 **11** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectAddDataDmndPrsntSmit.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | screen/op | `testcases/dataset/selectAddDataDmndPrsntSmit.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | login_notice/sc | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/opf/selectMbInfmPwd.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMbInfmPwd.do.json` | dmParam 경계2/악성6 | - |
| `/kops/main/op/opf/selectMbInfo.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMbInfo.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opf/selectMyPermCertList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | login_notice/sc | `testcases/dataset/selectMyPermCertList.do.json` |  경계1/악성6 | - |
| `/kops/main/op/opf/selectMyPubOggBriefList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectMyPubOggBriefList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/opf/selectYoyangOggBriefList.do` | ✅ | 410 / 200,410 | 1 | 하위화면 | popup_button/cl | `testcases/dataset/selectYoyangOggBriefList.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opf/saveMbInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opf/updateMbPwd.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opf/updateUsrOut.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAddDataDmndPrsntSmit.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectAddDataDmndPrsntSmit.do.csv` / `cases/res_selectAddDataDmndPrsntSmit.do.csv` |
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |
| `testcases/dataset/selectMbInfmPwd.do.json` | - | - | `cases/req_selectMbInfmPwd.do.csv` / `cases/res_selectMbInfmPwd.do.csv` |
| `testcases/dataset/selectMbInfo.do.json` | - | extrEltrEmailAddr,usrHtelAll,usrHtelTno,usrHtelTsno,usrHtelTtno | `cases/req_selectMbInfo.do.csv` / `cases/res_selectMbInfo.do.csv` |
| `testcases/dataset/selectMyPermCertList.do.json` | - | - | `cases/req_selectMyPermCertList.do.csv` / `cases/res_selectMyPermCertList.do.csv` |
| `testcases/dataset/selectMyPubOggBriefList.do.json` | smitYr=2025 | - | `cases/req_selectMyPubOggBriefList.do.csv` / `cases/res_selectMyPubOggBriefList.do.csv` |
| `testcases/dataset/selectYoyangOggBriefList.do.json` | smitYr=2025; 영업구분=S; fomTyCd=10; recordsTotal=0; 페이지행수=10; 페이지=1 | - | `cases/req_selectYoyangOggBriefList.do.csv` / `cases/res_selectYoyangOggBriefList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAF010000` | 마이페이지 > 나의 지출보고서 현황 | `app/op/opf/MyOggBriefPrsnt` | `direct_ui` | selectMyPermCertList.do,selectMyPubOggBriefList.do | ok_direct |
| `OPAF020000` | 마이페이지 > 추가 자료 요구 현황 및 제출 | `app/op/opf/AddDataDmndPrsntSmit` | `direct_ui` | selectAddDataDmndPrsntSmit.do | ok_direct |
| `OPAF030000` | 마이페이지 > 회원정보관리 | `-` | `direct_ui` | - | ok_group |
| `OPAF031000` | 마이페이지 > 회원정보관리 > 회원정보수정 | `app/op/opf/MbInfmUpd` | `direct_ui` | selectMbInfmPwd.do | ok_direct |
| `OPAF032000` | 마이페이지 > 회원정보관리 > 비밀번호 변경 | `app/op/opf/MbInfmUpdInfmCfr` | `direct_ui` | selectMbInfmPwd.do | ok_loaded |
| `OPAF033000` | 마이페이지 > 회원정보관리 > 회원탈퇴 | `app/op/opf/MbInfmOt` | `direct_ui` | selectMbInfmPwd.do | ok_direct |
| `OPAF034000` | 마이페이지 > 회원정보관리 > 회원탈퇴 완료 | `app/op/opf/MbInfmOtEnd` | `direct_ui` | - | ok_direct |
| `OPAF035000` | 마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO) | `app/op/opf/MbInfmUpdFirmCso` | `direct_ui` | selectMbInfo.do | ok_direct |
| `OPAF036000` | 마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO) | `app/op/opf/MbInfmUpdIndvCso` | `direct_ui` | selectMbInfo.do | ok_loaded |
| `OPAF037000` | 마이페이지 > 회원정보관리 > CSO회원비밀번호변경 | `app/op/opf/MbInfmUpdPwd` | `direct_ui` | - | ok_direct |
| `OPAF070000` | 마이페이지 > 요양기관 수수내역 조회 | `app/op/opf/YoyangOggBriefList` | `direct_ui` | selectYoyangOggBriefList.do | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectAddDataDmndPrsntSmit.do,selectComCodeList.do,selectMbInfmPwd.do | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAF010000 |  |  |
| 4 | `expect_screen` | app/op/opf/MyOggBriefPrsnt |  |  |
| 5 | `expect_any` |  | selectMyPermCertList.do,selectMyPubOggBriefList.do | 나의 지출보고서 현황 상세 URI |
| 6 | `detail` | OPAF020000 |  |  |
| 7 | `expect_screen` | app/op/opf/AddDataDmndPrsntSmit |  |  |
| 8 | `expect_any` |  | selectAddDataDmndPrsntSmit.do | 추가 자료 요구 현황 및 제출 상세 URI |
| 9 | `detail` | OPAF030000 |  |  |
| 10 | `detail` | OPAF031000 |  |  |
| 11 | `expect_screen` | app/op/opf/MbInfmUpd |  |  |
| 12 | `expect_any` |  | selectMbInfmPwd.do | 회원정보수정 상세 URI |
| 13 | `detail` | OPAF032000 |  |  |
| 14 | `expect_screen` | app/op/opf/MbInfmUpdInfmCfr |  |  |
| 15 | `expect_any` |  | selectMbInfmPwd.do | 비밀번호 변경 상세 URI |
| 16 | `detail` | OPAF033000 |  |  |
| 17 | `expect_screen` | app/op/opf/MbInfmOt |  |  |
| 18 | `expect_any` |  | selectMbInfmPwd.do | 회원탈퇴 상세 URI |
| 19 | `detail` | OPAF034000 |  |  |
| 20 | `expect_screen` | app/op/opf/MbInfmOtEnd |  |  |
| 21 | `detail` | OPAF035000 |  |  |
| 22 | `expect_screen` | app/op/opf/MbInfmUpdFirmCso |  |  |
| 23 | `expect_any` |  | selectMbInfo.do | 회원정보 수정(사업자CSO) 상세 URI |
| 24 | `detail` | OPAF036000 |  |  |
| 25 | `expect_screen` | app/op/opf/MbInfmUpdIndvCso |  |  |
| 26 | `expect_any` |  | selectMbInfo.do | 회원정보 수정(개인CSO) 상세 URI |
| 27 | `detail` | OPAF037000 |  |  |
| 28 | `expect_screen` | app/op/opf/MbInfmUpdPwd |  |  |

</details>

### `OPAF010000` — 마이페이지 > 나의 지출보고서 현황

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MyOggBriefPrsnt`, 소스 `app_op_opf_MyOggBriefPrsnt.clx.js` (33627B, 컴포넌트 37, 이벤트 4, 핸들러 6)
- 런타임: instance `1`, body `861`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, MyOggBriefPrsnt.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF010000.py` / STEP **7** / 기대 URI **3** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onButtonClick` | 185 | - |
| 이벤트 | button_2 | click | `onButtonClick2` | 199 | - |
| 이벤트 | app | load | `onBodyLoad` | 934 | Submit.send |
| 이벤트 | app | init | `onBodyInit` | 937 | - |
| Submission | `subPermSch` | - | - | 132 | send@[54] |
| Submission | `subPubSch` | - | - | 138 | send@[74] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onButtonClick` | 25 | e | [] | [] | [] |
| `onButtonClick2` | 37 | e | [] | [] | [] |
| `onBodyLoad` | 51 | e | ['subPermSch'] | [] | [] |
| `onBodyInit` | 68 | e | [] | [] | [] |
| `fnSearchMyPubList` | 73 |  | ['subPubSch'] | [] | [] |
| `onCmbSmitYrSelectionChange` | 87 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/com/selectComCodeList.do` | ✅ | 410 / 200,410 | 1 | 본문 | login_notice/sc | `testcases/dataset/selectComCodeList.do.json` | dmParam 경계1/악성6 | - |
| `/kops/main/op/opf/selectMyPermCertList.do` | ✅ | 410 / 200,410 | 1 | 본문 | login_notice/sc | `testcases/dataset/selectMyPermCertList.do.json` |  경계1/악성6 | - |
| `/kops/main/op/opf/selectMyPubOggBriefList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectMyPubOggBriefList.do.json` | dmParam 경계1/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectComCodeList.do.json` | 공통코드셋=SAL_TP_CD,SAL_FRM_CD,YN_CD,SMIT_STAT_CD | - | `cases/req_selectComCodeList.do.csv` / `cases/res_selectComCodeList.do.csv` |
| `testcases/dataset/selectMyPermCertList.do.json` | - | - | `cases/req_selectMyPermCertList.do.csv` / `cases/res_selectMyPermCertList.do.csv` |
| `testcases/dataset/selectMyPubOggBriefList.do.json` | smitYr=2025 | - | `cases/req_selectMyPubOggBriefList.do.csv` / `cases/res_selectMyPubOggBriefList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 지출보고서 공개현황 | ✅ | selectMyPubOggBriefList.do | click_지출보고서 공개현황 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 나의 지출보고서 현황 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MyOggBriefPrsnt |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `click` | 조회 |  |  |
| 5 | `expect_any` |  | selectComCodeList.do,selectMyPermCertList.do,selectMyPubOggBriefList.do | 조회/화면로드 후 메뉴 전용 URI |
| 6 | `popup` | 지출보고서 공개현황 |  |  |
| 7 | `expect_any` |  | selectMyPubOggBriefList.do | 팝업 지출보고서 공개현황 |

</details>

### `OPAF020000` — 마이페이지 > 추가 자료 요구 현황 및 제출

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/AddDataDmndPrsntSmit`, 소스 `app_op_opf_AddDataDmndPrsntSmit.clx.js` (18033B, 컴포넌트 8, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `667`, clx히트 `True`, 로드 `index.clx.js, MyOggBriefPrsnt.clx.js, AddDataDmndPrsntSmit.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF020000.py` / STEP **4** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 상세보기 | click | `onBtnLinkClick` | 556 | - |
| 이벤트 | userDefinedControl_3 | pagechange | `onUdcPage1Pagechange` | 592 | - |
| 이벤트 | app | load | `onBodyLoad` | 612 | - |
| Submission | `subSearch` | - | - | 299 | send@[45] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 30 | e | [] | [] | [] |
| `doSearch` | 44 |  | ['subSearch'] | [] | [] |
| `fnPageInit` | 70 |  | [] | [] | [] |
| `onUdcPage1Pagechange` | 80 | e | [] | [] | [] |
| `onBtnLinkClick` | 89 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectAddDataDmndPrsntSmit.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectAddDataDmndPrsntSmit.do.json` | dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectAddDataDmndPrsntSmit.do.json` | recordsTotal=0; 페이지행수=10; 페이지=1; pageIndexerCount=10 | chgpId,regpId | `cases/req_selectAddDataDmndPrsntSmit.do.csv` / `cases/res_selectAddDataDmndPrsntSmit.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 추가 자료 요구 현황 및 제출 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/AddDataDmndPrsntSmit |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectAddDataDmndPrsntSmit.do | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAF030000` — 마이페이지 > 회원정보관리

- 수준 L2 / 로그인 **필요** / 실행 `ok_group` / 진입 `openPageId` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `(그룹)`, 소스 `-` (0B, 컴포넌트 0, 이벤트 0, 핸들러 0)
- 런타임: instance `err`, body `0`, clx히트 `False`, 로드 `Main.clx.js`, 팝업 `1`/`0트라이`, 다이얼로그 `알림 이 서비스는 로그인이 필요합니다. 로그인 후 이용하시기 바랍니다. 확인`
- 테스트: `menu_tests/test_OPAF030000.py` / STEP **21** / 기대 URI **5** / 상세화면 **7** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectMbInfmPwd.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMbInfmPwd.do.json` | dmParam 경계2/악성6 | - |
| `/kops/main/op/opf/selectMbInfo.do` | ✅ | 410 / 200,410 | 2 | 하위화면 | screen/op | `testcases/dataset/selectMbInfo.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opf/saveMbInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opf/updateMbPwd.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |
| `/kops/main/op/opf/updateUsrOut.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectMbInfmPwd.do.json` | - | - | `cases/req_selectMbInfmPwd.do.csv` / `cases/res_selectMbInfmPwd.do.csv` |
| `testcases/dataset/selectMbInfo.do.json` | - | extrEltrEmailAddr,usrHtelAll,usrHtelTno,usrHtelTsno,usrHtelTtno | `cases/req_selectMbInfo.do.csv` / `cases/res_selectMbInfo.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 상세 menu_id | 경로 | 화면 | 진입 | 기대 URI | 런타임 |
|---|---|---|---|---|---|
| `OPAF031000` | 마이페이지 > 회원정보관리 > 회원정보수정 | `app/op/opf/MbInfmUpd` | `direct_ui` | selectMbInfmPwd.do | ok_direct |
| `OPAF032000` | 마이페이지 > 회원정보관리 > 비밀번호 변경 | `app/op/opf/MbInfmUpdInfmCfr` | `direct_ui` | selectMbInfmPwd.do | ok_loaded |
| `OPAF033000` | 마이페이지 > 회원정보관리 > 회원탈퇴 | `app/op/opf/MbInfmOt` | `direct_ui` | selectMbInfmPwd.do | ok_direct |
| `OPAF034000` | 마이페이지 > 회원정보관리 > 회원탈퇴 완료 | `app/op/opf/MbInfmOtEnd` | `direct_ui` | - | ok_direct |
| `OPAF035000` | 마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO) | `app/op/opf/MbInfmUpdFirmCso` | `direct_ui` | selectMbInfo.do | ok_direct |
| `OPAF036000` | 마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO) | `app/op/opf/MbInfmUpdIndvCso` | `direct_ui` | selectMbInfo.do | ok_loaded |
| `OPAF037000` | 마이페이지 > 회원정보관리 > CSO회원비밀번호변경 | `app/op/opf/MbInfmUpdPwd` | `direct_ui` | - | ok_direct |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_any` |  | selectMbInfmPwd.do,selectMbInfo.do | 조회/화면로드 후 메뉴 전용 URI |
| 3 | `detail` | OPAF031000 |  |  |
| 4 | `expect_screen` | app/op/opf/MbInfmUpd |  |  |
| 5 | `expect_any` |  | selectMbInfmPwd.do | 회원정보수정 상세 URI |
| 6 | `detail` | OPAF032000 |  |  |
| 7 | `expect_screen` | app/op/opf/MbInfmUpdInfmCfr |  |  |
| 8 | `expect_any` |  | selectMbInfmPwd.do | 비밀번호 변경 상세 URI |
| 9 | `detail` | OPAF033000 |  |  |
| 10 | `expect_screen` | app/op/opf/MbInfmOt |  |  |
| 11 | `expect_any` |  | selectMbInfmPwd.do | 회원탈퇴 상세 URI |
| 12 | `detail` | OPAF034000 |  |  |
| 13 | `expect_screen` | app/op/opf/MbInfmOtEnd |  |  |
| 14 | `detail` | OPAF035000 |  |  |
| 15 | `expect_screen` | app/op/opf/MbInfmUpdFirmCso |  |  |
| 16 | `expect_any` |  | selectMbInfo.do | 회원정보 수정(사업자CSO) 상세 URI |
| 17 | `detail` | OPAF036000 |  |  |
| 18 | `expect_screen` | app/op/opf/MbInfmUpdIndvCso |  |  |
| 19 | `expect_any` |  | selectMbInfo.do | 회원정보 수정(개인CSO) 상세 URI |
| 20 | `detail` | OPAF037000 |  |  |
| 21 | `expect_screen` | app/op/opf/MbInfmUpdPwd |  |  |

</details>

### `OPAF031000` — 마이페이지 > 회원정보관리 > 회원정보수정

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmUpd`, 소스 `app_op_opf_MbInfmUpd.clx.js` (15028B, 컴포넌트 10, 이벤트 3, 핸들러 4)
- 런타임: instance `1`, body `734`, clx히트 `True`, 로드 `Main.clx.js, index.clx.js, MbInfmUpd.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF031000.py` / STEP **3** / 기대 URI **0** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_1 | keydown | `onKeyDown_enter` | 351 | - |
| 이벤트 | button_1 | click | `onBtnClick` | 394 | Submit.send; menu:OPAF035000,OPAF036000 |
| 이벤트 | app | load | `onBodyLoad` | 414 | - |
| 전환 | `openPageId` | - | target `-` | 72 | linkUrl, {} |
| 전환 | `openPageId` | - | target `-` | 74 | linkUrl, {} |
| Submission | `subSearch` | - | - | 184 | send@[41, 137] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnClick` | 26 | e | ['subSearch'] | [] | ['OPAF035000', 'OPAF036000'] |
| `onBodyLoad` | 98 | e | [] | [] | [] |
| `onKeyDown_enter` | 129 | e | [] | [] | [] |
| `doSearch` | 136 |  | ['subSearch'] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 회원정보수정 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmUpd |  |  |
| 3 | `click` | 조회 |  |  |

</details>

### `OPAF032000` — 마이페이지 > 회원정보관리 > 비밀번호 변경

- 수준 L3 / 로그인 **필요** / 실행 `ok_loaded` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmUpdInfmCfr`, 소스 `app_op_opf_MbInfmUpdInfmCfr.clx.js` (14681B, 컴포넌트 11, 이벤트 3, 핸들러 4)
- 런타임: instance `0`, body `734`, clx히트 `True`, 로드 `index.clx.js, MbInfmUpd.clx.js, MbInfmUpdInfmCfr.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF032000.py` / STEP **3** / 기대 URI **0** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_1 | keydown | `onKeyDown_enter` | 348 | - |
| 이벤트 | 확인 | click | `onBtnClick` | 391 | Submit.send; menu:OPAF037000 |
| 이벤트 | app | load | `onBodyLoad` | 411 | - |
| 전환 | `openPageId` | - | target `-` | 69 | linkUrl, {} |
| 전환 | `openPageId` | - | target `-` | 71 | linkUrl, {} |
| Submission | `subSearch` | - | - | 181 | send@[41, 134] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnClick` | 26 | e | ['subSearch'] | [] | ['OPAF037000'] |
| `onBodyLoad` | 95 | e | [] | [] | [] |
| `onKeyDown_enter` | 126 | e | [] | [] | [] |
| `doSearch` | 133 |  | ['subSearch'] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 비밀번호 변경 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmUpdInfmCfr |  |  |
| 3 | `click` | 조회 |  |  |

</details>

### `OPAF033000` — 마이페이지 > 회원정보관리 > 회원탈퇴

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmOt`, 소스 `app_op_opf_MbInfmOt.clx.js` (15200B, 컴포넌트 12, 이벤트 3, 핸들러 5)
- 런타임: instance `1`, body `820`, clx히트 `True`, 로드 `MbInfmUpd.clx.js, MbInfmUpdInfmCfr.clx.js, MbInfmOt.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF033000.py` / STEP **4** / 기대 URI **2** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_1 | click | `onKeyDown_enter` | 377 | - |
| 이벤트 | button_1 | click | `onBtnClick` | 420 | Submit.send |
| 이벤트 | app | load | `onBodyLoad` | 440 | - |
| 전환 | `openPageId` | - | target `-` | 125 | OPAF034000 {} |
| Submission | `subSearch` | - | - | 190 | send@[42, 137] |
| Submission | `subSave` | - | - | 198 | send@[118] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnClick` | 26 | e | ['subSearch'] | [] | [] |
| `onBodyLoad` | 75 | e | [] | [] | [] |
| `onKeyDown_enter` | 107 | e | [] | [] | [] |
| `doOut` | 117 |  | ['subSave'] | [] | ['OPAF034000'] |
| `doSearch` | 136 |  | ['subSearch'] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectMbInfmPwd.do` | ✅ | 410 / 200,410 | 2 | 본문 | screen/op | `testcases/dataset/selectMbInfmPwd.do.json` | dmParam 경계2/악성6 | - |
| `/kops/main/op/opf/updateUsrOut.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectMbInfmPwd.do.json` | - | - | `cases/req_selectMbInfmPwd.do.csv` / `cases/res_selectMbInfmPwd.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 회원탈퇴 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmOt |  |  |
| 3 | `click` | 조회 |  |  |
| 4 | `expect_any` |  | selectMbInfmPwd.do | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAF034000` — 마이페이지 > 회원정보관리 > 회원탈퇴 완료

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmOtEnd`, 소스 `app_op_opf_MbInfmOtEnd.clx.js` (7223B, 컴포넌트 9, 이벤트 1, 핸들러 1)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `MbInfmUpdInfmCfr.clx.js, MbInfmOt.clx.js, MbInfmOtEnd.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF034000.py` / STEP **2** / 기대 URI **0** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | 메인으로 가기 | click | `onBtnClick` | 192 | - |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBtnClick` | 20 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 회원탈퇴 완료 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmOtEnd |  |  |

</details>

### `OPAF035000` — 마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO)

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmUpdFirmCso`, 소스 `app_op_opf_MbInfmUpdFirmCso.clx.js` (33431B, 컴포넌트 23, 이벤트 15, 핸들러 9)
- 런타임: instance `1`, body `562`, clx히트 `True`, 로드 `MbInfmOt.clx.js, MbInfmOtEnd.clx.js, MbInfmUpdFirmCso.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF035000.py` / STEP **4** / 기대 URI **2** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_2 | keydown | `onKeyDown_enter` | 499 | - |
| 이벤트 | inputBox_3 | keydown | `onKeyDown_enter` | 539 | - |
| 이벤트 | inputBox_4 | keydown | `onKeyDown_enter` | 567 | - |
| 이벤트 | inputBox_5 | keydown | `onKeyDown_enter` | 596 | - |
| 이벤트 | inputBox_6 | keydown | `onKeyDown_enter` | 625 | - |
| 이벤트 | inputBox_7 | keydown | `onKeyDown_enter` | 666 | - |
| 이벤트 | inputBox_8 | keydown | `onKeyDown_enter` | 683 | - |
| 이벤트 | comboBox_1 | keydown | `onKeyDown_enter` | 705 | - |
| 이벤트 | inputBox_9 | keydown | `onKeyDown_enter` | 764 | - |
| 이벤트 | 주소검색 | click | `onAddrSrchClick` | 775 | - |
| 이벤트 | inputBox_10 | keydown | `onKeyDown_enter` | 814 | - |
| 이벤트 | inputBox_11 | keydown | `onKeyDown_enter` | 829 | - |
| 이벤트 | button_2 | click | `onBtnCancelClick` | 896 | - |
| 이벤트 | 저장 | click | `onBtnSaveClick` | 909 | - |
| 이벤트 | app | load | `onBodyInit` | 929 | - |
| Submission | `subSearch` | - | - | 306 | send@[40] |
| Submission | `subSave` | - | - | 314 | send@[198] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 27 | e | [] | [] | [] |
| `fnInit` | 34 |  | ['subSearch'] | [] | [] |
| `onBtnCancelClick` | 72 | e | [] | [] | [] |
| `onBtnSaveClick` | 91 | e | [] | [] | [] |
| `fn_validate` | 130 |  | [] | [] | [] |
| `doSave` | 195 |  | ['subSave'] | [] | [] |
| `selectionChange_email` | 210 | e | [] | [] | [] |
| `onAddrSrchClick` | 226 | e | [] | [] | [] |
| `onKeyDown_enter` | 255 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectMbInfo.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectMbInfo.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opf/saveMbInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectMbInfo.do.json` | - | extrEltrEmailAddr,usrHtelAll,usrHtelTno,usrHtelTsno,usrHtelTtno | `cases/req_selectMbInfo.do.csv` / `cases/res_selectMbInfo.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmUpdFirmCso |  |  |
| 3 | `fill` | 업체명 | @sample.업체명 |  |
| 4 | `expect_any` |  | selectMbInfo.do | 조회/화면로드 후 메뉴 전용 URI |

</details>

### `OPAF036000` — 마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO)

- 수준 L3 / 로그인 **필요** / 실행 `ok_loaded` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmUpdIndvCso`, 소스 `app_op_opf_MbInfmUpdIndvCso.clx.js` (30090B, 컴포넌트 22, 이벤트 11, 핸들러 9)
- 런타임: instance `0`, body `783`, clx히트 `True`, 로드 `MbInfmOtEnd.clx.js, MbInfmUpdFirmCso.clx.js, MbInfmUpdIndvCso.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF036000.py` / STEP **4** / 기대 URI **2** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_3 | keydown | `onKeyDown_enter` | 523 | - |
| 이벤트 | inputBox_4 | keydown | `onKeyDown_enter` | 552 | - |
| 이벤트 | inputBox_5 | keydown | `onKeyDown_enter` | 592 | - |
| 이벤트 | inputBox_6 | keydown | `onKeyDown_enter` | 608 | - |
| 이벤트 | inputBox_7 | keydown | `onKeyDown_enter` | 685 | - |
| 이벤트 | 주소검색 | click | `onAddrSrchClick` | 696 | - |
| 이벤트 | inputBox_8 | keydown | `onKeyDown_enter` | 734 | - |
| 이벤트 | inputBox_9 | keydown | `onKeyDown_enter` | 748 | - |
| 이벤트 | 취소 | click | `onBtnCancelClick` | 816 | menu:OPAF031000 |
| 이벤트 | 저장 | click | `onBtnSaveClick` | 828 | - |
| 이벤트 | app | init | `onBodyInit` | 848 | - |
| 전환 | `openPageId` | - | target `-` | 79 | OPAF031000 {} |
| Submission | `subSearch` | - | - | 295 | send@[40] |
| Submission | `subSave` | - | - | 303 | send@[187] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 27 | e | [] | [] | [] |
| `fnInit` | 34 |  | ['subSearch'] | [] | [] |
| `onBtnCancelClick` | 72 | e | [] | [] | ['OPAF031000'] |
| `onBtnSaveClick` | 92 | e | [] | [] | [] |
| `fn_validate` | 131 |  | [] | [] | [] |
| `doSave` | 184 |  | ['subSave'] | [] | [] |
| `selectionChange_email` | 199 | e | [] | [] | [] |
| `onAddrSrchClick` | 215 | e | [] | [] | [] |
| `onKeyDown_enter` | 244 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectMbInfo.do` | ✅ | 410 / 200,410 | 1 | 본문 | screen/op | `testcases/dataset/selectMbInfo.do.json` | dmParam 경계6/악성6 | - |
| `/kops/main/op/opf/saveMbInfo.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectMbInfo.do.json` | - | extrEltrEmailAddr,usrHtelAll,usrHtelTno,usrHtelTsno,usrHtelTtno | `cases/req_selectMbInfo.do.csv` / `cases/res_selectMbInfo.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 주소검색 | ⚠️ | - |  |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO) 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmUpdIndvCso |  |  |
| 3 | `expect_any` |  | selectMbInfo.do | 조회/화면로드 후 메뉴 전용 URI |
| 4 | `popup` | 주소검색 |  |  |

</details>

### `OPAF037000` — 마이페이지 > 회원정보관리 > CSO회원비밀번호변경

- 수준 L3 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/MbInfmUpdPwd`, 소스 `app_op_opf_MbInfmUpdPwd.clx.js` (27061B, 컴포넌트 26, 이벤트 7, 핸들러 7)
- 런타임: instance `1`, body `1028`, clx히트 `True`, 로드 `MbInfmUpdFirmCso.clx.js, MbInfmUpdIndvCso.clx.js, MbInfmUpdPwd.clx.js`, 팝업 `0`/`0트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF037000.py` / STEP **2** / 기대 URI **1** / 상세화면 **0** / 팝업 **0**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | inputBox_1 | keydown | `onKeyDown_enter` | 483 | - |
| 이벤트 | inputBox_2 | keydown | `onKeyDown_enter` | 531 | - |
| 이벤트 | inputBox_3 | keydown | `onKeyDown_enter` | 578 | - |
| 이벤트 | inputBox_4 | keydown | `onKeyDown_enter` | 657 | - |
| 이벤트 | 취소 | click | `onBtnCancelClick` | 705 | menu:OPAF032000 |
| 이벤트 | 저장 | click | `onBtnSaveClick` | 717 | - |
| 이벤트 | app | init | `onBodyInit` | 737 | - |
| 전환 | `openPageId` | - | target `-` | 44 | OPAF032000 {} |
| 전환 | `openPageId` | - | target `-` | 186 | OPAF032000 {} |
| 전환 | `openPageId` | - | target `-` | 191 | OPAF032000 {} |
| Submission | `subSave` | - | - | 268 | send@[166] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyInit` | 27 | e | [] | [] | [] |
| `onBtnCancelClick` | 37 | e | [] | [] | ['OPAF032000'] |
| `onBtnSaveClick` | 57 | e | [] | [] | [] |
| `fn_validate` | 96 |  | [] | [] | [] |
| `doSave` | 163 |  | ['subSave'] | [] | ['OPAF032000', 'OPAF032000'] |
| `onKeyDown_enter` | 206 | e | [] | [] | [] |
| `gfn_containsCharsOnly` | 221 | input,chars | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/updateMbPwd.do` | 소스만 | - / 200,410 | 0 | 소스참조 | / | `-` | - - | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 회원정보관리 > CSO회원비밀번호변경 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/MbInfmUpdPwd |  |  |

</details>

### `OPAF070000` — 마이페이지 > 요양기관 수수내역 조회

- 수준 L2 / 로그인 **필요** / 실행 `ok_direct` / 진입 `util.EmbApp.load (direct UI load)` / 접근 `hmrLoginTpCd=1 (client check bypassed for UI; server session still required`
- 화면: `app/op/opf/YoyangOggBriefList`, 소스 `app_op_opf_YoyangOggBriefList.clx.js` (68671B, 컴포넌트 69, 이벤트 3, 핸들러 12)
- 런타임: instance `1`, body `969`, clx히트 `True`, 로드 `MbInfmUpdIndvCso.clx.js, MbInfmUpdPwd.clx.js, YoyangOggBriefList.clx.js`, 팝업 `0`/`1트라이`, 다이얼로그 `-`
- 테스트: `menu_tests/test_OPAF070000.py` / STEP **9** / 기대 URI **1** / 상세화면 **0** / 팝업 **1**
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=10`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=LIST`

<details><summary>이벤트 · 핸들러 · Submission 전체</summary>

| 종류 | 라벨/메서드 | 이벤트 | 핸들러/ID | line | 호출 |
|---|---|---|---|---:|---|
| 이벤트 | button_1 | click | `onBtnInit1Click` | 696 | - |
| 이벤트 | button_2 | click | `onBtnSearchClick` | 708 | - |
| 이벤트 | app | load | `onBodyLoad` | 1992 | - |
| Submission | `subSearch` | - | - | 393 | send@[169] |

| 핸들러 | line | params | Submit | openPage | menu/ndo |
|---|---:|---|---|---|---|
| `onBodyLoad` | 41 | e | [] | [] | [] |
| `fnBriefFormCmbRedraw` | 66 |  | [] | [] | [] |
| `fnTabFolderGrid` | 85 |  | [] | [] | [] |
| `onCmbSalTpCdItemClick` | 114 | e | [] | [] | [] |
| `onCmbOggBriefFormItemClick` | 123 | e | [] | [] | [] |
| `onBtnSearchClick` | 132 | e | [] | [] | [] |
| `fnSearch` | 141 |  | ['subSearch'] | [] | [] |
| `fnPageing` | 178 |  | [] | [] | [] |
| `onPageIndexSelectionChange` | 209 | e | [] | [] | [] |
| `onBodyScreenChange` | 235 | e | [] | [] | [] |
| `onBtnInit1Click` | 249 | e | [] | [] | [] |
| `onCmbSmitYrSelectionChange` | 266 | e | [] | [] | [] |

</details>

<details><summary>URI · 데이터셋 · call stack 전체</summary>

| URI | 관측 | 상태/accept | 호출 | 경로 | phase/step | 데이터셋 | req/계약 | 정적 호출자 |
|---|---|---|---:|---|---|---|---|---|
| `/kops/main/op/opf/selectYoyangOggBriefList.do` | ✅ | 410 / 200,410 | 1 | 본문 | popup_button/cl | `testcases/dataset/selectYoyangOggBriefList.do.json` | dmParam 경계6/악성6 | - |

| 데이터셋 | 기준 요청 샘플 | 마스킹 | CSV |
|---|---|---|---|
| `testcases/dataset/selectYoyangOggBriefList.do.json` | smitYr=2025; 영업구분=S; fomTyCd=10; recordsTotal=0; 페이지행수=10; 페이지=1 | - | `cases/req_selectYoyangOggBriefList.do.csv` / `cases/res_selectYoyangOggBriefList.do.csv` |

</details>

<details><summary>상세 화면 · 팝업 · 테스트 STEP</summary>

| 팝업 버튼 | 성공 | URI | 비고 |
|---|---|---|---|
| 조회 | ✅ | selectYoyangOggBriefList.do | click_조회 |

| # | do | 대상 | 값/URI | 비고 |
|---:|---|---|---|---|
| 1 | `note` |  |  | 마이페이지 > 요양기관 수수내역 조회 화면 진입 / 소스 이벤트 기반 |
| 2 | `expect_screen` | app/op/opf/YoyangOggBriefList |  |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |  |
| 4 | `select` | 영업구분 | @sample.영업구분 |  |
| 5 | `fill` | 업체명 | @sample.업체명 |  |
| 6 | `click` | 조회 |  |  |
| 7 | `expect_any` |  | selectYoyangOggBriefList.do | 조회/화면로드 후 메뉴 전용 URI |
| 8 | `popup` | 조회 |  |  |
| 9 | `expect_any` |  | selectYoyangOggBriefList.do | 팝업 조회 |

</details>

## 6. 예시 — 지출보고서 작성ㆍ정정 > 지출보고서 정정 (상세 화면까지)

- 경로: `지출보고서 작성ㆍ정정 > 지출보고서 정정` / 로그인 필요 / 실행 `ok_direct` / 화면 `app/op/opb/OggBriefWrtUpdList` / 소스 `app_op_opb_OggBriefWrtUpdList.clx.js`
- 샘플: `제출연도=2025`, `영업구분=S`, `서식구분=S10`, `페이지=1`, `페이지행수=8`, `업체명=`, `검색어=`, `요양기관명=`, `품목명=`, `모드=UPDATE`, `선택유형=UPDATE`, `시작화면=UPD`, `문서유형=updList`
- 상세 화면 **10개**: `OPAB050100` 업체별 지출보고서 정정 현황, `OPAB031100` 업체정보 작성하기, `OPAB050200` 지출보고서 정정, `OPAB050300` 지출보고서 정정, `OPAB050400` 지출보고서 정정, `OPAB050500` 지출보고서 정정, `OPAB050600` 지출보고서 정정, `OPAB050700` 지출보고서 정정, `OPAB050800` 지출보고서 정정, `OPAB050900` 최종확정
- 기대 URI **18개** (관측 13 / 소스참조 5)

| # | STEP | 대상 | 값/URI |
|---:|---|---|---|
| 1 | `note` |  |  |
| 2 | `expect_screen` | app/op/opb/OggBriefWrtUpdList |  |
| 3 | `select` | 제출연도 | @sample.제출연도 |
| 4 | `select` | 영업구분 | @sample.영업구분 |
| 5 | `click` | 조회 |  |
| 6 | `expect_any` |  | selectBizWrtMbList.do,selectComCodeList.do,selectOggBriefForm1List.do |
| 7 | `detail` | OPAB050100 |  |
| 8 | `expect_screen` | app/op/opb/EntpOggBriefFormUpdList |  |
| 9 | `expect_any` |  | selectOggBriefFormAllCnt.do |
| 10 | `detail` | OPAB031100 |  |
| 11 | `expect_screen` | app/op/opb/EntpInfmWrt |  |
| 12 | `expect_any` |  | selectComCodeList.do,selectBizWrtTgtList.do |
| 13 | `detail` | OPAB050200 |  |
| 14 | `expect_screen` | app/op/opb/OggBriefFormUpdList1 |  |
| 15 | `detail` | OPAB050300 |  |
| 16 | `expect_screen` | app/op/opb/OggBriefFormUpdList2 |  |
| 17 | `detail` | OPAB050400 |  |
| 18 | `expect_screen` | app/op/opb/OggBriefFormUpdList3 |  |
| 19 | `detail` | OPAB050500 |  |
| 20 | `expect_screen` | app/op/opb/OggBriefFormUpdList4 |  |
| 21 | `detail` | OPAB050600 |  |
| 22 | `expect_screen` | app/op/opb/OggBriefFormUpdList5 |  |
| 23 | `detail` | OPAB050700 |  |
| 24 | `expect_screen` | app/op/opb/OggBriefFormUpdList6 |  |
| 25 | `detail` | OPAB050800 |  |
| 26 | `expect_screen` | app/op/opb/OggBriefFormUpdList7 |  |
| 27 | `detail` | OPAB050900 |  |
| 28 | `expect_screen` | app/op/opb/LastFdecList |  |
| 29 | `popup` | 조회 |  |

> 이 예시처럼 `test_OPAB050000.py` 한 파일에 목록 → 조회 → 업체별 정정 현황 → 서식별 정정 1~7 → 최종확정 → 팝업 순서가 **라벨 기반 STEP**으로 들어 있습니다. 값은 `SAMPLE`만 바꾸면 됩니다.

## 7. 메뉴별 테스트 파일 색인

| 메뉴 | 경로 | 파일 | STEP | 상세 |
|---|---|---|---:|---:|
| `OPAA000000` | 지출보고서 정보공개 | `menu_tests/test_OPAA000000.py` | 25 | 14 |
| `OPAA010000` | 지출보고서 정보공개 > 지출보고서 공표자료 | `menu_tests/test_OPAA010000.py` | 4 | 0 |
| `OPAA020000` | 지출보고서 정보공개 > 지출보고서 공개자료조회 | `menu_tests/test_OPAA020000.py` | 24 | 8 |
| `OPAA020100` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 업체별 지출보고서 공개 현황 | `menu_tests/test_OPAA020100.py` | 7 | 1 |
| `OPAA020200` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(견본품 제공) | `menu_tests/test_OPAA020200.py` | 11 | 2 |
| `OPAA020300` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(학술대회 지원) | `menu_tests/test_OPAA020300.py` | 11 | 2 |
| `OPAA020400` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(임상시험 등의 지원) | `menu_tests/test_OPAA020400.py` | 11 | 2 |
| `OPAA020500` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(제품설명회) | `menu_tests/test_OPAA020500.py` | 11 | 2 |
| `OPAA020600` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(시판 후 조사) | `menu_tests/test_OPAA020600.py` | 8 | 2 |
| `OPAA020700` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(대금결제 조건에 따른 비용할인) | `menu_tests/test_OPAA020700.py` | 8 | 2 |
| `OPAA020800` | 지출보고서 정보공개 > 지출보고서 공개자료조회 > 지출보고서 서식별 공개(구매 전 의료기기의 성능 확인을 위한 사용) | `menu_tests/test_OPAA020800.py` | 11 | 2 |
| `OPAA030000` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 | `menu_tests/test_OPAA030000.py` | 15 | 3 |
| `OPAA030100` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공자 | `menu_tests/test_OPAA030100.py` | 3 | 0 |
| `OPAA030200` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 제공내역 | `menu_tests/test_OPAA030200.py` | 3 | 0 |
| `OPAA030300` | 지출보고서 정보공개 > 한눈에 보는 지출보고서 통계 > 합법적 경제적 이익 수수내역 | `menu_tests/test_OPAA030300.py` | 3 | 0 |
| `OPAB000000` | 지출보고서 작성ㆍ정정 | `menu_tests/test_OPAB000000.py` | 25 | 14 |
| `OPAB010000` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 | `menu_tests/test_OPAB010000.py` | 31 | 10 |
| `OPAB010100` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 현황 조회 | `menu_tests/test_OPAB010100.py` | 8 | 1 |
| `OPAB010200` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(견본품 제공) | `menu_tests/test_OPAB010200.py` | 19 | 7 |
| `OPAB010300` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(학술대회 지원) | `menu_tests/test_OPAB010300.py` | 20 | 7 |
| `OPAB010400` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(임상시험 등의 지원) | `menu_tests/test_OPAB010400.py` | 20 | 7 |
| `OPAB010500` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(제품설명회) | `menu_tests/test_OPAB010500.py` | 17 | 7 |
| `OPAB010600` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(시판 후 조사) | `menu_tests/test_OPAB010600.py` | 17 | 7 |
| `OPAB010700` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(대금결제 조건에 따른 비용할인) | `menu_tests/test_OPAB010700.py` | 20 | 7 |
| `OPAB010800` | 지출보고서 작성ㆍ정정 > 지출보고서 현황 조회 > 지출보고서 서식별 조회(구매 전 의료기기의 성능 확인을 위한 사용) | `menu_tests/test_OPAB010800.py` | 20 | 7 |
| `OPAB020000` | 지출보고서 작성ㆍ정정 > 지출보고서 상시작성 | `menu_tests/test_OPAB020000.py` | 14 | 2 |
| `OPAB030000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 | `menu_tests/test_OPAB030000.py` | 31 | 12 |
| `OPAB030100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체별 지출보고서 작성 현황 | `menu_tests/test_OPAB030100.py` | 11 | 2 |
| `OPAB030200` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030200.py` | 8 | 1 |
| `OPAB030300` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030300.py` | 11 | 2 |
| `OPAB030400` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030400.py` | 11 | 2 |
| `OPAB030500` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030500.py` | 9 | 2 |
| `OPAB030600` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030600.py` | 9 | 2 |
| `OPAB030700` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030700.py` | 9 | 2 |
| `OPAB030800` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 작성 | `menu_tests/test_OPAB030800.py` | 11 | 2 |
| `OPAB030900` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 최종확정 | `menu_tests/test_OPAB030900.py` | 10 | 2 |
| `OPAB031000` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항 | `menu_tests/test_OPAB031000.py` | 6 | 0 |
| `OPAB031100` | 지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 업체정보 작성하기 | `menu_tests/test_OPAB031100.py` | 13 | 3 |
| `OPAB040000` | 지출보고서 작성ㆍ정정 > 대량 지출보고서 업로드 | `menu_tests/test_OPAB040000.py` | 7 | 0 |
| `OPAB050000` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 | `menu_tests/test_OPAB050000.py` | 29 | 10 |
| `OPAB050100` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 업체별 지출보고서 정정 현황 | `menu_tests/test_OPAB050100.py` | 6 | 1 |
| `OPAB050200` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050200.py` | 20 | 7 |
| `OPAB050300` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050300.py` | 17 | 7 |
| `OPAB050400` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050400.py` | 20 | 7 |
| `OPAB050500` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050500.py` | 17 | 7 |
| `OPAB050600` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050600.py` | 20 | 7 |
| `OPAB050700` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050700.py` | 17 | 7 |
| `OPAB050800` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 지출보고서 정정 | `menu_tests/test_OPAB050800.py` | 20 | 7 |
| `OPAB050900` | 지출보고서 작성ㆍ정정 > 지출보고서 정정 > 최종확정 | `menu_tests/test_OPAB050900.py` | 8 | 2 |
| `OPAC000000` | 지출보고서 기초정보 조회 | `menu_tests/test_OPAC000000.py` | 9 | 3 |
| `OPAC010000` | 지출보고서 기초정보 조회 > 요양기관 정보조회 | `menu_tests/test_OPAC010000.py` | 4 | 0 |
| `OPAC020000` | 지출보고서 기초정보 조회 > 의약품 정보조회 | `menu_tests/test_OPAC020000.py` | 4 | 0 |
| `OPAC030000` | 지출보고서 기초정보 조회 > 의료기기 정보조회 | `menu_tests/test_OPAC030000.py` | 5 | 0 |
| `OPAD000000` | 고객지원 | `menu_tests/test_OPAD000000.py` | 31 | 12 |
| `OPAD010000` | 고객지원 > 공지사항 | `menu_tests/test_OPAD010000.py` | 8 | 1 |
| `OPAD010100` | 고객지원 > 공지사항 > 공지사항 상세 | `menu_tests/test_OPAD010100.py` | 4 | 0 |
| `OPAD020000` | 고객지원 > 자주 찾는 질문(FAQ) | `menu_tests/test_OPAD020000.py` | 5 | 0 |
| `OPAD030000` | 고객지원 > 자료실 | `menu_tests/test_OPAD030000.py` | 8 | 1 |
| `OPAD030100` | 고객지원 > 자료실 > 자료실 상세 | `menu_tests/test_OPAD030100.py` | 4 | 0 |
| `OPAD040000` | 고객지원 > 교육서비스 | `menu_tests/test_OPAD040000.py` | 13 | 3 |
| `OPAD040100` | 고객지원 > 교육서비스 > 교육서비스 상세 | `menu_tests/test_OPAD040100.py` | 12 | 3 |
| `OPAD040200` | 고객지원 > 교육서비스 > 교육서비스 신청 상세내역 | `menu_tests/test_OPAD040200.py` | 7 | 1 |
| `OPAD040300` | 고객지원 > 교육서비스 > 교육신청 | `menu_tests/test_OPAD040300.py` | 6 | 1 |
| `OPAD050000` | 고객지원 > 정보이관 및 비공개(폐업) 신청 | `menu_tests/test_OPAD050000.py` | 8 | 1 |
| `OPAD050200` | 고객지원 > 정보이관 및 비공개(폐업) 신청 > 정보이관 및 비공개 신청 | `menu_tests/test_OPAD050200.py` | 3 | 0 |
| `OPAD060000` | 고객지원 > 웹 접근성 안내 | `menu_tests/test_OPAD060000.py` | 2 | 0 |
| `OPAE000000` | 제도소개 | `menu_tests/test_OPAE000000.py` | 11 | 5 |
| `OPAE010000` | 제도소개 > 제도개요 | `menu_tests/test_OPAE010000.py` | 2 | 0 |
| `OPAE020000` | 제도소개 > 조직현황 | `menu_tests/test_OPAE020000.py` | 2 | 0 |
| `OPAE030000` | 제도소개 > 조직연혁 | `menu_tests/test_OPAE030000.py` | 2 | 0 |
| `OPAE040000` | 제도소개 > 관련법령 | `menu_tests/test_OPAE040000.py` | 2 | 0 |
| `OPAE050000` | 제도소개 > 오시는길 | `menu_tests/test_OPAE050000.py` | 2 | 0 |
| `OPAF000000` | 마이페이지 | `menu_tests/test_OPAF000000.py` | 28 | 11 |
| `OPAF010000` | 마이페이지 > 나의 지출보고서 현황 | `menu_tests/test_OPAF010000.py` | 7 | 0 |
| `OPAF020000` | 마이페이지 > 추가 자료 요구 현황 및 제출 | `menu_tests/test_OPAF020000.py` | 4 | 0 |
| `OPAF030000` | 마이페이지 > 회원정보관리 | `menu_tests/test_OPAF030000.py` | 21 | 7 |
| `OPAF031000` | 마이페이지 > 회원정보관리 > 회원정보수정 | `menu_tests/test_OPAF031000.py` | 3 | 0 |
| `OPAF032000` | 마이페이지 > 회원정보관리 > 비밀번호 변경 | `menu_tests/test_OPAF032000.py` | 3 | 0 |
| `OPAF033000` | 마이페이지 > 회원정보관리 > 회원탈퇴 | `menu_tests/test_OPAF033000.py` | 4 | 0 |
| `OPAF034000` | 마이페이지 > 회원정보관리 > 회원탈퇴 완료 | `menu_tests/test_OPAF034000.py` | 2 | 0 |
| `OPAF035000` | 마이페이지 > 회원정보관리 > 회원정보 수정(사업자CSO) | `menu_tests/test_OPAF035000.py` | 4 | 0 |
| `OPAF036000` | 마이페이지 > 회원정보관리 > 회원정보 수정(개인CSO) | `menu_tests/test_OPAF036000.py` | 4 | 0 |
| `OPAF037000` | 마이페이지 > 회원정보관리 > CSO회원비밀번호변경 | `menu_tests/test_OPAF037000.py` | 2 | 0 |
| `OPAF070000` | 마이페이지 > 요양기관 수수내역 조회 | `menu_tests/test_OPAF070000.py` | 9 | 0 |

## 8. 실행 / 재생성

```bash
/opt/hira-pwenv/bin/python build_menu_cases.py
/opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py        # plan 84건
/opt/hira-pwenv/bin/python -m pytest menu_tests/ -q              # 동일
HIRA_MENU_IDS=OPAA020000,OPAB050000 \
  /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live
HIRA_MENU_IDS=OPAA020000,OPAB050000,OPAD010000 \
  /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live \
  --max 3 --max-steps 6 --wait-ms 1000 \
  --report-prefix menu_case_live_report   # 빠른 스모크, 별도 리포트
```

`--max-steps`/`--wait-ms` 는 실행만 절단하고 `test_*.py` 의 STEP 은 그대로 둡니다. `--strict` 는 미관측 URI 경고를 FAIL 로 승격합니다.

기본은 브라우저를 열지 않는 **plan 검증**. `--live` 일 때만 CDP sync 로 읽기 전용 재생하며, 로그인 필요 화면은 `util.EmbApp.load` UI 로드 + 서버 410 차단까지 확인합니다.

