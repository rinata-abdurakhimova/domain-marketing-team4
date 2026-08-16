"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { computeKpis } from "@/lib/analytics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

function Kpi({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  tone?: "default" | "good" | "bad";
}) {
  const toneClass =
    tone === "good" ? "text-green-600" : tone === "bad" ? "text-red-600" : "text-blue-700";

  const bubbleClass =
    tone === "good"
      ? "bg-green-100 text-green-700"
      : tone === "bad"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-3xl border border-blue-100 bg-white/95 p-4 shadow-md shadow-blue-200/30 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-blue-200/40">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm ${bubbleClass}`}>
          {icon}
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-extrabold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function KpiCards() {
  const { filteredData } = useFilters();
  const kpis = useMemo(() => computeKpis(filteredData), [filteredData]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Kpi icon="💵" label="Total Spend" value={formatCurrency(kpis.totalSpend)} />
      <Kpi icon="🧩" label="Total Creatives" value={formatNumber(kpis.totalCreatives)} />
      <Kpi
        icon="🟢"
        label="Effective Creatives"
        value={formatNumber(kpis.effectiveCount)}
        tone="good"
        hint="Target achieved"
      />
      <Kpi
        icon="🔴"
        label="Ineffective Creatives"
        value={formatNumber(kpis.ineffectiveCount)}
        tone="bad"
        hint="Target missed"
      />
      <Kpi icon="📈" label="Success Rate" value={formatPercent(kpis.successRate)} />
      <Kpi
        icon="⚠️"
        label="Spend on Underperforming"
        value={formatCurrency(kpis.underperformingSpend)}
        tone="bad"
        hint={`${formatPercent(kpis.underperformingShare)} of total spend`}
      />
    </div>
  );
}
