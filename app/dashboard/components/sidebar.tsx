
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineChartBar,
  HiOutlineFolder,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

import { useSession, signOut } from "@/lib/auth-client";

const navItems = [
  { title: "Overview", href: "/dashboard", icon: HiOutlineHome },
  { title: "Users", href: "/dashboard/users", icon: HiOutlineUsers },
  { title: "Projects", href: "/dashboard/projects", icon: HiOutlineFolder },
  { title: "Analytics", href: "/dashboard/analytics", icon: HiOutlineChartBar },
  { title: "Settings", href: "/dashboard/settings", icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { data: session, isPending } = useSession();

  const user = session?.user;
  const name = user?.name || "User";
  const email = user?.email || "";

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  // Close sidebar after navigation
  const closeSidebar = () => setIsOpen(false);

  // Sign out using Better Auth
  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsOpen(false);
            router.replace("/login");
            router.refresh();
          },
          onError: () => {
            setIsSigningOut(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop: below sidebar and toggle button */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={closeSidebar}
          className="fixed inset-0 top-20 z-[40] bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 top-20 z-[45] flex w-64 flex-col border-r border-base-300 bg-base-100 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:top-0 lg:translate-x-0 lg:shadow-none`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-base-300 px-6">
          <Image
            src="/logo.png"
            width={240}
            height={240}
            alt="Knowledge logo"
            priority
            className=" shrink-0 object-contain"
          />

    
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-base-content/50">
            Main menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon size={21} />
                <span>{item.title}</span>

                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User session and sign out */}
        <div className="shrink-0 border-t border-base-300 p-4">
          {isPending ? (
            <div className="flex animate-pulse items-center gap-3 p-2">
              <div className="h-10 w-10 rounded-full bg-base-300" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-base-300" />
                <div className="h-3 w-32 rounded bg-base-300" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${name}'s profile`}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-xs text-base-content/60">
                  {email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                aria-label="Sign out"
                title="Sign out"
                className="shrink-0 rounded-lg p-2 text-base-content/60 transition hover:bg-base-300 hover:text-error disabled:opacity-50"
              >
                {isSigningOut ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <HiOutlineArrowRightOnRectangle size={20} />
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={closeSidebar}
              className="block rounded-xl bg-base-200 p-3 text-sm hover:bg-base-300"
            >
              Please sign in
            </Link>
          )}
        </div>
      </aside>

      {/* Toggle stays outside the sidebar so it never slides away */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls="dashboard-sidebar"
        className="fixed left-4 top-5 z-[50] flex h-10 w-10 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content shadow-md transition hover:bg-base-200 lg:hidden"
      >
        {isOpen ? (
          <HiOutlineXMark size={23} />
        ) : (
          <HiOutlineBars3 size={23} />
        )}
      </button>
    </>
  );
}
