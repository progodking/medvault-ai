"use client";

import { Building2, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteRecord } from "@/hooks/use-records";
import { formatDate } from "@/lib/format";
import { CATEGORY_ICON, CATEGORY_TONE } from "@/lib/ui-maps";
import { FileText } from "lucide-react";
import type { MedicalRecord } from "@/lib/types";

export function RecordTimeline({
  records,
  showMember,
  memberName,
}: {
  records: MedicalRecord[];
  showMember?: boolean;
  memberName?: (id: string) => string;
}) {
  const del = useDeleteRecord();

  if (records.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No records found"
        description="Try adjusting your filters, or upload a new report."
      />
    );
  }

  return (
    <div className="relative space-y-4 before:absolute before:left-[1.15rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
      {records.map((r) => {
        const Icon = CATEGORY_ICON[r.category];
        return (
          <div key={r.id} className="relative flex gap-4">
            <span
              className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl ${CATEGORY_TONE[r.category]}`}
            >
              <Icon className="size-5" />
            </span>
            <div className="group flex-1 rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading text-sm font-semibold">{r.title}</h4>
                    <Badge variant="secondary" className="text-[10px]">{r.category}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(r.date)}
                    {showMember && memberName ? ` · ${memberName(r.memberId)}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete record"
                  onClick={() =>
                    del.mutate(r.id, {
                      onSuccess: () => toast.success("Record deleted"),
                    })
                  }
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>

              {(r.doctorName || r.hospital) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {r.doctorName && (
                    <span className="flex items-center gap-1.5">
                      <Stethoscope className="size-3.5" /> {r.doctorName}
                    </span>
                  )}
                  {r.hospital && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="size-3.5" /> {r.hospital}
                    </span>
                  )}
                </div>
              )}

              {r.diagnosis && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Diagnosis: </span>
                  {r.diagnosis}
                </p>
              )}

              {r.medicines && r.medicines.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.medicines.map((m) => (
                    <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
