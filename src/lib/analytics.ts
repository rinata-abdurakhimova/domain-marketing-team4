import type {
  ConceptSummary,
  CostOfFailureItem,
  Creative,
  FilterState,
  InfluencerSummary,
  SpendEfficiencySlice,
  SpendSlice,
} from "@/types/creative";

export function applyFilters(data: Creative[], filters: FilterState): Creative[] {
  return data.filter((c) => {
    if (filters.audience !== "All" && c.audience !== filters.audience) return false;
    if (filters.type !== "All" && c.type !== filters.type) return false;
    if (filters.influencer !== "All" && c.influencerName !== filters.influencer) return false;
    if (filters.language !== "All" && c.language !== filters.language) return false;
    if (filters.concept !== "All" && c.concept !== filters.concept) return false;
    if (filters.efficiency === "Effective" && !c.isEffective) return false;
    if (filters.efficiency === "Ineffective" && c.isEffective) return false;
    return true;
  });
}

export function getUniqueValues(data: Creative[], key: keyof Creative): string[] {
  const values = new Set<string>();
  for (const item of data) {
    const v = item[key];
    if (v !== null && v !== undefined) values.add(String(v));
  }
  return Array.from(values).sort();
}

export interface KpiSummary {
  totalSpend: number;
  totalCreatives: number;
  effectiveCount: number;
  ineffectiveCount: number;
  successRate: number;
  underperformingSpend: number;
  underperformingShare: number;
}

export function computeKpis(data: Creative[]): KpiSummary {
  const totalSpend = sumBy(data, (c) => c.spend);
  const totalCreatives = data.length;
  const effectiveCount = data.filter((c) => c.isEffective).length;
  const ineffectiveCount = totalCreatives - effectiveCount;
  const successRate = totalCreatives > 0 ? effectiveCount / totalCreatives : 0;
  const underperformingSpend = sumBy(
    data.filter((c) => !c.isEffective),
    (c) => c.spend
  );
  const underperformingShare = totalSpend > 0 ? underperformingSpend / totalSpend : 0;

  return {
    totalSpend,
    totalCreatives,
    effectiveCount,
    ineffectiveCount,
    successRate,
    underperformingSpend,
    underperformingShare,
  };
}

function sumBy(data: Creative[], selector: (c: Creative) => number): number {
  return data.reduce((acc, c) => acc + (selector(c) ?? 0), 0);
}

function groupByKey(data: Creative[], key: keyof Creative): Map<string, Creative[]> {
  const map = new Map<string, Creative[]>();
  for (const c of data) {
    const rawValue = c[key];
    const label = rawValue === null || rawValue === undefined ? "Unknown" : String(rawValue);
    const arr = map.get(label) ?? [];
    arr.push(c);
    map.set(label, arr);
  }
  return map;
}

export function spendBy(data: Creative[], key: keyof Creative): SpendSlice[] {
  const totalSpend = sumBy(data, (c) => c.spend);
  const groups = groupByKey(data, key);
  const slices: SpendSlice[] = [];
  for (const [name, items] of groups) {
    const spend = sumBy(items, (c) => c.spend);
    slices.push({
      name,
      spend,
      share: totalSpend > 0 ? spend / totalSpend : 0,
      count: items.length,
    });
  }
  return slices.sort((a, b) => b.spend - a.spend);
}

export function topSpendBy(data: Creative[], key: keyof Creative, limit = 10): SpendSlice[] {
  return spendBy(data, key).slice(0, limit);
}

export function spendEfficiencyBy(
  data: Creative[],
  key: keyof Creative,
  limit = 10
): SpendEfficiencySlice[] {
  const groups = groupByKey(data, key);
  const rows: SpendEfficiencySlice[] = [];
  for (const [name, items] of groups) {
    const effectiveSpend = sumBy(
      items.filter((c) => c.isEffective),
      (c) => c.spend
    );
    const ineffectiveSpend = sumBy(
      items.filter((c) => !c.isEffective),
      (c) => c.spend
    );
    const totalSpend = effectiveSpend + ineffectiveSpend;
    const effectiveCount = items.filter((c) => c.isEffective).length;
    rows.push({
      name,
      effectiveSpend,
      ineffectiveSpend,
      totalSpend,
      successRate: items.length > 0 ? effectiveCount / items.length : 0,
    });
  }
  return rows.sort((a, b) => b.totalSpend - a.totalSpend).slice(0, limit);
}

export function topCreativesBySpend(data: Creative[], limit = 10): Creative[] {
  return [...data].sort((a, b) => b.spend - a.spend).slice(0, limit);
}

