"""Generate MariaDB DDL/seed SQL from the KOPS OpenAPI guide (2026.09).

Source: uploads/지출보고서_관리시스템_OpenAPI_개발가이드(26.9.).pdf
All camelCase request field names are converted to snake_case columns.
"""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
CASES = json.loads((ROOT / "data_menu_cases.json").read_text(encoding="utf-8"))

# (camelCase name, type, size, Korean description from the guide)
COMMON = [
    ("userId", "String", 12, "회원아이디"),
    ("bizRno", "String", 10, "사업자등록번호"),
    ("smitYear", "String", 4, "제출연도(회계연도+1)"),
    ("smitNo", "String", 7, "제출번호"),
    ("bizTpCd", "String", 1, "영업구분 S(의약품) E(의료기기)"),
    ("bizFrmCd", "String", 3, "영업유형"),
    ("formTyCd", "String", 3, "지출보고서서식코드"),
]

# 7 form types: 견본품 제공 ~ 구매 전 의료기기의 성능 확인을 위한 사용
FORMS: dict[str, dict] = {
    "form_sample_offr": {
        "label": "견본품 제공",
        "code": "S10/E10",
        "endpoint": "wrtSampleOffr.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("yadmNm", "String", 400, "요양기관명칭"),
            ("ykiho", "String", 8, "요양기관기호"),
            ("itmNm", "String", 400, "제품명(표준코드명칭)"),
            ("msupStdCd", "String", 13, "제품코드(표준코드)"),
            ("modelNm", "String", 400, "모델명(의료기기)"),
            ("permCertRptNo", "String", 30, "허가·인증 또는 신고번호(의료기기)"),
            ("packUnit", "Number", 10, "포장내총수량(규격)"),
            ("offrQty", "Number", 10, "제공수량"),
            ("totOffrQty", "Number", 10, "계 = 포장내총수량 × 제공수량"),
            ("offrDd", "String", 8, "제공일자 yyyyMMdd"),
        ],
    },
    "form_symposium_offr": {
        "label": "학술대회 지원",
        "code": "S20/E20",
        "endpoint": "wrtSymposium.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("tgtAdmNm", "String", 400, "주최기관"),
            ("schlCnfrNm", "String", 400, "대회명칭"),
            ("schlCnfrPlcNm", "String", 400, "대회장소"),
            ("schlCnfrStaDd", "String", 8, "대회시작일시 yyyyMMdd"),
            ("schlCnfrEndDd", "String", 8, "대회종료일시 yyyyMMdd"),
            ("schlCnfrBrchAmt", "Number", 10, "지원금액"),
        ],
    },
    "form_clinical_trial": {
        "label": "임상시험 등의 지원",
        "code": "S31/E31",
        "endpoint": "wrtClinicalTrial.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("cliTstTxt", "String", 1000, "명칭"),
            ("cliTstTpCd", "String", 1, "구분"),
            ("admtNo", "String", 30, "승인번호"),
            ("admtDd", "String", 8, "승인일자"),
            ("cliTstRsprNm", "String", 400, "성명(책임자)"),
            ("cliTstRsprYkiho", "String", 8, "요양기관기호(책임자)"),
            ("cliTstRsprPstnNm", "String", 400, "요양기관명칭(책임자)"),
            ("jntRsrcrNm", "String", 400, "성명(공동연구자)"),
            ("jntRsrcrYkiho", "String", 8, "요양기관기호(공동연구자)"),
            ("jntRsrcrPstnNm", "String", 400, "요양기관명칭(공동연구자)"),
            ("rsrcXpnsAmt", "Number", 22, "연구비"),
            ("msupStdCdListDt", "String", 4000, "제품코드 목록"),
            ("lTxt", "String", 4000, "제품명(표준코드명칭)"),
            ("itmNmListDtlTxt", "String", 4000, "제품코드(표준코드)"),
            ("offrQty", "Number", 22, "수량"),
            ("ctrtStaDd", "String", 8, "계약일"),
            ("ctrtEndDd", "String", 8, "수정계약일"),
            ("modelNm", "String", 400, "모델명"),
            ("stDtlTxt", "String", 4000, "허가·인증 또는 신고번호"),
        ],
    },
    "form_product_pst": {
        "label": "제품설명회",
        "code": "S41/E41",
        "endpoint": "wrtProductPst.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("itmNmListDtlTxt", "String", 4000, "제품명(표준코드명칭)"),
            ("lTxt", "String", 4000, "제품코드(표준코드)"),
            ("medpNm", "String", 400, "의료인명"),
            ("yadmNm", "String", 400, "요양기관명"),
            ("ykiho", "String", 8, "요양기관기호"),
            ("trnsprtXpnsAmt", "Number", 12, "교통비용"),
            ("anvsThgXpnsAmt", "Number", 12, "기념품비"),
            ("stynXpnsAmt", "Number", 12, "숙박비"),
            ("mealXpnsAmt", "Number", 12, "식음료비"),
            ("hmePlcNm", "String", 400, "개최장소"),
            ("staYmdHm", "String", 12, "시작일시 yyyyMMddHHmmss"),
            ("endYmdHm", "String", 12, "종료일시 yyyyMMddHHmmss"),
            ("jntHmeYn", "String", 1, "공동개최여부 Y,N"),
            ("xt", "String", 4000, "모델명"),
            ("stDtlTxt", "String", 4000, "허가·인증 또는 신고번호"),
            ("natNm", "String", 400, "국가"),
            ("plcNm", "String", 400, "도시"),
        ],
    },
    "form_post_market_invt": {
        "label": "시판 후 조사",
        "code": "E44",
        "endpoint": "wrtPostMarketInvt.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("itmNmListDtlTxt", "String", 4000, "제품명"),
            ("xt", "String", 4000, "모델명"),
            ("stDtlTxt", "String", 4000, "허가·인증 또는 신고번호"),
            ("lTxt", "String", 4000, "제품코드"),
            ("yadmNm", "String", 400, "요양기관명"),
            ("ykiho", "String", 8, "요양기관기호"),
            ("medpNm", "String", 400, "의료인명"),
            ("mealXpnsAmt", "Number", 10, "식음료비"),
            ("hmePlcNm", "String", 400, "장소"),
            ("staYmdHm", "String", 12, "시작일시"),
            ("endYmdHm", "String", 12, "종료일시"),
            ("jntHmeYn", "String", 1, "공동개최여부 Y,N"),
            ("reRvTgtYn", "String", 3, "재심사대상여부 Y,N"),
            ("sellAfInvtTpCd", "String", 1, "구분"),
            ("unprc", "Number", 10, "단가/건"),
            ("cnt", "Number", 10, "건수"),
        ],
    },
    "form_expense_dc": {
        "label": "대금결제 조건에 따른 비용할인",
        "code": "E50",
        "endpoint": "wrtExpenseDC.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("itmNmListDtlTxt", "String", 4000, "품목명"),
            ("xt", "String", 4000, "모델명"),
            ("stDtlTxt", "String", 4000, "허가·인증 또는 신고번호"),
            ("reRvTgtYn", "String", 1, "시판후조사대상여부 Y,N"),
            ("medpNm", "String", 400, "의료인명"),
            ("yadmNm", "String", 400, "요양기관명"),
            ("ykiho", "String", 8, "요양기관기호"),
            ("sellAfInvtTpCd", "String", 1, "구분"),
            ("unprc", "Number", 10, "단가/건"),
            ("cnt", "Number", 10, "건수"),
            ("trstDd", "String", 8, "거래일자 yyyyMMdd"),
            ("paymDd", "String", 8, "결제일자 yyyyMMdd"),
            ("dcRt", "Number", 10, "할인율"),
            ("contTrstYn", "String", 1, "계속적거래여부 Y,N"),
        ],
    },
    "form_performance_cfr": {
        "label": "구매 전 의료기기의 성능 확인을 위한 사용",
        "code": "E70",
        "endpoint": "wrtPerfomanceCfr.do",
        "fields": [
            ("wrtSno", "Number", 7, "번호"),
            ("yadmNm", "String", 400, "요양기관명"),
            ("ykiho", "String", 8, "요양기관기호"),
            ("itmNmListDtlTxt", "String", 4000, "의료기기명/품목명"),
            ("modelNm", "String", 400, "모델명"),
            ("stDtlTxt", "String", 4000, "허가·인증 또는 신고번호"),
            ("perfCfrDd", "String", 8, "성능확인일자 yyyyMMdd"),
            ("perfCfrPurpTxt", "String", 1000, "성능확인 목적"),
            ("offrQty", "Number", 10, "제공수량"),
            ("unprc", "Number", 10, "단가/건"),
            ("trstDd", "String", 8, "거래일자 yyyyMMdd"),
            ("paymDd", "String", 8, "결제일자 yyyyMMdd"),
            ("dcRt", "Number", 10, "할인율"),
            ("contTrstYn", "String", 1, "계속적거래여부 Y,N"),
        ],
    },
}


