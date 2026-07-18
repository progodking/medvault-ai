"use client";

import {
  ArrowLeft,
  Droplet,
  Phone,
  Pill,
  Ruler,
  ShieldAlert,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { RecordTimeline } from "@/components/dashboard/record-timeline";
import { MemberReportsChart } from "@/components/dashboard/member-reports-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMember } from "@/hooks/use-members";
import { useMedicines } from "@/hooks/use-medicines";
import { useRecords } from "@/hooks/use-records";
import { calcAge, initials, isExpired } from "@/lib/format";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading } = useMember(id);
  const { data: records } = useRecords(id);
  const { data: medicines } = useMedicines(id);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [hospital, setHospital] = useState("all");

  const years = useMemo(
    () => Array.from(new Set((records ?? []).map((r) => r.date.slice(0, 4)))).sort().reverse(),
    [records],
  );
  const hospitals = useMemo(
    () => Array.from(new Set((records ?? []).map((r) => r.hospital).filter(Boolean))) as string[],
    [records],
  );

  const filtered = useMemo(() => {
    return (records ?? []).filter((r) => {
      if (year !== "all" && !r.date.startsWith(year)) return false;
      if (hospital !== "all" && r.hospital !== hospital) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [r.title, r.diagnosis, r.hospital, r.doctorName, ...(r.tags ?? [])]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, year, hospital, search]);

  if (isLoading || !member) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const bmi =
    member.heightCm && member.weightKg
      ? (member.weightKg / (member.heightCm / 100) ** 2).toFixed(1)
      : null;

  const categoryTab = (cat: string) =>
    filtered.filter((r) => r.category === cat);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2" render={<Link href="/dashboard/family"><ArrowLeft className="size-4" /> Family</Link>} />

      {/* Header */}
      <Card className="relative gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-soft">
        <div className="h-24 brand-gradient" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 border-4 border-card">
                <AvatarImage src={member.photoUrl} alt={member.name} />
                <AvatarFallback className="text-2xl">{initials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="font-heading text-2xl font-bold">{member.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {member.relationship} · {calcAge(member.dateOfBirth)} yrs · {member.gender}
                </p>
              </div>
            </div>
            <Button className="gap-2" variant="outline" render={<Link href="/dashboard/emergency"><ShieldAlert className="size-4" /> Emergency card</Link>} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile icon={Droplet} label="Blood group" value={member.bloodGroup} tone="text-destructive" />
            <InfoTile icon={Ruler} label="Height" value={member.heightCm ? `${member.heightCm} cm` : "—"} tone="text-secondary" />
            <InfoTile icon={Weight} label="Weight" value={member.weightKg ? `${member.weightKg} kg` : "—"} tone="text-primary" />
            <InfoTile icon={Pill} label="BMI" value={bmi ?? "—"} tone="text-success" />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Conditions</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {member.conditions.length ? member.conditions.map((c) => (
                  <Badge key={c} variant="secondary">{c}</Badge>
                )) : <span className="text-sm text-muted-foreground">None recorded</span>}
              </div>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">Allergies</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {member.allergies.length ? member.allergies.map((a) => (
                  <Badge key={a} variant="outline" className="border-warning/40 text-warning">{a}</Badge>
                )) : <span className="text-sm text-muted-foreground">None recorded</span>}
              </div>
            </div>
          </div>

          {member.emergencyContactName && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" /> Emergency contact: {member.emergencyContactName} · {member.emergencyContactPhone}
            </p>
          )}
        </div>
      </Card>

      {/* Chart */}
      <Card className="gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Records by category</h2>
        <div className="mt-4">
          <MemberReportsChart records={records ?? []} />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="timeline">
        <TabsList className="flex-wrap">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="Report">Reports</TabsTrigger>
          <TabsTrigger value="Scan">Scans</TabsTrigger>
          <TabsTrigger value="Bill">Bills</TabsTrigger>
          <TabsTrigger value="Visit">Visits</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Search records…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 sm:max-w-xs"
            />
            <Select value={year} onValueChange={(v) => setYear(v ?? "all")}>
              <SelectTrigger className="h-9 sm:w-40"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={hospital} onValueChange={(v) => setHospital(v ?? "all")}>
              <SelectTrigger className="h-9 sm:w-48"><SelectValue placeholder="Hospital" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All hospitals</SelectItem>
                {hospitals.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <RecordTimeline records={filtered} />
        </TabsContent>

        {(["Report", "Scan", "Bill", "Visit"] as const).map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            <RecordTimeline records={categoryTab(cat)} />
          </TabsContent>
        ))}

        <TabsContent value="medicines" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(medicines ?? []).map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Pill className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="font-medium">{m.name} <span className="text-muted-foreground">{m.dosage}</span></p>
                  <p className="text-xs text-muted-foreground capitalize">{m.schedule.join(" · ") || "As needed"}</p>
                </div>
                {isExpired(m.expiryDate) && <Badge variant="outline" className="border-destructive/40 text-destructive">Expired</Badge>}
              </div>
            ))}
            {(medicines ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No medicines recorded.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Droplet;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
      <Icon className={`size-5 ${tone}`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
