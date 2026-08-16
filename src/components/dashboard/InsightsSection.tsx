"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { generateInsights } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { SectionTitle } from "@/components/dashboard/ui/SectionTitle";

export function InsightsSection() {
  const { filteredData } = useFilters();
  const insights = useMemo(() => generateInsights(filteredData), [filteredData]);

  return (
    <section>
      <SectionTitle icon="✨" title="Automatic Data Insights" className="mb-3" />
      <Card>
        <ul className="flex flex-col gap-3">
          {insights.map((insight) => (
            <li key={insight.id} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                ★
              </span>
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
