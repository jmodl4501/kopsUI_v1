"""
지출보고서 기초정보 조회 > 의약품 정보조회  —  메뉴 기준 Playwright **sync** 테스트케이스

수정은 이 파일의 `SAMPLE` / `STEPS` 만 고치면 됩니다.
컴포넌트 ID, `clx.js`, 제출 객체를 직접 다룰 필요가 없습니다.
라벨("제출연도", "조회", "상세")만 쓰고, 값은 `@sample.키` 로 참조합니다.

실행
    /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAC020000.py -q
    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAC020000 \
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
        'label': '초기화',
        'event': 'click',
        'handler': 'onBtnInit',
        'component': 'button_1',
        'line': 658,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'button_2',
        'event': 'click',
        'handler': 'onBtnSearch',
        'component': 'button_2',
        'line': 670,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'userDefinedControl_3',
        'event': 'pagechange',
        'handler': 'onUdcPagePagechange',
        'component': 'userDefinedControl_3',
        'line': 1069,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'app',
        'event': 'load',
        'handler': 'onBodyLoad',
        'component': 'app',
        'line': 1089,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {'kind': 'Submission', 'id': 'subSearch', 'line': 364, 'sent_at_lines': [113]}]
HANDLERS = [   {   'handler': 'onBodyInit',
        'line': 39,
        'params': 'e',
        'body_chars': 5,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBodyLoad',
        'line': 47,
        'params': 'e',
        'body_chars': 508,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnInit',
        'line': 67,
        'params': 'e',
        'body_chars': 609,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onUdcPagePagechange',
        'line': 85,
        'params': 'e',
        'body_chars': 20,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnSearch',
        'line': 93,
        'params': 'e',
        'body_chars': 581,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'doSearch',
        'line': 112,
        'params': '',
        'body_chars': 160,
        'submit_send': ['subSearch'],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnBizNoClick',
        'line': 122,
        'params': 'e',
        'body_chars': 1024,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnPrdNmClick',
        'line': 160,
        'params': 'e',
        'body_chars': 29991,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onUdcGridTitleUdcSelectionChange',
        'line': 212,
        'params': 'e',
        'body_chars': 393,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
SOURCE_ENDPOINTS = [   {   'source_path': 'op/opc/selectOggBriefCommBiz1List.do',
        'uri': '/kops/main/op/opc/selectOggBriefCommBiz1List.do',
        'slug': 'selectOggBriefCommBiz1List.do',
        'observed': False,
        'destructive': False}]

# ③ 기대 URI / 데이터셋 / 상세화면 / 팝업 (참고용)
EXPECTED_URIS = [   {   'uri': '/kops/main/op/opc/selectOggBriefCommBiz1List.do',
        'source_path': 'op/opc/selectOggBriefCommBiz1List.do',
        'slug': 'selectOggBriefCommBiz1List.do',
        'status': None,
        'accept': [200, 410],
        'observed': False,
        'required': False,
        'calls': 0,
        'phases': [],
        'steps': [],
        'via': ['소스참조'],
        'dataset': None,
        'destructive': False,
        'request_csv': None,
        'response_csv': None,
        'src_json': None,
        'static_callers': []}]
DATASETS = []
DETAIL_SCREENS = []
POPUPS = []

# ④ 실제 테스트 순서 — 여기만 직관적으로 편집하면 됩니다
STEPS = [   {'do': 'note', 'text': '지출보고서 기초정보 조회 > 의약품 정보조회 화면 진입 / 소스 이벤트 기반'},
    {   'do': 'expect_screen',
        'app_uri': 'app/op/opc/MsupInfmList',
        'source': 'app_op_opc_MsupInfmList.clx.js',
        'required': False},
    {'do': 'fill', 'label': '업체명', 'value': '@sample.업체명', 'required': False},
    {'do': 'click', 'label': '조회', 'settle': 1500, 'required': False}]

CASE = {
   'menu_id': 'OPAC020000',
    'path': '지출보고서 기초정보 조회 > 의약품 정보조회',
    'level': '2',
    'login_required': True,
    'screen': {   'app_uri': 'app/op/opc/MsupInfmList',
                  'source': 'app_op_opc_MsupInfmList.clx.js',
                  'title': '의약품 정보조회',
                  'menu_url_addr': 'app/op/opc/MsupInfmList.clx',
                  'bytes': 36413,
                  'components': 30,
                  'event_bindings_count': 4,
                  'handlers_count': 9},
    'open': {'via': 'direct_ui', 'init': {}, 'init_keys_for_detail': []},
    'runtime': {   'status': 'ok_direct',
                   'navigation_via': 'util.EmbApp.load (direct UI load)',
                   'access_control': 'hmrLoginTpCd=1 (client check bypassed for UI; server session '
                                     'still required',
                   'app_instance': 1,
                   'body_len': 492,
                   'clx_hit': True,
                   'screen_wait_ok': True,
                   'needs_login': True,
                   'loaded_clx': ['index.clx.js', 'YadmInfmList.clx.js', 'MsupInfmList.clx.js'],
                   'dialogs': [],
                   'popup_visits': 0,
                   'popup_buttons_tried': 0,
                   'source_popup_refs': ['util.Dialog.open'],
                   'logged_in': False},
    'strict': False,
    'test_file': 'menu_tests/test_OPAC020000.py',
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


def test_OPAC020000():
    report = run_case(CASE)          # 기본 plan 모드, live 는 옵트인
    assert report["ok"], report


if __name__ == "__main__":
    print(json.dumps(run_case(CASE), ensure_ascii=False, indent=2))
