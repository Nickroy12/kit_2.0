"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { ComponentType } from "react";

import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineChartBar,
  HiOutlineFolder,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineTrophy,
} from "react-icons/hi2";

import { useSession, signOut } from "@/lib/auth-client";

interface NavigationLink {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  exact?: boolean;
}

// Admin Navigation Links (similar to rentigo's adminLinks)
const adminLinks: NavigationLink[] = [
  { title: "Admin Overview", href: "/dashboard/admin", icon: HiOutlineShieldCheck, exact: true },
  { title: "Manage Students", href: "/dashboard/admin/users", icon: HiOutlineUsers },
  { title: "Manage Courses", href: "/dashboard/admin/courses", icon: HiOutlineBookOpen },
  { title: "Analytics", href: "/dashboard/admin/analytics", icon: HiOutlineChartBar },
  { title: "Settings", href: "/dashboard/admin/settings", icon: HiOutlineCog6Tooth },
];

// User / Student Navigation Links (similar to rentigo's consumerLinks)
const userLinks: NavigationLink[] = [
  { title: "My Learning", href: "/dashboard/User", icon: HiOutlineHome, exact: true },
  { title: "My Courses", href: "/dashboard/User/courses", icon: HiOutlineBookOpen },
  { title: "Certificates", href: "/dashboard/User/certificates", icon: HiOutlineTrophy },
  { title: "Settings", href: "/dashboard/User/settings", icon: HiOutlineCog6Tooth },
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
  const role = ((user as { role?: string })?.role || "user").toLowerCase();

  // Dynamically switch links based on user role (rentigo pattern)
  const navItems = role === "admin" ? adminLinks : userLinks;

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
            router.replace("/auth/signin");
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
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={160}
              height={40}
              alt="Knowledge IT"
              priority
              className="w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3 px-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              {role === "admin" ? "Admin Panel" : "Student Area"}
            </p>
            <span
              className={`badge badge-xs font-bold uppercase ${
                role === "admin" ? "badge-primary" : "badge-neutral"
              }`}
            >
              {role}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon size={20} />
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
            <div className="flex items-center gap-3 rounded-xl bg-base-200/60 p-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${name}'s profile`}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
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
                <HiOutlineArrowRightOnRectangle size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="btn btn-outline btn-primary btn-sm w-full rounded-xl"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile toggle button (placed inside navbar height) */}
      <div className="fixed left-4 top-5 z-[50] lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="dashboard-sidebar"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-100 shadow-sm transition hover:bg-base-200"
        >
          {isOpen ? <HiOutlineXMark size={22} /> : <HiOutlineBars3 size={22} />}
        </button>
      </div>
    </>
  );
}
