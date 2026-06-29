"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Cetak / Simpan PDF" }: { label?: string }) {
  return (
    <Button onClick={() => window.print()} className="no-print gap-1.5 shadow-sm">
      <Printer className="size-4" />
      {label}
    </Button>
  );
}
