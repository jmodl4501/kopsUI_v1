"""
마이페이지 > 회원정보관리 > 회원탈퇴 완료  —  메뉴 기준 Playwright **sync** 테스트케이스

수정은 이 파일의 `SAMPLE` / `STEPS` 만 고치면 됩니다.
컴포넌트 ID, `clx.js`, 제출 객체를 직접 다룰 필요가 없습니다.
라벨("제출연도", "조회", "상세")만 쓰고, 값은 `@sample.키` 로 참조합니다.

실행
    /opt/hira-pwenv/bin/python -m pytest menu_tests/test_OPAF034000.py -q
    HIRA_MENU_LIVE=1 HIRA_MENU_IDS=OPAF034000 \
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
        'label': '메인으로 가기',
        'event': 'click',
        'handler': 'onBtnClick',
        'component': 'button_1',
        'line': 192,
        'submit_send': False,
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
HANDLERS = [   {   'handler': 'onBtnClick',
        'line': 20,
        'params': 'e',
        'body_chars': 286,
        'submit_send': [],
        'open_page': [],
        'menu_ids': [],
        'ndo_literals': []}]
SOURCE_ENDPOINTS = []

# ③ 기대 URI / 데이터셋 / 상세화면 / 팝업 (참고용)
EXPECTED_URIS = []
DATASETS = []
DETAIL_SCREENS = []
POPUPS = []

# ④ 실제 테스트 순서 — 여기만 직관적으로 편집하면 됩니다
STEPS = [   {'do': 'note', 'text': '마이페이지 > 회원정보관리 > 회원탈퇴 완료 화면 진입 / 소스 이벤트 기반'},
    {   'do': 'expect_screen',
        'app_uri': 'app/op/opf/MbInfmOtEnd',
        'source': 'app_op_opf_MbInfmOtEnd.clx.js',
        'required': False}]

CASE = {
   'menu_id': 'OPAF034000',
    'path': '마이페이지 > 회원정보관리 > 회원탈퇴 완료',
    'level': '3',
    'login_required': True,
    'screen': {   'app_uri': 'app/op/opf/MbInfmOtEnd',
                  'source': 'app_op_opf_MbInfmOtEnd.clx.js',
                  'title': '회원탈퇴 완료',
                  'menu_url_addr': 'app/op/opf/MbInfmOtEnd.clx',
                  'bytes': 7223,
                  'components': 9,
                  'event_bindings_count': 1,
                  'handlers_count': 1},
    'open': {'via': 'direct_ui', 'init': {}, 'init_keys_for_detail': []},
    'runtime': {   'status': 'ok_direct',
                   'navigation_via': 'util.EmbApp.load (direct UI load)',
                   'access_control': 'hmrLoginTpCd=1 (client check bypassed for UI; server session '
                                     'still required',
                   'app_instance': 1,
                   'body_len': 562,
                   'clx_hit': True,
                   'screen_wait_ok': True,
                   'needs_login': True,
                   'loaded_clx': [   'MbInfmUpdInfmCfr.clx.js',
                                     'MbInfmOt.clx.js',
                                     'MbInfmOtEnd.clx.js'],
                   'dialogs': [],
                   'popup_visits': 0,
                   'popup_buttons_tried': 0,
                   'source_popup_refs': [],
                   'logged_in': False},
    'strict': False,
    'test_file': 'menu_tests/test_OPAF034000.py',
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


def test_OPAF034000():
    report = run_case(CASE)          # 기본 plan 모드, live 는 옵트인
    assert report["ok"], report


if __name__ == "__main__":
    print(json.dumps(run_case(CASE), ensure_ascii=False, indent=2))
