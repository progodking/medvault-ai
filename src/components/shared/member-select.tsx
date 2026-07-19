"use client";

import { SelectField } from "@/components/shared/select-field";
import type { FamilyMember } from "@/lib/types";

/**
 * Shared "pick a family member" dropdown used by the upload, emergency and the
 * medicine / reminder form dialogs. Callers own the surrounding label + layout.
 */
export function MemberSelect({
  value,
  onValueChange,
  members,
  placeholder = "Select member",
  className = "h-9 w-full",
}: {
  value: string;
  onValueChange: (value: string) => void;
  members?: FamilyMember[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <SelectField
      value={value}
      onValueChange={onValueChange}
      options={(members ?? []).map((m) => ({ value: m.id, label: m.name }))}
      placeholder={placeholder}
      triggerClassName={className}
    />
  );
}
