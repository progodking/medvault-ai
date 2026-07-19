"use client";

import {
  ArrowUpRight,
  Bell,
  FileText,
  Pill,
  Plus,
  Upload,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import { HealthSummaryChart } from "@/components/dashboard/health-summary-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/use-members";
import { useRecords } from "@/hooks/use-records";
import { useReminders } from "@/hooks/use-reminders";
import { useStats } from "@/hooks/use-stats";
import { REMINDER_ICON } from "@/lib/ui-maps";
import { DEMO_USER } from "@/lib/demo-user";
import { formatDate, initials, relativeTime } from "@/lib/format";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorObj,
    refetch: refetchStats,
  } = useStats();
  const { data: members } = useMembers();
  const { data: records } = useRecords();
  const { data: reminders } = useReminders();
  const [now] = useState(() => Date.now());

  const upcoming = (reminders ?? [])
    .filter((r) => !r.completed && new Date(r.dateTime).getTime() > now)
    .slice(0, 4);
  const recent = (records ?? []).slice(0, 5);
  const memberName = (id: string) =>
    members?.find((m) => m.id === id)?.name ?? "Unknown";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="relative overflow-hidden gap-0 rounded-3xl border-0 brand-gradient p-6 text-white shadow-glow sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.25),transparent_45%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/80">Welcome back,</p>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {DEMO_USER.firstName} 👋
            </h1>
            <p className="mt-1 max-w-md text-sm text-white/85">
              Your family&apos;s health is all in order. Here&apos;s what&apos;s
              happening today.
            </p>
          </div>
          <Button
            className="h-11 gap-2 bg-white text-accent hover:bg-white/90"
            render={<Link href="/dashboard/upload"><Upload className="size-4" /> Quick upload</Link>}
          />
        </div>
      </Card>

      {/* Stats */}
      {statsError ? (
        <ErrorState
          title="Couldn't load your stats"
          error={statsErrorObj}
          onRetry={() => refetchStats()}
          className="py-10"
        />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard icon={Users} label="Family members" value={stats.members} tone="primary" />
            <StatCard icon={FileText} label="Medical records" value={stats.records} tone="secondary" />
            <StatCard icon={Pill} label="Active medicines" value={stats.medicines} tone="success" hint={`${stats.expiredMedicines} expired`} />
            <StatCard icon={Bell} label="Upcoming reminders" value={stats.upcomingReminders} tone="warning" />
          </>
        )}
      </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health summary chart */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold">Health summary</h2>
              <p className="text-sm text-muted-foreground">Records added over the last 6 months</p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/timeline">View timeline</Link>} />
          </div>
          <div className="mt-6">
            <HealthSummaryChart records={records ?? []} />
          </div>
        </Card>

        {/* Family members */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Family</h2>
            <Button variant="ghost" size="icon-sm" render={<Link href="/dashboard/family" aria-label="Manage family"><Plus className="size-4" /></Link>} />
          </div>
          <div className="mt-4 space-y-3">
            {(members ?? []).slice(0, 4).map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/family/${m.id}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src={m.photoUrl} alt={m.name} />
                  <AvatarFallback>{initials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.relationship}</p>
                </div>
                <Badge variant="outline" className="text-xs">{m.bloodGroup}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming reminders */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Upcoming reminders</h2>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/reminders">All</Link>} />
          </div>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <EmptyState icon={Bell} title="No upcoming reminders" description="You're all caught up." className="py-10" />
            ) : (
              upcoming.map((r) => {
                const Icon = REMINDER_ICON[r.type];
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {memberName(r.memberId)} · {relativeTime(r.dateTime)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{r.type}</Badge>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent reports */}
        <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent reports</h2>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/timeline">All</Link>} />
          </div>
          <div className="mt-4 space-y-3">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <FileText className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {memberName(r.memberId)} · {formatDate(r.date)}
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
