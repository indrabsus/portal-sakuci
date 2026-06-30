"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  Layers,
  School,
  GraduationCap,
  Users,
  BookOpen,
  KeyRound,
  DatabaseBackup,
  Map,
  ClipboardList,
  Award,
  BarChart3,
  BookMarked,
  FileText,
  ClipboardCheck,
  NotebookText,
  Route,
  Sparkles,
  Search,
  Building2,
  UserCircle,
  MessageCircle,
  HeartHandshake,
  NotebookPen,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ICONS = {
  dashboard: LayoutDashboard,
  "calendar-range": CalendarRange,
  layers: Layers,
  school: School,
  "graduation-cap": GraduationCap,
  users: Users,
  "book-open": BookOpen,
  "key-round": KeyRound,
  "database-backup": DatabaseBackup,
  map: Map,
  "clipboard-list": ClipboardList,
  award: Award,
  "bar-chart": BarChart3,
  "book-marked": BookMarked,
  "file-text": FileText,
  "clipboard-check": ClipboardCheck,
  "notebook-text": NotebookText,
  route: Route,
  sparkles: Sparkles,
  search: Search,
  building: Building2,
  "user-circle": UserCircle,
  "message-circle": MessageCircle,
  "heart-handshake": HeartHandshake,
  "notebook-pen": NotebookPen,
} as const;

export type NavIconKey = keyof typeof ICONS;
export type NavItem = { href: string; label: string; icon: NavIconKey };

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
              active
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Sidebar tetap, hanya tampil di layar md ke atas. */
export function SidebarNav({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-14 items-center border-b px-5">
        <p className="text-lg font-bold tracking-tight">{title}</p>
      </div>
      <NavLinks items={items} />
    </aside>
  );
}

/** Tombol hamburger + drawer nav, hanya tampil di layar di bawah md. */
export function MobileNav({ title, items }: { title: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Buka menu navigasi"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <SheetContent side="left" className="flex w-3/4 max-w-xs flex-col p-0">
        <SheetHeader className="border-b px-5 py-0">
          <SheetTitle className="flex h-14 items-center text-lg font-bold tracking-tight">
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <NavLinks items={items} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
