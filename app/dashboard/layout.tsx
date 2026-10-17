
import type { ReactNode } from "react";
import Sidebar from "./components/sidebar";
import { HiOutlineBell } from "react-icons/hi2";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-base-200">
      <Sidebar />

      {/* Main content */}
      <main className="min-h-screen lg:pl-64">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-base-300 bg-base-100/95 px-6 pl-16 backdrop-blur lg:px-8">
          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="hidden text-sm text-base-content/60 sm:block">
              Welcome to your workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-base-300 p-2.5 transition hover:bg-base-200"
          >
            <HiOutlineBell size={21} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>
        </header>

        {/* Page content */}
        <section className="p-5 sm:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}
