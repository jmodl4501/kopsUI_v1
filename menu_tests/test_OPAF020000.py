"""
마이페이지 > 추가 자료 요구 현황 및 제출  —  메뉴 기준 Playwright **sync** 테스트케이스

수정은 이 파일의 `SAMPLE` / `STEPS` 만 고치면 됩니다.
컴포넌트 ID, `clx.js`, 제출 객체를 직접 다룰 필요가 없습니다.
라벨("제출연도", "조회", "상세")만 쓰고, 값은 `@sample.키` 로 참조합니다.

실행
    /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAF020000.py -q
    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAF020000 \
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
EVENTS = [   {   'kind': '이벤트바인딩',
        'label': '상세보기',
        'event': 'click',
        'handler': 'onBtnLinkClick',
        'component': 'button_1',
        'line': 556,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'userDefinedControl_3',
        'event': 'pagechange',
        'handler': 'onUdcPage1Pagechange',
        'component': 'userDefinedControl_3',
        'line': 592,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'app',
        'event': 'load',
        'handler': 'onBodyLoad',
        'component': 'app',
        'line': 612,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {'kind': 'Submission', 'id': 'subSearch', 'line': 299, 'sent_at_lines': [45]}]
HANDLERS = [   {   'handler': 'onBodyLoad',
        'line': 30,
        'params': 'e',
        'body_chars': 234,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'doSearch',
        'line': 44,
        'params': '',
        'body_chars': 696,
        'submit_send': ['subSearch'],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'fnPageInit',
        'line': 70,
        'params': '',
        'body_chars': 271,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onUdcPage1Pagechange',
        'line': 80,
        'params': 'e',
        'body_chars': 25,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnLinkClick',
        'line': 89,
        'params': 'e',
        'body_chars': 860,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
SOURCE_ENDPOINTS = [   {   'source_path': 'op/opf/selectAddDataDmndPrsntSmit.do',
        'uri': '/kops/main/op/opf/selectAddDataDmndPrsntSmit.do',
        'slug': 'selectAddDataDmndPrsntSmit.do',
        'observed': True,
        'destructive': True}]

# ③ 기대 URI / 데이터셋 / 상세화면 / 팝업 (참고용)
EXPECTED_URIS = [   {   'uri': '/kops/main/op/opf/selectAddDataDmndPrsntSmit.do',
        'slug': 'selectAddDataDmndPrsntSmit.do',
        'status': 410,
        'accept': [200, 410],
        'observed': True,
        'required': False,
        'calls': 1,
        'phases': ['screen'],
        'steps': ['openPageId'],
        'via': ['본문'],
        'dataset': 'testcases/dataset/selectAddDataDmndPrsntSmit.do.json',
        'request_csv': 'out/cases/req_selectAddDataDmndPrsntSmit.do.csv',
        'response_csv': 'out/cases/res_selectAddDataDmndPrsntSmit.do.csv',
        'src_json': 'out/cases/src_selectAddDataDmndPrsntSmit.do.json',
        'static_callers': []}]
DATASETS = [   {   'slug': 'selectAddDataDmndPrsntSmit.do',
        'uri': '/kops/main/op/opf/selectAddDataDmndPrsntSmit.do',
        'statuses': {'410': 1},
        'calls': 1,
        'request_keys': ['dmParam'],
        'response_keys': [],
        'baseline_sample': [   ('recordsTotal', '0'),
                               ('페이지행수', '10'),
                               ('페이지', '1'),
                               ('pageIndexerCount', '10')],
        'boundary_count': 6,
        'injection_count': 6,
        'masked_fields': ['chgpId', 'regpId'],
        'source_files': [],
        'source_handlers': [],
        'csv': {   'request': 'cases/req_selectAddDataDmndPrsntSmit.do.csv',
                   'response': 'cases/res_selectAddDataDmndPrsntSmit.do.csv',
                   'stack': 'cases/src_selectAddDataDmndPrsntSmit.do.json'},
        'path': 'testcases/dataset/selectAddDataDmndPrsntSmit.do.json'}]
DETAIL_SCREENS = []
POPUPS = []

# ④ 실제 테스트 순서 — 여기만 직관적으로 편집하면 됩니다
STEPS = [   {'do': 'note', 'text': '마이페이지 > 추가 자료 요구 현황 및 제출 화면 진입 / 소스 이벤트 기반'},
    {   'do': 'expect_screen',
        'app_uri': 'app/op/opf/AddDataDmndPrsntSmit',
        'source': 'app_op_opf_AddDataDmndPrsntSmit.clx.js',
        'required': False},
    {'do': 'click', 'label': '조회', 'settle': 1500, 'required': False},
    {   'do': 'expect_any',
        'uris': ['selectAddDataDmndPrsntSmit.do'],
        'accept': [200, 410],
        'required': False,
        'note': '조회/화면로드 후 메뉴 전용 URI'}]

CASE = {
   'menu_id': 'OPAF020000',
    'path': '마이페이지 > 추가 자료 요구 현황 및 제출',
    'level': '2',
    'login_required': True,
    'screen': {   'app_uri': 'app/op/opf/AddDataDmndPrsntSmit',
                  'source': 'app_op_opf_AddDataDmndPrsntSmit.clx.js',
                  'title': '추가 자료 요구 현황 및 제출',
                  'menu_url_addr': 'app/op/opf/AddDataDmndPrsntSmit.clx',
                  'bytes': 18033,
                  'components': 8,
                  'event_bindings_count': 3,
                  'handlers_count': 5},
    'open': {'via': 'direct_ui', 'init': {}, 'init_keys_for_detail': []},
    'runtime': {   'status': 'ok_direct',
                   'navigation_via': 'util.EmbApp.load (direct UI load)',
                   'access_control': 'hmrLoginTpCd=1 (client check bypassed for UI; server session '
                                     'still required',
                   'app_instance': 1,
                   'body_len': 667,
                   'clx_hit': True,
                   'screen_wait_ok': True,
                   'needs_login': True,
                   'loaded_clx': [   'index.clx.js',
                                     'MyOggBriefPrsnt.clx.js',
                                     'AddDataDmndPrsntSmit.clx.js'],
                   'dialogs': [],
                   'popup_visits': 0,
                   'popup_buttons_tried': 0,
                   'source_popup_refs': ['util.Dialog.open'],
                   'logged_in': False},
    'strict': False,
    'test_file': 'menu_tests/test_OPAF020000.py',
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


def test_OPAF020000():
    report = run_case(CASE)          # 기본 plan 모드, live 는 옵트인
    assert report["ok"], report


if __name__ == "__main__":
    print(json.dumps(run_case(CASE), ensure_ascii=False, indent=2))
