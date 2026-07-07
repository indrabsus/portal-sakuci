import { requireRole } from "@/lib/auth";
import { getUsers, getRoles } from "./actions";
import { PenggunaClient } from "./pengguna-client";

export default async function PenggunaPage() {
  await requireRole(["admin"]);
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);
  return <PenggunaClient users={users} roles={roles} />;
}
