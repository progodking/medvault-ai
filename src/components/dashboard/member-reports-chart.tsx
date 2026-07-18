"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RECORD_CATEGORIES } from "@/lib/constants";
import type { MedicalRecord } from "@/lib/types";

const COLORS = ["#1F6BFF", "#16C7C7", "#F59E0B", "#8B5CF6", "#22C55E", "#EF4444"];

export function MemberReportsChart({ records }: { records: MedicalRecord[] }) {
  const data = RECORD_CATEGORIES.map((cat) => ({
    category: cat,
    count: records.filter((r) => r.category === cat).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          className="text-[11px] text-muted-foreground"
          stroke="currentColor"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          className="text-xs text-muted-foreground"
          stroke="currentColor"
        />
        <Tooltip
          cursor={{ fill: "color-mix(in oklab, var(--muted) 60%, transparent)" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Records" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