export function topMnByRoi(data: Creative[], limit = 10): Creative[] {
  return data
    .filter((c) => c.audience === "MN")
    .sort((a, b) => b.roi - a.roi)
    .slice(0, limit);
}

export function topWmnByCpuSlay(data: Creative[], limit = 10): Creative[] {
  return data
    .filter((c) => c.audience === "WMN" && c.cpuSlay !== null)
    .sort((a, b) => (a.cpuSlay ?? Infinity) - (b.cpuSlay ?? Infinity))
    .slice(0, limit);
}

export function creativesByInfluencer(data: Creative[], influencer: string): Creative[] {
  return data
    .filter((c) => c.influencerName === influencer)
    .sort((a, b) => b.spend - a.spend);
}

export function topByConversion(
  data: Creative[],
  metric: "paidUnitsShare" | "slayShare",
  limit = 10
): Creative[] {
  return [...data]
    .filter((c) => c[metric] !== null && c[metric] !== undefined)
    .sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
    .slice(0, limit);
}

export function influencerSummaries(data: Creative[]): InfluencerSummary[] {
  const groups = groupByKey(data, "influencerName");
  const rows: InfluencerSummary[] = [];
  for (const [influencer, items] of groups) {
    const spend = sumBy(items, (c) => c.spend);
    const effective = items.filter((c) => c.isEffective).length;
    const ineffective = items.length - effective;
    const ineffectiveSpend = sumBy(
      items.filter((c) => !c.isEffective),
      (c) => c.spend
    );
    rows.push({
      influencer,
      spend,
      creatives: items.length,
      effective,
      ineffective,
      successRate: items.length > 0 ? effective / items.length : 0,
      ineffectiveSpend,
    });
  }
  return rows.sort((a, b) => b.spend - a.spend);
}

export function conceptSummaries(data: Creative[], limit?: number): ConceptSummary[] {
  const groups = groupByKey(data, "concept");
  const rows: ConceptSummary[] = [];
  for (const [concept, items] of groups) {
    const spend = sumBy(items, (c) => c.spend);
    const effective = items.filter((c) => c.isEffective).length;
    const ineffective = items.length - effective;
    const ineffectiveSpend = sumBy(
      items.filter((c) => !c.isEffective),
      (c) => c.spend
    );
    rows.push({
      concept,
      spend,
      creatives: items.length,
      effective,
      ineffective,
      successRate: items.length > 0 ? effective / items.length : 0,
      ineffectiveSpend,
    });
  }
  const sorted = rows.sort((a, b) => b.spend - a.spend);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function costOfFailure(data: Creative[], limit = 5): CostOfFailureItem[] {
  return [...data]
    .filter((c) => !c.isEffective)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, limit)
    .map((creative) => {
      if (creative.audience === "MN") {
        return {
          creative,
          targetLabel: "Target: ROI > 0%",
          actualLabel: `ROI: ${(creative.roi * 100).toFixed(1)}%`,
        };
      }
      return {
        creative,
        targetLabel: "Target: CPU Slay < $30",
        actualLabel:
          creative.cpuSlay !== null
            ? `CPU Slay: $${creative.cpuSlay.toFixed(2)}`
            : "CPU Slay: No data",
      };
    });
}

export interface Insight {
  id: string;
  text: string;
}

