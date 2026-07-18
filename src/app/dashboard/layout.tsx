import type { ReactNode } from "react";

import { FloatingUpload } from "@/components/dashboard/floating-upload";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="lg:pl-64">
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <FloatingUpload />
    </div>
  );
}
