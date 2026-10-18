import Link from "next/link";
import { HiOutlineShieldExclamation, HiOutlineArrowLeft, HiOutlineHome } from "react-icons/hi2";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-error/10 text-error shadow-inner">
        <HiOutlineShieldExclamation className="h-10 w-10" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        Access Denied
      </h1>

      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-error/10 px-3 py-1 text-xs font-semibold text-error">
        <span>403 Forbidden</span>
      </div>

      <p className="mt-4 max-w-md text-sm text-base-content/70 sm:text-base">
        You do not have permission to view this page. This section is restricted to administrators or specific roles.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="btn btn-primary gap-2 rounded-xl px-5 text-sm font-medium shadow-lg shadow-primary/20"
        >
          <HiOutlineHome className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <Link
          href="/"
          className="btn btn-outline gap-2 rounded-xl px-5 text-sm font-medium"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Home Page
        </Link>
      </div>
    </div>
  );
}
