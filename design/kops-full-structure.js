const groups = [
  ['지출보고서 정보공개', ['지출보고서 공표자료', '지출보고서 공개자료조회', '업체별 지출보고서 공개 현황', '한눈에 보는 지출보고서 통계', '합법적 경제적 이익 제공자', '합법적 경제적 이익 제공내역', '합법적 경제적 이익 수수내역']],
  ['지출보고서 작성·정정', ['지출보고서 현황 조회', '업체 기본정보 작성', '지출보고서 작성', '정기 지출보고서 작성', '지출보고서 정정', '파일 검증 현황', '최종 확정 현황', '지출보고서 작성 기본 안내']],
  ['기관정보 관리', ['요양기관 정보 관리', '의약품 정보 관리', '의료기기 정보 관리']],
  ['알림·지원', ['공지사항', '자주 묻는 질문', '자료실', '교육 신청', '정보이관 신청 내역']],
  ['시스템 안내', ['시스템 개요', '추진 경과', '지출보고서 제도 현황', '관련 법령', '찾아오시는 길', '웹 접근성 안내']],
  ['마이페이지', ['나의 지출보고서 현황', '요양기관 지출보고서 조회', '추가자료 요구 제출', '회원정보 수정', '비밀번호 변경', '회원 탈퇴']]
];
const navy = '#123B6D';
const blue = '#146DC1';
const sky = '#EAF4FD';
const line = '#D7E0E9';
const text = '#202B38';
const white = '#FFFFFF';

function solid(color) {
  return [{ type: 'solid', color }];
}

function txt(parent, content, size, weight, color, width) {
  return I(parent, {
    type: 'text', content, width: width || 'fit_content', height: 'fit_content',
    fontSize: size, fontWeight: weight, fill: solid(color || text)
  });
}

function header(parent, active) {
  const utility = I(parent, { type: 'frame', name: '유틸리티 바', role: 'navbar', width: 'fill_container', height: 36, layout: 'horizontal', padding: [0, 40], justifyContent: 'space_between', alignItems: 'center', fill: solid('#F2F5F8') });
  txt(utility, '보건복지부 산하 건강보험심사평가원', 12, 400, '#546273');
  txt(utility, '로그인  ·  회원가입  ·  화면크기 － 100% ＋', 12, 400, '#546273');
  const nav = I(parent, { type: 'frame', name: '헤더 및 GNB', role: 'navbar', width: 'fill_container', height: 82, layout: 'horizontal', padding: [0, 40], gap: 28, alignItems: 'center', fill: solid(white), stroke: { thickness: { bottom: 1 }, fill: line } });
  const brand = I(nav, { type: 'frame', name: 'KOPS 로고', width: 265, height: 'fit_content', layout: 'horizontal', gap: 10, alignItems: 'center' });
  I(brand, { type: 'frame', width: 44, height: 44, cornerRadius: 22, fill: solid(blue) });
  txt(brand, 'KOPS\n지출보고서 관리시스템', 18, 700, navy, 200);
  groups.forEach(([name]) => txt(nav, name, 14, name === active ? 700 : 600, name === active ? blue : navy));
}

function pageTemplate(group, items, index) {
  const page = I(null, { type: 'frame', name: `${group} 화면 구조`, width: 1280, height: 1050, layout: 'vertical', fill: solid('#FFFFFF') });
  header(page, group);
  const title = I(page, { type: 'frame', name: '페이지 타이틀', width: 'fill_container', height: 120, layout: 'vertical', padding: [28, 40], gap: 8, fill: solid('#F0F7FD') });
  txt(title, `홈 > ${group}`, 12, 400, '#657383');
  txt(title, group, 28, 700, navy);
  const body = I(page, { type: 'frame', name: '콘텐츠 레이아웃', width: 'fill_container', height: 'fill_container', layout: 'horizontal', padding: [32, 40], gap: 32 });
  const lnb = I(body, { type: 'frame', name: '좌측 메뉴', role: 'navbar', width: 220, height: 'fit_content', layout: 'vertical', stroke: { thickness: 1, fill: line }, cornerRadius: 8 });
  const lnbTitle = I(lnb, { type: 'frame', width: 'fill_container', height: 60, padding: [18, 16], fill: solid(navy) });
  txt(lnbTitle, group, 17, 700, white);
  items.forEach((item, itemIndex) => {
    const row = I(lnb, { type: 'frame', role: 'button', width: 'fill_container', height: 44, padding: [13, 14], fill: solid(itemIndex === 0 ? sky : white), stroke: { thickness: { bottom: 1 }, fill: line } });
    txt(row, item, 12, itemIndex === 0 ? 700 : 400, itemIndex === 0 ? blue : text, 188);
  });
  const content = I(body, { type: 'frame', name: '업무 화면', role: 'section', width: 'fill_container', height: 'fit_content', layout: 'vertical', gap: 18 });
  const notice = I(content, { type: 'frame', name: '안내', width: 'fill_container', height: 56, padding: [17, 18], fill: solid(sky), stroke: { thickness: { left: 4 }, fill: blue } });
  txt(notice, `${group}의 조회 및 업무처리 화면입니다.`, 13, 400, '#36536D');
  const search = I(content, { type: 'frame', name: '검색 조건', role: 'section', width: 'fill_container', height: 112, layout: 'horizontal', padding: [20, 20], gap: 12, alignItems: 'center', fill: solid('#F8FAFC'), stroke: { thickness: 1, fill: line }, cornerRadius: 8 });
  ['제출연도  전체', '처리상태  전체', '검색어를 입력하세요'].forEach((label, fieldIndex) => {
    const field = I(search, { type: 'frame', role: fieldIndex === 2 ? 'input' : 'button', width: fieldIndex === 2 ? 270 : 160, height: 40, padding: [12, 12], fill: solid(white), stroke: { thickness: 1, fill: '#CBD5DF' }, cornerRadius: 4 });
    txt(field, label, 12, 400, '#657383');
  });
  const button = I(search, { type: 'frame', role: 'button', width: 76, height: 40, padding: [12, 22], fill: solid(blue), cornerRadius: 4 });
  txt(button, '조회', 13, 700, white);
  txt(content, `총 ${items.length * 12 + index}건`, 13, 600, navy);
  const table = I(content, { type: 'frame', name: '데이터 그리드', role: 'table', width: 'fill_container', height: 320, layout: 'vertical', stroke: { thickness: 1, fill: line } });
  const tableHeader = I(table, { type: 'frame', role: 'table-header', width: 'fill_container', height: 48, layout: 'horizontal', fill: solid('#EDF3F8') });
  ['No.', '제출연도', '구분', '업체명/제목', '처리상태', '등록일'].forEach((label) => txt(tableHeader, label, 12, 700, navy, label === '업체명/제목' ? 250 : 110));
  for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
    const row = I(table, { type: 'frame', role: 'table-row', width: 'fill_container', height: 48, layout: 'horizontal', fill: solid(rowIndex % 2 ? '#FBFCFD' : white), stroke: { thickness: { bottom: 1 }, fill: line } });
    [`${rowIndex + 1}`, '2026', items[rowIndex % items.length], '한국메디칼㈜', '제출완료', '2026-11-24'].forEach((value, valueIndex) => txt(row, value, 11, 400, text, valueIndex === 3 ? 250 : 110));
  }
}

groups.forEach(([group, items], index) => pageTemplate(group, items, index));
