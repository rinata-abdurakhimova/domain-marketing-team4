"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, formatPercent } from "@/lib/format";
import { STATUS } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

interface Props {
  effectiveSpend: number;
  ineffectiveSpend: number;
}

export function EffectivenessDonut({ effectiveSpend, ineffectiveSpend }: Props) {
  const total = effectiveSpend + ineffectiveSpend;
  if (total <= 0) return <EmptyState />;

  type Slice = { name: string; value: number; share: number; color: string };
  const data: Slice[] = [
    { name: "🟢 Effective Spend", value: effectiveSpend, share: effectiveSpend / total, color: STATUS.effective },
    { name: "🔴 Ineffective Spend", value: ineffectiveSpend, share: ineffectiveSpend / total, color: STATUS.ineffective },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={2}
          strokeWidth={2}
          stroke="#ffffff"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, item) => {
            const payload = item?.payload as Slice | undefined;
            return [`${formatCurrency(Number(value))} (${formatPercent(payload?.share ?? 0)})`, payload?.name];
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
