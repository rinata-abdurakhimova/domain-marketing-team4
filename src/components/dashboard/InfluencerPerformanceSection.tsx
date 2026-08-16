"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { influencerSummaries } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { AggregateTable } from "@/components/dashboard/AggregateTable";
import { SpendSuccessBubbleChart } from "@/components/dashboard/charts/SpendSuccessBubbleChart";

export function InfluencerPerformanceSection() {
  const { filteredData } = useFilters();
  const rows = useMemo(() => influencerSummaries(filteredData), [filteredData]);

  const bubbleData = useMemo(
    () =>
      rows.map((r) => ({
        name: r.influencer,
        spend: r.spend,
        successRate: r.successRate,
        creatives: r.creatives,
      })),
    [rows]
  );

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-800">Influencer Performance</h2>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Spend vs Success Rate by Influencer" subtitle="Bubble size = number of creatives">
          <SpendSuccessBubbleChart data={bubbleData} />
        </Card>
        <Card title="Influencer Summary">
          <AggregateTable
            nameLabel="Influencer"
            rows={rows.map((r) => ({
              name: r.influencer,
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
