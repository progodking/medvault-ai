"use client";

import { Droplet, Eye, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { MemberFormDialog } from "@/components/dashboard/member-form-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/hooks/use-members";
import { calcAge, initials } from "@/lib/format";
import type { FamilyMember } from "@/lib/types";

export function MemberCard({ member }: { member: FamilyMember }) {
  const del = useDeleteMember();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card className="group relative gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
      <div className="h-16 brand-gradient" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <Avatar className="size-16 border-4 border-card">
            <AvatarImage src={member.photoUrl} alt={member.name} />
            <AvatarFallback className="text-lg">{initials(member.name)}</AvatarFallback>
          </Avatar>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Options">
                  <MoreVertical className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/dashboard/family/${member.id}`}><Eye className="mr-2 size-4" /> Open</Link>} />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 size-4" /> Delete
                    </DropdownMenuItem>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {member.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the member and all their records, medicines and
                      reminders. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        del.mutate(member.id, {
                          onSuccess: () => toast.success(`${member.name} deleted`),
                          onError: (err) =>
                            toast.error("Couldn't delete member", {
                              description:
                                err instanceof Error
                                  ? err.message
                                  : "Please try again.",
                            }),
                        })
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3">
          <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
          <p className="text-sm text-muted-foreground">
            {member.relationship} · {calcAge(member.dateOfBirth)} yrs · {member.gender}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary" className="gap-1">
            <Droplet className="size-3 text-destructive" /> {member.bloodGroup}
          </Badge>
          {member.conditions.slice(0, 2).map((c) => (
            <Badge key={c} variant="outline">{c}</Badge>
          ))}
          {member.conditions.length > 2 && (
            <Badge variant="outline">+{member.conditions.length - 2}</Badge>
          )}
        </div>

        {member.emergencyContactName && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="size-3" /> {member.emergencyContactName} ·{" "}
            {member.emergencyContactPhone}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link href={`/dashboard/family/${member.id}`}>Open</Link>}
          />
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>
      </div>

      <MemberFormDialog
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
        trigger={<span className="hidden" />}
      />
    </Card>
  );
}
