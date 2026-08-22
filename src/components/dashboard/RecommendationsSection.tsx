"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  MIN_SEGMENT_SAMPLE_SIZE,
  compareRoiByAudience,
  compareCpuByType,
  computeMetricCorrelationBySegment,
  type AudienceRoiComparison,
  type FormatCpuComparison,
  type MetricCorrelationSummary,
  type SegmentedMetricCorrelation,
} from "@/lib/analytics";
import { Card } from "@/components/dashboard/ui/Card";
import { SectionTitle } from "@/components/dashboard/ui/SectionTitle";
import { formatCurrency, formatNumber, formatPercent, formatSignedPercent } from "@/lib/format";

type Tone = "good" | "bad" | "neutral" | "insufficient";

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
  tone: Tone;
}) {
  const bubbleClass =
    tone === "good"
      ? "bg-green-100 text-green-700"
      : tone === "bad"
        ? "bg-red-100 text-red-700"
        : tone === "insufficient"
          ? "bg-gray-100 text-gray-500"
          : "bg-blue-100 text-blue-700";

  const conclusionClass =
    tone === "good"
      ? "bg-green-50 text-green-700"
      : tone === "bad"
        ? "bg-red-50 text-red-700"
        : tone === "insufficient"
          ? "bg-gray-100 text-gray-600"
          : "bg-blue-50 text-blue-700";

  const conclusionIcon = tone === "good" ? "🟢" : tone === "bad" ? "🔴" : tone === "insufficient" ? "⚪" : "🔵";

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

function buildAudienceInsight(comparison: AudienceRoiComparison): { tone: Tone; conclusion: string } {
  const { mnAverageRoi, wmnAverageRoi, mnCount, wmnCount } = comparison;

  if (mnCount < MIN_SEGMENT_SAMPLE_SIZE || wmnCount < MIN_SEGMENT_SAMPLE_SIZE) {
    const thin = mnCount < wmnCount ? `MN (${formatNumber(mnCount)} rows)` : `WMN (${formatNumber(wmnCount)} rows)`;
    return {
      tone: "insufficient",
      conclusion: `Not enough data in ${thin} to draw a reliable conclusion yet — need at least ${MIN_SEGMENT_SAMPLE_SIZE} creatives per audience.`,
    };
  }

  const mnIsBetter = mnAverageRoi >= wmnAverageRoi;
  const better = mnIsBetter ? "MN" : "WMN";
  const worse = mnIsBetter ? "WMN" : "MN";
  const betterRoi = mnIsBetter ? mnAverageRoi : wmnAverageRoi;
  const worseRoi = mnIsBetter ? wmnAverageRoi : mnAverageRoi;

  if (worseRoi <= 0) {
    return {
      tone: "bad",
      conclusion: `${worse} campaigns are unprofitable (avg ROI ${formatSignedPercent(
        worseRoi
      )}) — recommend pausing ${worse} spend and shifting budget to ${better} (avg ROI ${formatSignedPercent(
        betterRoi
      )}).`,
    };
  }

  return {
    tone: "good",
    conclusion: `Both audiences are profitable, but ${better} outperforms ${worse} (${formatSignedPercent(
      betterRoi
    )} vs ${formatSignedPercent(worseRoi)}) — consider shifting more budget toward ${better}.`,
  };
}

function buildFormatInsight(comparison: FormatCpuComparison): { tone: Tone; conclusion: string } {
  const { motionAverageCpu, staticAverageCpu, motionCount, staticCount } = comparison;

  if (motionCount < MIN_SEGMENT_SAMPLE_SIZE || staticCount < MIN_SEGMENT_SAMPLE_SIZE) {
    const thin =
      motionCount < staticCount ? `Motion (${formatNumber(motionCount)} rows)` : `Static (${formatNumber(staticCount)} rows)`;
    return {
      tone: "insufficient",
      conclusion: `Not enough data in ${thin} to draw a reliable conclusion yet — need at least ${MIN_SEGMENT_SAMPLE_SIZE} creatives per format.`,
    };
  }

  const motionCheaper = motionAverageCpu <= staticAverageCpu;
  const cheaper = motionCheaper ? "Motion" : "Static";
  const pricier = motionCheaper ? "Static" : "Motion";
  const cheaperCpu = motionCheaper ? motionAverageCpu : staticAverageCpu;
  const pricierCpu = motionCheaper ? staticAverageCpu : motionAverageCpu;

  return {
    tone: "good",
    conclusion: `${cheaper} runs cheaper per unit (${formatCurrency(cheaperCpu, true)} vs ${formatCurrency(
      pricierCpu,
      true
    )}) than ${pricier} — prioritize ${cheaper} creatives.`,
  };
}

function correlationRow(label: string, summary: MetricCorrelationSummary | null) {
  const insufficient = !summary || summary.sampleSize < MIN_SEGMENT_SAMPLE_SIZE;
  return {
    label,
    value: insufficient ? "—" : `${summary!.hookRoiCorrelation.toFixed(2)} / ${summary!.holdRoiCorrelation.toFixed(2)}`,
    valueClassName: insufficient ? "text-gray-400" : "text-blue-700",
  };
}

function buildCorrelationInsight(segments: SegmentedMetricCorrelation): { tone: Tone; conclusion: string } {
  const { overall, mn, wmn } = segments;

  if (overall.sampleSize < MIN_SEGMENT_SAMPLE_SIZE) {
    return {
      tone: "insufficient",
      conclusion: `Not enough data (${formatNumber(
        overall.sampleSize
      )} rows) to assess metric correlation reliably — need at least ${MIN_SEGMENT_SAMPLE_SIZE}.`,
    };
  }

  const overallWeak = Math.abs(overall.hookRoiCorrelation) < 0.3 && Math.abs(overall.holdRoiCorrelation) < 0.3;

  const bothSegmentsHaveData = mn.sampleSize >= MIN_SEGMENT_SAMPLE_SIZE && wmn.sampleSize >= MIN_SEGMENT_SAMPLE_SIZE;
  const segmentsDiffer =
    bothSegmentsHaveData &&
    (Math.abs(mn.hookRoiCorrelation - wmn.hookRoiCorrelation) > 0.2 ||
      Math.abs(mn.holdRoiCorrelation - wmn.holdRoiCorrelation) > 0.2);

  const segmentClause = !bothSegmentsHaveData
    ? " (not enough per-segment data to check MN vs WMN separately)"
    : segmentsDiffer
      ? ", and the relationship differs notably between MN and WMN"
      : ", consistently across both MN and WMN";

  if (overallWeak) {
    return {
      tone: "neutral",
      conclusion: `Attention metrics (Hook, Hold) don't meaningfully correlate with ROI${segmentClause} — optimize creatives for Paid Conversion (avg ${formatPercent(
        overall.averagePaidUnitsShare
      )}) instead of attention metrics.`,
    };
  }

  return {
    tone: "neutral",
    conclusion: `Attention metrics do correlate with ROI here${segmentClause} — Hook/Hold remain useful early signals alongside Paid Conversion (avg ${formatPercent(
      overall.averagePaidUnitsShare
    )}).`,
  };
}

export function RecommendationsSection() {
  const { datasetSource, allData } = useFilters();

  const roiComparison = useMemo(() => compareRoiByAudience(allData), [allData]);
  const cpuComparison = useMemo(() => compareCpuByType(allData), [allData]);
  const correlationSegments = useMemo(() => computeMetricCorrelationBySegment(allData), [allData]);

  if (datasetSource !== "uploaded") {
    return (
      <Card>
        <p className="text-sm text-slate-600">Please upload a file to generate insights.</p>
      </Card>
    );
  }

  const audienceInsight = buildAudienceInsight(roiComparison);
  const formatInsight = buildFormatInsight(cpuComparison);
  const correlationInsight = buildCorrelationInsight(correlationSegments);

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
          tone={audienceInsight.tone}
          rows={[
            {
              label: `MN avg ROI (n=${formatNumber(roiComparison.mnCount)})`,
              value: roiComparison.mnCount === 0 ? "—" : formatSignedPercent(roiComparison.mnAverageRoi),
              valueClassName:
                roiComparison.mnCount === 0
                  ? "text-gray-400"
                  : roiComparison.mnAverageRoi > 0
                    ? "text-green-600"
                    : "text-red-600",
            },
            {
              label: `WMN avg ROI (n=${formatNumber(roiComparison.wmnCount)})`,
              value: roiComparison.wmnCount === 0 ? "—" : formatSignedPercent(roiComparison.wmnAverageRoi),
              valueClassName:
                roiComparison.wmnCount === 0
                  ? "text-gray-400"
                  : roiComparison.wmnAverageRoi > 0
                    ? "text-green-600"
                    : "text-red-600",
            },
          ]}
          conclusion={audienceInsight.conclusion}
        />

        <ReportCard
          icon="🎬"
          title="Format Efficiency"
          tone={formatInsight.tone}
          rows={[
            {
              label: `Motion avg CPU (n=${formatNumber(cpuComparison.motionCount)})`,
              value: cpuComparison.motionCount === 0 ? "—" : formatCurrency(cpuComparison.motionAverageCpu, true),
              valueClassName: cpuComparison.motionCount === 0 ? "text-gray-400" : undefined,
            },
            {
              label: `Static avg CPU (n=${formatNumber(cpuComparison.staticCount)})`,
              value: cpuComparison.staticCount === 0 ? "—" : formatCurrency(cpuComparison.staticAverageCpu, true),
              valueClassName: cpuComparison.staticCount === 0 ? "text-gray-400" : undefined,
            },
          ]}
          conclusion={formatInsight.conclusion}
        />

        <ReportCard
          icon="🔍"
          title="Metric Correlation"
          tone={correlationInsight.tone}
          rows={[
            correlationRow("Overall Hook / Hold ↔ ROI", correlationSegments.overall),
            correlationRow(`MN (n=${formatNumber(correlationSegments.mn.sampleSize)})`, correlationSegments.mn),
            correlationRow(`WMN (n=${formatNumber(correlationSegments.wmn.sampleSize)})`, correlationSegments.wmn),
            {
              label: "Avg. Paid Conversion",
              value:
                correlationSegments.overall.sampleSize === 0
                  ? "—"
                  : formatPercent(correlationSegments.overall.averagePaidUnitsShare),
            },
          ]}
          conclusion={correlationInsight.conclusion}
        />
      </div>
    </div>
  );
}
