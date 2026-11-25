"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MENU_BY_ID,
  MENU_CASES,
  MENU_GROUPS,
  type MenuCase,
} from "@/data/menuCases";
import {
  FORM_FIELDS,
  detailMenuIds,
  endpointsForMenu,
  extractRows,
  findMenuByAppUri,
  formIndexForTitle,
  labelOf,
  nowDate,
  type Row,
} from "@/lib/kops";

type DialogState = { title: string; lines: string[] } | null;

interface SearchValues {
  [key: string]: string;
}

const SEARCH_FIELDS = [
  { key: "제출연도", kind: "select", options: ["2026", "2025", "2024", "2023"] },
  { key: "영업구분", kind: "select", options: ["전체", "S", "E"] },
  { key: "업체명", kind: "text" },
  { key: "요양기관명", kind: "text" },
  { key: "품목명", kind: "text" },
] as const;

const POPUP_LABELS = [
  "조회",
  "조회하기",
  "작성현황(서식이동)",
  "작성대상 보기",
  "지출보고서 공개 현황",
  "지출보고서 공개현황",
  "지출보고서 작성 현황",
  "지출보고서 정정 현황",
  "주소검색",
];

const FEATURED_MENUS = [
  "OPAA020000",
  "OPAA030000",
  "OPAB010000",
  "OPAB030000",
  "OPAB050000",
  "OPAD010000",
  "OPAD020000",
  "OPAF010000",
];

function initialValues(menu: MenuCase): SearchValues {
  return {
    제출연도: menu.sample["제출연도"] || "2025",
    영업구분: menu.sample["영업구분"] || "S",
    업체명: "",
    요양기관명: "",
    품목명: "",
  };
}

