"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { getUniqueValues } from "@/lib/analytics";
import { Select } from "@/components/dashboard/ui/Select";
import type { EfficiencyFilter } from "@/types/creative";

export function FiltersBar() {
  const { filters, setFilter, resetFilters, allData } = useFilters();

  const options = useMemo(
    () => ({
      audience: ["All", ...getUniqueValues(allData, "audience")],
      type: ["All", ...getUniqueValues(allData, "type")],
      influencer: ["All", ...getUniqueValues(allData, "influencerName")],
      language: ["All", ...getUniqueValues(allData, "language")],
      concept: ["All", ...getUniqueValues(allData, "concept")],
    }),
    [allData]
  );

  const efficiencyOptions: EfficiencyFilter[] = ["All", "Effective", "Ineffective"];

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/50">
      <Select
        label="Audience"
        value={filters.audience}
        options={options.audience}
        onChange={(v) => setFilter("audience", v)}
      />
      <Select
        label="Creative Type"
        value={filters.type}
        options={options.type}
        onChange={(v) => setFilter("type", v)}
      />
      <Select
        label="Influencer"
        value={filters.influencer}
        options={options.influencer}
        onChange={(v) => setFilter("influencer", v)}
      />
      <Select
        label="Language"
        value={filters.language}
        options={options.language}
        onChange={(v) => setFilter("language", v)}
      />
      <Select
        label="Concept"
        value={filters.concept}
        options={options.concept}
        onChange={(v) => setFilter("concept", v)}
      />
      <Select
        label="Efficiency / Success"
        value={filters.efficiency}
        options={efficiencyOptions}
        onChange={(v) => setFilter("efficiency", v)}
      />
      <button
        onClick={resetFilters}
        className="ml-auto rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-blue-300 transition hover:bg-blue-700"
      >
        Reset Filters
      </button>
    </div>
  );
}
