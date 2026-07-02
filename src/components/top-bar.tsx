"use client";

import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav, type NavItem } from "@/components/sidebar-nav";

export function TopBar({
  tahunAjaranLabel,
  email,
  navTitle,
  navItems,
  isSidebarCollapsed = false,
  onToggleSidebar,
}: {
  tahunAjaranLabel: string | null;
  email: string | null;
  navTitle: string;
  navItems: NavItem[];
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-3 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav title={navTitle} items={navItems} />
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            aria-label={isSidebarCollapsed ? "Buka sidebar" : "Sembunyikan sidebar"}
            onClick={onToggleSidebar}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        )}
        <p className="truncate text-xs text-muted-foreground sm:text-sm">
          {tahunAjaranLabel ? (
            <>
              <span className="hidden sm:inline">Tahun Ajaran: </span>
              <span className="font-medium text-foreground">{tahunAjaranLabel}</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {email && <span className="hidden max-w-40 truncate text-sm text-muted-foreground md:inline">{email}</span>}
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm" className="gap-1.5">
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
