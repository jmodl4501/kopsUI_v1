/* global I */
const colors = {
  navy: '#0B2E59',
  blue: '#0F5EA8',
  accent: '#1E6FD9',
  sky: '#EAF2FB',
  light: '#F4F7FB',
  border: '#D8E1EC',
  text: '#1F2937',
  muted: '#64748B',
  white: '#FFFFFF'
};

function solid(color) {
  return [{ type: 'solid', color }];
}

function text(id, content, options) {
  return Object.assign({
    id,
    type: 'text',
    content,
    fontFamily: 'Noto Sans KR',
    fontSize: 16,
    fill: solid(colors.text)
  }, options || {});
}

function frame(id, name, options, children) {
  return Object.assign({
    id,
    type: 'frame',
    name,
    width: 'fill_container',
    height: 'fit_content',
    layout: 'vertical'
  }, options || {}, { children: children || [] });
}

function link(id, content) {
  return text(id, content, {
    fontSize: 14,
    fontWeight: 500,
    fill: solid('#DCE8F5')
  });
}

function gnb(id, content) {
  return text(id, content, {
    fontSize: 17,
    fontWeight: 600,
    fill: solid(colors.navy)
  });
}

function quickCard(id, title, description, icon) {
  return frame(id, title, {
    width: 'fill_container',
    height: 168,
    padding: [24, 20],
    gap: 14,
    cornerRadius: 12,
    fill: solid(colors.white),
    stroke: { thickness: 1, fill: solid(colors.border) },
    role: 'card'
  }, [
    frame(id + '-top', '카드 상단', {
      layout: 'horizontal',
      justifyContent: 'space_between',
      alignItems: 'center'
    }, [
      frame(id + '-icon', '아이콘', {
        width: 44,
        height: 44,
        cornerRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        fill: solid(colors.sky)
      }, [
        { id: id + '-icon-glyph', type: 'icon_font', name: icon, iconFontName: icon, width: 22, height: 22, fill: colors.accent }
      ]),
      { id: id + '-arrow', type: 'icon_font', name: '바로가기', iconFontName: 'arrow-up-right', width: 18, height: 18, fill: colors.muted }
    ]),
    text(id + '-title', title, { fontSize: 18, fontWeight: 700, fill: solid(colors.navy) }),
    text(id + '-desc', description, {
      fontSize: 14,
      textGrowth: 'fixed-width',
      width: 'fill_container',
      lineHeight: 1.6,
      fill: solid(colors.muted)
    })
  ]);
}

function noticeRow(id, title, date) {
  return frame(id, '공지 행', {
    layout: 'horizontal',
    justifyContent: 'space_between',
    alignItems: 'center',
    padding: [12, 0],
    stroke: { thickness: { bottom: 1 }, fill: solid(colors.border) }
  }, [
    text(id + '-title', title, { fontSize: 15, fill: solid(colors.text) }),
    text(id + '-date', date, { fontSize: 13, fill: solid(colors.muted) })
  ]);
}

