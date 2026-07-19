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
import { MemberSelect } from "@/components/shared/member-select";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateReminder } from "@/hooks/use-reminders";
import { useMembers } from "@/hooks/use-members";
import { REMINDER_TYPES } from "@/lib/constants";
import type { ReminderType } from "@/lib/types";
import { errorMessage } from "@/lib/errors";

export function ReminderFormDialog({ trigger }: { trigger: ReactNode }) {
  const { data: members } = useMembers();
  const create = useCreateReminder();
  const [open, setOpen] = useState(false);

  const [memberId, setMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("Medicine");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async () => {
    if (!memberId) return toast.error("Select a member");
    if (!title) return toast.error("Enter a title");
    if (!dateTime) return toast.error("Pick a date & time");
    try {
      await create.mutateAsync({
        memberId,
        title,
        type,
        dateTime: new Date(dateTime).toISOString(),
        notes: notes || undefined,
        completed: false,
        channels: ["push", "email"],
      });
      toast.success("Reminder created");
      setOpen(false);
      setTitle("");
      setDateTime("");
      setNotes("");
    } catch (err) {
      toast.error("Couldn't create reminder", {
        description: errorMessage(err, "Please try again."),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New reminder</DialogTitle>
          <DialogDescription>
            Medicine, appointments, lab tests and vaccinations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Member</Label>
            <MemberSelect
              value={memberId}
              onValueChange={setMemberId}
              members={members}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rtitle">Title</Label>
            <Input id="rtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Take Metformin" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <SelectField
                value={type}
                onValueChange={(v) => setType(v as ReminderType)}
                options={REMINDER_TYPES}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rdt">Date &amp; time</Label>
              <Input id="rdt" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rnotes">Notes</Label>
            <Input id="rnotes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={create.isPending} className="brand-gradient text-white">
            {create.isPending ? <Loader2 className="size-4 animate-spin" /> : "Create reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
