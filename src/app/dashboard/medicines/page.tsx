"use client";

import { AlertTriangle, Clock, Pill, Plus, ShieldCheck, Sun, Sunrise, Sunset, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { MedicineExplainDialog } from "@/components/dashboard/medicine-explain-dialog";
import { MedicineFormDialog } from "@/components/dashboard/medicine-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteMedicine,
  useMedicines,
  useUpdateMedicine,
} from "@/hooks/use-medicines";
import { useMembers } from "@/hooks/use-members";
import { formatDate, isExpired } from "@/lib/format";
import { detectWarnings } from "@/lib/interactions";
import type { Frequency, Medicine } from "@/lib/types";

const FREQ_ICON: Record<Frequency, typeof Sun> = {
  morning: Sunrise,
  afternoon: Sun,
  night: Sunset,
};

function MedicineCard({ med, memberName }: { med: Medicine; memberName: string }) {
  const update = useUpdateMedicine();
  const del = useDeleteMedicine();
  const expired = isExpired(med.expiryDate);

  return (
    <Card className="group gap-0 rounded-2xl border-border/70 p-5 shadow-soft transition-all hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Pill className="size-5" />
          </span>
          <div>
            <p className="font-heading font-semibold">{med.name}</p>
            <p className="text-xs text-muted-foreground">{med.dosage} · {memberName}</p>
          </div>
        </div>
        {expired ? (
          <Badge variant="outline" className="border-destructive/40 text-destructive">Expired</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {(["morning", "afternoon", "night"] as Frequency[]).map((f) => {
          const Icon = FREQ_ICON[f];
          const on = med.schedule.includes(f);
          return (
            <div
              key={f}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-2 text-xs capitalize ${on ? "border-primary/40 bg-accent text-primary" : "border-border text-muted-foreground"}`}
            >
              <Icon className="size-4" />
              {f}
            </div>
          );
        })}
      </div>

      {med.notes && <p className="mt-3 text-xs text-muted-foreground">{med.notes}</p>}
      {med.expiryDate && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3" /> Expires {formatDate(med.expiryDate)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={med.reminderEnabled}
            onCheckedChange={(v) =>
              update.mutate({ id: med.id, data: { reminderEnabled: v } })
            }
          />
          <span className="text-xs text-muted-foreground">Reminder</span>
        </div>
        <div className="flex gap-1">
          <MedicineExplainDialog
            medicine={med.name}
            trigger={<Button variant="outline" size="sm">Explain</Button>}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete"
            onClick={() =>
              del.mutate(med.id, { onSuccess: () => toast.success("Medicine deleted") })
            }
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SafetyBanner({
  medicines,
  memberName,
}: {
  medicines: Medicine[];
  memberName: (id: string) => string;
}) {
  const warnings = detectWarnings(medicines, memberName);

  if (warnings.length === 0) {
    return (
      <Card className="flex-row items-center gap-3 rounded-2xl border-success/30 bg-success/5 p-4 shadow-soft">
        <span className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium">No interaction or duplicate risks detected</p>
          <p className="text-xs text-muted-foreground">
            We checked active medicines across your family for common conflicts.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-0 rounded-2xl border-warning/40 bg-warning/5 p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-5 text-warning" />
        <h2 className="font-heading text-sm font-semibold">
          {warnings.length} safety {warnings.length === 1 ? "check" : "checks"} to review
        </h2>
      </div>
      <div className="mt-3 space-y-2">
        {warnings.map((w, i) => (
          <div
            key={`${w.title}-${i}`}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
          >
            <Badge
              variant="outline"
              className={
                w.severity === "high"
                  ? "border-destructive/40 text-destructive"
                  : "border-warning/40 text-warning"
              }
            >
              {w.severity === "high" ? "High" : "Moderate"}
            </Badge>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {w.title}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {w.members.join(", ")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{w.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Automated checks are not a substitute for professional medical advice.
      </p>
    </Card>
  );
}

export default function MedicinesPage() {
  const { data: medicines, isLoading } = useMedicines();
  const { data: members } = useMembers();
  const memberName = (id: string) => members?.find((m) => m.id === id)?.name ?? "Unknown";

  const active = (medicines ?? []).filter((m) => !isExpired(m.expiryDate));
  const expired = (medicines ?? []).filter((m) => isExpired(m.expiryDate));

  const grid = (list: Medicine[]) =>
    list.length === 0 ? (
      <EmptyState icon={Pill} title="No medicines here" description="Add a medicine to start tracking." />
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <MedicineCard key={m.id} med={m} memberName={memberName(m.memberId)} />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicine Vault"
        description="Track dosages, schedules and reminders for every medicine."
        action={
          <MedicineFormDialog
            trigger={
              <Button className="gap-2 brand-gradient text-white shadow-glow">
                <Plus className="size-4" /> Add medicine
              </Button>
            }
          />
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : (
        <>
        <SafetyBanner medicines={active} memberName={memberName} />
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expired.length})</TabsTrigger>
            <TabsTrigger value="all">History ({(medicines ?? []).length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">{grid(active)}</TabsContent>
          <TabsContent value="expired" className="mt-6">{grid(expired)}</TabsContent>
          <TabsContent value="all" className="mt-6">{grid(medicines ?? [])}</TabsContent>
        </Tabs>
        </>
      )}
    </div>
  );
}
