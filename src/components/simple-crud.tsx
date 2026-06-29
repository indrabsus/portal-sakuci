"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableControls } from "@/components/use-table-controls";
import { SortableHead, TablePagination } from "@/components/table-pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "date" | "checkbox" | "select" | "textarea";
  options?: { value: string; label: string }[];
  required?: boolean;
};

export type SimpleCrudAction = (
  formData: FormData,
) => Promise<{ success: boolean; message: string }>;

export function SimpleCrud<T extends Record<string, unknown>>({
  title,
  idKey,
  columns,
  fields,
  rows,
  createAction,
  updateAction,
  deleteAction,
  renderExtraActions,
}: {
  title: string;
  idKey: keyof T & string;
  columns: {
    key: keyof T & string;
    label: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  fields: FieldDef[];
  rows: T[];
  createAction: SimpleCrudAction;
  updateAction: SimpleCrudAction;
  deleteAction: SimpleCrudAction;
  renderExtraActions?: (row: T) => React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const table = useTableControls<T>(rows);

  function openCreate() {
    setEditing(null);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setError(null);
    setDialogOpen(true);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const action = editing ? updateAction : createAction;
    if (editing) formData.set(idKey, String(editing[idKey]));
    startTransition(async () => {
      const result = await action(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setDialogOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.set(idKey, String(deleteTarget[idKey]));
    startTransition(async () => {
      await deleteAction(formData);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} data tercatat</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((col) =>
                  col.sortable === false ? (
                    <TableHead key={col.key} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {col.label}
                    </TableHead>
                  ) : (
                    <SortableHead
                      key={col.key}
                      label={col.label}
                      sortKey={col.key}
                      activeKey={table.sortKey}
                      sortDir={table.sortDir}
                      onSort={table.toggleSort}
                    />
                  ),
                )}
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                    Belum ada data
                  </TableCell>
                </TableRow>
              )}
              {table.rows.map((row) => (
                <TableRow key={String(row[idKey])} className="transition-colors hover:bg-accent/40">
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {renderExtraActions?.(row)}
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)} aria-label="Edit">
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(row)}
                        aria-label="Hapus"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          onPageSizeChange={table.setPageSize}
        />
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Tambah"} {title}</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    defaultValue={editing ? String(editing[field.name] ?? "") : ""}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Pilih...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    rows={3}
                    defaultValue={editing ? String(editing[field.name] ?? "") : ""}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    defaultChecked={editing ? Boolean(editing[field.name]) : false}
                    className="h-4 w-4"
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type === "date" ? "date" : "text"}
                    required={field.required}
                    defaultValue={editing ? String(editing[field.name] ?? "") : ""}
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
