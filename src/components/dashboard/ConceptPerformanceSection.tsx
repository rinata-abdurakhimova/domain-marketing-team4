"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { conceptSummaries, spendEfficiencyBy } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { SectionTitle } from "@/components/dashboard/ui/SectionTitle";
import { AggregateTable } from "@/components/dashboard/AggregateTable";
import { StackedEffectivenessBarChart } from "@/components/dashboard/charts/StackedEffectivenessBarChart";

export function ConceptPerformanceSection() {
  const { filteredData } = useFilters();
  const chartData = useMemo(() => spendEfficiencyBy(filteredData, "concept", 10), [filteredData]);
  const tableRows = useMemo(() => conceptSummaries(filteredData, 15), [filteredData]);

  return (
    <section>
      <SectionTitle icon="🎯" title="Concept Performance" className="mb-3" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Top Concepts by Spend & Performance" subtitle="Top 10, split effective / ineffective">
          <StackedEffectivenessBarChart data={chartData} />
        </Card>
        <Card title="Concept Summary" subtitle="Spend shown alongside Success Rate">
          <AggregateTable
            nameLabel="Concept"
            rows={tableRows.map((r) => ({
              name: r.concept,
              spend: r.spend,
              creatives: r.creatives,
              effective: r.effective,
              ineffective: r.ineffective,
              successRate: r.successRate,
              ineffectiveSpend: r.ineffectiveSpend,
            }))}
          />
        </Card>
      </div>
    </section>
  );
}
