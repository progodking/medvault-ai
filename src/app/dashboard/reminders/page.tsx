"use client";

import { Bell, Check, Mail, Plus, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ReminderFormDialog } from "@/components/dashboard/reminder-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMembers } from "@/hooks/use-members";
import {
  useDeleteReminder,
  useReminders,
  useUpdateReminder,
} from "@/hooks/use-reminders";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { Reminder } from "@/lib/types";
import { REMINDER_ICON } from "@/lib/ui-maps";

function ReminderRow({ r, memberName }: { r: Reminder; memberName: string }) {
  const update = useUpdateReminder();
  const del = useDeleteReminder();
  const Icon = REMINDER_ICON[r.type];

  return (
    <Card className="flex-row items-center gap-4 rounded-2xl border-border/70 p-4 shadow-soft">
      <span className={`flex size-11 items-center justify-center rounded-xl ${r.completed ? "bg-success/10 text-success" : "bg-accent text-primary"}`}>
        <Icon className="size-5" />
      </span>
      <div className="flex-1">
        <p className={`font-medium ${r.completed ? "text-muted-foreground line-through" : ""}`}>{r.title}</p>
        <p className="text-xs text-muted-foreground">
          {memberName} · {formatDateTime(r.dateTime)}
          {!r.completed && <> · {relativeTime(r.dateTime)}</>}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
          {r.channels.includes("push") && <span className="flex items-center gap-1"><Smartphone className="size-3" /> Push</span>}
          {r.channels.includes("email") && <span className="flex items-center gap-1"><Mail className="size-3" /> Email</span>}
        </div>
      </div>
      <div className="flex gap-1">
        {!r.completed && (
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Mark done"
            onClick={() =>
              update.mutate(
                { id: r.id, data: { completed: true } },
                { onSuccess: () => toast.success("Marked as done") },
              )
            }
          >
            <Check className="size-4 text-success" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete"
          onClick={() => del.mutate(r.id, { onSuccess: () => toast.success("Reminder deleted") })}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}

export default function RemindersPage() {
  const { data: reminders, isLoading } = useReminders();
  const { data: members } = useMembers();
  const memberName = (id: string) => members?.find((m) => m.id === id)?.name ?? "Unknown";

  const sorted = (reminders ?? []).slice().sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );
  const upcoming = sorted.filter((r) => !r.completed);
  const completed = sorted.filter((r) => r.completed);

  const list = (items: Reminder[]) =>
    items.length === 0 ? (
      <EmptyState icon={Bell} title="Nothing here" description="Create a reminder to stay on track." />
    ) : (
      <div className="space-y-3">
        {items.map((r) => <ReminderRow key={r.id} r={r} memberName={memberName(r.memberId)} />)}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reminders"
        description="Never miss a dose, appointment, lab test or vaccination."
        action={
          <ReminderFormDialog
            trigger={
              <Button className="gap-2 brand-gradient text-white shadow-glow">
                <Plus className="size-4" /> New reminder
              </Button>
            }
          />
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">{list(upcoming)}</TabsContent>
          <TabsContent value="completed" className="mt-6">{list(completed)}</TabsContent>
        </Tabs>
      )}
    </div>
  );
}
