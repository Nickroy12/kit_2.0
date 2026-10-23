import { getUserSession } from "@/lib/core/session";
import { HiOutlineShieldCheck, HiOutlineUsers, HiOutlineAcademicCap, HiOutlineCog6Tooth } from "react-icons/hi2";

export default async function AdminPage() {
  // Session is already guaranteed to be admin by AdminLayout
  const session = await getUserSession();
  const user = session?.user;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/30">
            <HiOutlineShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              Admin Control Panel
            </h1>
            <p className="text-sm text-base-content/70">
              Logged in as <span className="font-semibold text-primary">{user?.name || user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-base-content/60">Total Students</p>
              <h3 className="mt-1 text-2xl font-bold">1,248</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HiOutlineUsers className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-success">↑ 12% increase this month</p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-base-content/60">Active Courses</p>
              <h3 className="mt-1 text-2xl font-bold">24</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <HiOutlineAcademicCap className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-base-content/60">4 new courses under review</p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-base-content/60">System Security</p>
              <h3 className="mt-1 text-2xl font-bold text-success">Protected</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <HiOutlineCog6Tooth className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-success">RBAC active on all routes</p>
        </div>
      </div>
    </div>
  );
}