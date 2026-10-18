import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const roleRequired = async (targetRole: string) => {
  const session = await getUserSession();

  // If not logged in, redirect to signin page
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const role = ((session.user as { role?: string }).role || "user").toLowerCase();

  // If user role does not match the target role, redirect to unauthorized page
  if (role !== targetRole.toLowerCase()) {
    redirect("/dashboard/unauthorized");
  }

  return session;
};