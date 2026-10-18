import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getUserSession();
  
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const role = ((session.user as { role?: string })?.role || "user").toLowerCase();

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/User");
}