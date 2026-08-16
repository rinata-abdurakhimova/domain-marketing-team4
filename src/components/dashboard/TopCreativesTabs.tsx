"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  creativesByInfluencer,
  getUniqueValues,
  topByConversion,
  topCreativesBySpend,
  topMnByRoi,
  topWmnByCpuSlay,
} from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { CreativeTable } from "@/components/dashboard/CreativeTable";
import { formatPercent } from "@/lib/format";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

type TabKey = "spend" | "performance" | "influencer" | "conversion";

const TABS: { key: TabKey; label: string }[] = [
  { key: "spend", label: "By Spend" },
  { key: "performance", label: "By Performance" },
  { key: "influencer", label: "By Influencer" },
  { key: "conversion", label: "By Conversion" },
];

export function TopCreativesTabs() {
  const { filteredData } = useFilters();
  const [tab, setTab] = useState<TabKey>("spend");

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-slate-800">Top Creatives</h2>
      <Card>
        <div className="mb-4 flex flex-wrap gap-2 border-b border-blue-100 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-300"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "spend" && <BySpendTab data={filteredData} />}
        {tab === "performance" && <ByPerformanceTab data={filteredData} />}
        {tab === "influencer" && <ByInfluencerTab data={filteredData} />}
        {tab === "conversion" && <ByConversionTab data={filteredData} />}
      </Card>
    </section>
  );
}

function BySpendTab({ data }: { data: ReturnType<typeof topCreativesBySpend> }) {
  const top = useMemo(() => topCreativesBySpend(data, 10), [data]);
  return <CreativeTable data={top} />;
}

function ByPerformanceTab({ data }: { data: ReturnType<typeof topCreativesBySpend> }) {
  const mn = useMemo(() => topMnByRoi(data, 10), [data]);
  const wmn = useMemo(() => topWmnByCpuSlay(data, 10), [data]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">MN — Ranked by ROI (highest first)</p>
        <CreativeTable data={mn} />
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">WMN — Ranked by CPU Slay (lowest first)</p>
        <CreativeTable data={wmn} />
      </div>
    </div>
  );
}

function ByInfluencerTab({ data }: { data: ReturnType<typeof topCreativesBySpend> }) {
  const influencers = useMemo(() => getUniqueValues(data, "influencerName"), [data]);
  const [selected, setSelected] = useState<string>(influencers[0] ?? "");

  const activeSelection = influencers.includes(selected) ? selected : influencers[0] ?? "";
  const creatives = useMemo(
    () => (activeSelection ? creativesByInfluencer(data, activeSelection) : []),
    [data, activeSelection]
  );

  if (influencers.length === 0) return <EmptyState />;

  return (
    <div>
      <label className="mb-3 flex max-w-xs flex-col gap-1 text-xs font-medium text-slate-500">
        Select Influencer
        <select
          value={activeSelection}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          {influencers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <CreativeTable data={creatives} />
    </div>
  );
}

function ByConversionTab({ data }: { data: ReturnType<typeof topCreativesBySpend> }) {
  const [metric, setMetric] = useState<"paidUnitsShare" | "slayShare">("paidUnitsShare");

  const top = useMemo(() => topByConversion(data, metric, 10), [data, metric]);

  return (
    <div>
      <div className="mb-3 inline-flex rounded-full bg-blue-50 p-1">
        <button
          onClick={() => setMetric("paidUnitsShare")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
            metric === "paidUnitsShare" ? "bg-blue-600 text-white" : "text-blue-700"
          }`}
        >
          Paid Conversion
        </button>
        <button
          onClick={() => setMetric("slayShare")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
            metric === "slayShare" ? "bg-blue-600 text-white" : "text-blue-700"
          }`}
        >
          Slay Conversion
        </button>
      </div>
      <CreativeTable
        data={top}
        extraColumn={{
          key: metric,
          label: metric === "paidUnitsShare" ? "Paid Conversion" : "Slay Conversion",
          render: (c) => formatPercent(c[metric]),
        }}
      />
    </div>
  );
}
