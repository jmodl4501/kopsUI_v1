import type { Metadata } from "next";
import "./globals.css";
import "./portal.css";

export const metadata: Metadata = {
  title: "KOPS 지출보고서 관리시스템",
  description:
    "건강보험심사평가원 지출보고서 관리시스템 — 84개 메뉴 테스트케이스 재현용 React 포털",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
