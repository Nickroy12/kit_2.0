import type { ReactNode } from "react";
import DashboardSidebar from "./components/sidebar";
import { getUserSession } from "@/lib/core/session";
import { Bell } from "lucide-react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getUserSession();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-zinc-900">
      <DashboardSidebar session={session} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Desktop) */}
        <header className="sticky top-0 z-30 hidden md:flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 lg:px-8">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Dashboard</h2>
            <p className="text-xs text-zinc-500">
              Welcome to your workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-zinc-200 p-2 text-zinc-600 transition hover:bg-zinc-100"
          >
            <Bell size={18} />
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: "#eb9710" }}
            />
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
