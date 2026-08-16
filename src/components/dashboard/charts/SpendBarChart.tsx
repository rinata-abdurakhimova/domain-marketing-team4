"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SpendSlice } from "@/types/creative";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "@/lib/format";
import { BLUE } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

export function SpendBarChart({ data }: { data: SpendSlice[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0f2fe" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ fill: "#eff6ff" }}
          formatter={(value, _name, item) => {
            const payload = item?.payload as SpendSlice | undefined;
            return [`${formatCurrency(Number(value))} (${formatPercent(payload?.share ?? 0)})`, "Spend"];
          }}
          contentStyle={{ borderRadius: 12, border: "1px solid #bfdbfe", fontSize: 12 }}
        />
        <Bar dataKey="spend" fill={BLUE.electric} radius={[6, 6, 0, 0]} maxBarSize={56} />
      </BarChart>
    </ResponsiveContainer>
  );
}
