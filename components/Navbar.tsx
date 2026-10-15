"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3 9.75 8.25-6.75a1.125 1.125 0 0 1 1.5 0L21 9.75M4.5 10.5v9a1.5 1.5 0 0 0 1.5 1.5h3.75v-6h4.5v6H18a1.5 1.5 0 0 0 1.5-1.5v-9"
        />
      </svg>
    ),
  },
  {
    name: "Course",
    href: "/course",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    name: "Success Story",
    href: "/success-story",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v3.375m-6.75-9a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Z"
        />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // ইমেইল verify হয়েছে কিনা তা চেক করা হচ্ছে
  // emailVerified false মানে ইউজার এখনও পুরোপুরি লগইন না
  const isFullyLoggedIn = session?.user && session.user.emailVerified;

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="Knowledge IT Institute"
                width={180}
                height={45}
                priority
                className="w-auto  object-contain"
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
                    className={`group relative py-2 text-sm font-medium transition-colors duration-200 ${active
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
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-error hover:bg-error/10 font-medium py-2 rounded-lg transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
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
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${isOpen
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[85vw] bg-base-100 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
        <div className="p-4 border-t border-base-200/80 bg-base-200/30">
          {isFullyLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-primary/20">
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
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-base-content">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="btn btn-outline btn-error btn-sm w-full font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="btn btn-outline btn-primary btn-sm w-full font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary btn-sm w-full font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
