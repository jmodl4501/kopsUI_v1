"""
고객지원 > 웹 접근성 안내  —  메뉴 기준 Playwright **sync** 테스트케이스

수정은 이 파일의 `SAMPLE` / `STEPS` 만 고치면 됩니다.
컴포넌트 ID, `clx.js`, 제출 객체를 직접 다룰 필요가 없습니다.
라벨("제출연도", "조회", "상세")만 쓰고, 값은 `@sample.키` 로 참조합니다.

실행
    /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAD060000.py -q
    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAD060000 \
        /opt/hira-pwenv/bin/python menu_tests/run_all_menu_tests.py --live
"""
from __future__ import annotations

import json
from menu_case_runner import run_case

# ① 검색·입력에 쓸 샘플 데이터 — 자유롭게 수정
SAMPLE = {   '제출연도': '2025',
    '영업구분': 'S',
    '서식구분': 'S10',
    '페이지': '1',
    '페이지행수': '10',
    '업체명': '',
    '검색어': '',
    '요양기관명': '',
    '품목명': '',
    '모드': 'LIST'}

# ② 소스에서 읽은 이벤트·핸들러·endpoint (참고용, 수정 불필요)
EVENTS = []
HANDLERS = []
SOURCE_ENDPOINTS = []

# ③ 기대 URI / 데이터셋 / 상세화면 / 팝업 (참고용)
EXPECTED_URIS = [   {   'uri': '/kops/main/op/opb/selectBizInfoSubTitle.ndo',
        'slug': 'selectBizInfoSubTitle.ndo',
        'status': 200,
        'accept': [200],
        'observed': True,
        'required': False,
        'calls': 9,
        'phases': ['screen'],
        'steps': ['openPageId'],
        'via': ['본문'],
        'dataset': 'testcases/dataset/selectBizInfoSubTitle.ndo.json',
        'request_csv': 'out/cases/req_selectBizInfoSubTitle.ndo.csv',
        'response_csv': 'out/cases/res_selectBizInfoSubTitle.ndo.csv',
        'src_json': 'out/cases/src_selectBizInfoSubTitle.ndo.json',
        'static_callers': [   {   'file': 'cpr-lib_udc.js',
                                  'app_uri': 'udc/com/udcComAppHeader',
                                  'endpoints': ['op/opa/selectBizInfoSubTitle.ndo'],
                                  'callers': [   {   'handler': 'doSearch',
                                                     'line': 8994,
                                                     'reason': 'util.Submit.send at line 8996'}]}]}]
DATASETS = [   {   'slug': 'selectBizInfoSubTitle.ndo',
        'uri': '/kops/main/op/opb/selectBizInfoSubTitle.ndo',
        'statuses': {'200': 191},
        'calls': 191,
        'request_keys': ['dmParam'],
        'response_keys': ['dmSubTit'],
        'baseline_sample': [],
        'boundary_count': 3,
        'injection_count': 6,
        'masked_fields': [],
        'source_files': ['cpr-lib_udc.js'],
        'source_handlers': ['doSearch'],
        'csv': {   'request': 'cases/req_selectBizInfoSubTitle.ndo.csv',
                   'response': 'cases/res_selectBizInfoSubTitle.ndo.csv',
                   'stack': 'cases/src_selectBizInfoSubTitle.ndo.json'},
        'path': 'testcases/dataset/selectBizInfoSubTitle.ndo.json'}]
DETAIL_SCREENS = []
POPUPS = []

# ④ 실제 테스트 순서 — 여기만 직관적으로 편집하면 됩니다
STEPS = [   {'do': 'note', 'text': '고객지원 > 웹 접근성 안내 화면 진입 / 소스 이벤트 기반'},
    {   'do': 'expect_screen',
        'app_uri': 'app/op/ope/WebAccessibilityM01',
        'source': 'app_op_ope_WebAccessibilityM01.clx.js',
        'required': False}]

CASE = {
   'menu_id': 'OPAD060000',
    'path': '고객지원 > 웹 접근성 안내',
    'level': '2',
    'login_required': False,
    'screen': {   'app_uri': 'app/op/ope/WebAccessibilityM01',
                  'source': 'app_op_ope_WebAccessibilityM01.clx.js',
                  'title': '웹 접근성 안내',
                  'menu_url_addr': 'app/op/ope/WebAccessibilityM01.clx',
                  'bytes': 10932,
                  'components': 15,
                  'event_bindings_count': 0,
                  'handlers_count': 0},
    'open': {'via': 'openPageId', 'init': {}, 'init_keys_for_detail': []},
    'runtime': {   'status': 'ok',
                   'navigation_via': 'openPageId',
                   'access_control': 'public',
                   'app_instance': 1,
                   'body_len': 985,
                   'clx_hit': False,
                   'screen_wait_ok': True,
                   'needs_login': False,
                   'loaded_clx': [   'LawEcnmyPftOffrrDtlList.clx.js',
                                     'LawEcnmyPftAcpDtlList.clx.js',
                                     '.clx.js'],
                   'dialogs': [],
                   'popup_visits': 0,
                   'popup_buttons_tried': 0,
                   'source_popup_refs': [],
                   'logged_in': False},
    'strict': False,
    'test_file': 'menu_tests/test_OPAD060000.py',
    'master_md': 'out/MENU_MASTER.md',
    'dataset_file': 'menu_tests/sample_dataset.json',
    "sample": SAMPLE,
    "events": EVENTS,
    "handlers": HANDLERS,
    "source_endpoints": SOURCE_ENDPOINTS,
    "expected_uris": EXPECTED_URIS,
    "datasets": DATASETS,
    "detail_screens": DETAIL_SCREENS,
    "popups": POPUPS,
    "steps": STEPS,
}


def test_OPAD060000():
    report = run_case(CASE)          # 기본 plan 모드, live 는 옵트인
    assert report["ok"], report


if __name__ == "__main__":
    print(json.dumps(run_case(CASE), ensure_ascii=False, indent=2))
