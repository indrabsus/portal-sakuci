import { requireRole } from "@/lib/auth";
import { ChangePasswordForm } from "@/features/ganti-password/change-password-form";

export default async function SiswaGantiPasswordPage() {
  await requireRole(["siswa"]);
  return <ChangePasswordForm />;
}