function cellText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export default function KopsShell({ menuId }: { menuId: string }) {
  const router = useRouter();
  const menu = MENU_BY_ID[menuId];
  const isHome = menuId === "home" || !menu;
  const [values, setValues] = useState<SearchValues>(() =>
    menu ? initialValues(menu) : initialValues(MENU_BY_ID.OPAA020000),
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [searchModal, setSearchModal] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [toast, setToast] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const endpoints = useMemo(
    () => (menu ? endpointsForMenu(menu) : []),
    [menu],
  );

  const fireEndpoints = useCallback(() => {
    endpoints.forEach((url) => {
      void fetch(url, { cache: "no-store" })
        .then((response) => response.json())
        .then((payload: { result?: { list?: Row[] }; dsResult?: Row[] }) => {
          const list = payload.result?.list ?? payload.dsResult;
          if (Array.isArray(list) && list.length) {
            setRows((current) => (current.length ? current : list.slice(0, 12)));
          }
        })
        .catch(() => undefined);
    });
  }, [endpoints]);

  useEffect(() => {
    if (!menu) return;
    setValues(initialValues(menu));
    const seed = extractRows(
      menu.uris.find((uri) => uri.includes("List")) ?? "",
    );
    setRows(seed.rows);
    fireEndpoints();
  }, [menu, fireEndpoints]);

  useEffect(() => {
    if (!menu) return;
    const bridge = window as unknown as {
      openPageId?: (id: string, init?: Record<string, unknown>) => void;
      util?: { EmbApp?: { load?: (uri: string, init?: unknown) => void } };
      __KOPS_MENU__?: string;
      __KOPS_APP_INSTANCE__?: number;
    };
    bridge.openPageId = (id) => {
      if (MENU_BY_ID[id]) router.push(`/menu/${id}`);
    };
    bridge.util = {
      EmbApp: {
        load: (uri) => {
          const target = findMenuByAppUri(uri);
          if (target) router.push(`/menu/${target.id}`);
        },
      },
    };
    bridge.__KOPS_MENU__ = menu.id;
    bridge.__KOPS_APP_INSTANCE__ = 1;
    return () => {
      delete bridge.openPageId;
      delete bridge.util;
    };
  }, [menu, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredRows = useMemo(() => {
    const keywords = ["업체명", "요양기관명", "품목명"]
      .map((key) => values[key]?.trim())
      .filter(Boolean) as string[];
    if (!keywords.length || !rows.length) return rows;
    return rows.filter((row) =>
      keywords.every((word) => JSON.stringify(row).includes(word)),
    );
  }, [rows, values]);

  const runSearch = () => {
    fireEndpoints();
    setDialog({
      title: "조회 결과",
      lines: [
        `제출연도 ${values["제출연도"] || "-"} · 영업구분 ${values["영업구분"] || "-"}`,
        `조회 건수 ${filteredRows.length}건`,
        "선택한 조건에 맞는 지출보고서 목록을 확인했습니다.",
      ],
    });
  };

  const openDetail = (row: Row) => {
    const first = Object.values(row).find((value) => typeof value === "string" && value);
    setDialog({
      title: "상세 정보",
      lines: Object.entries(row)
        .slice(0, 9)
        .map(([key, value]) => `${labelOf(key)} : ${cellText(value)}`),
    });
    void first;
  };

  const children = menu
    ? MENU_CASES.filter(
        (item) => item.group === menu.group && item.depth > 1 && item.id !== menu.id,
      )
    : [];
  const groupMenus = menu
    ? MENU_CASES.filter((item) => item.group === menu.group && item.depth === 1)
    : [];
  const siblingMenus = menu
    ? MENU_CASES.filter(
        (item) =>
          item.group === menu.group &&
          item.section === menu.section &&
          item.id !== menu.id,
      ).slice(0, 24)
    : [];
  const searchResults = menuQuery.trim()
    ? MENU_CASES.filter((item) =>
        `${item.path} ${item.title}`.toLowerCase().includes(menuQuery.trim().toLowerCase()),
      ).slice(0, 20)
    : FEATURED_MENUS.map((id) => MENU_BY_ID[id]).filter(Boolean);

  const displayTitle = isHome ? "지출보고서 관리시스템" : menu.title;

  return (
    <div style={{ zoom: zoom / 100 }} className="flex min-h-screen flex-col">
      <a className="skip-link" href="#content">
        본문 바로가기
      </a>
      <div className="utility">
        <div className="shell utility-inner">
          <span>보건복지부 산하 건강보험심사평가원</span>
          <div className="utility-actions">
            <button
              type="button"
              data-action="login"
              onClick={() => setLoginModal(true)}
            >
              {loggedIn ? "마이페이지" : "로그인"}
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" data-action="join" onClick={() => router.push("/menu/OPAF030000")}>
              회원가입
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" aria-label="화면 축소" onClick={() => setZoom((z) => Math.max(80, z - 10))}>
              −
            </button>
            <span id="zoom-value">{zoom}%</span>
            <button type="button" aria-label="화면 확대" onClick={() => setZoom((z) => Math.min(130, z + 10))}>
              ＋
            </button>
            <button type="button" onClick={() => setZoom(100)}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <Link href="/" className="brand" aria-label="KOPS 홈">
            <span className="brand-mark">K</span>
            <span>
              <strong>KOPS</strong>
              <small>지출보고서 관리시스템</small>
            </span>
          </Link>
          <nav
            id="gnb"
            className={`gnb${mobileOpen ? " open" : ""}`}
            aria-label="주 메뉴"
          >
            {MENU_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                className={menu?.group === group ? "active" : ""}
                onMouseEnter={() => setActiveGroup(group)}
                onClick={() => {
                  setActiveGroup((current) => (current === group ? null : group));
                  setMobileOpen(false);
                  const target = MENU_CASES.find(
                    (item) => item.group === group && item.depth === 1,
                  );
                  if (target) router.push(`/menu/${target.id}`);
                }}
              >
                {group}
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <button
              id="global-search-button"
              type="button"
              className="icon-button"
              aria-label="통합검색"
              onClick={() => setSearchModal(true)}
            >
              ⌕
            </button>
            <button
              id="mobile-menu-button"
              type="button"
              className="icon-button mobile-only"
              aria-expanded={mobileOpen}
              aria-controls="gnb"
              onClick={() => setMobileOpen((open) => !open)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {activeGroup && (
        <div className="mega-menu" onMouseLeave={() => setActiveGroup(null)}>
          <div className="shell mega-inner">
            <div className="mega-title">
              <h2>{activeGroup}</h2>
              <p>테스트케이스 84개 메뉴를 기준으로 구성한 KOPS 서비스 메뉴입니다.</p>
            </div>
            <div className="mega-sections">
              {Array.from(
                new Set(
                  MENU_CASES.filter((item) => item.group === activeGroup).map(
                    (item) => item.section,
                  ),
                ),
              ).map((section) => (
                <div className="mega-section" key={section}>
                  <h3>{section}</h3>
                  {MENU_CASES.filter(
                    (item) => item.group === activeGroup && item.section === section,
                  ).slice(0, 9).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        router.push(`/menu/${item.id}`);
                        setActiveGroup(null);
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main id="content" tabIndex={-1} data-app-uri={menu?.appUri ?? "app/com/main/index"}>
        {isHome ? (
          <HomeView onNavigate={(id) => router.push(`/menu/${id}`)} />
        ) : (
          <>
            <div className="page-head">
              <div className="shell">
                <div className="breadcrumbs">
                  <Link href="/">홈</Link>
                  <span> &gt; </span>
                  {menu.path.split(" > ").map((part, index) => (
                    <span key={`${part}-${index}`}>
                      {index > 0 && " > "}
                      {part}
                    </span>
                  ))}
                </div>
                <h1>{displayTitle}</h1>
                <p>
                  {menu.id} · {menu.appUri ?? "그룹 화면"} ·{" "}
                  {menu.loginRequired ? "로그인 필요" : "공개 서비스"}
                </p>
              </div>
            </div>

            {menu.loginRequired && !loggedIn && (
              <div className="notice-box shell" role="status">
                로그인이 필요한 서비스입니다. 조회와 화면 이동은 데모 모드로 확인할 수 있습니다.
                <button
                  type="button"
                  className="button secondary small"
                  style={{ marginLeft: 12 }}
                  onClick={() => setLoginModal(true)}
                >
                  데모 로그인
                </button>
              </div>
            )}

            <div className="shell content-layout">
              <aside className="lnb" aria-label="메뉴 목록">
                <h2>{menu.group}</h2>
                {groupMenus.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === menu.id ? "active" : ""}
                    onClick={() => router.push(`/menu/${item.id}`)}
                  >
                    {item.title}
                  </button>
                ))}
                {siblingMenus.length > 0 && (
                  <div className="lnb-section">{menu.section}</div>
                )}
                {siblingMenus.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === menu.id ? "active" : ""}
                    onClick={() => router.push(`/menu/${item.id}`)}
                  >
                    {item.title}
                  </button>
                ))}
              </aside>

              <section className="page-body">
                <div className="page-actions">
                  <button type="button" className="button secondary small" onClick={() => setToast("현재 화면을 인쇄합니다.")}>
                    인쇄
                  </button>
                  <button type="button" className="button secondary small" onClick={() => setToast("엑셀 다운로드를 준비했습니다.")}>
                    엑셀다운로드
                  </button>
                </div>

                <SearchPanel
                  values={values}
                  onChange={(key, value) =>
                    setValues((current) => ({ ...current, [key]: value }))
                  }
                  onSearch={runSearch}
                />

                {menu.group.includes("정보공개") && menu.title.includes("통계") ? (
                  <StatsView rows={rows} menu={menu} />
                ) : menu.id === "OPAD020000" ? (
                  <FaqView rows={rows} />
                ) : menu.title.includes("오시는길") ? (
                  <MapView />
                ) : isFormScreen(menu) ? (
                  <FormView
                    menu={menu}
                    values={values}
                    onChange={(key, value) =>
                      setValues((current) => ({ ...current, [key]: value }))
                    }
                    onToast={setToast}
                  />
                ) : menu.title.includes("상세") ? (
                  <DetailView menu={menu} rows={filteredRows} />
                ) : menu.depth === 1 ? (
                  <GroupView menu={menu} children={children} />
                ) : (
                  <ResultTable
                    menu={menu}
                    rows={filteredRows}
                    onRowClick={openDetail}
                  />
                )}

                <div className="panel">
                  <div className="panel-title">
                    <h3>관련 팝업 · 바로가기</h3>
                    <span className="badge gray">{POPUP_LABELS.length}개</span>
                  </div>
                  <div className="panel-body" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {POPUP_LABELS.map((label) => (
                      <button
                        type="button"
                        className="button secondary small"
                        key={label}
                        onClick={() => {
                          fireEndpoints();
                          setDialog({
                            title: label,
                            lines: [
                              `${menu.title} — ${label}`,
                              `조회연도 ${values["제출연도"] || "-"} · 조건에 맞는 내역 ${filteredRows.length}건`,
                            ],
                          });
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {detailMenuIds(menu).length > 0 && (
                  <div className="panel">
                    <div className="panel-title">
                      <h3>관련 화면 이동</h3>
                      <span className="badge blue">{detailMenuIds(menu).length}개</span>
                    </div>
                    <div className="panel-body">
                      <div className="tabs" style={{ marginBottom: 0 }}>
                        {detailMenuIds(menu).map((id) => (
                          <button
                            type="button"
                            key={id}
                            onClick={() => router.push(`/menu/${id}`)}
                          >
                            {MENU_BY_ID[id]?.title ?? id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="shell">
          <nav className="footer-links" aria-label="푸터 메뉴">
            <Link href="/menu/OPAD060000">개인정보처리방침</Link>
            <Link href="/menu/OPAE040000">이용약관</Link>
            <Link href="/menu/OPAD060000">저작권정책</Link>
            <Link href="/menu/OPAE050000">찾아오시는 길</Link>
          </nav>
          <div className="footer-body">
            <strong>KOPS 지출보고서 관리시스템</strong>
            <p>
              26464 강원특별자치도 원주시 건강로 32 건강보험심사평가원
              <br />
              고객센터 1644-2000 · 평일 09:00~18:00
            </p>
          </div>
          <small>
            Copyright © Health Insurance Review &amp; Assessment Service. All rights reserved.
          </small>
        </div>
      </footer>

      {dialog && (
        <div className="dialog-backdrop" role="presentation">
          <div className="dialog" role="dialog" aria-modal="true" aria-label={dialog.title}>
            <header>
              <h2>{dialog.title}</h2>
              <button type="button" aria-label="닫기" onClick={() => setDialog(null)}>
                ×
              </button>
            </header>
            <div className="dialog-body">
              {dialog.lines.map((line, index) => (
                <p key={`${line}-${index}`} style={{ margin: "6px 0" }}>
                  {line}
                </p>
              ))}
            </div>
            <footer>
              <button type="button" className="button primary" onClick={() => setDialog(null)}>
                확인
              </button>
              <button type="button" className="button secondary" onClick={() => setDialog(null)}>
                닫기
              </button>
            </footer>
          </div>
        </div>
      )}

      {searchModal && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setSearchModal(false)}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="통합 메뉴 검색"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h2>통합 메뉴 검색</h2>
              <button type="button" aria-label="닫기" onClick={() => setSearchModal(false)}>
                ×
              </button>
            </header>
            <div className="dialog-body">
              <div className="field">
                <label htmlFor="global-menu-query">메뉴명</label>
                <input
                  id="global-menu-query"
                  aria-label="메뉴 검색"
                  value={menuQuery}
                  onChange={(event) => setMenuQuery(event.target.value)}
                  placeholder="메뉴명을 입력하세요"
                />
              </div>
              <ul className="home-list" style={{ marginTop: 14 }}>
                {searchResults.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/menu/${item.id}`);
                        setSearchModal(false);
                        setMenuQuery("");
                      }}
                    >
                      {item.path} · {item.id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <footer>
              <button type="button" className="button secondary" onClick={() => setSearchModal(false)}>
                닫기
              </button>
            </footer>
          </div>
        </div>
      )}

      {loginModal && (
        <div className="dialog-backdrop" role="presentation">
          <div className="dialog" role="dialog" aria-modal="true" aria-label="로그인">
            <header>
              <h2>로그인</h2>
              <button type="button" aria-label="닫기" onClick={() => setLoginModal(false)}>
                ×
              </button>
            </header>
            <div className="dialog-body">
              <div className="form-table">
                <label htmlFor="login-id">아이디</label>
                <div className="form-cell">
                  <input id="login-id" aria-label="아이디" defaultValue="kops-demo" />
                </div>
                <label htmlFor="login-pw">비밀번호</label>
                <div className="form-cell">
                  <input id="login-pw" aria-label="비밀번호" type="password" defaultValue="demo" />
                </div>
              </div>
              <p style={{ color: "#657383", fontSize: 12 }}>
                데모 환경입니다. 임의의 계정으로 로그인할 수 있습니다.
              </p>
            </div>
            <footer>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  setLoggedIn(true);
                  setLoginModal(false);
                  setToast("데모 계정으로 로그인했습니다.");
                }}
              >
                로그인
              </button>
              <button type="button" className="button secondary" onClick={() => setLoginModal(false)}>
                취소
              </button>
            </footer>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function isFormScreen(menu: MenuCase): boolean {
  const text = `${menu.path} ${menu.title}`;
  return (
    /(작성하기|작성$|회원정보수정|비밀번호 변경|비밀번호변경|탈퇴|교육신청|신청$|업로드|기본사항)/.test(text) &&
    !menu.title.includes("현황")
  );
}

function SearchPanel({
  values,
  onChange,
  onSearch,
}: {
  values: SearchValues;
  onChange: (key: string, value: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="search-panel" role="search">
      {SEARCH_FIELDS.map((field) => (
        <div className="field" key={field.key}>
          <label htmlFor={`search-${field.key}`}>{field.key}</label>
          {field.kind === "select" ? (
            <select
              id={`search-${field.key}`}
              aria-label={field.key}
              value={values[field.key] ?? ""}
              onChange={(event) => onChange(field.key, event.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`search-${field.key}`}
              aria-label={field.key}
              value={values[field.key] ?? ""}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={`${field.key} 입력`}
            />
          )}
        </div>
      ))}
      <div className="search-actions">
        <button type="button" className="button primary" onClick={onSearch}>
          조회
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            SEARCH_FIELDS.forEach((field) =>
              onChange(field.key, field.key === "제출연도" ? "2025" : field.key === "영업구분" ? "S" : ""),
            );
          }}
        >
          초기화
        </button>
      </div>
    </div>
  );
}

function ResultTable({
  menu,
  rows,
  onRowClick,
}: {
  menu: MenuCase;
  rows: Row[];
  onRowClick: (row: Row) => void;
}) {
  const columns = rows.length ? Object.keys(rows[0]).slice(0, 6) : [];
  return (
    <>
      <div className="result-tools">
        <div>
          총 <strong>{rows.length}</strong>건 / 1페이지
        </div>
        <div>
          <button type="button" className="button secondary small">CSV 다운로드</button>
        </div>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <caption className="sr-only">{menu.title} 목록</caption>
          <thead>
            <tr>
              <th>번호</th>
              {columns.map((column) => (
                <th key={column}>{labelOf(column)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="empty" colSpan={columns.length + 1}>
                  조회된 데이터가 없습니다. 조회 버튼을 눌러주세요.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${menu.id}-row-${index}`}>
                  <td>{index + 1}</td>
                  {columns.map((column) => (
                    <td key={column} className={column.includes("Nm") || column.includes("Ttl") ? "title" : ""}>
                      {index === 0 && columns[0] === column ? (
                        <button type="button" className="link" onClick={() => onRowClick(row)}>
                          {cellText(row[column])}
                        </button>
                      ) : (
                        cellText(row[column])
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination" aria-label="페이지 이동">
        <button type="button" disabled>이전</button>
        <button type="button" className="active" aria-current="page">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">다음</button>
      </div>
    </>
  );
}

function StatsView({ rows, menu }: { rows: Row[]; menu: MenuCase }) {
  const cards = rows.slice(0, 4);
  const chartRows = rows.filter((row) => row.dChartColumn1).slice(0, 7);
  const max = Math.max(...chartRows.map((row) => Number(row.dChartColumn1) || 0), 1);
  return (
    <>
      <div className="notice-box">
        지출보고서 제도 현황과 경제적 이익 제공 내역을 한눈에 확인할 수 있습니다.
        기준연도는 제출연도({menu.sample["제출연도"] || "2025"})입니다.
      </div>
      <div className="stat-cards">
        {(cards.length ? cards : [{ commCdTxt: "경제적이익 제공 업체수", totCnt: "1,437", rmkTxt2: "개소" }]).map(
          (card, index) => (
            <div className="stat-card" key={index}>
              <span>{cellText(card.commCdTxt ?? card.commCdNm ?? "통계")}</span>
              <strong>{cellText(card.totCnt ?? card.dChartColumn1)}</strong>
              <span>{cellText(card.rmkTxt2 ?? "건")}</span>
            </div>
          ),
        )}
      </div>
      <div className="panel">
        <div className="panel-title">
          <h3>업종별 제공 현황</h3>
        </div>
        <div className="panel-body">
          <div className="chart">
            {(chartRows.length
              ? chartRows
              : [
                  { gubun: "제조업", dChartColumn1: "522" },
                  { gubun: "수입업", dChartColumn1: "415" },
                  { gubun: "도매업", dChartColumn1: "318" },
                ]
            ).map((row, index) => (
              <div
                className="chart-bar"
                key={index}
                style={{ height: `${Math.max(8, ((Number(row.dChartColumn1) || 0) / max) * 100)}%` }}
              >
                <strong>{cellText(row.dChartColumn1)}</strong>
                <span>{cellText(row.gubun ?? row.commCdNm)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FaqView({ rows }: { rows: Row[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = rows.filter((row) => row.prbmDtlTxt || row.bltTtl);
  return (
    <div className="panel">
      <div className="panel-title">
        <h3>자주 찾는 질문</h3>
        <span className="badge">총 {faqs.length}건</span>
      </div>
      <div className="panel-body">
        <div className="accordion">
          {faqs.map((row, index) => (
            <div className="accordion-item" key={index}>
              <button
                type="button"
                className="accordion-question"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <b>Q</b>
                <span>{cellText(row.prbmDtlTxt ?? row.bltTtl)}</span>
              </button>
              {open === index && (
                <div className="accordion-answer">
                  <b>A</b> {cellText(row.ansDtlTxt)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapView() {
  return (
    <div className="panel">
      <div className="panel-title"><h3>오시는 길</h3></div>
      <div className="panel-body">
        <div className="map-box">
          <div className="map-pin">건강보험심사평가원 · 강원특별자치도 원주시 건강로 32</div>
        </div>
        <p style={{ lineHeight: 1.8, color: "#657383" }}>
          지하철 이용: 태릉입구역 7번 출구에서 셔틀버스 · 버스 이용: 원주시외버스터미널에서 30번 버스
        </p>
      </div>
    </div>
  );
}

function FormView({
  menu,
  values,
  onChange,
  onToast,
}: {
  menu: MenuCase;
  values: SearchValues;
  onChange: (key: string, value: string) => void;
  onToast: (message: string) => void;
}) {
  const index = formIndexForTitle(menu.title);
  const fields = FORM_FIELDS[index] ?? ["작성일자", "업체명", "제출연도", "내용", "증빙자료"];
  return (
    <div className="panel">
      <div className="panel-title">
        <h3>{menu.title}</h3>
        <span className="badge blue">{menu.id}</span>
      </div>
      <div className="panel-body">
        <div className="stepper">
          <span className="active">기본사항</span>
          <span>업체정보</span>
          <span>세부사항</span>
          <span>확인</span>
        </div>
        <div className="form-table">
          <label htmlFor="form-smit-year">제출연도 <span className="required">*</span></label>
          <div className="form-cell">
            <input
              id="form-smit-year"
              aria-label="제출연도"
              value={values["제출연도"] ?? "2025"}
              onChange={(event) => onChange("제출연도", event.target.value)}
            />
          </div>
          {fields.map((field, i) => (
            <div key={field} style={{ display: "contents" }}>
              <label htmlFor={`form-${field}`}>
                {field} <span className="required">*</span>
              </label>
              <div className="form-cell">
                <input
                  id={`form-${field}`}
                  aria-label={field}
                  defaultValue={i === 1 ? menu.sample["업체명"] ?? "" : ""}
                />
              </div>
            </div>
          ))}
          <label htmlFor="form-remark">비고</label>
          <div className="form-cell">
            <textarea id="form-remark" aria-label="비고" placeholder="내용을 입력하세요" />
          </div>
        </div>
        <div className="form-footer">
          <button type="button" className="button secondary" onClick={() => onToast("임시 저장했습니다.")}>
            임시저장
          </button>
          <button type="button" className="button positive" onClick={() => onToast("입력 내용을 확인했습니다.")}>
            확인
          </button>
          <button type="button" className="button secondary" onClick={() => onToast("목록으로 이동합니다.")}>
            목록
          </button>
        </div>
        <p style={{ color: "#657383", fontSize: 12, textAlign: "center" }}>
          작성일 {nowDate()} · 7종 서식(견본품 제공 ~ 구매 전 의료기기의 성능 확인을 위한 사용) 지원
        </p>
      </div>
    </div>
  );
}

function DetailView({ menu, rows }: { menu: MenuCase; rows: Row[] }) {
  const row = rows[0] ?? {};
  return (
    <div className="panel">
      <div className="panel-title">
        <h3>{menu.title}</h3>
        <span className="badge gray">{nowDate()}</span>
      </div>
      <div className="panel-body">
        <div className="form-table" style={{ gridTemplateColumns: "180px 1fr" }}>
          {["제목", "등록일", "내용"].map((label, index) => (
            <div key={label} style={{ display: "contents" }}>
              <label>{label}</label>
              <div className="form-cell">
                {index === 0
                  ? cellText(row.bltTtl ?? row.title ?? menu.title)
                  : index === 1
                    ? cellText(row.regDt ?? nowDate())
                    : "테스트케이스 기준 상세 내용입니다. 화면 식별자: " + (menu.appUri ?? menu.id)}
              </div>
            </div>
          ))}
        </div>
        <div className="form-footer">
          <button type="button" className="button secondary">목록</button>
        </div>
      </div>
    </div>
  );
}

function GroupView({
  menu,
  children,
}: {
  menu: MenuCase;
  children: MenuCase[];
}) {
  const columns = Array.from(
    new Set(children.map((item) => item.section)),
  ).slice(0, 4);
  return (
    <>
      <div className="notice-box">
        {menu.title} 서비스입니다. 아래에서 세부 메뉴를 선택하거나 상단 조회 조건으로 자료를 검색할 수 있습니다.
      </div>
      <div className="panel">
        <div className="panel-title"><h3>세부 메뉴</h3></div>
        <div className="panel-body">
          {columns.map((column) => (
            <div key={column} style={{ marginBottom: 20 }}>
              <h3 style={{ color: "#123b6d", fontSize: 15 }}>{column}</h3>
              <div className="quick-grid" style={{ padding: "12px 0" }}>
                {children
                  .filter((item) => item.section === column)
                  .slice(0, 8)
                  .map((item) => (
                    <button
                      type="button"
                      className="quick-card"
                      key={item.id}
                      onClick={() => {
                        window.location.href = `/menu/${item.id}`;
                      }}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.id}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function HomeView({ onNavigate }: { onNavigate: (id: string) => void }) {
  const notices = extractRows("selectMainNtfclteList.ndo", 5).rows;
  const stats = extractRows("selectAllSeeStcInfoPgList.ndo", 4).rows;
  return (
    <>
      <section className="hero">
        <div className="shell hero-inner">
          <h1>
            투명한 지출보고서,
            <br />
            신뢰받는 의료환경
          </h1>
          <p>지출보고서 작성·정정부터 공개자료 조회까지 한 곳에서 확인하세요.</p>
          <div className="hero-actions">
            <button type="button" className="button primary" onClick={() => onNavigate("OPAA020000")}>
              공개자료 조회
            </button>
            <button type="button" className="button secondary" onClick={() => onNavigate("OPAB030000")}>
              지출보고서 작성
            </button>
          </div>
          <div className="hero-art" aria-hidden="true" />
        </div>
      </section>
      <section className="quick-area">
        <div className="shell quick-grid">
          {FEATURED_MENUS.map((id) => {
            const item = MENU_BY_ID[id];
            return (
              <button type="button" className="quick-card" key={id} onClick={() => onNavigate(id)}>
                <i>▦</i>
                <strong>{item.title}</strong>
                <span>{item.group}</span>
              </button>
            );
          })}
        </div>
      </section>
      <div className="shell home-content">
        <div>
          <div className="home-board">
            <div className="home-board-head">
              <h2>공지사항</h2>
              <button type="button" className="button secondary small" onClick={() => onNavigate("OPAD010000")}>
                더보기
              </button>
            </div>
            <ul className="home-list">
              {(notices.length ? notices : [{ bltTtl: "KOPS 시스템 이용 안내", regDt: nowDate() }]).map(
                (row, index) => (
                  <li key={index}>
                    <button type="button" onClick={() => onNavigate("OPAD010100")}>
                      {cellText(row.bltTtl ?? row.title)}
                    </button>
                    <time>{cellText(row.regDt ?? nowDate()).slice(0, 10)}</time>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div>
          <div className="home-board">
            <div className="home-board-head"><h2>한눈에 보는 통계</h2></div>
            <div className="guide-cards">
              {(stats.length ? stats : [{ commCdTxt: "경제적이익 제공 업체수", totCnt: "1,437", rmkTxt2: "개소" }]).map(
                (row, index) => (
                  <div className="guide-card" key={index}>
                    <h3>{cellText(row.commCdTxt ?? "통계")}</h3>
                    <p>
                      {cellText(row.totCnt)} {cellText(row.rmkTxt2 ?? "")}
                    </p>
                  </div>
                ),
              )}
            </div>
            <button
              type="button"
              className="button secondary small"
              style={{ marginTop: 14 }}
              onClick={() => onNavigate("OPAA030000")}
            >
              통계 전체보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
