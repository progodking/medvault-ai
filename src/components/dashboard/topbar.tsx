"use client";

import {
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DEMO_USER } from "@/lib/demo-user";
import { initials } from "@/lib/format";

const notifications = [
  { title: "Metformin reminder", desc: "Due in 3 hours", tone: "text-primary" },
  { title: "Report processed", desc: "HbA1c test categorised", tone: "text-secondary" },
  { title: "Medicine expiring", desc: "Atorvastatin expired", tone: "text-warning" },
];

export function Topbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass-strong px-4 sm:px-6">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <button
        onClick={() => router.push("/dashboard/timeline")}
        className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-card/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 sm:max-w-md"
      >
        <Search className="size-4" />
        <span>Search records, medicines…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          /
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary" className="text-[10px]">
                {notifications.length} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5 py-2.5">
                <span className={`text-sm font-medium ${n.tone}`}>{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.desc}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-sm text-primary"
              onClick={() => router.push("/dashboard/reminders")}
            >
              View all reminders
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 pl-1.5 pr-2" aria-label="Profile menu">
                <Avatar className="size-8">
                  <AvatarImage src={DEMO_USER.avatarUrl} alt={DEMO_USER.name} />
                  <AvatarFallback>{initials(DEMO_USER.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  {DEMO_USER.firstName}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="font-medium">{DEMO_USER.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {DEMO_USER.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/settings"><User className="mr-2 size-4" /> Profile</Link>} />
            <DropdownMenuItem render={<Link href="/dashboard/settings"><Settings className="mr-2 size-4" /> Settings</Link>} />
            <DropdownMenuItem render={<Link href="/dashboard/emergency"><ShieldAlert className="mr-2 size-4" /> Emergency card</Link>} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                toast.success("Logged out");
                router.push("/");
              }}
            >
              <LogOut className="mr-2 size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
