"use client";

import { useState } from "react";
import { getCreatives } from "@/lib/data";
import { FilterProvider } from "@/context/FilterContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UploadDataControl } from "@/components/dashboard/UploadDataControl";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { SpendStructureSection } from "@/components/dashboard/SpendStructureSection";
import { EffectiveVsIneffectiveSection } from "@/components/dashboard/EffectiveVsIneffectiveSection";
import { SpendPerformanceStackedSection } from "@/components/dashboard/SpendPerformanceStackedSection";
import { TopCreativesTabs } from "@/components/dashboard/TopCreativesTabs";
import { ScatterPerformanceSection } from "@/components/dashboard/ScatterPerformanceSection";
import { InfluencerPerformanceSection } from "@/components/dashboard/InfluencerPerformanceSection";
import { ConceptPerformanceSection } from "@/components/dashboard/ConceptPerformanceSection";
import { CostOfFailureSection } from "@/components/dashboard/CostOfFailureSection";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";

type PageTab = "dashboard" | "recommendations";

const PAGE_TABS: { key: PageTab; label: string }[] = [
  { key: "dashboard", label: "Performance Dashboard" },
  { key: "recommendations", label: "Recommendations" },
];

export default function Home() {
  const creatives = getCreatives();
  const [tab, setTab] = useState<PageTab>("dashboard");

  return (
    <FilterProvider data={creatives}>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader />
        <UploadDataControl />

        <div className="inline-flex w-fit rounded-full bg-blue-50 p-1">
          {PAGE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-300"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <>
            <FiltersBar />
            <KpiCards />
            <SpendStructureSection />
            <EffectiveVsIneffectiveSection />
            <SpendPerformanceStackedSection />
            <TopCreativesTabs />
            <ScatterPerformanceSection />
            <InfluencerPerformanceSection />
            <ConceptPerformanceSection />
            <CostOfFailureSection />
            <InsightsSection />
          </>
        )}

        {tab === "recommendations" && <RecommendationsSection />}

        <footer className="pb-6 pt-2 text-center text-xs text-slate-500">
          Data source: data.xlsx · Generated via scripts/convertData.mjs
        </footer>
      </main>
    </FilterProvider>
  );
}
