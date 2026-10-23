"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineTrophy,
  HiOutlineEnvelope,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineSquares2X2,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: <HiOutlineHome className="h-5 w-5" />,
  },
  {
    name: "Course",
    href: "/course",
    icon: <HiOutlineBookOpen className="h-5 w-5" />,
  },
  {
    name: "Success Story",
    href: "/success-story",
    icon: <HiOutlineTrophy className="h-5 w-5" />,
  },
  {
    name: "Contact Us",
    href: "/contact",
    icon: <HiOutlineEnvelope className="h-5 w-5" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const isFullyLoggedIn = !!session?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  // Close offcanvas drawer on route navigation (React 19 recommended pattern without effect)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Lock body scroll when mobile offcanvas is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-base-300/60 bg-base-100/90 backdrop-blur-md">
        <div className="navbar max-w-7xl mx-auto px-4 sm:px-8 h-16">
          <div className="navbar-start gap-2">
            {/* Hamburger button to trigger left offcanvas drawer on mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="Open mobile navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-offcanvas-menu"
            >
              <HiOutlineBars3 className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="Knowledge IT Institute"
                width={180}
                height={45}
                priority
                className="w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links with animated border-bottom */}
          <div className="navbar-center hidden lg:flex">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative py-2 text-1xl font-medium transition-colors duration-200 ${active
                      ? "text-primary font-semibold"
                      : "text-base-content/70 hover:text-primary"
                      }`}
                  >
                    <span>{item.name}</span>
                    {/* Animated border-bottom transition */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2.5px] rounded-full bg-primary transition-all duration-300 ease-in-out ${active
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navbar Action Buttons (Sign In & Sign Up or User Dropdown) */}
          <div className="navbar-end flex items-center justify-end gap-2 sm:gap-3">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-primary"></span>
            ) : isFullyLoggedIn ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className="btn btn-ghost btn-circle p-0 hover:bg-primary/10 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-primary/25 hover:ring-primary transition-all">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="leading-none">
                        {(session.user.name || session.user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-50 p-2.5 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-200"
                >
                  <li className="px-3 py-2.5 border-b border-base-200/80 mb-1">
                    <div className="flex flex-col gap-0.5 p-0 hover:bg-transparent cursor-default">
                      <span className="font-semibold text-sm text-base-content truncate">
                        {session.user.name || "User"}
                      </span>
                      <span className="text-xs text-base-content/60 truncate">
                        {session.user.email}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 font-medium py-2 rounded-lg text-base-content hover:bg-base-200 hover:text-primary transition-colors"
                    >
                      <HiOutlineSquares2X2 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 font-medium py-2 rounded-lg text-base-content hover:bg-base-200 hover:text-primary transition-colors"
                    >
                      <HiOutlineUser className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li className="border-t border-base-200/80 my-1 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-error hover:bg-error/10 font-medium py-2 rounded-lg transition-colors"
                    >
                      <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="btn btn-ghost btn-sm sm:btn-md font-medium text-base-content hover:bg-base-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-primary btn-sm sm:btn-md font-semibold text-white shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Overlay / Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Offcanvas Drawer (Slides in from the left) */}
      <aside
        id="mobile-offcanvas-menu"
        aria-label="Mobile navigation"
        className={`fixed top-0 bottom-0 left-0 z-[100] w-80 max-w-[85vw] bg-base-100 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-200/80">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/logo.png"
              alt="Knowledge IT Institute"
              width={160}
              height={40}
              className="w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200"
            aria-label="Close navigation menu"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-3">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${active
                    ? "bg-primary/10 text-primary font-semibold shadow-xs"
                    : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
                    }`}
                >
                  <span
                    className={
                      active ? "text-primary" : "text-base-content/50"
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions */}

      </aside>
    </>
  );
}
