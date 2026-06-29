"use client";

import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "./use-table-controls";

const PAGE_SIZE_OPTIONS = [10, 50, 100];

export function TablePagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Tampilkan</span>
        <Select value={String(pageSize)} onValueChange={(v) => v && onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue>{String(pageSize)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)} label={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          baris &middot; {totalRows === 0 ? "0" : `${start}-${end}`} dari {totalRows}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-[5.5rem] text-center text-sm text-muted-foreground">
          Hal {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function SortableHead({
  label,
  sortKey,
  activeKey,
  sortDir,
  onSort,
  className,
}: {
  label: React.ReactNode;
  sortKey: string;
  activeKey: string | null;
  sortDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}) {
  const active = activeKey === sortKey;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", active ? "opacity-100" : "opacity-40")} />
      </button>
    </TableHead>
  );
}
