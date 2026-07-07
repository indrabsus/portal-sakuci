"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, KeyRound,
  ToggleLeft, ToggleRight, Search, UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import {
  createUserAction, updateUserAction, resetPasswordAction,
  toggleAktifAction, deleteUserAction, type UserRow,
} from "./actions";

const ROLE_COLOR: Record<string, string> = {
  admin:  "bg-red-500/15 text-red-600 dark:text-red-400",
  kajur:  "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  bkk:    "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  bk:     "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  perpus: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_COLOR[role] ?? "bg-muted text-muted-foreground"}`}>
      {role}
    </span>
  );
}

function sanitizeUsername(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9_.]/g, "");
}

type Mode = "create" | "edit" | "reset-password" | "delete" | null;

export function PenggunaClient({
  users,
  roles,
}: {
  users: UserRow[];
  roles: { id_role: number; nama_role: string }[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [target, setTarget] = useState<UserRow | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // form states
  const [username, setUsername] = useState("");
  const [idRole, setIdRole] = useState("");

  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      search
        ? users.filter((u) =>
            [u.nama_lengkap, u.email, u.role].some((v) =>
              v?.toLowerCase().includes(search.toLowerCase())
            )
          )
        : users,
    [users, search]
  );

  const { rows: paginated, sortKey, sortDir, toggleSort, page, setPage, pageSize, setPageSize, totalPages, totalRows } =
    useTableControls(filtered);

  const open = (m: Mode, u?: UserRow) => {
    setMode(m);
    setTarget(u ?? null);
    setMsg(null);
    if (m === "edit" && u) {
      setIdRole(roles.find((r) => r.nama_role === u.role)?.id_role.toString() ?? "");
    }
    if (m === "create") {
      setUsername("");
      setIdRole(roles[0]?.id_role.toString() ?? "");
    }
  };
  const close = () => { setMode(null); setTarget(null); setMsg(null); };

  const run = (action: () => Promise<{ success: boolean; message: string }>) => {
    startTransition(async () => {
      const res = await action();
      setMsg({ ok: res.success, text: res.message });
      if (res.success) { router.refresh(); setTimeout(close, 900); }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola akun admin, kajur, bkk, dan role lainnya.
          </p>
        </div>
        <Button onClick={() => open("create")} className="gap-2">
          <Plus size={16} /> Tambah Pengguna
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-3 p-4 border-b flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama atau email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <p className="text-sm text-muted-foreground shrink-0">{totalRows} pengguna</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Nama" sortKey="nama_lengkap" activeKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableHead label="Username" sortKey="email" activeKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableHead label="Role" sortKey="role" activeKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
            {paginated.map((u) => (
              <TableRow key={u.id_profile} className={!u.aktif ? "opacity-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <UserCircle2 size={16} className="text-muted-foreground shrink-0" />
                    {u.nama_lengkap ?? "—"}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {u.email?.replace("@sakuci.id", "") ?? "—"}
                  {u.email?.endsWith("@sakuci.id") && (
                    <span className="text-muted-foreground/50">@sakuci.id</span>
                  )}
                </TableCell>
                <TableCell><RoleBadge role={u.role} /></TableCell>
                <TableCell className="text-center">
                  <span className={`text-xs font-medium ${u.aktif ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {u.aktif ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => open("edit", u)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Reset Password" onClick={() => open("reset-password", u)}>
                      <KeyRound size={14} />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      title={u.aktif ? "Nonaktifkan" : "Aktifkan"}
                      onClick={() => run(() => toggleAktifAction(u.id_profile, !u.aktif))}
                    >
                      {u.aktif ? <ToggleRight size={14} className="text-green-500" /> : <ToggleLeft size={14} />}
                    </Button>
                    <Button variant="ghost" size="icon" title="Hapus" className="text-destructive hover:text-destructive" onClick={() => open("delete", u)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t">
          <TablePagination page={page} totalPages={totalPages} totalRows={totalRows} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </Card>

      {/* ── Dialog Tambah ── */}
      <Dialog open={mode === "create"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Tambah Pengguna Baru</DialogTitle></DialogHeader>
          <form action={(fd) => run(() => createUserAction(fd))} className="flex flex-col gap-4 pt-2">
            {msg && <p className={`text-sm rounded-md px-3 py-2 ${msg.ok ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-destructive/10 text-destructive"}`}>{msg.text}</p>}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-nama">Nama Lengkap</Label>
              <Input id="c-nama" name="nama_lengkap" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-username">Username</Label>
              <div className="flex items-center rounded-md border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="c-username" name="username" required minLength={3} maxLength={30}
                  value={username}
                  onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                  placeholder="contoh: budi.santoso"
                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-transparent outline-none"
                />
                <span className="px-3 py-2 text-xs text-muted-foreground bg-muted border-l select-none">@sakuci.id</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-role">Role</Label>
              <Select name="id_role" value={idRole} onValueChange={(v) => setIdRole(v ?? "")} required>
                <SelectTrigger id="c-role">
                  <SelectValue placeholder="Pilih role">
                    {(v: unknown) => roles.find((r) => r.id_role.toString() === v)?.nama_role ?? "Pilih role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id_role} value={r.id_role.toString()} label={r.nama_role}>
                      <RoleBadge role={r.nama_role} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="id_role" value={idRole} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-pw">Password</Label>
              <Input id="c-pw" name="password" type="password" minLength={6} required placeholder="Min. 6 karakter" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>Batal</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan…" : "Buat Akun"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Edit ── */}
      <Dialog open={mode === "edit"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Pengguna</DialogTitle></DialogHeader>
          <form action={(fd) => run(() => updateUserAction(fd))} className="flex flex-col gap-4 pt-2">
            {msg && <p className={`text-sm rounded-md px-3 py-2 ${msg.ok ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-destructive/10 text-destructive"}`}>{msg.text}</p>}
            <input type="hidden" name="id_profile" value={target?.id_profile ?? ""} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-nama">Nama Lengkap</Label>
              <Input id="e-nama" name="nama_lengkap" defaultValue={target?.nama_lengkap ?? ""} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Username</Label>
              <div className="flex items-center rounded-md border bg-muted overflow-hidden px-3 py-2 text-sm text-muted-foreground font-mono">
                {target?.email?.replace("@sakuci.id", "") ?? target?.email}
                {target?.email?.endsWith("@sakuci.id") && <span className="text-muted-foreground/50">@sakuci.id</span>}
              </div>
              <p className="text-xs text-muted-foreground">Username tidak bisa diubah di sini. Gunakan halaman Migrasi Akun jika perlu.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-role">Role</Label>
              <Select name="id_role" value={idRole} onValueChange={(v) => setIdRole(v ?? "")} required>
                <SelectTrigger id="e-role">
                  <SelectValue placeholder="Pilih role">
                    {(v: unknown) => roles.find((r) => r.id_role.toString() === v)?.nama_role ?? "Pilih role"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id_role} value={r.id_role.toString()} label={r.nama_role}>
                      <RoleBadge role={r.nama_role} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="id_role" value={idRole} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>Batal</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan…" : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Reset Password ── */}
      <Dialog open={mode === "reset-password"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Reset Password — {target?.nama_lengkap}</DialogTitle></DialogHeader>
          <form action={(fd) => run(() => resetPasswordAction(fd))} className="flex flex-col gap-4 pt-2">
            {msg && <p className={`text-sm rounded-md px-3 py-2 ${msg.ok ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-destructive/10 text-destructive"}`}>{msg.text}</p>}
            <input type="hidden" name="id_profile" value={target?.id_profile ?? ""} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rp-pw">Password Baru</Label>
              <Input id="rp-pw" name="password" type="password" minLength={6} required placeholder="Min. 6 karakter" />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>Batal</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Mereset…" : "Reset Password"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Alert Hapus ── */}
      <AlertDialog open={mode === "delete"} onOpenChange={(o) => !o && close()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun <span className="font-semibold">{target?.nama_lengkap}</span> ({target?.email}) akan dihapus permanen dari sistem dan tidak bisa dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => run(() => deleteUserAction(target!.id_profile))}
            >
              {isPending ? "Menghapus…" : "Hapus Permanen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
