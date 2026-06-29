"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
} as const;

export type NavIconKey = keyof typeof ICONS;

export function SidebarNav({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string; icon: NavIconKey }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-5">
        <p className="text-lg font-bold tracking-tight">{title}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
