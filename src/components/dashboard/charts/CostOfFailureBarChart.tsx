"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CostOfFailureItem } from "@/types/creative";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { STATUS } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

export function CostOfFailureBarChart({ data }: { data: CostOfFailureItem[] }) {
  if (data.length === 0) return <EmptyState message="No ineffective creatives in the current selection." />;

  const chartData = data.map((item) => ({
    name: item.creative.creativeName,
    spend: item.creative.spend,
    targetLabel: item.targetLabel,
    actualLabel: item.actualLabel,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, chartData.length * 46)}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fee2e2" />
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
          width={200}
          tick={{ fontSize: 11, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#fef2f2" }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null;
            const row = payload[0].payload as (typeof chartData)[number];
            return (
              <div className="max-w-[240px] rounded-xl border border-red-200 bg-white px-3 py-2 text-xs shadow-md">
                <p className="mb-1 truncate font-semibold text-slate-700">{label}</p>
                <p className="text-slate-500">Spend: {formatCurrency(row.spend)}</p>
                <p className="text-red-600">{row.actualLabel}</p>
                <p className="text-slate-400">{row.targetLabel}</p>
              </div>
            );
          }}
        />
        <Bar dataKey="spend" fill={STATUS.ineffective} radius={[0, 6, 6, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
