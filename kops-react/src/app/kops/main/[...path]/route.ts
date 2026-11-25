import { NextRequest, NextResponse } from "next/server";
import dataset from "../../../../../data/kops-datasets.json";

export const dynamic = "force-dynamic";

type DatasetMap = Record<string, Record<string, unknown[]>>;

const DATASETS = dataset as DatasetMap;

/**
 * Browser-facing `/kops/main/**` endpoint adapter.
 *
 * - With KOPS_API_UPSTREAM set (e.g. http://127.0.0.1:8080) the request is
 *   proxied server-side to the eGovFrame backend.
 * - Otherwise the bundled, non-identifying KOPS sample dataset is returned so
 *   the React portal and the Playwright test cases work without a backend.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handle(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handle(request, path);
}

async function handle(request: NextRequest, path: string[]) {
  const upstream = process.env.KOPS_API_UPSTREAM;
  if (upstream) {
    try {
      const target = `${upstream.replace(/\/$/, "")}/kops/main/${path.join("/")}${request.nextUrl.search}`;
      const response = await fetch(target, {
        method: request.method,
        headers: { "content-type": "application/json" },
        body: request.method === "POST" ? await request.text() : undefined,
        cache: "no-store",
      });
      return new NextResponse(response.body, { status: response.status });
    } catch {
      // fall through to the bundled sample data when the backend is offline
    }
  }

  const slug = path[path.length - 1] ?? "";
  const data = DATASETS[slug] ?? {};
  const firstList = Object.values(data).find(Array.isArray) ?? [];
  return NextResponse.json({
    result: {
      rtnCode: "200",
      rtnText: "정상 처리되었습니다.",
      totCnt: String(firstList.length),
      list: firstList,
    },
    ...data,
    _source: slug in DATASETS ? "sample-dataset" : "empty-dataset",
    _uri: path.join("/"),
  });
}
