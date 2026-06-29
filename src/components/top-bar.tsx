"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar({
  tahunAjaranLabel,
  email,
}: {
  tahunAjaranLabel: string | null;
  email: string | null;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
      <p className="text-sm text-muted-foreground">
        {tahunAjaranLabel ? (
          <>
            Tahun Ajaran: <span className="font-medium text-foreground">{tahunAjaranLabel}</span>
          </>
        ) : null}
      </p>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {email && <span className="text-sm text-muted-foreground">{email}</span>}
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm" className="gap-1.5">
            <LogOut className="size-3.5" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
