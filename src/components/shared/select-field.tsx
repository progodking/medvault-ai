"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = string | { value: string; label: string };

function normalize(option: SelectOption): { value: string; label: string } {
  return typeof option === "string" ? { value: option, label: option } : option;
}

/**
 * A single-value dropdown built from a list of options. Wraps the Base UI
 * `Select` scaffolding (trigger + content + items) so callers declare their
 * options once instead of duplicating them across the `items` prop and the
 * rendered `SelectItem` children. Callers own the surrounding label + layout.
 */
export function SelectField({
  value,
  onValueChange,
  options,
  placeholder,
  allOption,
  triggerClassName = "h-9 w-full",
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  /** Prepends a catch-all entry (e.g. `{ value: "all", label: "All members" }`). */
  allOption?: { value: string; label: string };
  triggerClassName?: string;
}) {
  const items = [...(allOption ? [allOption] : []), ...options.map(normalize)];
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v ?? "")}
      items={items}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
