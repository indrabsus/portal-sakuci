"use client";

import Link from "next/link";
import { KeyRound, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav, type NavItem } from "@/components/sidebar-nav";
import { InitialsAvatar } from "@/components/initials-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({
  tahunAjaranLabel,
  email,
  namaLengkap,
  fotoUrl,
  gantiPasswordHref,
  navTitle,
  navItems,
  isSidebarCollapsed = false,
  onToggleSidebar,
  notifSlot,
}: {
  tahunAjaranLabel: string | null;
  email: string | null;
  namaLengkap: string | null;
  fotoUrl: string | null;
  gantiPasswordHref: string;
  navTitle: string;
  navItems: NavItem[];
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  notifSlot?: React.ReactNode;
}) {
  return (
    <header className="dark flex h-14 items-center justify-between gap-2 border-b bg-black px-3 text-foreground sm:px-6">
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
        {notifSlot}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <InitialsAvatar name={namaLengkap ?? "?"} fotoUrl={fotoUrl} className="size-8 text-xs" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-1.5 py-1">
              <p className="truncate text-sm font-medium text-foreground">{namaLengkap ?? "Pengguna"}</p>
              {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={gantiPasswordHref} />}>
              <KeyRound className="size-4" />
              Ganti Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => void logoutAction()}>
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