def snake(name: str) -> str:
    """camelCase/PascalCase -> snake_case (acronyms handled)."""
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    value = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", value)
    return value.lower()


def sql_type(kind: str, size: int, name: str) -> str:
    if kind == "String":
        if size > 1000:
            return "TEXT"
        return f"VARCHAR({size})"
    amount = any(word in name.lower() for word in ("amt", "unprc", "dc_rt"))
    if amount:
        return "DECIMAL(18,2)"
    if size <= 9:
        return "INT"
    return "BIGINT"


def escaped(value: str) -> str:
    return value.replace("'", "''")


def ddl() -> str:
    lines = [
        "-- KOPS MariaDB schema — generated by scripts/gen_schema.py",
        "-- Source: OpenAPI 개발 가이드(26.9.) 지출보고서 서식정보 7종",
        "-- All column names are camelCase -> snake_case conversions.",
        "CREATE DATABASE IF NOT EXISTS kops CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
        "USE kops;",
        "SET NAMES utf8mb4;",
        "",
        "DROP TABLE IF EXISTS uri_baseline, form_performance_cfr, form_expense_dc,",
        "  form_post_market_invt, form_product_pst, form_clinical_trial,",
        "  form_symposium_offr, form_sample_offr, report_submission, menu,",
        "  common_code, notice;",
        "",
        "CREATE TABLE notice (",
        "  id BIGINT NOT NULL AUTO_INCREMENT,",
        "  title VARCHAR(200) NOT NULL COMMENT '공지사항 제목',",
        "  content TEXT NOT NULL COMMENT '내용',",
        "  writer VARCHAR(50) NOT NULL COMMENT '작성자',",
        "  view_count INT NOT NULL DEFAULT 0 COMMENT '조회수',",
        "  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
        "  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
        "  PRIMARY KEY (id), KEY idx_notice_created_at (created_at)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='고객지원 공지사항';",
        "",
        "CREATE TABLE common_code (",
        "  code_group VARCHAR(30) NOT NULL COMMENT '코드그룹(SAL_TP_CD 등)',",
        "  code VARCHAR(20) NOT NULL COMMENT '코드',",
        "  code_name VARCHAR(200) NOT NULL COMMENT '코드명',",
        "  sort_order INT NOT NULL DEFAULT 0,",
        "  PRIMARY KEY (code_group, code)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='공통코드';",
        "",
        "CREATE TABLE menu (",
        "  menu_id CHAR(10) NOT NULL COMMENT '메뉴ID(OPAA020000)',",
        "  menu_path VARCHAR(300) NOT NULL COMMENT '메뉴 경로',",
        "  menu_title VARCHAR(200) NOT NULL COMMENT '화면명',",
        "  menu_group VARCHAR(100) NOT NULL,",
        "  menu_section VARCHAR(100) NOT NULL,",
        "  depth INT NOT NULL DEFAULT 1,",
        "  app_uri VARCHAR(200) NULL COMMENT '화면식별자',",
        "  login_required CHAR(1) NOT NULL DEFAULT 'N',",
        "  PRIMARY KEY (menu_id), KEY idx_menu_group (menu_group)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='84개 메뉴 마스터';",
        "",
        "CREATE TABLE report_submission (",
        "  id BIGINT NOT NULL AUTO_INCREMENT,",
    ]
    for camel, kind, size, desc in COMMON:
        column = snake(camel)
        nullable = "" if camel in ("userId", "smitYear", "smitNo") else " NULL"
        lines.append(
            f"  {column} {sql_type(kind, size, camel)}{nullable} COMMENT '{escaped(desc)}',"
        )
    lines += [
        "  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
        "  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
        "  PRIMARY KEY (id),",
        "  KEY idx_submission_key (smit_year, smit_no, biz_tp_cd),",
        "  KEY idx_submission_user (user_id)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='지출보고서 제출 공통정보(dmParam)';",
        "",
    ]
    for table, meta in FORMS.items():
        lines.append(f"CREATE TABLE {table} (")
        lines.append("  id BIGINT NOT NULL AUTO_INCREMENT,")
        lines.append("  submission_id BIGINT NOT NULL COMMENT 'report_submission.id',")
        for camel, kind, size, desc in meta["fields"]:
            column = snake(camel)
            lines.append(
                f"  {column} {sql_type(kind, size, camel)} NULL COMMENT '{escaped(desc)}',"
            )
        lines += [
            "  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
            "  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,",
            "  PRIMARY KEY (id),",
            f"  KEY idx_{table}_submission (submission_id),",
            f"  CONSTRAINT fk_{table}_submission FOREIGN KEY (submission_id)",
            "    REFERENCES report_submission(id) ON DELETE CASCADE",
            f") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='{escaped(meta['label'])} 서식정보';",
            "",
        ]
    lines += [
        "CREATE TABLE uri_baseline (",
        "  slug VARCHAR(120) NOT NULL COMMENT 'URI 파일명',",
        "  uri VARCHAR(300) NOT NULL,",
        "  menu_id CHAR(10) NOT NULL,",
        "  expected_status INT NOT NULL DEFAULT 200,",
        "  PRIMARY KEY (slug, menu_id)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='테스트케이스 관측 URI 기준';",
        "",
    ]
    return "\n".join(lines)


