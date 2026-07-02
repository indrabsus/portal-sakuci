"use client";

import { useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { SidebarNav, type NavItem } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";

export function AppShell({
  title,
  navItems,
  tahunAjaranLabel,
  email,
  children,
  mainClassName = "flex-1 overflow-x-hidden p-4 md:p-8 print:p-0",
  contentClassName = "mx-auto max-w-6xl print:max-w-none",
  footerClassName = "mx-auto max-w-6xl print:hidden",
}: {
  title: string;
  navItems: NavItem[];
  tahunAjaranLabel: string | null;
  email: string | null;
  children: React.ReactNode;
  mainClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SidebarNav title={title} items={navItems} collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col bg-muted/30">
        <TopBar
          tahunAjaranLabel={tahunAjaranLabel}
          email={email}
          navTitle={title}
          navItems={navItems}
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <main className={mainClassName}>
          <div className={contentClassName}>{children}</div>
          <div className={footerClassName}>
            <AppFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
