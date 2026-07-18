"use client";

import { HardDrive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Progress } from "@/components/ui/progress";
import { useStats } from "@/hooks/use-stats";
import { DASHBOARD_NAV } from "@/lib/constants";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: stats } = useStats();
  const used = stats?.storage.usedMb ?? 0;
  const total = stats?.storage.totalMb ?? 2048;
  const pct = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" onClick={onNavigate} aria-label="MedVault AI home">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {DASHBOARD_NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "brand-gradient text-white shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  active ? "text-white" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 p-3">
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="size-3.5 text-primary" /> Storage
            </span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-2 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {formatBytes(used)} of {formatBytes(total)} used
          </p>
          <p className="mt-1 text-xs font-medium text-primary">
            Free forever — every feature included.
          </p>
        </div>
      </div>
    </div>
  );
}
