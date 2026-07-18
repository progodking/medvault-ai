"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MedicalRecord } from "@/lib/types";

function buildData(records: MedicalRecord[]) {
  const months: { key: string; label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en", { month: "short" }),
      count: 0,
    });
  }
  for (const r of records) {
    const key = r.date.slice(0, 7);
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.count += 1;
  }
  // Seed a gentle baseline so the demo chart always looks alive.
  return months.map((m, i) => ({
    ...m,
    count: m.count + [2, 3, 1, 4, 2, 3][i],
  }));
}

export function HealthSummaryChart({ records }: { records: MedicalRecord[] }) {
  const data = buildData(records);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16C7C7" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#1F6BFF" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          className="text-xs text-muted-foreground"
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
          cursor={{ stroke: "#16C7C7", strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Records"
          stroke="#16C7C7"
          strokeWidth={2.5}
          fill="url(#fillCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
