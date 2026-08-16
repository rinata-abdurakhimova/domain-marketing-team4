"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { spendBy, topSpendBy } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { SpendDonut } from "@/components/dashboard/charts/SpendDonut";
import { SpendBarChart } from "@/components/dashboard/charts/SpendBarChart";
import { SpendHorizontalBarChart } from "@/components/dashboard/charts/SpendHorizontalBarChart";

export function SpendStructureSection() {
  const { filteredData } = useFilters();

  const byAudience = useMemo(() => spendBy(filteredData, "audience"), [filteredData]);
  const byType = useMemo(() => spendBy(filteredData, "type"), [filteredData]);
  const byLanguage = useMemo(() => spendBy(filteredData, "language"), [filteredData]);
  const topInfluencers = useMemo(
    () => topSpendBy(filteredData, "influencerName", 10),
    [filteredData]
  );
  const topConcepts = useMemo(() => topSpendBy(filteredData, "concept", 10), [filteredData]);

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-800">Spend Structure</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Spend by Audience" subtitle="Share of total spend, MN vs WMN">
          <SpendDonut data={byAudience} />
        </Card>
        <Card title="Spend by Creative Type" subtitle="Static vs Motion">
          <SpendBarChart data={byType} />
        </Card>
        <Card title="Spend by Language">
          <SpendBarChart data={byLanguage} />
        </Card>
        <Card title="Top Influencers by Spend" subtitle="Top 10">
          <SpendHorizontalBarChart data={topInfluencers} />
        </Card>
        <Card title="Top Concepts by Spend" subtitle="Top 10" className="lg:col-span-2">
          <SpendHorizontalBarChart data={topConcepts} />
        </Card>
      </div>
    </section>
  );
}
