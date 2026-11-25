# KOPS MariaDB 스키마

`지출보고서 관리시스템 OpenAPI 개발 가이드(26.9.)` 의 지출보고서 서식정보
(견본품 제공 ~ 구매 전 의료기기의 성능 확인을 위한 사용) 필드를 **camelCase → snake_case**로
변환해 구성한 MariaDB 스키마입니다.

## 적용

```bash
sudo service mariadb start
sudo mariadb < /home/user/kops-db/sql/schema.sql
sudo mariadb < /home/user/kops-db/sql/seed.sql
```

- DB: `kops` (utf8mb4 / utf8mb4_unicode_ci)
- 계정: `kops` / `kops1234` (로컬 개발용)
- 생성 스크립트: `python3 scripts/gen_schema.py` → `sql/schema.sql`, `sql/seed.sql`

## 테이블 (12개)

| 테이블 | 설명 |
|---|---|
| `notice` | 공지사항(MyBatis CRUD) |
| `common_code` | 공통코드(SAL_TP_CD, SAL_FRM_CD, FORM_TY_CD, PLC_CD) |
| `menu` | 84개 메뉴 마스터(menu_id, menu_path, app_uri, login_required) |
| `report_submission` | dmParam 공통정보(user_id, biz_rno, smit_year, smit_no, biz_tp_cd, biz_frm_cd, form_ty_cd) |
| `form_sample_offr` | 견본품 제공 — yadm_nm, ykiho, itm_nm, msup_std_cd, pack_unit, offr_qty, tot_offr_qty, offr_dd … |
| `form_symposium_offr` | 학술대회 지원 — tgt_adm_nm, schl_cnfr_nm, schl_cnfr_plc_nm, schl_cnfr_sta_dd … |
| `form_clinical_trial` | 임상시험 등의 지원 — cli_tst_txt, admt_no, cli_tst_rspr_nm, jnt_rsrcr_nm, rsrc_xpns_amt … |
| `form_product_pst` | 제품설명회 — medp_nm, trnsprt_xpns_amt, anvs_thg_xpns_amt, hme_plc_nm … |
| `form_post_market_invt` | 시판 후 조사 — re_rv_tgt_yn, sell_af_invt_tp_cd, unprc, cnt … |
| `form_expense_dc` | 대금결제 조건에 따른 비용할인 — trst_dd, paym_dd, dc_rt, cont_trst_yn … |
| `form_performance_cfr` | 구매 전 의료기기 성능확인 — perf_cfr_dd, perf_cfr_purp_txt, model_nm … |
| `uri_baseline` | 84개 메뉴의 456개 관측 URI 기준값 |

## 시드 데이터

- 메뉴 84건, URI 기준 456건, 공지 3건, 공통코드 29건, 서식별 제출건 7건
- 카멜케이스 → 스네이크케이스 예시: `bizRno → biz_rno`, `smitYear → smit_year`,
  `itmNmListDtlTxt → itm_nm_list_dtl_txt`, `schlCnfrBrchAmt → schl_cnfr_brch_amt`

## 백엔드 확인

```bash
curl http://127.0.0.1:8080/api/menus          # count=84, source=mariadb
curl http://127.0.0.1:8080/api/forms/S10      # 견본품 서식정보
curl http://127.0.0.1:8080/api/uri-baselines  # count=456
```

MyBatis 매퍼: `/home/user/kops-backend/src/main/resources/mapper/ReportMapper.xml`
