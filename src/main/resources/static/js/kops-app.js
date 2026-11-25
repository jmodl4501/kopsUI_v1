/* global tui, KOPS_CONFIG */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const gnb = document.getElementById('gnb');
  const megaMenu = document.getElementById('mega-menu');
  const dialog = document.getElementById('dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogBody = document.getElementById('dialog-body');
  const dialogConfirm = document.getElementById('dialog-confirm');
  const toast = document.getElementById('toast');
  const screens = KOPS_CONFIG.screens;
  const screenMap = new Map(screens.map((screen) => [screen.id, screen]));
  const groups = [...new Set(screens.filter((screen) => screen.group !== '홈').map((screen) => screen.group))];
  const labels = {
    rn: '번호', bltNo: '게시물번호', bltTtl: '제목', prbmDtlTxt: '질문', ansDtlTxt: '답변', regDt: '등록일',
    oggBriefSmitYr: '제출연도', oggBriefSmitNo: '제출번호', salTpNm: '업종', salFrmNm: '구분', entpNm: '업체명', telno: '전화번호',
    stdYear: '기준연도', stdBYear: '비교연도', stdByear: '비교연도', stdSum: '금액', diffSum: '증감액', commCdNm: '구분', commCdTxt: '설명',
    gubun: '구분', dChartColumn1: '의약품', dChartColumn2: '의료기기', dChartColumn3: '합계', exttOno: '기관수',
    title: '제목', company: '업체명', year: '제출연도', type: '서식 구분', status: '처리상태', updatedAt: '최종수정일', writer: '담당자', code: '기관기호', product: '품목명'
  };
  const formNames = KOPS_CONFIG.formTypes;
  let datasets = {};
  let currentGrid = null;
  let currentRows = [];
  let currentScreen = null;
  let zoom = 1;
  let toastTimer = null;
  let dialogAction = null;

  const mockRows = Array.from({ length: 17 }, (_, index) => ({
    id: index + 1,
    year: index % 2 ? '2025' : '2026',
    company: ['한국메디칼㈜', '건강제약㈜', '바른의료기기㈜', '미래바이오㈜'][index % 4],
    type: formNames[index % formNames.length],
    status: ['작성중', '제출완료', '검증완료', '정정요청'][index % 4],
    updatedAt: `2026-11-${String(24 - (index % 15)).padStart(2, '0')}`,
    writer: ['김담당', '이관리', '박보고', '최확인'][index % 4]
  }));

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function routeTo(id) {
    window.location.hash = id === 'home' ? '#home' : `#${id}`;
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function openDialog(title, html, action = null, confirmText = '확인') {
    dialogTitle.textContent = title;
    dialogBody.innerHTML = html;
    dialogConfirm.textContent = confirmText;
    dialogConfirm.hidden = !action;
    dialogAction = action;
    dialog.hidden = false;
    const firstInput = dialogBody.querySelector('input,select,textarea');
    if (firstInput) firstInput.focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    dialogAction = null;
  }

  function menuScreens(group) {
    return screens.filter((screen) => screen.group === group && !screen.hidden);
  }

  function buildNavigation() {
    gnb.innerHTML = groups.map((group) => `<button type="button" data-mega="${escapeHtml(group)}">${escapeHtml(group)}</button>`).join('');
  }

  function openMega(group) {
    const items = menuScreens(group);
    const sections = [...new Set(items.map((item) => item.section || '메뉴'))];
    megaMenu.innerHTML = `<div class="shell mega-inner">
      <div class="mega-title"><h2>${escapeHtml(group)}</h2><p>KOPS의 ${escapeHtml(group)} 관련 서비스를 이용할 수 있습니다.</p></div>
      <div class="mega-sections">${sections.map((section) => `<section class="mega-section"><h3>${escapeHtml(section)}</h3>${items.filter((item) => (item.section || '메뉴') === section).map((item) => `<button type="button" data-route="${item.id}">${escapeHtml(item.title)}</button>`).join('')}</section>`).join('')}</div>
    </div>`;
    megaMenu.hidden = false;
    gnb.querySelectorAll('button').forEach((button) => button.classList.toggle('active', button.dataset.mega === group));
  }

  function closeMega() {
    megaMenu.hidden = true;
    gnb.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
  }

  function lnbHtml(screen) {
    const items = menuScreens(screen.group);
    const sections = [...new Set(items.map((item) => item.section || '메뉴'))];
    return `<aside class="lnb"><h2>${escapeHtml(screen.group)}</h2>${sections.map((section) => `<div class="lnb-section">${escapeHtml(section)}</div>${items.filter((item) => (item.section || '메뉴') === section).map((item) => `<button type="button" class="${item.id === screen.id ? 'active' : ''}" data-route="${item.id}">${escapeHtml(item.title)}</button>`).join('')}`).join('')}</aside>`;
  }

  function pageFrame(screen, body) {
    return `<section class="page-head"><div class="shell"><div class="breadcrumbs">홈 &gt; ${escapeHtml(screen.group)} &gt; ${escapeHtml(screen.title)}</div><h1>${escapeHtml(screen.title)}</h1><p>KOPS 지출보고서 관리시스템에서 제공하는 서비스입니다.</p></div></section>
      <div class="shell content-layout">${lnbHtml(screen)}<article class="page-body">${body}</article></div>`;
  }

  function searchHtml(kind = 'default') {
    const extra = kind === 'public' ? `<div class="field"><label for="search-type">공개 구분</label><select id="search-type"><option value="">전체</option>${formNames.map((name) => `<option>${escapeHtml(name)}</option>`).join('')}</select></div>` : `<div class="field"><label for="search-status">처리상태</label><select id="search-status"><option value="">전체</option><option>작성중</option><option>제출완료</option><option>검증완료</option><option>정정요청</option></select></div>`;
    return `<form id="search-form" class="search-panel"><div class="field"><label for="search-year">제출연도</label><select id="search-year"><option value="">전체</option><option>2026</option><option>2025</option><option>2024</option></select></div>${extra}<div class="field span-2"><label for="search-keyword">검색어</label><input id="search-keyword" type="search" placeholder="업체명, 제목 또는 키워드를 입력하세요"></div><div class="search-actions"><button type="submit" class="button primary">조회</button><button type="reset" class="button secondary">초기화</button></div></form>`;
  }

  function tabsHtml(prefix, active = '') {
    return `<div class="tabs" role="tablist">${formNames.map((name, index) => { const id = `${prefix}-${index + 1}`; return `<button type="button" role="tab" class="${id === active ? 'active' : ''}" data-route="${id}">${escapeHtml(name)}</button>`; }).join('')}</div>`;
  }

  function workflowTabs(prefix, companyId, active = '') {
    return `<div class="tabs" role="tablist"><button type="button" role="tab" class="${companyId === active ? 'active' : ''}" data-route="${companyId}">업체별 전체 현황</button>${formNames.map((name, index) => { const id = `${prefix}-${index + 1}`; return `<button type="button" role="tab" class="${id === active ? 'active' : ''}" data-route="${id}">${escapeHtml(name)}</button>`; }).join('')}</div>`;
  }

  function resultHtml(rows, options = {}) {
    currentRows = rows;
    return `<div class="result-tools"><span>총 <strong id="result-count">${rows.length}</strong>건</span><div>${options.add ? '<button type="button" class="button positive small" data-action="new">신규 작성</button>' : ''}<button type="button" class="button secondary small" data-action="export">엑셀 다운로드</button></div></div><div id="grid" aria-label="조회 결과"></div>`;
  }

  function datasetRows(screen) {
    const source = datasets[screen.dataset] || {};
    const key = Object.keys(source).find((name) => Array.isArray(source[name]) && source[name].length);
    return key ? source[key].filter(Boolean) : [];
  }

  function gridColumns(rows) {
    if (!rows.length) return [{ header: '안내', name: 'message', minWidth: 500 }];
    const excluded = new Set(['bltDtlTxt', 'ansDtlTxt', 'apndFileNm', 'delYn', 'bltYn', 'sortOrd', 'dataTpCd', 'salTpCd', 'salFrmCd']);
    const keys = Object.keys(rows[0]).filter((key) => !excluded.has(key) && rows.some((row) => row[key] !== null && typeof row[key] !== 'object')).slice(0, 7);
    return keys.map((key, index) => ({
      header: labels[key] || key,
      name: key,
      minWidth: index === 0 ? 130 : 100,
      align: ['stdSum', 'diffSum', 'dChartColumn1', 'dChartColumn2', 'dChartColumn3'].includes(key) ? 'right' : 'center',
      ellipsis: true
    }));
  }

  function mountGrid(rows) {
    const gridElement = document.getElementById('grid');
    if (!gridElement) return;
    if (currentGrid) {
      currentGrid.destroy();
      currentGrid = null;
    }
    const data = rows.length ? rows : [{ message: '조회된 데이터가 없습니다.' }];
    currentGrid = new tui.Grid({
      el: gridElement,
      data,
      columns: gridColumns(data),
      rowHeaders: rows.length ? ['rowNum'] : [],
      bodyHeight: 400,
      rowHeight: 42,
      minRowHeight: 42,
      pageOptions: { useClient: true, perPage: 10, visiblePages: 5 },
      columnOptions: { resizable: true },
      selectionUnit: 'row',
      usageStatistics: false
    });
    currentGrid.on('dblclick', (event) => {
      if (event.rowKey === undefined || !rows.length) return;
      const row = currentGrid.getRow(event.rowKey);
      openDetail(row);
    });
  }

  function openDetail(row) {
    const entries = Object.entries(row).filter(([, value]) => value !== null && typeof value !== 'object').slice(0, 12);
    openDialog('상세 정보', `<div class="form-table">${entries.map(([key, value]) => `<label>${escapeHtml(labels[key] || key)}</label><div class="form-cell">${escapeHtml(value)}</div>`).join('')}</div>`);
  }

  async function fetchNotices() {
    try {
      const response = await fetch('/api/notices?page=1&size=20');
      if (!response.ok) throw new Error('notice');
      const data = await response.json();
      return data.contents || [];
    } catch {
      return [];
    }
  }

  async function renderHome() {
    const notices = await fetchNotices();
    app.innerHTML = `<section class="hero"><div class="shell hero-inner"><h1>의약품·의료기기<br>지출보고서 관리시스템</h1><p>경제적 이익 지출보고서의 작성부터 공개까지 투명하게 관리합니다.</p><div class="hero-actions"><button type="button" class="button primary" data-route="report-write">지출보고서 작성</button><button type="button" class="button secondary" data-route="public-search">공개자료 조회</button></div><div class="hero-art" aria-hidden="true"></div></div></section>
      <section class="quick-area"><div class="shell quick-grid"><button class="quick-card" type="button" data-route="report-status"><i>✓</i><strong>작성 현황 조회</strong><span>보고서 작성 및 제출 현황</span></button><button class="quick-card" type="button" data-route="public-search"><i>⌕</i><strong>공개자료 조회</strong><span>업체·서식별 공개자료 검색</span></button><button class="quick-card" type="button" data-route="statistics"><i>▥</i><strong>한눈에 보는 통계</strong><span>연도별 지출보고서 통계</span></button><button class="quick-card" type="button" data-route="education"><i>▶</i><strong>교육 신청</strong><span>사용자 교육 일정 및 신청</span></button></div></section>
      <div class="shell home-content"><section class="home-board"><div class="home-board-head"><h2>공지사항</h2><button type="button" class="button secondary small" data-route="notice">더보기</button></div><ul class="home-list">${notices.slice(0, 5).map((notice) => `<li><button type="button" data-route="notice" data-detail-id="${notice.id}">${escapeHtml(notice.title)}</button><time>${escapeHtml(String(notice.createdAt || '').slice(0, 10))}</time></li>`).join('') || '<li>등록된 공지사항이 없습니다.</li>'}</ul></section><section><div class="home-board-head"><h2>이용 안내</h2></div><div class="guide-cards"><article class="guide-card"><h3>작성 안내</h3><p>서식별 작성 방법과 제출 절차를 확인하세요.</p><button type="button" class="button secondary small" data-route="report-guide">자세히</button></article><article class="guide-card"><h3>자주 묻는 질문</h3><p>시스템 이용 중 궁금한 내용을 확인하세요.</p><button type="button" class="button secondary small" data-route="faq">자세히</button></article></div></section></div>`;
  }

  function renderPublicList(screen) {
    let rows = datasetRows(screen);
    if (!rows.length && screen.id === 'company-public') rows = mockRows;
    const subTabs = screen.id.startsWith('public-form-') ? tabsHtml('public-form', screen.id) : (screen.id === 'public-search' ? tabsHtml('public-form') : '');
    return `${subTabs}<div class="notice-box">제출연도와 공개 구분을 선택하면 지출보고서 공개자료를 조회할 수 있습니다. 개인정보가 포함된 자료의 무단 활용을 금지합니다.</div>${searchHtml('public')}${resultHtml(rows)}`;
  }

  function renderWorkList(screen) {
    const prefix = screen.id.startsWith('status-form-') ? 'status-form' : screen.id.startsWith('write-form-') ? 'write-form' : screen.id.startsWith('update-form-') ? 'update-form' : '';
    let tabs = '';
    if (prefix === 'status-form' || ['report-status', 'company-status'].includes(screen.id)) tabs = workflowTabs('status-form', 'company-status', screen.id);
    if (prefix === 'write-form' || ['report-write', 'company-write'].includes(screen.id)) tabs = workflowTabs('write-form', 'company-write', screen.id);
    if (prefix === 'update-form' || ['report-correct', 'company-update'].includes(screen.id)) tabs = workflowTabs('update-form', 'company-update', screen.id);
    return `${tabs}<div class="notice-box">조회 조건을 입력한 후 조회 버튼을 선택하세요. 행을 더블 클릭하면 상세 정보를 확인할 수 있습니다.</div>${searchHtml()}${resultHtml(mockRows, { add: ['report-write', 'regular-write', 'company-write'].includes(screen.id) })}`;
  }

  function renderStatistics(screen) {
    const rows = datasetRows(screen);
    const chartRows = rows.length ? rows.slice(0, 6) : mockRows.slice(0, 6);
    const values = chartRows.map((row, index) => Number(String(row.stdSum || row.dChartColumn1 || (index + 1) * 130).replace(/[^0-9.-]/g, '')) || (index + 1) * 100);
    const max = Math.max(...values, 1);
    return `<div class="stat-cards"><article class="stat-card"><span>전체 제출업체</span><strong>1,284개</strong></article><article class="stat-card"><span>공개 지출보고서</span><strong>42,817건</strong></article><article class="stat-card"><span>전년 대비</span><strong>+8.4%</strong></article><article class="stat-card"><span>기준연도</span><strong>2025년</strong></article></div>${searchHtml('public')}<div class="panel" style="margin-top:20px"><div class="panel-title"><h2>연도별 현황</h2></div><div class="panel-body"><div class="chart">${values.map((value, index) => `<div class="chart-bar" style="height:${Math.max(12, Math.round(value / max * 90))}%"><strong>${value.toLocaleString()}</strong><span>${escapeHtml(chartRows[index].stdYear || `${2020 + index}년`)}</span></div>`).join('')}</div></div></div>${resultHtml(rows)}`;
  }

  function formFields(screen) {
    if (screen.type === 'password') return `<label>현재 비밀번호 <span class="required">*</span></label><div class="form-cell"><input name="currentPassword" type="password" required autocomplete="current-password"></div><label>새 비밀번호 <span class="required">*</span></label><div class="form-cell"><input name="newPassword" type="password" required minlength="8" autocomplete="new-password"><p>영문, 숫자, 특수문자를 조합하여 8자 이상 입력하세요.</p></div><label>새 비밀번호 확인 <span class="required">*</span></label><div class="form-cell"><input name="confirmPassword" type="password" required minlength="8" autocomplete="new-password"></div>`;
    if (screen.id.includes('profile') || screen.id === 'company-info') return `<label>회원 구분</label><div class="form-cell"><select name="memberType"><option>법인회원</option><option>개인회원</option></select></div><label>업체명 <span class="required">*</span></label><div class="form-cell"><input name="company" required value="한국메디칼㈜"></div><label>사업자등록번호 <span class="required">*</span></label><div class="form-cell"><input name="businessNo" required value="123-45-67890"></div><label>담당자명 <span class="required">*</span></label><div class="form-cell"><input name="manager" required value="김담당"></div><label>연락처 <span class="required">*</span></label><div class="form-cell"><input name="phone" required value="02-1234-5678"></div><label>이메일</label><div class="form-cell"><input name="email" type="email" value="manager@example.com"></div>`;
    return `<label>제출연도 <span class="required">*</span></label><div class="form-cell"><select name="year" required><option>2026</option><option>2025</option></select></div><label>보고서 구분 <span class="required">*</span></label><div class="form-cell"><select name="type" required>${formNames.map((name) => `<option>${escapeHtml(name)}</option>`).join('')}</select></div><label>업체명 <span class="required">*</span></label><div class="form-cell"><input name="company" required placeholder="업체명을 입력하세요"></div><label>제목 <span class="required">*</span></label><div class="form-cell"><input name="title" required placeholder="제목을 입력하세요"></div><label>내용 <span class="required">*</span></label><div class="form-cell"><textarea name="content" required placeholder="상세 내용을 입력하세요"></textarea></div><label>첨부파일</label><div class="form-cell"><input name="file" type="file"><p>PDF, XLSX, ZIP 파일을 첨부할 수 있습니다.</p></div>`;
  }

  function renderForm(screen) {
    const tabs = screen.id.startsWith('write-form-') ? workflowTabs('write-form', 'company-write', screen.id) : screen.id.startsWith('update-form-') ? workflowTabs('update-form', 'company-update', screen.id) : '';
    return `${tabs}<div class="stepper"><span class="active">1. 기본정보</span><span>2. 상세내용</span><span>3. 확인·제출</span></div><div class="notice-box"><span class="required">*</span> 표시는 필수 입력 항목입니다. 작성 중인 내용은 임시저장할 수 있습니다.</div><form id="data-form" class="panel"><div class="panel-title"><h2>${escapeHtml(screen.title)}</h2></div><div class="panel-body"><div class="form-table">${formFields(screen)}</div></div><div class="form-footer"><button type="button" class="button secondary" data-action="draft">임시저장</button><button type="submit" class="button primary">저장 및 다음</button></div></form>`;
  }

  function renderNotice(screen) {
    const rows = datasetRows(screen);
    const body = rows.map((row) => ({ id: row.bltNo, title: row.bltTtl, writer: '관리자', updatedAt: row.regDt || '2026-11-24', content: row.bltDtlTxt }));
    return `${searchHtml('public')}${resultHtml(body)}`;
  }

  function renderFaq(screen) {
    const rows = datasetRows(screen);
    return `<form id="faq-search" class="search-panel"><div class="field span-2"><label for="faq-keyword">FAQ 검색</label><input id="faq-keyword" type="search" placeholder="궁금한 내용을 입력하세요"></div><div class="search-actions"><button type="submit" class="button primary">검색</button><button type="reset" class="button secondary">초기화</button></div></form><div id="faq-list" class="accordion" style="margin-top:22px">${rows.map((row, index) => `<section class="accordion-item"><button type="button" class="accordion-question" data-accordion="${index}" aria-expanded="false"><b>Q</b>${escapeHtml(row.prbmDtlTxt || row.bltTtl)}</button><div class="accordion-answer" hidden><b>A.</b> ${escapeHtml(row.ansDtlTxt || row.bltDtlTxt || '답변을 준비하고 있습니다.')}</div></section>`).join('')}</div>`;
  }

  function renderBoard(screen) {
    const rows = datasetRows(screen);
    const fallback = Array.from({ length: 8 }, (_, index) => ({ title: `${screen.title} 안내 ${index + 1}`, writer: '관리자', updatedAt: `2026-11-${String(24 - index).padStart(2, '0')}`, status: '게시' }));
    return `${searchHtml('public')}${resultHtml(rows.length ? rows : fallback)}`;
  }

  function renderEducation() {
    const rows = Array.from({ length: 8 }, (_, index) => ({ id: index + 1, title: `KOPS 지출보고서 사용자 교육 ${index + 1}차`, updatedAt: `2026-12-${String(3 + index).padStart(2, '0')}`, type: index % 2 ? '온라인' : '집합교육', status: index < 5 ? '신청가능' : '마감' }));
    return `<div class="notice-box">교육 일정을 확인하고 신청 가능한 교육을 선택하세요. 신청 내역은 마이페이지에서 확인할 수 있습니다.</div>${searchHtml('public')}${resultHtml(rows, { add: true })}`;
  }

  function renderInfo(screen) {
    const info = {
      'report-guide': ['지출보고서 작성 절차', '업체정보 확인', '서식별 내용 작성', '파일 검증 및 제출'],
      'system-overview': ['투명한 정보 공개', '편리한 전자 제출', '안전한 자료 관리'],
      'system-status': ['제도 근거', '작성 대상', '공개 범위'],
      accessibility: ['키보드 접근성', '명확한 정보 구조', '대체 텍스트 제공'],
      'screen-access': ['접근 권한 확인', '로그인 상태 확인', '서비스 문의']
    };
    const items = info[screen.id] || ['서비스 안내', '이용 절차', '문의 및 지원'];
    return `<div class="info-visual"><strong>${escapeHtml(screen.title)}</strong><p>KOPS는 의약품·의료기기 유통의 투명성을 높이고 지출보고서 작성과 공개 업무를 효율적으로 지원합니다.</p></div><div class="info-grid">${items.map((item, index) => `<article class="info-card"><b>${index + 1}</b><h3>${escapeHtml(item)}</h3><p>관련 기준과 처리 절차를 확인하고 안내에 따라 서비스를 이용해 주세요.</p></article>`).join('')}</div>`;
  }

  function renderHistory() {
    return `<div class="timeline">${[['2026','KOPS 서비스 고도화 및 공개자료 확대'],['2025','지출보고서 공개 시스템 통합'],['2024','의료기기 지출보고서 제출 시행'],['2023','지출보고서 공개 제도 기반 마련'],['2018','의약품 공급자 지출보고서 작성 의무화']].map(([year, text]) => `<article class="timeline-item"><strong>${year}</strong><p>${text}</p></article>`).join('')}</div>`;
  }

  function renderMap() {
    return `<div class="map-box"><div class="map-pin">● 건강보험심사평가원<br><small>강원특별자치도 원주시 건강로 32</small></div></div><div class="panel" style="margin-top:20px"><div class="panel-title"><h2>교통 안내</h2></div><div class="panel-body"><p><strong>버스</strong> 원주고속버스터미널에서 혁신도시 방면 버스 이용</p><p><strong>자가용</strong> 남원주IC에서 혁신도시 방향 약 15분</p><p><strong>대표전화</strong> 1644-2000</p></div></div>`;
  }

  function renderDetail(screen) {
    return `<article class="panel"><div class="panel-title"><h2>${escapeHtml(screen.title)}</h2><span>2026-11-24</span></div><div class="panel-body" style="min-height:280px"><p>선택한 게시물의 상세 내용입니다.</p><p>KOPS 지출보고서 관리시스템 이용에 필요한 주요 사항과 처리 방법을 안내합니다.</p></div></article><div class="page-actions"><button type="button" class="button secondary" data-action="back">목록</button></div>`;
  }

  function renderWithdraw(screen) {
    if (screen.type === 'complete') return `<div class="info-visual"><strong>회원 탈퇴가 완료되었습니다.</strong><p>그동안 KOPS 지출보고서 관리시스템을 이용해 주셔서 감사합니다.</p><button type="button" class="button primary" data-route="home">홈으로</button></div>`;
    return `<div class="notice-box">회원 탈퇴 시 작성 중인 자료와 서비스 이용 정보가 삭제되며 복구할 수 없습니다.</div><form id="withdraw-form" class="panel"><div class="panel-title"><h2>탈퇴 사유</h2></div><div class="panel-body"><div class="field"><label for="withdraw-reason">탈퇴 사유를 선택하세요.</label><select id="withdraw-reason" required><option value="">선택</option><option>서비스 이용 종료</option><option>재가입 예정</option><option>기타</option></select></div><p><label><input type="checkbox" required> 안내사항을 확인했으며 회원 탈퇴에 동의합니다.</label></p></div><div class="form-footer"><button type="submit" class="button danger">회원 탈퇴</button></div></form>`;
  }

  function renderType(screen) {
    switch (screen.type) {
      case 'publicList': return renderPublicList(screen);
      case 'workList': return renderWorkList(screen);
      case 'statistics': return renderStatistics(screen);
      case 'form': case 'password': return renderForm(screen);
      case 'notice': return renderNotice(screen);
      case 'faq': return renderFaq(screen);
      case 'board': return renderBoard(screen);
      case 'education': return renderEducation(screen);
      case 'info': return renderInfo(screen);
      case 'history': return renderHistory();
      case 'map': return renderMap();
      case 'detail': return renderDetail(screen);
      case 'withdraw': case 'complete': return renderWithdraw(screen);
      default: return renderInfo(screen);
    }
  }

  function bindPage(screen) {
    const gridElement = document.getElementById('grid');
    if (gridElement) mountGrid(currentRows);
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const keyword = document.getElementById('search-keyword')?.value.trim().toLowerCase() || '';
        const year = document.getElementById('search-year')?.value || '';
        const status = document.getElementById('search-status')?.value || document.getElementById('search-type')?.value || '';
        const filtered = currentRows.filter((row) => (!keyword || JSON.stringify(row).toLowerCase().includes(keyword)) && (!year || String(row.year || row.oggBriefSmitYr || row.stdYear || '').includes(year)) && (!status || String(row.status || row.type || row.salFrmNm || '').includes(status)));
        mountGrid(filtered);
        const count = document.getElementById('result-count');
        if (count) count.textContent = String(filtered.length);
        showToast(`${filtered.length}건이 조회되었습니다.`);
      });
      searchForm.addEventListener('reset', () => window.setTimeout(() => { mountGrid(currentRows); const count = document.getElementById('result-count'); if (count) count.textContent = String(currentRows.length); }, 0));
    }
    const dataForm = document.getElementById('data-form');
    if (dataForm) dataForm.addEventListener('submit', (event) => { event.preventDefault(); openDialog('저장 확인', '입력한 내용을 저장하고 다음 단계로 이동하시겠습니까?', () => { closeDialog(); showToast('정상적으로 저장되었습니다.'); }); });
    const withdrawForm = document.getElementById('withdraw-form');
    if (withdrawForm) withdrawForm.addEventListener('submit', (event) => { event.preventDefault(); openDialog('회원 탈퇴', '정말 회원 탈퇴를 진행하시겠습니까?', () => { closeDialog(); routeTo('withdraw-complete'); }, '탈퇴'); });
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) faqSearch.addEventListener('submit', (event) => { event.preventDefault(); const keyword = document.getElementById('faq-keyword').value.trim(); document.querySelectorAll('.accordion-item').forEach((item) => { item.hidden = keyword && !item.textContent.includes(keyword); }); });
    document.title = `${screen.title} | KOPS`;
  }

  async function renderRoute() {
    closeMega();
    if (currentGrid) { currentGrid.destroy(); currentGrid = null; }
    const id = window.location.hash.slice(1) || 'home';
    const screen = screenMap.get(id) || screenMap.get('home');
    currentScreen = screen;
    window.scrollTo(0, 0);
    if (screen.type === 'home') {
      await renderHome();
      document.title = 'KOPS 지출보고서 관리시스템';
      return;
    }
    currentRows = [];
    app.innerHTML = pageFrame(screen, renderType(screen));
    bindPage(screen);
  }

  function handleAction(action) {
    if (action === 'export') {
      if (currentGrid && currentRows.length) currentGrid.export('csv', { fileName: `${currentScreen.title}.csv` });
      else showToast('다운로드할 데이터가 없습니다.');
    } else if (action === 'new') {
      if (currentScreen.id === 'education') routeTo('education-write');
      else routeTo('write-form-1');
    } else if (action === 'draft') {
      const form = document.getElementById('data-form');
      if (form) localStorage.setItem(`kops-draft-${currentScreen.id}`, JSON.stringify(Object.fromEntries(new FormData(form))));
      showToast('임시저장되었습니다.');
    } else if (action === 'back') {
      window.history.back();
    } else if (action === 'login') {
      openDialog('로그인', '<div class="field"><label for="login-id">아이디</label><input id="login-id" autocomplete="username"></div><div class="field" style="margin-top:12px"><label for="login-password">비밀번호</label><input id="login-password" type="password" autocomplete="current-password"></div>', () => { closeDialog(); showToast('테스트 사용자로 로그인되었습니다.'); }, '로그인');
    } else if (action === 'join') {
      openDialog('회원가입 안내', '회원 유형을 선택한 뒤 본인인증 및 약관동의를 진행합니다.<div class="page-actions" style="justify-content:center;margin-top:15px"><button class="button secondary">개인회원</button><button class="button primary">법인회원</button></div>');
    }
  }

  document.addEventListener('click', (event) => {
    const route = event.target.closest('[data-route]');
    if (route) { routeTo(route.dataset.route); return; }
    const mega = event.target.closest('[data-mega]');
    if (mega) { if (!megaMenu.hidden && mega.classList.contains('active')) closeMega(); else openMega(mega.dataset.mega); return; }
    const action = event.target.closest('[data-action]');
    if (action) { handleAction(action.dataset.action); return; }
    const accordion = event.target.closest('[data-accordion]');
    if (accordion) { const answer = accordion.nextElementSibling; answer.hidden = !answer.hidden; accordion.setAttribute('aria-expanded', String(!answer.hidden)); return; }
    if (event.target.closest('[data-dialog-close]')) closeDialog();
  });

  dialogConfirm.addEventListener('click', () => { if (dialogAction) dialogAction(); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDialog(); closeMega(); } });
  document.getElementById('mobile-menu-button').addEventListener('click', (event) => { const open = gnb.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
  document.getElementById('global-search-button').addEventListener('click', () => {
    openDialog('통합검색', '<div class="field"><label for="global-keyword">메뉴명 또는 서비스명을 입력하세요.</label><input id="global-keyword" type="search" placeholder="예: 공개자료, 교육, 통계"></div><div id="global-results" style="margin-top:15px"></div>', () => {
      const keyword = document.getElementById('global-keyword').value.trim();
      const matches = screens.filter((screen) => !screen.hidden && screen.title.includes(keyword)).slice(0, 10);
      document.getElementById('global-results').innerHTML = matches.length ? matches.map((screen) => `<button type="button" class="button secondary" style="display:block;width:100%;margin:5px 0;text-align:left" data-route="${screen.id}">${escapeHtml(screen.group)} &gt; ${escapeHtml(screen.title)}</button>`).join('') : '<p>검색 결과가 없습니다.</p>';
    }, '검색');
  });
  document.querySelectorAll('[data-zoom]').forEach((button) => button.addEventListener('click', () => {
    const type = button.dataset.zoom;
    zoom = type === 'reset' ? 1 : Math.min(1.2, Math.max(.85, zoom + (type === 'in' ? .05 : -.05)));
    document.documentElement.style.fontSize = `${zoom * 100}%`;
    document.getElementById('zoom-value').textContent = `${Math.round(zoom * 100)}%`;
  }));
  window.addEventListener('hashchange', renderRoute);

  async function initialize() {
    buildNavigation();
    try {
      const response = await fetch('/data/kops-datasets.json');
      if (response.ok) datasets = await response.json();
    } catch {
      datasets = {};
    }
    await renderRoute();
  }

  initialize();
})();
