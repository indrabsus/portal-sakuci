"use client";

import { useState } from "react";
import { AppFooter } from "@/components/app-footer";
import { SidebarNav, type NavItem } from "@/components/sidebar-nav";
import { TopBar } from "@/components/top-bar";
import { FloatingChat } from "@/features/chat/floating-chat";
import { ChatNotifBell } from "@/features/chat/chat-notif-bell";

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
  mainClassName = "flex-1 overflow-x-hidden p-4 md:p-8 print:p-0",
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
    <div className="flex min-h-screen">
      <SidebarNav title={title} items={navItems} collapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col bg-muted/30">
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
        <main className={mainClassName}>
          <div className={contentClassName}>{children}</div>
          <div className={footerClassName}>
            <AppFooter />
          </div>
        </main>
      </div>
      {currentUserId && <FloatingChat currentUserId={currentUserId} />}
    </div>
  );
}
