"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SpendEfficiencySlice } from "@/types/creative";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "@/lib/format";
import { STATUS } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

export function StackedEffectivenessBarChart({ data }: { data: SpendEfficiencySlice[] }) {
  if (data.length === 0) return <EmptyState />;

  const height = Math.max(220, data.length * 36);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
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
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null;
            const row = payload[0]?.payload as SpendEfficiencySlice;
            return (
              <div className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs shadow-md">
                <p className="mb-1 font-semibold text-slate-700">{label}</p>
                <p className="text-green-600">🟢 Effective: {formatCurrency(row.effectiveSpend)}</p>
                <p className="text-red-600">🔴 Ineffective: {formatCurrency(row.ineffectiveSpend)}</p>
                <p className="mt-1 text-slate-500">Success rate: {formatPercent(row.successRate)}</p>
              </div>
            );
          }}
        />
        <Bar dataKey="effectiveSpend" stackId="spend" fill={STATUS.effective} name="Effective Spend" radius={[0, 0, 0, 0]} maxBarSize={20} />
        <Bar dataKey="ineffectiveSpend" stackId="spend" fill={STATUS.ineffective} name="Ineffective Spend" radius={[0, 6, 6, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
