"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { computeKpis, costOfFailure } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { CostOfFailureBarChart } from "@/components/dashboard/charts/CostOfFailureBarChart";
import { formatCurrency, formatPercent } from "@/lib/format";

export function CostOfFailureSection() {
  const { filteredData } = useFilters();
  const failures = useMemo(() => costOfFailure(filteredData, 5), [filteredData]);
  const kpis = useMemo(() => computeKpis(filteredData), [filteredData]);

  return (
    <section>
      <h2 className="mb-1 text-lg font-bold text-slate-800">💸 Cost of Failure</h2>
      <p className="mb-3 text-sm text-slate-500">
        Which underperforming creatives consumed the most budget? (Top 5, sorted by spend)
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Top 5 Ineffective Creatives by Spend">
          <CostOfFailureBarChart data={failures} />
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Spend on Underperforming Creatives
            </p>
            <p className="mt-1.5 text-2xl font-bold text-red-600">
              {formatCurrency(kpis.underperformingSpend)}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Share of Budget on Underperforming Creatives
            </p>
            <p className="mt-1.5 text-2xl font-bold text-red-600">
              {formatPercent(kpis.underperformingShare)}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
