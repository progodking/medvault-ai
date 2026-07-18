"use client";

import { Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

import { RecordTimeline } from "@/components/dashboard/record-timeline";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { useMembers } from "@/hooks/use-members";
import { useRecords } from "@/hooks/use-records";
import type { MedicalRecord } from "@/lib/types";

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
        <Select
          value={member}
          onValueChange={(v) => setMember(v ?? "all")}
          items={[{ value: "all", label: "All members" }, ...(members ?? []).map((m) => ({ value: m.id, label: m.name }))]}
        >
          <SelectTrigger className="h-9 sm:w-48"><SelectValue placeholder="Member" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            {(members ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v ?? "all")}
          items={[{ value: "all", label: "All categories" }, ...["Report", "Prescription", "Bill", "Scan", "Visit", "Vaccination"].map((c) => ({ value: c, label: c }))]}
        >
          <SelectTrigger className="h-9 sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {["Report", "Prescription", "Bill", "Scan", "Visit", "Vaccination"].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="h-9 self-start px-3 sm:self-auto">
          {base.length} records
        </Badge>
      </div>

      <RecordTimeline records={base} showMember memberName={memberName} />
    </div>
  );
}
