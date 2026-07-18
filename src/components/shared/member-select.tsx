"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const list = members ?? [];
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v ?? "")}
      items={list.map((m) => ({ value: m.id, label: m.name }))}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {list.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
