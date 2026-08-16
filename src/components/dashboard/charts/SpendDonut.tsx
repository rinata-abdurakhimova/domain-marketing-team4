"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SpendSlice } from "@/types/creative";
import { formatCurrency, formatPercent } from "@/lib/format";
import { CATEGORICAL_BLUES } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

export function SpendDonut({ data }: { data: SpendSlice[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="spend"
          nameKey="name"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={data.length > 1 ? 2 : 0}
          strokeWidth={2}
          stroke="#ffffff"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CATEGORICAL_BLUES[index % CATEGORICAL_BLUES.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, item) => {
            const payload = item?.payload as SpendSlice | undefined;
            return [
              `${formatCurrency(Number(value))} (${formatPercent(payload?.share ?? 0)})`,
              payload?.name,
            ];
          }}
          contentStyle={{ borderRadius: 12, border: "1px solid #bfdbfe", fontSize: 12 }}
        />
        <Legend
          verticalAlign="bottom"
          height={32}
          formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