I(null, {
  id: 'public-portal',
  type: 'frame',
  name: '공공포털 홈',
  width: 1280,
  height: 0,
  layout: 'vertical',
  gap: 0,
  children: [
    frame('utility', '유틸리티 바', {
      height: 40,
      layout: 'horizontal',
      padding: [0, 40],
      justifyContent: 'space_between',
      alignItems: 'center',
      fill: solid(colors.navy),
      role: 'navbar'
    }, [
      frame('utility-left', '왼쪽 링크', { layout: 'horizontal', gap: 22, alignItems: 'center' }, [
        link('login', '로그인'),
        link('join', '회원가입'),
        link('cs', '고객센터')
      ]),
      frame('utility-right', '오른쪽 링크', { layout: 'horizontal', gap: 18, alignItems: 'center' }, [
        link('zoom', '화면크기'),
        link('bookmark', '즐겨찾기'),
        link('sitemap', '사이트맵')
      ])
    ]),

    frame('header', '기관 헤더', {
      height: 96,
      layout: 'horizontal',
      padding: [0, 40],
      justifyContent: 'space_between',
      alignItems: 'center',
      fill: solid(colors.white),
      stroke: { thickness: { bottom: 1 }, fill: solid(colors.border) },
      role: 'navbar'
    }, [
      frame('brand', '기관 로고', { layout: 'horizontal', gap: 16, alignItems: 'center' }, [
        frame('emblem', '기관 상징', {
          width: 48,
          height: 48,
          cornerRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          fill: solid(colors.accent)
        }, [
          text('emblem-text', '복', { fontSize: 22, fontWeight: 700, fill: solid(colors.white) })
        ]),
        frame('brand-text', '기관명', { layout: 'vertical', gap: 2 }, [
          text('org', '건강보험심사평가원', { fontSize: 20, fontWeight: 700, fill: solid(colors.navy) }),
          text('system', '지출보고서 관리시스템', { fontSize: 14, fill: solid(colors.muted) })
        ])
      ]),
      frame('gnb', '주 메뉴', { layout: 'horizontal', gap: 34, alignItems: 'center' }, [
        gnb('menu-1', '민원신청'),
        gnb('menu-2', '정보공개'),
        gnb('menu-3', '정책정보'),
        gnb('menu-4', '알림마당'),
        gnb('menu-5', '참여소통')
      ]),
      frame('header-actions', '헤더 버튼', { layout: 'horizontal', gap: 12, alignItems: 'center' }, [
        { id: 'search-icon', type: 'icon_font', name: '검색', iconFontName: 'search', width: 20, height: 20, fill: colors.navy },
        frame('mypage', '마이페이지 버튼', {
          padding: [10, 16],
          cornerRadius: 8,
          fill: solid(colors.sky),
          role: 'button'
        }, [
          text('mypage-label', '마이페이지', { fontSize: 14, fontWeight: 600, fill: solid(colors.blue) })
        ])
      ])
    ]),

    frame('banner', '메인 배너', {
      height: 320,
      layout: 'horizontal',
      padding: [48, 80],
      justifyContent: 'space_between',
      alignItems: 'center',
      fill: solid(colors.navy),
      role: 'section'
    }, [
      frame('banner-copy', '배너 문구', { width: 720, gap: 18 }, [
        frame('badge', '안내 배지', {
          padding: [7, 14],
          cornerRadius: 999,
          fill: solid(colors.accent),
          role: 'badge'
        }, [
          text('badge-text', '2026년 지출보고서 제출 안내', { fontSize: 13, fontWeight: 600, fill: solid(colors.white) })
        ]),
        text('headline', '지출보고서, 한 곳에서 간편하게', {
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.15,
          fill: solid(colors.white)
        }),
        text('subheadline', '작성부터 심사까지 투명하게 관리하세요.', {
          fontSize: 18,
          fill: solid('#D7E5F5')
        }),
        frame('banner-actions', '배너 버튼', { layout: 'horizontal', gap: 12, alignItems: 'center' }, [
          frame('primary-btn', '지출보고서 작성', {
            padding: [13, 22],
            cornerRadius: 8,
            fill: solid(colors.accent),
            role: 'button'
          }, [
            text('primary-btn-label', '지출보고서 작성', { fontSize: 15, fontWeight: 600, fill: solid(colors.white) })
          ]),
          frame('secondary-btn', '심사진행 조회', {
            padding: [13, 22],
            cornerRadius: 8,
            stroke: { thickness: 1, fill: solid('#8FB3DA') },
            role: 'button'
          }, [
            text('secondary-btn-label', '심사진행 조회', { fontSize: 15, fontWeight: 600, fill: solid(colors.white) })
          ])
        ])
      ]),
      frame('banner-panel', '배너 정보 패널', {
        width: 330,
        height: 210,
        padding: [26, 26],
        gap: 12,
        cornerRadius: 14,
        fill: solid('#123E72')
      }, [
        text('panel-label', '업무 안내', { fontSize: 13, fontWeight: 600, fill: solid('#A9C8E8') }),
        text('panel-title', '지출보고서 작성 기한', { fontSize: 22, fontWeight: 700, fill: solid(colors.white) }),
        text('panel-desc', '2026년 12월 10일까지 제출하세요.', { fontSize: 15, fill: solid('#D7E5F5') }),
        frame('panel-link', '자세히 보기', { layout: 'horizontal', gap: 8, alignItems: 'center' }, [
          text('panel-link-text', '자세히 보기', { fontSize: 14, fontWeight: 600, fill: solid('#8FC2FF') }),
          { id: 'panel-link-icon', type: 'icon_font', name: '화살표', iconFontName: 'arrow-right', width: 16, height: 16, fill: '#8FC2FF' }
        ])
      ])
    ]),

    frame('quick-section', '주요 업무 바로가기', {
      height: 360,
      padding: [40, 80],
      gap: 24,
      fill: solid(colors.light),
      role: 'section'
    }, [
      frame('quick-heading', '섹션 제목', { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'end' }, [
        text('quick-title', '주요 업무 바로가기', { fontSize: 26, fontWeight: 700, fill: solid(colors.navy) }),
        text('quick-desc', '자주 찾는 업무를 한 번에 처리하세요.', { fontSize: 14, fill: solid(colors.muted) })
      ]),
      frame('quick-grid', '바로가기 카드 목록', { layout: 'horizontal', gap: 20, alignItems: 'stretch' }, [
        quickCard('quick-1', '지출보고서 작성', '작성 중인 보고서를 이어서 작성합니다.', 'file-text'),
        quickCard('quick-2', '심사진행 조회', '제출한 보고서의 심사 현황을 확인합니다.', 'search-check'),
        quickCard('quick-3', '민원신청', '이용 문의와 민원을 접수합니다.', 'message-square-text'),
        quickCard('quick-4', '자주묻는질문', '궁금한 점을 빠르게 찾아보세요.', 'circle-help')
      ])
    ]),

    frame('notice-section', '공지사항/안내', {
      height: 300,
      layout: 'horizontal',
      gap: 24,
      padding: [0, 80, 40, 80],
      fill: solid(colors.light),
      role: 'section'
    }, [
      frame('notice-card', '공지사항', {
        width: 'fill_container',
        height: 'fill_container',
        padding: [24, 24],
        gap: 6,
        cornerRadius: 12,
        fill: solid(colors.white),
        stroke: { thickness: 1, fill: solid(colors.border) },
        role: 'card'
      }, [
        frame('notice-heading', '공지 제목 행', { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
          text('notice-title', '공지사항', { fontSize: 20, fontWeight: 700, fill: solid(colors.navy) }),
          { id: 'notice-more', type: 'icon_font', name: '더보기', iconFontName: 'plus', width: 18, height: 18, fill: colors.muted }
        ]),
        noticeRow('notice-row-1', '개인정보 처리방침 개정 안내', '2026.11.24'),
        noticeRow('notice-row-2', '시스템 정기 점검 안내', '2026.11.21'),
        noticeRow('notice-row-3', '지출보고서 작성 요령 교육 안내', '2026.11.18')
      ]),
      frame('info-card', '알림 배너', {
        width: 390,
        height: 'fill_container',
        padding: [24, 24],
        gap: 12,
        cornerRadius: 12,
        fill: solid(colors.blue),
        role: 'card'
      }, [
        text('info-label', '알림', { fontSize: 13, fontWeight: 700, fill: solid('#B9D7F5') }),
        text('info-title', '전자민원 신청이 한층 편리해졌습니다', {
          fontSize: 21,
          fontWeight: 700,
          lineHeight: 1.35,
          fill: solid(colors.white)
        }),
        text('info-desc', '자주 이용하는 민원은 온라인으로 바로 접수하세요.', {
          fontSize: 14,
          lineHeight: 1.6,
          fill: solid('#D7E5F5')
        }),
        frame('info-link', '민원 접수하기', {
          width: 'fit_content',
          padding: [10, 16],
          cornerRadius: 8,
          fill: solid(colors.white),
          role: 'button'
        }, [
          text('info-link-text', '민원 접수하기', { fontSize: 14, fontWeight: 700, fill: solid(colors.blue) })
        ])
      ])
    ]),

    frame('inquiry-section', '업무 조회', {
      height: 520,
      padding: [40, 80],
      gap: 18,
      fill: solid(colors.white),
      role: 'section'
    }, [
      frame('inquiry-heading', '업무 조회 제목', { layout: 'vertical', gap: 6 }, [
        text('inquiry-title', '업무 조회', { fontSize: 26, fontWeight: 700, fill: solid(colors.navy) }),
        text('inquiry-desc', '지출보고서 처리 현황을 조회합니다.', { fontSize: 14, fill: solid(colors.muted) })
      ]),
      frame('search-card', '검색 조건', {
        width: 'fill_container',
        padding: [18, 24],
        cornerRadius: 12,
        fill: solid(colors.light),
        stroke: { thickness: 1, fill: solid(colors.border) }
      }, [
        frame('search-row', '검색 폼', { layout: 'horizontal', gap: 12, alignItems: 'center' }, [
          text('search-label', '검색어', { fontSize: 14, fontWeight: 600, fill: solid(colors.navy) }),
          frame('search-input', '검색어 입력', {
            width: 420,
            height: 42,
            padding: [0, 14],
            alignItems: 'center',
            cornerRadius: 8,
            fill: solid(colors.white),
            stroke: { thickness: 1, fill: solid(colors.border) },
            role: 'input'
          }, [
            text('search-placeholder', '제목 또는 내용을 입력하세요', { fontSize: 14, fill: solid('#94A3B8') })
          ]),
          frame('search-button', '조회', {
            padding: [11, 20],
            cornerRadius: 8,
            fill: solid(colors.accent),
            role: 'button'
          }, [
            text('search-button-label', '조회', { fontSize: 14, fontWeight: 600, fill: solid(colors.white) })
          ]),
          frame('reset-button', '초기화', {
            padding: [11, 20],
            cornerRadius: 8,
            fill: solid(colors.white),
            stroke: { thickness: 1, fill: solid(colors.border) },
            role: 'button'
          }, [
            text('reset-button-label', '초기화', { fontSize: 14, fontWeight: 600, fill: solid(colors.text) })
          ])
        ])
      ]),
      frame('grid-card', '데이터 그리드', {
        width: 'fill_container',
        height: 330,
        cornerRadius: 12,
        fill: solid(colors.white),
        stroke: { thickness: 1, fill: solid(colors.border) },
        role: 'table'
      }, [
        frame('grid-toolbar', '그리드 도구 모음', {
          height: 52,
          layout: 'horizontal',
          padding: [0, 16],
          justifyContent: 'space_between',
          alignItems: 'center'
        }, [
          text('grid-count', '총 3건', { fontSize: 14, fill: solid(colors.muted) }),
          frame('grid-actions', '그리드 버튼', { layout: 'horizontal', gap: 8, alignItems: 'center' }, [
            frame('grid-create', '등록', {
              padding: [8, 14],
              cornerRadius: 6,
              fill: solid(colors.accent),
              role: 'button'
            }, [text('grid-create-label', '등록', { fontSize: 13, fontWeight: 600, fill: solid(colors.white) })]),
            frame('grid-update', '수정', {
              padding: [8, 14],
              cornerRadius: 6,
              fill: solid(colors.white),
              stroke: { thickness: 1, fill: solid(colors.border) },
              role: 'button'
            }, [text('grid-update-label', '수정', { fontSize: 13, fontWeight: 600, fill: solid(colors.text) })]),
            frame('grid-delete', '삭제', {
              padding: [8, 14],
              cornerRadius: 6,
              fill: solid(colors.white),
              stroke: { thickness: 1, fill: solid(colors.border) },
              role: 'button'
            }, [text('grid-delete-label', '삭제', { fontSize: 13, fontWeight: 600, fill: solid(colors.text) })])
          ])
        ]),
        frame('grid-header', '테이블 헤더', {
          height: 42,
          layout: 'horizontal',
          alignItems: 'center',
          fill: solid(colors.sky),
          role: 'table-header'
        }, [
          text('th-no', '번호', { width: 60, textAlign: 'center', fontSize: 13, fontWeight: 600, fill: solid(colors.navy) }),
          text('th-title', '제목', { width: 620, fontSize: 13, fontWeight: 600, fill: solid(colors.navy) }),
          text('th-writer', '작성자', { width: 140, textAlign: 'center', fontSize: 13, fontWeight: 600, fill: solid(colors.navy) }),
          text('th-date', '등록일', { width: 180, textAlign: 'center', fontSize: 13, fontWeight: 600, fill: solid(colors.navy) })
        ]),
        frame('grid-row-1', '데이터 행', {
          height: 42,
          layout: 'horizontal',
          alignItems: 'center',
          stroke: { thickness: { bottom: 1 }, fill: solid(colors.border) },
          role: 'table-row'
        }, [
          text('td-1-no', '3', { width: 60, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) }),
          text('td-1-title', '개인정보 처리방침 개정', { width: 620, fontSize: 14, fill: solid(colors.text) }),
          text('td-1-writer', '관리자', { width: 140, textAlign: 'center', fontSize: 14, fill: solid(colors.text) }),
          text('td-1-date', '2026.11.24', { width: 180, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) })
        ]),
        frame('grid-row-2', '데이터 행', {
          height: 42,
          layout: 'horizontal',
          alignItems: 'center',
          stroke: { thickness: { bottom: 1 }, fill: solid(colors.border) },
          role: 'table-row'
        }, [
          text('td-2-no', '2', { width: 60, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) }),
          text('td-2-title', '시스템 점검 안내', { width: 620, fontSize: 14, fill: solid(colors.text) }),
          text('td-2-writer', '관리자', { width: 140, textAlign: 'center', fontSize: 14, fill: solid(colors.text) }),
          text('td-2-date', '2026.11.21', { width: 180, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) })
        ]),
        frame('grid-row-3', '데이터 행', {
          height: 42,
          layout: 'horizontal',
          alignItems: 'center',
          role: 'table-row'
        }, [
          text('td-3-no', '1', { width: 60, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) }),
          text('td-3-title', '공지사항 안내', { width: 620, fontSize: 14, fill: solid(colors.text) }),
          text('td-3-writer', '관리자', { width: 140, textAlign: 'center', fontSize: 14, fill: solid(colors.text) }),
          text('td-3-date', '2026.11.18', { width: 180, textAlign: 'center', fontSize: 14, fill: solid(colors.muted) })
        ])
      ])
    ]),

    frame('footer', '푸터', {
      height: 200,
      padding: [32, 80],
      gap: 14,
      fill: solid(colors.navy),
      role: 'footer'
    }, [
      frame('footer-top', '푸터 상단', { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        text('footer-logo', '건강보험심사평가원', { fontSize: 18, fontWeight: 700, fill: solid(colors.white) }),
        frame('footer-links', '푸터 링크', { layout: 'horizontal', gap: 20, alignItems: 'center' }, [
          link('footer-link-1', '개인정보처리방침'),
          link('footer-link-2', '이용약관'),
          link('footer-link-3', '저작권정책'),
          link('footer-link-4', '고객센터')
        ])
      ]),
      text('footer-address', '우편번호 26464 강원도 원주시 건강로 32  ·  대표전화 033-730-2114', {
        fontSize: 14,
        fill: solid('#B9D0E6')
      }),
      text('footer-copy', 'Copyright © 2026 건강보험심사평가원. All rights reserved.', {
        fontSize: 13,
        fill: solid('#8FA9C4')
      })
    ])
  ]
});
