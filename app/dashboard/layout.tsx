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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <DashboardSidebar session={session} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Desktop) */}
        <header className="sticky top-0 z-30 hidden md:flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 px-6 lg:px-8 backdrop-blur">
          <div>
            <h2 className="text-base font-semibold">Dashboard</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Welcome to your workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 text-zinc-600 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
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
