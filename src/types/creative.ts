export type Audience = "MN" | "WMN";
export type CreativeType = string;
export type SuccessFlag = "YES" | "NO";

export interface Creative {
  id: number;
  creativeName: string;
  concept: string;
  influencerKey: number;
  influencerName: string;
  type: CreativeType;
  audience: Audience;
  language: string;
  spend: number;
  units: number;
  cpu: number;
  cpm: number;
  cpc: number;
  ctr: number;
  hook: number;
  hold: number | null;
  cr2Unit: number;
  paidUnitsShare: number;
  flexShare: number;
  cr2Flex: number;
  slayShare: number;
  cr2Slay: number;
  cpuSlay: number | null;
  roi: number;
  success: SuccessFlag;
  isEffective: boolean;
}

export type EfficiencyFilter = "All" | "Effective" | "Ineffective";

export interface FilterState {
  audience: string;
  type: string;
  influencer: string;
  language: string;
  concept: string;
  efficiency: EfficiencyFilter;
}

export const DEFAULT_FILTERS: FilterState = {
  audience: "All",
  type: "All",
  influencer: "All",
  language: "All",
  concept: "All",
  efficiency: "All",
};

export interface SpendSlice {
  name: string;
  spend: number;
  share: number;
  count: number;
}

export interface SpendEfficiencySlice {
  name: string;
  effectiveSpend: number;
  ineffectiveSpend: number;
  totalSpend: number;
  successRate: number;
}

export interface InfluencerSummary {
  influencer: string;
  spend: number;
  creatives: number;
  effective: number;
  ineffective: number;
  successRate: number;
  ineffectiveSpend: number;
}

export interface ConceptSummary {
  concept: string;
  spend: number;
  creatives: number;
  effective: number;
  ineffective: number;
  successRate: number;
  ineffectiveSpend: number;
}

export interface CostOfFailureItem {
  creative: Creative;
  targetLabel: string;
  actualLabel: string;
}
