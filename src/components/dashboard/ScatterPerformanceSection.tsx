"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useFilters } from "@/context/FilterContext";
import { Card } from "@/components/dashboard/ui/Card";
import { SectionTitle } from "@/components/dashboard/ui/SectionTitle";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { formatCpuSlay, formatCurrency, formatCurrencyCompact, formatSignedPercent } from "@/lib/format";
import { STATUS } from "@/lib/colors";
import type { Creative } from "@/types/creative";

type View = "MN" | "WMN";

export function ScatterPerformanceSection() {
  const { filteredData, filters } = useFilters();
  const [manualView, setManualView] = useState<View>("MN");

  const showToggle = filters.audience === "All";
  const view: View =
    filters.audience === "MN" || filters.audience === "WMN" ? filters.audience : manualView;
  const setView = setManualView;

  const points = useMemo(
    () => filteredData.filter((c) => c.audience === view),
    [filteredData, view]
  );

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon="🔬" title="Spend vs Performance" />
        {showToggle && (
          <div className="inline-flex rounded-full bg-blue-50 p-1">
            <button
              onClick={() => setView("MN")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                view === "MN" ? "bg-blue-600 text-white" : "text-blue-700"
              }`}
            >
              MN
            </button>
            <button
              onClick={() => setView("WMN")}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                view === "WMN" ? "bg-blue-600 text-white" : "text-blue-700"
              }`}
            >
              WMN
            </button>
          </div>
        )}
      </div>
      <Card
        title={view === "MN" ? "MN: Spend vs ROI" : "WMN: Spend vs CPU Slay"}
        subtitle={
          view === "MN"
            ? "Reference line at ROI = 0. Green = ROI > 0, Red = ROI ≤ 0."
            : "Reference line at CPU Slay = $30. Green = CPU Slay < $30, Red = CPU Slay ≥ $30."
        }
      >
        {view === "MN" ? <MnScatter data={points} /> : <WmnScatter data={points} />}
      </Card>
    </section>
  );
}

function MnScatter({ data }: { data: Creative[] }) {
  if (data.length === 0) return <EmptyState />;
  return (
    <ResponsiveContainer width="100%" height={320}>
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
          dataKey="roi"
          name="ROI"
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 4" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const c = payload[0].payload as Creative;
            return (
              <div className="max-w-[220px] rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs shadow-md">
                <p className="mb-1 truncate font-semibold text-slate-700">{c.creativeName}</p>
                <p className="text-slate-500">Spend: {formatCurrency(c.spend)}</p>
                <p className={c.roi > 0 ? "text-green-600" : "text-red-600"}>ROI: {formatSignedPercent(c.roi)}</p>
              </div>
            );
          }}
        />
        <Scatter data={data}>
          {data.map((c) => (
            <Cell key={c.id} fill={c.roi > 0 ? STATUS.effective : STATUS.ineffective} fillOpacity={0.8} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function WmnScatter({ data }: { data: Creative[] }) {
  const plottable = data.filter((c) => c.cpuSlay !== null);
  if (plottable.length === 0) return <EmptyState message="No CPU Slay data for the selected filters." />;
  return (
    <ResponsiveContainer width="100%" height={320}>
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
          dataKey="cpuSlay"
          name="CPU Slay"
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <ReferenceLine y={30} stroke="#64748b" strokeDasharray="4 4" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const c = payload[0].payload as Creative;
            return (
              <div className="max-w-[220px] rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs shadow-md">
                <p className="mb-1 truncate font-semibold text-slate-700">{c.creativeName}</p>
                <p className="text-slate-500">Spend: {formatCurrency(c.spend)}</p>
                <p className={(c.cpuSlay ?? Infinity) < 30 ? "text-green-600" : "text-red-600"}>
                  CPU Slay: {formatCpuSlay(c.cpuSlay)}
                </p>
              </div>
            );
          }}
        />
        <Scatter data={plottable}>
          {plottable.map((c) => (
            <Cell key={c.id} fill={(c.cpuSlay ?? Infinity) < 30 ? STATUS.effective : STATUS.ineffective} fillOpacity={0.8} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
