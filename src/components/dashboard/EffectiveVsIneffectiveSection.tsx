"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { computeKpis } from "@/lib/analytics";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card } from "@/components/dashboard/ui/Card";
import { EffectivenessDonut } from "@/components/dashboard/charts/EffectivenessDonut";

export function EffectiveVsIneffectiveSection() {
  const { filteredData } = useFilters();
  const kpis = useMemo(() => computeKpis(filteredData), [filteredData]);

  const effectiveSpend = kpis.totalSpend - kpis.underperformingSpend;

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-800">Effective vs Ineffective Spend</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <EffectivenessDonut effectiveSpend={effectiveSpend} ineffectiveSpend={kpis.underperformingSpend} />
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">🟢 Effective Spend</p>
            <p className="mt-1.5 text-2xl font-bold text-green-600">{formatCurrency(effectiveSpend)}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">🔴 Ineffective Spend</p>
            <p className="mt-1.5 text-2xl font-bold text-red-600">{formatCurrency(kpis.underperformingSpend)}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Ineffective Spend Share</p>
            <p className="mt-1.5 text-2xl font-bold text-red-600">{formatPercent(kpis.underperformingShare)}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
