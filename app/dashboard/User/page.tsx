import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import { HiOutlineUser, HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi2";

export default async function UserPage() {
  const session = await getUserSession();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl bg-base-100 p-6 border border-base-300">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HiOutlineUser className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              Student / User Dashboard
            </h1>
            <p className="text-sm text-base-content/70">
              Welcome back, <span className="font-semibold text-primary">{user.name || user.email}</span>! (Role: <span className="badge badge-neutral badge-sm uppercase">{user.role || "user"}</span>)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HiOutlineBookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content">My Enrolled Courses</h3>
              <p className="text-xs text-base-content/60">Access your active learning materials</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <HiOutlineAcademicCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base-content">Certificates</h3>
              <p className="text-xs text-base-content/60">View completed courses & certificates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}