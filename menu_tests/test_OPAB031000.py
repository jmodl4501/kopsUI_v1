"""
지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항  —  메뉴 기준 Playwright **sync** 테스트케이스

수정은 이 파일의 `SAMPLE` / `STEPS` 만 고치면 됩니다.
컴포넌트 ID, `clx.js`, 제출 객체를 직접 다룰 필요가 없습니다.
라벨("제출연도", "조회", "상세")만 쓰고, 값은 `@sample.키` 로 참조합니다.

실행
    /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAB031000.py -q
    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAB031000 \
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
    '모드': 'UPDATE',
    '선택유형': 'UPDATE',
    '시작화면': 'UPD',
    '문서유형': 'updList'}

# ② 소스에서 읽은 이벤트·핸들러·endpoint (참고용, 수정 불필요)
EVENTS = [   {   'kind': '이벤트바인딩',
        'label': 'button_1',
        'event': 'click',
        'handler': 'onBtnPopViewClick',
        'component': 'button_1',
        'line': 560,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': '지출보고서 무실적 작성하기',
        'event': 'click',
        'handler': 'onButtonClick',
        'component': 'button_2',
        'line': 727,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'button_3',
        'event': 'click',
        'handler': 'onBtnWrtClick',
        'component': 'button_3',
        'line': 738,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'kind': '이벤트바인딩',
        'label': 'app',
        'event': 'init',
        'handler': 'onBodyInit',
        'component': 'app',
        'line': 758,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
HANDLERS = [   {   'handler': 'onBtnPopViewClick',
        'line': 21,
        'params': 'e',
        'body_chars': 647,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBodyInit',
        'line': 53,
        'params': 'e',
        'body_chars': 452,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onButtonClick',
        'line': 74,
        'params': 'e',
        'body_chars': 47,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'onBtnWrtClick',
        'line': 83,
        'params': 'e',
        'body_chars': 923,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []},
    {   'handler': 'fnGuideSetting',
        'line': 122,
        'params': '',
        'body_chars': 446,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
SOURCE_ENDPOINTS = []

# ③ 기대 URI / 데이터셋 / 상세화면 / 팝업 (참고용)
EXPECTED_URIS = [   {   'uri': '/kops/main/op/opb/selectBizWrtTgtList.do',
        'slug': 'selectBizWrtTgtList.do',
        'status': 410,
        'accept': [200, 410],
        'observed': True,
        'required': False,
        'calls': 1,
        'phases': ['screen'],
        'steps': ['openPageId'],
        'via': ['본문'],
        'dataset': 'testcases/dataset/selectBizWrtTgtList.do.json',
        'request_csv': 'out/cases/req_selectBizWrtTgtList.do.csv',
        'response_csv': 'out/cases/res_selectBizWrtTgtList.do.csv',
        'src_json': 'out/cases/src_selectBizWrtTgtList.do.json',
        'static_callers': []}]
DATASETS = [   {   'slug': 'selectBizWrtTgtList.do',
        'uri': '/kops/main/op/opb/selectBizWrtTgtList.do',
        'statuses': {'410': 24},
        'calls': 24,
        'request_keys': ['dmParam'],
        'response_keys': [],
        'baseline_sample': [],
        'boundary_count': 3,
        'injection_count': 6,
        'masked_fields': [],
        'source_files': [],
        'source_handlers': [],
        'csv': {   'request': 'cases/req_selectBizWrtTgtList.do.csv',
                   'response': 'cases/res_selectBizWrtTgtList.do.csv',
                   'stack': 'cases/src_selectBizWrtTgtList.do.json'},
        'path': 'testcases/dataset/selectBizWrtTgtList.do.json'}]
DETAIL_SCREENS = []
POPUPS = [   {   'button': '작성대상 보기',
        'ok': True,
        'reason': 'click_작성대상 보기',
        'phase': 'popup_button',
        'text': '',
        'uris': []}]

# ④ 실제 테스트 순서 — 여기만 직관적으로 편집하면 됩니다
STEPS = [   {'do': 'note', 'text': '지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항 화면 진입 / 소스 이벤트 기반'},
    {   'do': 'expect_screen',
        'app_uri': 'app/op/opb/OggBriefBseLte',
        'source': 'app_op_opb_OggBriefBseLte.clx.js',
        'required': False},
    {'do': 'select', 'label': '제출연도', 'value': '@sample.제출연도', 'required': False},
    {'do': 'select', 'label': '영업구분', 'value': '@sample.영업구분', 'required': False},
    {   'do': 'expect_any',
        'uris': ['selectBizWrtTgtList.do'],
        'accept': [200, 410],
        'required': False,
        'note': '조회/화면로드 후 메뉴 전용 URI'},
    {'do': 'popup', 'label': '작성대상 보기', 'settle': 1200, 'required': False}]

CASE = {
   'menu_id': 'OPAB031000',
    'path': '지출보고서 작성ㆍ정정 > 지출보고서 실태조사 > 지출보고서 기본사항',
    'level': '3',
    'login_required': True,
    'screen': {   'app_uri': 'app/op/opb/OggBriefBseLte',
                  'source': 'app_op_opb_OggBriefBseLte.clx.js',
                  'title': '지출보고서 기본사항',
                  'menu_url_addr': 'app/op/opb/OggBriefBseLte.clx',
                  'bytes': 23126,
                  'components': 16,
                  'event_bindings_count': 4,
                  'handlers_count': 5},
    'open': {'via': 'direct_ui', 'init': {}, 'init_keys_for_detail': []},
    'runtime': {   'status': 'ok_direct',
                   'navigation_via': 'util.EmbApp.load (direct UI load)',
                   'access_control': 'hmrLoginTpCd=1 (client check bypassed for UI; server session '
                                     'still required',
                   'app_instance': 1,
                   'body_len': 922,
                   'clx_hit': True,
                   'screen_wait_ok': True,
                   'needs_login': True,
                   'loaded_clx': [   'OggBriefFormWrt7.clx.js',
                                     'LastFdecList.clx.js',
                                     'OggBriefBseLte.clx.js'],
                   'dialogs': [],
                   'popup_visits': 0,
                   'popup_buttons_tried': 1,
                   'source_popup_refs': ['util.Dialog.open'],
                   'logged_in': False},
    'strict': False,
    'test_file': 'menu_tests/test_OPAB031000.py',
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


def test_OPAB031000():
    report = run_case(CASE)          # 기본 plan 모드, live 는 옵트인
    assert report["ok"], report


if __name__ == "__main__":
    print(json.dumps(run_case(CASE), ensure_ascii=False, indent=2))
