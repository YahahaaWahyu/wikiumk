import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Otorisasi asli /admin: proxy.ts baru menyaring yang belum login (tanpa DB);
// keputusan role diambil di sini dengan sesi yang valid.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return children;
}
