"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "@/lib/format";
import { BLUE } from "@/lib/colors";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

interface BubbleRow {
  name: string;
  spend: number;
  successRate: number;
  creatives: number;
}

export function SpendSuccessBubbleChart({ data }: { data: BubbleRow[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
        <XAxis
          type="number"
          dataKey="spend"
          name="Spend"
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="successRate"
          name="Success Rate"
          domain={[0, 1]}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <ZAxis type="number" dataKey="creatives" range={[60, 400]} name="Creatives" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const row = payload[0].payload as BubbleRow;
            return (
              <div className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs shadow-md">
                <p className="mb-1 font-semibold text-slate-700">{row.name}</p>
                <p className="text-slate-500">Spend: {formatCurrency(row.spend)}</p>
                <p className="text-slate-500">Success Rate: {formatPercent(row.successRate)}</p>
                <p className="text-slate-500">Creatives: {row.creatives}</p>
              </div>
            );
          }}
        />
        <Scatter data={data} fill={BLUE.electric} fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
