# KOPS 전 URI 테스트 케이스 / 데이터셋

- 생성: `2026-11-24T22:36:40+09:00`
- 기준: `<CAPTURE_SOURCE>` — XHR **350건 / URI 59개**
- URI 케이스: **590개** (AUTHZ 59, BOUNDARY 59, CSV_SHAPE 59, LIVE 59, NEGATIVE 59, NORMAL 59, PRIVACY 59, SCHEMA_REQ 59, SCHEMA_RES 59, TRACE 59)
- 보안 회귀: **13건** (`testcases/test_security.py`, SEC-01~SEC-13)
- **통합 실행 603건** → `out/testcase_report.json`
- 전체 매트릭스: `testcases/test_matrix.csv` (URI 590행) / `out/all_testcases.csv` (603행 + 실행결과)

## 실행

```bash
/opt/hira-pwenv/bin/python build_testcases.py       # 데이터셋·매트릭스 재생성
/opt/hira-pwenv/bin/python security_scan.py        # 보안 증거 재실측
/opt/hira-pwenv/bin/python testcases/run_tests.py   # 통합 603건 + 리포트
/opt/hira-pwenv/bin/python -m pytest testcases/ -q  # pytest(선택)
HIRA_LIVE_TESTS=1 /opt/hira-pwenv/bin/python testcases/live_replay.py --max 3
```

## 카테고리

| 코드 | 의미 | 검증 |
|---|---|---|
| NORMAL | 기준 요청 재현 | status/파싱/에러없음 |
| SCHEMA_REQ | 요청 스키마 | 최상위 키 허용집합 |
| SCHEMA_RES | 응답 스키마 | 데이터셋 ↔ 캡처 전수 일치 |
| BOUNDARY | 경계값 | 빈값·음수·큰수·1000자·None JSON 왕복 |
| NEGATIVE | 악성입력 탐지 | SQLi/XSS/Path/NUL/장문 탐지 + 정상값 오탐 없음 |
| AUTHZ | 접근제어 | 차단 410·데이터 없음 / 공개 200 |
| PRIVACY | 민감정보 | 라이선스키·SESSION·주민번호·비밀번호 마스킹 |
| TRACE | 호출추적 | `src_*.json` occurrence·where |
| CSV_SHAPE | CSV 정합성 | `|` 헤드/행 필드수·행수 |
| LIVE | 실서버 재현 자리표시 | 항상 SKIP, 별도 `live_replay.py --max 3` 옵트인 |
| SEC-\* | 보안 회귀 13건 | 헤더·CORS·쿠키·라이선스키·CSRF·410·소스·자동화 |

## 데이터셋

`testcases/dataset/{slug}.json` — URI 마다
`baseline`(요청/응답/헤더), `samples`(최대 3변형), `boundary_paths`,
`injection_payloads`, `request_keys`/`response_keys`, `source_files`/
`source_handlers`, `masked_fields`, `csv` 경로.

> 민감 필드(`license_key`, `product_key`, `regpId`, `mobileNo`, `birthDate` 등)는
> 키/타입은 유지하고 값만 `<MASKED>` 로 바꿨습니다. 리스트는 20건까지만 보관.

## URI 목록

