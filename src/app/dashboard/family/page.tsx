"use client";

import { UserPlus, Users } from "lucide-react";

import { MemberCard } from "@/components/dashboard/member-card";
import { MemberFormDialog } from "@/components/dashboard/member-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/use-members";

export default function FamilyPage() {
  const { data: members, isLoading } = useMembers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Members"
        description="Manage a health profile for everyone in your family."
        action={
          <MemberFormDialog
            trigger={
              <Button className="gap-2 brand-gradient text-white shadow-glow">
                <UserPlus className="size-4" /> Add member
              </Button>
            }
          />
        }
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : members && members.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No family members yet"
          description="Add your first family member to start building their health vault."
          action={
            <MemberFormDialog
              trigger={
                <Button className="gap-2 brand-gradient text-white">
                  <UserPlus className="size-4" /> Add member
                </Button>
              }
            />
          }
        />
      )}
    </div>
  );
}