export function generateInsights(data: Creative[]): Insight[] {
  const insights: Insight[] = [];
  if (data.length === 0) {
    return [{ id: "empty", text: "No creatives match the current filters." }];
  }

  const kpis = computeKpis(data);

  insights.push({
    id: "success-rate",
    text: `${(kpis.successRate * 100).toFixed(1)}% of creatives (${kpis.effectiveCount} of ${
      kpis.totalCreatives
    }) are hitting their performance target.`,
  });

  if (kpis.underperformingShare > 0) {
    insights.push({
      id: "underperforming-share",
      text: `${(kpis.underperformingShare * 100).toFixed(
        1
      )}% of total spend (${formatMoney(kpis.underperformingSpend)}) is going to ineffective creatives.`,
    });
  }

  const byInfluencer = influencerSummaries(data).filter((i) => i.creatives >= 2);
  if (byInfluencer.length > 0) {
    const best = [...byInfluencer].sort((a, b) => b.successRate - a.successRate)[0];
    const worst = [...byInfluencer].sort((a, b) => a.successRate - b.successRate)[0];
    if (best && best.successRate > 0) {
      insights.push({
        id: "best-influencer",
        text: `${best.influencer} has the highest success rate at ${(best.successRate * 100).toFixed(
          0
        )}% across ${best.creatives} creatives.`,
      });
    }
    if (worst && worst.influencer !== best?.influencer && worst.ineffectiveSpend > 0) {
      insights.push({
        id: "worst-influencer",
        text: `${worst.influencer} has the lowest success rate at ${(
          worst.successRate * 100
        ).toFixed(0)}%, with ${formatMoney(worst.ineffectiveSpend)} spent on ineffective creatives.`,
      });
    }
  }

  const byConcept = conceptSummaries(data).filter((c) => c.creatives >= 1);
  const worstConcept = [...byConcept].sort((a, b) => b.ineffectiveSpend - a.ineffectiveSpend)[0];
  if (worstConcept && worstConcept.ineffectiveSpend > 0) {
    insights.push({
      id: "worst-concept",
      text: `Concept "${worstConcept.concept}" has the largest ineffective spend at ${formatMoney(
        worstConcept.ineffectiveSpend
      )}.`,
    });
  }

  const failures = costOfFailure(data, 1);
  if (failures.length > 0) {
    const f = failures[0];
    insights.push({
      id: "top-failure",
      text: `The single biggest wasted-spend creative is "${f.creative.creativeName}" (${formatMoney(
        f.creative.spend
      )}, ${f.actualLabel}).`,
    });
  }

  return insights.slice(0, 5);
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
}

function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n === 0) return 0;
  const meanX = average(xs);
  const meanY = average(ys);
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denominator = Math.sqrt(denomX * denomY);
  return denominator === 0 ? 0 : numerator / denominator;
}

export interface AudienceRoiComparison {
  mnAverageRoi: number;
  wmnAverageRoi: number;
  mnCount: number;
  wmnCount: number;
}

/** Compares the same metric (ROI) across audiences — never mixed with CPU Slay. */
export function compareRoiByAudience(data: Creative[]): AudienceRoiComparison {
  const mnRows = data.filter((c) => c.audience === "MN");
  const wmnRows = data.filter((c) => c.audience === "WMN");
  return {
    mnAverageRoi: average(mnRows.map((c) => c.roi)),
    wmnAverageRoi: average(wmnRows.map((c) => c.roi)),
    mnCount: mnRows.length,
    wmnCount: wmnRows.length,
  };
}

export interface FormatCpuComparison {
  motionAverageCpu: number;
  staticAverageCpu: number;
  motionCount: number;
  staticCount: number;
}

export function compareCpuByType(data: Creative[]): FormatCpuComparison {
  const motionRows = data.filter((c) => c.type === "Motion");
  const staticRows = data.filter((c) => c.type === "Static");
  return {
    motionAverageCpu: average(motionRows.map((c) => c.cpu)),
    staticAverageCpu: average(staticRows.map((c) => c.cpu)),
    motionCount: motionRows.length,
    staticCount: staticRows.length,
  };
}

/** Below this many rows, a segment's average/correlation is treated as too
 * noisy to act on — recommendations should flag it rather than assert it. */
export const MIN_SEGMENT_SAMPLE_SIZE = 10;

export interface MetricCorrelationSummary {
  hookRoiCorrelation: number;
  holdRoiCorrelation: number;
  averagePaidUnitsShare: number;
  sampleSize: number;
}

export function computeMetricCorrelation(data: Creative[]): MetricCorrelationSummary {
  const withHold = data.filter((c) => c.hold !== null);
  const paidShares = data.map((c) => c.paidUnitsShare).filter((v): v is number => v !== null);

  return {
    hookRoiCorrelation: pearsonCorrelation(
      data.map((c) => c.hook),
      data.map((c) => c.roi)
    ),
    holdRoiCorrelation: pearsonCorrelation(
      withHold.map((c) => c.hold as number),
      withHold.map((c) => c.roi)
    ),
    averagePaidUnitsShare: average(paidShares),
    sampleSize: data.length,
  };
}

export interface SegmentedMetricCorrelation {
  overall: MetricCorrelationSummary;
  mn: MetricCorrelationSummary;
  wmn: MetricCorrelationSummary;
}

/** Same correlation as computeMetricCorrelation, broken out by audience so
 * a recommendation can say whether the relationship depends on segment. */
export function computeMetricCorrelationBySegment(data: Creative[]): SegmentedMetricCorrelation {
  return {
    overall: computeMetricCorrelation(data),
    mn: computeMetricCorrelation(data.filter((c) => c.audience === "MN")),
    wmn: computeMetricCorrelation(data.filter((c) => c.audience === "WMN")),
  };
}
