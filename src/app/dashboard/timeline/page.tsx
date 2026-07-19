"use client";

import { Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { RecordTimeline } from "@/components/dashboard/record-timeline";
import { PageHeader } from "@/components/shared/page-header";
import { SelectField } from "@/components/shared/select-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useMembers } from "@/hooks/use-members";
import { useRecords } from "@/hooks/use-records";
import { RECORD_CATEGORIES } from "@/lib/constants";
import type { MedicalRecord } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";

const EXAMPLES = [
  "Show all diabetes reports",
  "Reports from 2024",
  "Show MRI",
  "Apollo Hospital",
];

export default function TimelinePage() {
  const { data: members } = useMembers();
  const { data: records } = useRecords();

  const [member, setMember] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [aiResults, setAiResults] = useState<MedicalRecord[] | null>(null);
  const [interpreted, setInterpreted] = useState("");
  const [searching, setSearching] = useState(false);

  const memberName = (id: string) =>
    members?.find((m) => m.id === id)?.name ?? "Unknown";

  const base = useMemo(() => {
    let list = aiResults ?? records ?? [];
    if (member !== "all") list = list.filter((r) => r.memberId === member);
    if (category !== "all") list = list.filter((r) => r.category === category);
    return list;
  }, [aiResults, records, member, category]);

  const runAiSearch = async () => {
    if (!query.trim()) {
      setAiResults(null);
      setInterpreted("");
      return;
    }
    setSearching(true);
    try {
      const res = await api.post<{ results: MedicalRecord[]; interpreted: string }>(
        "/api/ai/search",
        { query, memberId: member === "all" ? undefined : member },
      );
      setAiResults(res.results);
      setInterpreted(res.interpreted);
    } catch (err) {
      toast.error("Search failed", {
        description: getErrorMessage(err),
      });
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setAiResults(null);
    setInterpreted("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Timeline"
        description="Every record across your family — search it naturally."
      />

      {/* AI search */}
      <Card className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">AI natural-language search</span>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAiSearch()}
              placeholder="e.g. Show all diabetes reports"
              className="h-10 pl-9 pr-9"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Button onClick={runAiSearch} disabled={searching} className="h-10 brand-gradient text-white">
            {searching ? "Searching…" : "Search"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
              }}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
        {interpreted && (
          <p className="mt-3 text-sm text-primary">{interpreted}</p>
        )}
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SelectField
          value={member}
          onValueChange={(v) => setMember(v || "all")}
          options={(members ?? []).map((m) => ({ value: m.id, label: m.name }))}
          allOption={{ value: "all", label: "All members" }}
          placeholder="Member"
          triggerClassName="h-9 sm:w-48"
        />
        <SelectField
          value={category}
          onValueChange={(v) => setCategory(v || "all")}
          options={RECORD_CATEGORIES}
          allOption={{ value: "all", label: "All categories" }}
          placeholder="Category"
          triggerClassName="h-9 sm:w-44"
        />
        <Badge variant="secondary" className="h-9 self-start px-3 sm:self-auto">
          {base.length} records
        </Badge>
      </div>

      <RecordTimeline records={base} showMember memberName={memberName} />
    </div>
  );
}
