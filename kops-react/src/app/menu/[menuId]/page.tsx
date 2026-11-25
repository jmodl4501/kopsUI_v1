import KopsShell from "@/components/KopsShell";
import { MENU_BY_ID } from "@/data/menuCases";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return Object.keys(MENU_BY_ID).map((menuId) => ({ menuId }));
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;
  if (!MENU_BY_ID[menuId]) notFound();
  return <KopsShell menuId={menuId} />;
}
