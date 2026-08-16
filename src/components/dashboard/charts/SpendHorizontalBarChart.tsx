"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SpendSlice } from "@/types/creative";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "@/lib/format";
import { BLUE } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

export function SpendHorizontalBarChart({ data }: { data: SpendSlice[] }) {
  if (data.length === 0) return <EmptyState />;

  const height = Math.max(220, data.length * 34);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0f2fe" />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fontSize: 11, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#eff6ff" }}
          formatter={(value, _name, item) => {
            const payload = item?.payload as SpendSlice | undefined;
            return [`${formatCurrency(Number(value))} (${formatPercent(payload?.share ?? 0)})`, "Spend"];
          }}
          contentStyle={{ borderRadius: 12, border: "1px solid #bfdbfe", fontSize: 12 }}
        />
        <Bar dataKey="spend" fill={BLUE.cobalt} radius={[0, 6, 6, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
