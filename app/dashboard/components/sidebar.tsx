"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Home,
  Settings,
  StickyNotePlus,
  ShoppingCart,
  LucideIcon,
  TicketPercent,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import type { getUserSession } from "@/lib/core/session";
import { signOut } from "@/lib/auth-client";

// Define strict typing for navigation links
interface NavigationLink {
  icon: LucideIcon;
  href: string;
  name: string;
  exact?: boolean;
}

type ServerSession = Awaited<ReturnType<typeof getUserSession>>;

interface DashboardSidebarProps {
  session?: ServerSession;
}

// Unified Navigation Links for Consumers matching domain & dashboard routes
const consumerLinks: NavigationLink[] = [
  { icon: Home, href: "/dashboard/User", name: "Dashboard", exact: true },
  { icon: TicketPercent, href: "/dashboard/renter/booked", name: "My Booking" },
  { icon: Settings, href: "/dashboard/profile", name: "Profile" },
];

const adminLinks: NavigationLink[] = [
  { icon: Home, href: "/dashboard/admin", name: "Dashboard", exact: true },
  { icon: StickyNotePlus, href: "/dashboard/admin/Access", name: "Access Control" },
  { icon: StickyNotePlus, href: "/dashboard/admin/Course", name: "New Course" },
  { icon: ShoppingCart, href: "/dashboard/admin/seminar", name: "New Seminar" },
  { icon: Settings, href: "/dashboard/profile", name: "Profile" },
];

export default function DashboardSidebar({ session }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Dynamically switch links based on user role
  const userRole = ((session?.user as { role?: string })?.role || "user").toLowerCase();
  const currentLinks = userRole === "admin" ? adminLinks : consumerLinks;

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setOpen(false);
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

  const renderSidebarContent = () => (
    <div className="flex flex-col bg-white h-full w-full text-zinc-900">
      {/* Profile Section */}
      <div
        className="m-3 p-4 rounded-2xl shadow-sm flex flex-col gap-3 shrink-0"
        style={{ backgroundColor: "#eb9710" }}
      >
        <div className="flex items-center gap-3">
          {/* Accent Avatar using image or user's initial */}
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session?.user?.name || "User"}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white/40 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-white/20 text-white border border-white/30 shadow-inner">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="text-sm space-y-0.5 min-w-0 flex-1">
            <p className="font-semibold truncate text-white leading-tight">
              {session?.user?.name || "User"}
            </p>
            <p className="text-white/80 text-xs truncate">
              {session?.user?.email || ""}
            </p>
          </div>
        </div>

        {/* Plan / Role Status Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <span className="text-[11px] font-medium text-white/75 uppercase tracking-wider">
            Role
          </span>
          <span className="inline-block px-3 py-0.5 text-xs font-semibold bg-white/20 text-white rounded-full border border-white/30 capitalize">
            {userRole === "admin"
              ? "Admin"
              : userRole === "renter"
                ? "Renter"
                : "Student"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {currentLinks.map((item) => {
          const Icon = item.icon;

          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={active ? { backgroundColor: "#eb9710", color: "#ffffff" } : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${active
                ? "text-white shadow-sm"
                : "text-zinc-600 hover:text-white hover:bg-primary/90"
                }`}
            >
              <Icon
                size={18}
                className={active ? "text-white" : "text-zinc-400"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="p-3 border-t border-zinc-200 mt-auto shrink-0">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium disabled:opacity-50"
        >
          <LogOut size={18} className="text-zinc-400" />
          <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden border-b p-3.5 flex items-center justify-between bg-white border-zinc-200">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Open menu"
        >
          <LayoutDashboard size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Knowledge IT"
            width={320}
            height={320}
            priority
            className=" w-auto object-contain"
          />
        </Link>

        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session?.user?.name || "User"}
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-primary/30"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white border border-primary/25"
            style={{ backgroundColor: "#eb9710" }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 border-r border-zinc-200 bg-white flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Knowledge IT"
              width={320}
              height={320}
              priority
              className=" w-auto object-contain"
            />
          </Link>
        </div>
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-screen w-72 bg-white border-r border-zinc-200 text-zinc-900 transform transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 shrink-0">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/logo.png"
                alt="Knowledge IT"
                width={130}
                height={32}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-500 hover:text-primary p-1.5 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {renderSidebarContent()}
        </div>
      </div>
    </>
  );
}
