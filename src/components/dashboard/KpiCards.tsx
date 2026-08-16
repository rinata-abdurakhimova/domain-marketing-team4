"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { computeKpis } from "@/lib/analytics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "bad";
}) {
  const toneClass =
    tone === "good"
      ? "text-green-600"
      : tone === "bad"
        ? "text-red-600"
        : "text-blue-700";

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/50">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function KpiCards() {
  const { filteredData } = useFilters();
  const kpis = useMemo(() => computeKpis(filteredData), [filteredData]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Kpi label="Total Spend" value={formatCurrency(kpis.totalSpend)} />
      <Kpi label="Total Creatives" value={formatNumber(kpis.totalCreatives)} />
      <Kpi
        label="Effective Creatives"
        value={formatNumber(kpis.effectiveCount)}
        tone="good"
        hint="🟢 target achieved"
      />
      <Kpi
        label="Ineffective Creatives"
        value={formatNumber(kpis.ineffectiveCount)}
        tone="bad"
        hint="🔴 target missed"
      />
      <Kpi label="Success Rate" value={formatPercent(kpis.successRate)} />
      <Kpi
        label="Spend on Underperforming"
        value={formatCurrency(kpis.underperformingSpend)}
        tone="bad"
        hint={`${formatPercent(kpis.underperformingShare)} of total spend`}
      />
    </div>
  );
}
