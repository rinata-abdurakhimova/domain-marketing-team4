"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { compareRoiByAudience, compareCpuByType, computeMetricCorrelation } from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { SectionTitle } from "@/components/dashboard/ui/SectionTitle";
import { formatCurrency, formatPercent, formatSignedPercent } from "@/lib/format";

function ReportCard({
  icon,
  title,
  rows,
  conclusion,
  tone,
}: {
  icon: string;
  title: string;
  rows: { label: string; value: string; valueClassName?: string }[];
  conclusion: string;
  tone: "good" | "bad" | "neutral";
}) {
  const bubbleClass =
    tone === "good"
      ? "bg-green-100 text-green-700"
      : tone === "bad"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";

  const conclusionClass =
    tone === "good"
      ? "bg-green-50 text-green-700"
      : tone === "bad"
        ? "bg-red-50 text-red-700"
        : "bg-blue-50 text-blue-700";

  const conclusionIcon = tone === "good" ? "🟢" : tone === "bad" ? "🔴" : "🔵";

  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg ${bubbleClass}`}>
          {icon}
        </span>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{row.label}</span>
            <span className={`font-bold ${row.valueClassName ?? "text-blue-700"}`}>{row.value}</span>
          </div>
        ))}
      </div>

      <p className={`mt-3 rounded-xl p-3 text-xs font-medium ${conclusionClass}`}>
        {conclusionIcon} {conclusion}
      </p>
    </Card>
  );
}

export function RecommendationsSection() {
  const { datasetSource, allData } = useFilters();

  const roiComparison = useMemo(() => compareRoiByAudience(allData), [allData]);
  const cpuComparison = useMemo(() => compareCpuByType(allData), [allData]);
  const correlation = useMemo(() => computeMetricCorrelation(allData), [allData]);

  if (datasetSource !== "uploaded") {
    return (
      <Card>
        <p className="text-sm text-slate-600">Please upload a file to generate insights.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle
        icon="🧠"
        title="Recommendations"
        subtitle="Automatically generated from the uploaded dataset"
        className="mb-1"
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ReportCard
          icon="🚻"
          title="Audience Strategy"
          tone="bad"
          rows={[
            {
              label: "MN avg ROI",
              value: formatSignedPercent(roiComparison.mnAverageRoi),
              valueClassName: roiComparison.mnAverageRoi > 0 ? "text-green-600" : "text-red-600",
            },
            {
              label: "WMN avg ROI",
              value: formatSignedPercent(roiComparison.wmnAverageRoi),
              valueClassName: roiComparison.wmnAverageRoi > 0 ? "text-green-600" : "text-red-600",
            },
          ]}
          conclusion="Campaigns targeting women (WMN) are critically unprofitable — recommend stopping WMN spend."
        />

        <ReportCard
          icon="🎬"
          title="Format Efficiency"
          tone="good"
          rows={[
            { label: "Motion avg CPU", value: formatCurrency(cpuComparison.motionAverageCpu, true) },
            { label: "Static avg CPU", value: formatCurrency(cpuComparison.staticAverageCpu, true) },
          ]}
          conclusion="Video (Motion) runs cheaper per unit than Static — double down on video creatives."
        />

        <ReportCard
          icon="🔍"
          title="Metric Correlation"
          tone="neutral"
          rows={[
            { label: "Hook ↔ ROI correlation", value: correlation.hookRoiCorrelation.toFixed(2) },
            { label: "Hold ↔ ROI correlation", value: correlation.holdRoiCorrelation.toFixed(2) },
            { label: "Avg. Paid Conversion", value: formatPercent(correlation.averagePaidUnitsShare) },
          ]}
          conclusion="Attention metrics (Hook, Hold) don't correlate with ROI for this product — optimize creatives for paid_units_share instead."
        />
      </div>
    </div>
  );
}
