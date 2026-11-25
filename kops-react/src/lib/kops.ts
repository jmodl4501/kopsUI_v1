import dataset from "../../data/kops-datasets.json";
import { MENU_BY_ID, type MenuCase } from "@/data/menuCases";

export type Row = Record<string, unknown>;

const DATASETS = dataset as unknown as Record<string, Record<string, unknown[]>>;

export const FIELD_LABELS: Record<string, string> = {
  oggBriefSmitYr: "제출연도",
  oggBriefSmitYrNm: "제출연도",
  oggBriefSmitNo: "제출번호",
  entpNm: "업체명",
  entpName: "업체명",
  bizNm: "업체명",
  bzNm: "업체명",
  yadmNm: "요양기관명",
  prdtNm: "품목명",
  itemNm: "품목명",
  bltTtl: "제목",
  title: "제목",
  prbmDtlTxt: "질문",
  ansDtlTxt: "답변",
  regDt: "등록일",
  chgDt: "수정일",
  salTpCdNm: "영업구분",
  salFrmCdNm: "영업형태",
  sltYn: "선택",
  stsNm: "진행상태",
  gubun: "구분",
  commCdTxt: "내용",
  commCdNm: "분류",
  totCnt: "건수",
  rmkTxt2: "단위",
  stdYear: "기준연도",
  dChartColumn1: "수량",
  dChartColumn2: "금액",
  ddlYn: "공개여부",
  fileNm: "파일명",
  smitDe: "제출일",
  ospNm: "기관명",
};

export function labelOf(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  if (key.endsWith("Nm") || key.endsWith("Name")) return key.slice(0, -2);
  if (key.endsWith("Dt") || key.endsWith("De")) return key.slice(0, -2);
  return key;
}

export function extractRows(key: string, limit = 12): { rows: Row[]; columns: string[] } {
  const source = DATASETS[key] ?? {};
  const rows = (Object.values(source).find(Array.isArray) ?? []).slice(0, limit) as Row[];
  if (!rows.length) return { rows: [], columns: [] };
  const columns = Object.keys(rows[0]).filter(
    (keyName) => !["regpId", "chgpId", "delYn", "sortOrd"].includes(keyName),
  );
  return { rows, columns };
}

export function datasetForMenu(menu: MenuCase): string {
  const preferred = menu.uris.find((uri) => uri in DATASETS);
  if (preferred) return preferred;
  if (menu.group.includes("정보공개")) return "selectOggBriefPubDataSrchList.ndo";
  if (menu.group.includes("작성")) return "selectOggBriefForm1List.do";
  if (menu.group.includes("고객지원")) return "selectNtfclteList.ndo";
  return "selectComCodeList.ndo";
}

export function endpointPath(menu: MenuCase, slug: string): string {
  const prefixes: Record<string, string> = {
    지출보고서_정보공개: "op/opa",
    지출보고서_작성ㆍ정정: "op/opb",
    지출보고서_기초정보_조회: "op/opc",
    고객지원: "op/opd",
    제도소개: "op/ope",
    마이페이지: "op/opf",
  };
  const fromAppUri = menu.appUri?.split("/").slice(1, 3).join("/");
  const prefix = fromAppUri && /^op\/op[a-f]$/.test(fromAppUri)
    ? fromAppUri
    : prefixes[menu.group.replace(/\s/g, "_")] ?? "op/com";
  return `/kops/main/${prefix}/${slug}`;
}

export function endpointsForMenu(menu: MenuCase, max = 28): string[] {
  const seen = new Set<string>();
  return menu.uris
    .map((slug) => endpointPath(menu, slug))
    .filter((url) => !seen.has(url) && seen.add(url))
    .slice(0, max);
}

export function detailMenuIds(menu: MenuCase): string[] {
  const seen = new Set<string>();
  return menu.detailIds.filter((id) => !seen.has(id) && seen.add(id));
}

export function findMenuByAppUri(appUri: string): MenuCase | undefined {
  return Object.values(MENU_BY_ID).find((menu) => menu.appUri === appUri);
}

export const FORM_FIELDS: Record<number, string[]> = {
  1: ["제공일자", "제공처명", "제품명", "수량", "단가", "공급금액", "증빙자료"],
  2: ["행사명", "행사일자", "장소", "참여의료인", "지원항목", "지원금액", "증빙자료"],
  3: ["시험명", "계약일자", "임상시험기관", "피험자수", "지원항목", "지원금액", "증빙자료"],
  4: ["설명회명", "개최일자", "장소", "참석자", "홍보물 수량", "소요금액", "증빙자료"],
  5: ["조사명", "조사기간", "대상제품", "조사건수", "참여기관", "소요금액", "증빙자료"],
  6: ["거래처명", "계약일자", "할인기간", "할인율", "할인금액", "결제조건", "증빙자료"],
  7: ["의료기기명", "확인목적", "제공일자", "수량", "기기정보", "소요금액", "증빙자료"],
};

export function formIndexForTitle(title: string): number {
  const names = [
    "견본품",
    "학술대회",
    "임상시험",
    "제품설명회",
    "시판 후 조사",
    "비용할인",
    "성능 확인",
  ];
  const index = names.findIndex((name) => title.includes(name));
  return index >= 0 ? index + 1 : 0;
}

export function nowDate(): string {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
