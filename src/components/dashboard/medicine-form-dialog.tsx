"use client";

import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateMedicine } from "@/hooks/use-medicines";
import { useMembers } from "@/hooks/use-members";
import type { Frequency } from "@/lib/types";
import { cn } from "@/lib/utils";

const FREQS: { key: Frequency; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "night", label: "Night" },
];

export function MedicineFormDialog({ trigger }: { trigger: ReactNode }) {
  const { data: members } = useMembers();
  const create = useCreateMedicine();
  const [open, setOpen] = useState(false);

  const [memberId, setMemberId] = useState("");
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [schedule, setSchedule] = useState<Frequency[]>(["morning"]);
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [notes, setNotes] = useState("");

  const toggleFreq = (f: Frequency) =>
    setSchedule((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  const submit = async () => {
    if (!memberId) return toast.error("Select a member");
    if (!name) return toast.error("Enter a medicine name");
    await create.mutateAsync({
      memberId,
      name,
      dosage,
      schedule,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiryDate || undefined,
      reminderEnabled,
      notes: notes || undefined,
    });
    toast.success("Medicine added");
    setOpen(false);
    setName("");
    setDosage("");
    setSchedule(["morning"]);
    setExpiryDate("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add medicine</DialogTitle>
          <DialogDescription>Track dosage and schedule reminders.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Member</Label>
            <Select
              value={memberId}
              onValueChange={(v) => setMemberId(v ?? "")}
              items={(members ?? []).map((m) => ({ value: m.id, label: m.name }))}
            >
              <SelectTrigger className="h-9 w-full"><SelectValue placeholder="Select member" /></SelectTrigger>
              <SelectContent>
                {(members ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mname">Name</Label>
              <Input id="mname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Metformin" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="500mg" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Schedule</Label>
            <div className="flex gap-2">
              {FREQS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFreq(f.key)}
                  className={cn(
                    "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                    schedule.includes(f.key)
                      ? "border-primary bg-accent text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiry">Expiry date</Label>
            <Input id="expiry" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Take after meals" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">Enable reminders</p>
              <p className="text-xs text-muted-foreground">Get notified at each scheduled time</p>
            </div>
            <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={create.isPending} className="brand-gradient text-white">
            {create.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add medicine"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
