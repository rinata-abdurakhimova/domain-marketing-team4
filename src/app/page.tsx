import { getCreatives } from "@/lib/data";
import { FilterProvider } from "@/context/FilterContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
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

export default function Home() {
  const creatives = getCreatives();

  return (
    <FilterProvider data={creatives}>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader />
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
        <footer className="pb-6 pt-2 text-center text-xs text-slate-500">
          Data source: data.xlsx · Generated via scripts/convertData.mjs
        </footer>
      </main>
    </FilterProvider>
  );
}