| URI | 종류 | 호출 | 상태 | 소스 |
|---|---|---:|---|---|
| `/kops/main/op/com/getUserSessionInfo.ndo` | ndo | 7 | 200 | app_com_main_Main.clx.js |
| `/kops/main/op/com/selectComCodeList.do` | resource | 8 | 410 | - |
| `/kops/main/op/com/selectComCodeList.ndo` | ndo | 1 | 200 | app_op_opa_OggBriefPubDataSrch.clx.js |
| `/kops/main/op/com/selectMainNtfclteList.ndo` | ndo | 7 | 200 | app_com_main_index.clx.js |
| `/kops/main/op/com/selectMenuList.ndo` | ndo | 7 | 200 | app_com_main_Main.clx.js |
| `/kops/main/op/com/selectNoticePopupSliderList.ndo` | ndo | 7 | 200 | app_com_main_Main.clx.js |
| `/kops/main/op/opa/selectAcpDescPecnyAstc1.ndo` | ndo | 1 | 200 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js |
| `/kops/main/op/opa/selectAcpDescPrdAstc1Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectAllSeeStcInfoPgList.ndo` | ndo | 8 | 200 | app_com_main_index.clx.js, app_op_opa_AllSeeOggWrptStc.clx.js |
| `/kops/main/op/opa/selectAllSeeStcInfoRcmd.ndo` | ndo | 1 | 200 | app_op_opa_AllSeeOggWrptStc.clx.js |
| `/kops/main/op/opa/selectAllSeeStcList.ndo` | ndo | 1 | 200 | app_op_opa_LawEcnmyPftOffrrList.clx.js |
| `/kops/main/op/opa/selectAllSeeStcListGSum.ndo` | ndo | 2 | 200 | - |
| `/kops/main/op/opa/selectExttOnoList.ndo` | ndo | 3 | 200 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `/kops/main/op/opa/selectMainStcList.ndo` | ndo | 7 | 200 | app_com_main_index.clx.js |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1.ndo` | ndo | 1 | 200 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `/kops/main/op/opa/selectOffrDescPecnyAstc1Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc3Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc4Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAstc5Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg1Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOffrDescPecnyAvg2Gsum.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefOfanDataSrchList.ndo` | ndo | 1 | 200 | app_op_opa_OggBriefOfanDataList.clx.js |
| `/kops/main/op/opa/selectOggBriefPub1List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub2List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub3List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub4List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub5List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub6List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPub7List.ndo` | ndo | 1 | 200 | - |
| `/kops/main/op/opa/selectOggBriefPubAllCnt.ndo` | ndo | 2 | 200 | app_op_opa_EntpOggBriefPubInfoList.clx.js |
| `/kops/main/op/opa/selectOggBriefPubDataSrchList.ndo` | ndo | 1 | 200 | app_op_opa_OggBriefPubDataSrch.clx.js |
| `/kops/main/op/opa/selectOggBriefSmitYrList.ndo` | ndo | 3 | 200 | app_op_opa_LawEcnmyPftAcpDtlList.clx.js, app_op_opa_LawEcnmyPftOffrrDtlList.clx.js |
| `/kops/main/op/opb/selectBizInfoSubTitle.ndo` | ndo | 191 | 200 | cpr-lib_udc.js |
| `/kops/main/op/opb/selectBizWrtMbList.do` | resource | 6 | 410 | - |
| `/kops/main/op/opb/selectBizWrtTgtList.do` | resource | 24 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm1List.do` | resource | 5 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm2List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm3List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm4List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm5List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm6List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefForm7List.do` | resource | 3 | 410 | - |
| `/kops/main/op/opb/selectOggBriefFormAllCnt.do` | resource | 3 | 410 | - |
| `/kops/main/op/opd/selectEduAplDtl.do` | resource | 1 | 410 | - |
| `/kops/main/op/opd/selectEduAplDtlDesc.do` | resource | 1 | 410 | - |
| `/kops/main/op/opd/selectEduAplList.do` | resource | 1 | 410 | - |
| `/kops/main/op/opd/selectFaqList.ndo` | ndo | 1 | 200 | app_op_opd_Faq.clx.js |
| `/kops/main/op/opd/selectInfmTrfrAplWrtList.do` | resource | 1 | 410 | - |
| `/kops/main/op/opd/selectNtfclteDtl.ndo` | ndo | 1 | 410 | app_op_opd_NtfclteDtl.clx.js |
| `/kops/main/op/opd/selectNtfclteList.ndo` | ndo | 1 | 200 | app_op_opd_Ntfclte.clx.js |
| `/kops/main/op/opd/selectRfrmDtl.ndo` | ndo | 1 | 410 | app_op_opd_RfrmDtl.clx.js |
| `/kops/main/op/opd/selectRfrmList.ndo` | ndo | 1 | 200 | app_op_opd_Rfrm.clx.js |
| `/kops/main/op/opf/selectAddDataDmndPrsntSmit.do` | resource | 1 | 410 | - |
| `/kops/main/op/opf/selectMbInfmPwd.do` | resource | 3 | 410 | - |
| `/kops/main/op/opf/selectMbInfo.do` | resource | 2 | 410 | - |
| `/kops/main/op/opf/selectMyPermCertList.do` | resource | 2 | 410 | - |
| `/kops/main/op/opf/selectMyPubOggBriefList.do` | resource | 1 | 410 | - |
| `/kops/main/op/opf/selectYoyangOggBriefList.do` | resource | 1 | 410 | - |
| `/kops/main/raonk/raonkUploadCustom.ndo` | ndo | 2 | 200 | cpr-lib_udc.js |

## 보안 발견 연계

`out/security_review.md` 의 S-01~S-13 은 URI 스위트 + `testcases/test_security.py` 의 SEC-01~SEC-13 으로 재검증합니다.
- S-01 라이선스 키 노출 → `PRIVACY` + `SEC-07`
- S-02/S-03 CORS·보안헤더 → `SEC-01`~`SEC-04`
- S-04 CSRF 토큰 부재 → `SCHEMA_REQ` + `SEC-08`
- S-05 클라이언트 권한검사 → `AUTHZ` + `SEC-09`
- S-06/S-07 쿠키 → `SEC-05`
- S-08 메뉴/사용자 필드 노출 → `PRIVACY` / `SCHEMA_RES` + `SEC-11`
- S-13 자동화 CDP·평문 캡처 → `SEC-06`, `SEC-11`, `SEC-12`

