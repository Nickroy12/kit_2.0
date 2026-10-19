import { roleRequired } from "@/lib/core/session";
import React, { ReactNode } from "react";

const AdminLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  await roleRequired("User");
  return <>{children}</>;
};

export default AdminLayout;