/* global tui */
(() => {
  'use strict';

  const gridEl = document.getElementById('grid');
  const searchForm = document.getElementById('search-form');
  const keywordInput = document.getElementById('keyword');
  const pageSize = document.getElementById('page-size');
  const resetSearch = document.getElementById('reset-search');
  const totalCount = document.getElementById('total-count');
  const mainNotices = document.getElementById('main-notices');
  const btnCreate = document.getElementById('btn-create');
  const btnUpdate = document.getElementById('btn-update');
  const btnDelete = document.getElementById('btn-delete');
  const modal = document.getElementById('notice-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const noticeForm = document.getElementById('notice-form');
  const noticeId = document.getElementById('notice-id');
  const noticeTitle = document.getElementById('notice-title');
  const noticeWriter = document.getElementById('notice-writer');
  const noticeContent = document.getElementById('notice-content');
  const toast = document.getElementById('toast');
  const zoomLabel = document.getElementById('zoom-label');

  let currentPage = 1;
  let selectedRowKey = null;
  let toastTimer = null;
  let zoomLevel = 1;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entities[char];
    });
  }

  function formatDate(value) {
    if (!value) {
      return '-';
    }
    return String(value).slice(0, 10).replace(/-/g, '.');
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove('hidden');
    toastTimer = window.setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  async function readError(response) {
    try {
      const data = await response.json();
      return data.message || data.error || `요청 실패 (${response.status})`;
    } catch {
      return `요청 실패 (${response.status})`;
    }
  }

  const grid = new tui.Grid({
    el: gridEl,
    data: [],
    columns: [
      { header: '제목', name: 'title', minWidth: 260, ellipsis: true },
      { header: '작성자', name: 'writer', width: 140, align: 'center' },
      { header: '조회수', name: 'viewCount', width: 100, align: 'center' },
      {
        header: '등록일',
        name: 'createdAt',
        width: 150,
        align: 'center',
        formatter: ({ value }) => formatDate(value)
      },
      {
        header: '수정일',
        name: 'updatedAt',
        width: 150,
        align: 'center',
        formatter: ({ value }) => formatDate(value)
      }
    ],
    rowHeaders: ['rowNum'],
    keyColumnName: 'id',
    bodyHeight: 420,
    rowHeight: 40,
    pageOptions: {
      useClient: false,
      perPage: 10,
      page: 1,
      totalCount: 0,
      visiblePages: 5,
      position: 'bottom'
    },
    selectionUnit: 'row',
    columnOptions: {
      resizable: true
    },
    usageStatistics: false
  });

  async function loadNotices(page = 1) {
    const params = new URLSearchParams({
      page: String(page),
      size: pageSize.value
    });
    const keyword = keywordInput.value.trim();
    if (keyword) {
      params.set('keyword', keyword);
    }

    try {
      const response = await fetch(`/api/notices?${params.toString()}`, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      const data = await response.json();
      const pagination = data.pagination || {
        page: 1,
        size: Number(pageSize.value),
        totalCount: 0,
        totalPages: 0
      };

      grid.resetData(data.contents || [], {
        pageState: {
          page: pagination.page,
          totalCount: pagination.totalCount,
          perPage: pagination.size
        }
      });
      currentPage = pagination.page;
      totalCount.textContent = String(pagination.totalCount);
      selectedRowKey = null;
    } catch (error) {
      showToast(error.message);
    }
  }

  async function loadMainNotices() {
    try {
      const response = await fetch('/api/notices?page=1&size=3', {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      const data = await response.json();
      mainNotices.innerHTML = (data.contents || []).map((notice) => `
        <li class="flex items-center justify-between gap-4 py-3">
          <a href="#inquiry" class="truncate text-sm text-slate-700 hover:text-[#0F5EA8]">${escapeHtml(notice.title)}</a>
          <time class="shrink-0 text-xs text-slate-400">${formatDate(notice.createdAt)}</time>
        </li>
      `).join('');
    } catch (error) {
      mainNotices.innerHTML = `<li class="py-3 text-sm text-red-500">${escapeHtml(error.message)}</li>`;
    }
  }

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    noticeTitle.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  function openCreate() {
    noticeForm.reset();
    noticeId.value = '';
    modalTitle.textContent = '공지사항 등록';
    openModal();
  }

  function openEdit() {
    if (selectedRowKey === null) {
      showToast('수정할 행을 선택하세요.');
      return;
    }
    const row = grid.getRow(selectedRowKey);
    if (!row) {
      showToast('수정할 행을 선택하세요.');
      return;
    }
    noticeForm.reset();
    noticeId.value = String(row.id);
    noticeTitle.value = row.title;
    noticeWriter.value = row.writer;
    noticeContent.value = row.content;
    modalTitle.textContent = '공지사항 수정';
    openModal();
  }

  async function saveNotice(event) {
    event.preventDefault();
    const id = noticeId.value;
    const payload = {
      title: noticeTitle.value.trim(),
      writer: noticeWriter.value.trim(),
      content: noticeContent.value.trim()
    };

    if (!payload.title || !payload.writer || !payload.content) {
      showToast('필수 값을 입력하세요.');
      return;
    }

    try {
      const response = await fetch(id ? `/api/notices/${id}` : '/api/notices', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      closeModal();
      showToast('저장되었습니다.');
      await loadNotices(id ? currentPage : 1);
    } catch (error) {
      showToast(error.message);
    }
  }

  async function deleteNotice() {
    if (selectedRowKey === null) {
      showToast('삭제할 행을 선택하세요.');
      return;
    }
    const row = grid.getRow(selectedRowKey);
    if (!row) {
      showToast('삭제할 행을 선택하세요.');
      return;
    }
    if (!window.confirm(`"${row.title}"을(를) 삭제할까요?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${row.id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      selectedRowKey = null;
      showToast('삭제되었습니다.');
      await loadNotices(currentPage);
    } catch (error) {
      showToast(error.message);
    }
  }

  function applyZoom(next) {
    zoomLevel = Math.min(1.25, Math.max(0.85, Number(next.toFixed(2))));
    document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
    zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
  }

  grid.on('beforePageMove', (event) => {
    event.stop();
    loadNotices(event.page);
  });
  grid.on('click', (event) => {
    if (event.rowKey !== undefined) {
      selectedRowKey = event.rowKey;
    }
  });
  grid.on('dblclick', (event) => {
    if (event.rowKey !== undefined) {
      selectedRowKey = event.rowKey;
      openEdit();
    }
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loadNotices(1);
  });
  pageSize.addEventListener('change', () => loadNotices(1));
  resetSearch.addEventListener('click', () => {
    searchForm.reset();
    loadNotices(1);
  });
  btnCreate.addEventListener('click', openCreate);
  btnUpdate.addEventListener('click', openEdit);
  btnDelete.addEventListener('click', deleteNotice);
  noticeForm.addEventListener('submit', saveNotice);
  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-zoom');
      if (action === 'in') {
        applyZoom(zoomLevel + 0.05);
      } else if (action === 'out') {
        applyZoom(zoomLevel - 0.05);
      } else {
        applyZoom(1);
      }
    });
  });

  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  loadNotices(1);
  loadMainNotices();
})();
