"use client";

import { useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { CircuitOverlay } from "@/components/circuit-overlay";
import { SidebarNav, type NavItem } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { FloatingChat } from "@/features/chat/floating-chat";
import { ChatNotifBell } from "@/features/chat/chat-notif-bell";
import { cn } from "@/lib/utils";

export function AppShell({
  title,
  navItems,
  tahunAjaranLabel,
  email,
  namaLengkap,
  fotoUrl,
  gantiPasswordHref,
  children,
  currentUserId,
  mainClassName = "flex-1 overflow-x-hidden p-4 md:p-8 print:block print:h-auto print:flex-none print:overflow-visible print:p-0",
  contentClassName = "mx-auto max-w-6xl print:max-w-none",
  footerClassName = "mx-auto max-w-6xl print:hidden",
}: {
  title: string;
  navItems: NavItem[];
  tahunAjaranLabel: string | null;
  email: string | null;
  namaLengkap: string | null;
  fotoUrl: string | null;
  gantiPasswordHref: string;
  children: React.ReactNode;
  currentUserId?: string;
  mainClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen print:block print:min-h-0">
      <SidebarNav title={title} items={navItems} collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col bg-muted/30 print:block print:flex-none">
        <TopBar
          tahunAjaranLabel={tahunAjaranLabel}
          email={email}
          namaLengkap={namaLengkap}
          fotoUrl={fotoUrl}
          gantiPasswordHref={gantiPasswordHref}
          navTitle={title}
          navItems={navItems}
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          notifSlot={currentUserId ? <ChatNotifBell currentUserId={currentUserId} /> : undefined}
        />
        <main className={cn("relative", mainClassName)}>
          <CircuitOverlay className="opacity-[0.05] dark:opacity-[0.07] print:hidden" />
          <div className={cn("relative", contentClassName)}>{children}</div>
          <div className={cn("relative", footerClassName)}>
            <AppFooter />
          </div>
        </main>
      </div>
      {currentUserId && <FloatingChat currentUserId={currentUserId} />}
    </div>
  );
}