def seed() -> str:
    lines = [
        "-- Generated seed data",
        "USE kops;",
        "SET NAMES utf8mb4;",
        "",
        "INSERT INTO notice (title, content, writer) VALUES",
        "  ('KOPS 시스템 이용 안내', 'eGovFrame 5.0 기반 KOPS 포털이 개설되었습니다.', '관리자'),",
        "  ('지출보고서 작성 마감 안내', '2025 회계연도 지출보고서는 2026년 2월 28일까지 작성하세요.', '관리자'),",
        "  ('정기 점검 안내', '매주 일요일 02:00~04:00 정기 점검을 실시합니다.', '관리자');",
        "",
        "INSERT INTO common_code (code_group, code, code_name, sort_order) VALUES",
        "  ('SAL_TP_CD','S','의약품',1), ('SAL_TP_CD','E','의료기기',2),",
    ]
    for index, (name, code) in enumerate(
        [
            ("제조", "S10"), ("수입", "S20"), ("도매", "S30"), ("판촉영업", "S40"),
            ("의료기기 제조", "E10"), ("체외진단제조", "E11"), ("디지털제조", "E12"),
            ("의료기기 수입", "E20"), ("판매임대", "E30"), ("의료기기 판촉영업", "E40"),
        ],
        start=1,
    ):
        lines.append(f"  ('SAL_FRM_CD','{code}','{name}',{index}),")
    lines[-1] = lines[-1].rstrip(",") + ";"
    lines += [
        "",
        "INSERT INTO common_code (code_group, code, code_name, sort_order) VALUES",
        "  ('FORM_TY_CD','S10','견본품 제공',1), ('FORM_TY_CD','S20','학술대회 지원',2),",
        "  ('FORM_TY_CD','S31','임상시험 등의 지원',3), ('FORM_TY_CD','S41','제품설명회',4),",
        "  ('FORM_TY_CD','E44','시판 후 조사',5), ('FORM_TY_CD','E50','대금결제 조건에 따른 비용할인',6),",
        "  ('FORM_TY_CD','E70','구매 전 의료기기의 성능 확인을 위한 사용',7),",
        "  ('PLC_CD','11','서울',1), ('PLC_CD','21','부산',2),",
        "  ('PLC_CD','22','인천',3), ('PLC_CD','23','대구',4),",
        "  ('PLC_CD','24','광주',5), ('PLC_CD','25','대전',6),",
        "  ('PLC_CD','26','울산',7), ('PLC_CD','29','세종',8),",
        "  ('PLC_CD','31','경기',9), ('PLC_CD','32','강원',10);",
        "",
    ]

    for case in CASES["cases"]:
        app_uri = (case.get("screen") or {}).get("app_uri") or ""
        parts = [p.strip().replace("'", "''") for p in case["path"].split(">")]
        lines.append(
            "INSERT INTO menu (menu_id, menu_path, menu_title, menu_group, menu_section, depth, app_uri, login_required) "
            f"VALUES ('{case['menu_id']}', '{' > '.join(parts)}', "
            f"'{(case['screen']['title'] or parts[-1]).replace(chr(39), chr(39)*2)}', "
            f"'{parts[0]}', '{parts[1] if len(parts) > 1 else parts[0]}', {len(parts)}, "
            f"'{app_uri}', '{'Y' if case.get('login_required') else 'N'}');"
        )
    lines.append("")

    seen: set[tuple[str, str]] = set()
    for case in CASES["cases"]:
        for entry in case.get("expected_uris", []):
            slug = entry.get("slug") or entry["uri"].rsplit("/", 1)[-1]
            key = (slug, case["menu_id"])
            if key in seen:
                continue
            seen.add(key)
            lines.append(
                "INSERT INTO uri_baseline (slug, uri, menu_id, expected_status) VALUES "
                f"('{slug}', '{(entry.get('uri') or '').replace(chr(39), chr(39)*2)}', "
                f"'{case['menu_id']}', {entry.get('status') or 200});"
            )
    lines.append("")

    # 7 form submissions with representative item rows.
    for number, (table, meta) in enumerate(FORMS.items(), start=1):
        biz_tp = "S" if number <= 4 else "E"
        form_code = meta["code"].split("/")[0]
        smit_no = f"{biz_tp}10000{number}"
        common_values = [
            "'demo-user'", "'1234567890'", "'2025'", f"'{smit_no}'",
            f"'{biz_tp}'", f"'{form_code[:3]}'", f"'{form_code}'",
        ]
        lines.append(
            "INSERT INTO report_submission "
            "(user_id, biz_rno, smit_year, smit_no, biz_tp_cd, biz_frm_cd, form_ty_cd) "
            "VALUES (" + ", ".join(common_values) + ");"
        )
        lines.append(f"SET @submission_id{number} = LAST_INSERT_ID();")
        columns = ["submission_id", "wrt_sno"]
        values = [f"@submission_id{number}", "1"]
        for camel, kind, size, _ in meta["fields"][1:]:
            column = snake(camel)
            columns.append(column)
            if kind == "Number" or camel in ("dcRt",):
                values.append("1" if "dc_rt" not in column else "5.00")
            elif camel in ("offrDd", "admtDd", "ctrtStaDd", "ctrtEndDd", "trstDd", "paymDd", "perfCfrDd"):
                values.append("'20251125'")
            elif camel in ("staYmdHm", "endYmdHm"):
                values.append("'202511251000'")
            elif column.endswith("_yn"):
                values.append("'Y'")
            elif column in ("cli_tst_tp_cd", "sell_af_invt_tp_cd"):
                values.append("'1'")
            elif size > 1000:
                values.append("'샘플 데이터'")
            else:
                values.append("'샘플'")
        lines.append(
            f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(values)});"
        )
    lines.append("")
    return "\n".join(lines)


(ROOT / "sql/schema.sql").write_text(ddl(), encoding="utf-8")
(ROOT / "sql/seed.sql").write_text(seed(), encoding="utf-8")
print(f"schema: {len((ROOT / 'sql/schema.sql').read_text(encoding='utf-8'))} bytes")
print(f"seed: {len((ROOT / 'sql/seed.sql').read_text(encoding='utf-8'))} bytes")
print("tables:", len(FORMS) + 5)
