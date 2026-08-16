"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { spendEfficiencyBy } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { StackedEffectivenessBarChart } from "@/components/dashboard/charts/StackedEffectivenessBarChart";

export function SpendPerformanceStackedSection() {
  const { filteredData } = useFilters();

  const byType = useMemo(() => spendEfficiencyBy(filteredData, "type", 10), [filteredData]);
  const byLanguage = useMemo(() => spendEfficiencyBy(filteredData, "language", 10), [filteredData]);
  const byInfluencer = useMemo(
    () => spendEfficiencyBy(filteredData, "influencerName", 10),
    [filteredData]
  );
  const byConcept = useMemo(() => spendEfficiencyBy(filteredData, "concept", 10), [filteredData]);

  return (
    <section>
      <h2 className="mb-1 text-lg font-bold text-slate-800">Where Is the Budget Working?</h2>
      <p className="mb-3 text-sm text-slate-500">
        Spend split into 🟢 effective and 🔴 ineffective per dimension (Top 10 where applicable).
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Creative Type">
          <StackedEffectivenessBarChart data={byType} />
        </Card>
        <Card title="Language">
          <StackedEffectivenessBarChart data={byLanguage} />
        </Card>
        <Card title="Influencer" subtitle="Top 10 by total spend">
          <StackedEffectivenessBarChart data={byInfluencer} />
        </Card>
        <Card title="Concept" subtitle="Top 10 by total spend">
          <StackedEffectivenessBarChart data={byConcept} />
        </Card>
      </div>
    </section>
  );
}
