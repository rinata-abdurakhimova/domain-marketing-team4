// Shared source-column -> Creative-field mapping.
// Mirrors scripts/convertData.mjs (kept in plain JS there since it's a
// standalone Node script) so the browser-side uploader accepts the same
// spreadsheet shape as the build-time data.xlsx conversion.
export const CREATIVE_COLUMN_MAP: Record<string, string> = {
  creative_name: "creativeName",
  concept: "concept",
  influencers_key: "influencerKey",
  influencers_name: "influencerName",
  type: "type",
  audience: "audience",
  language: "language",
  spend: "spend",
  units: "units",
  cpu: "cpu",
  cpm: "cpm",
  cpc: "cpc",
  ctr: "ctr",
  hook: "hook",
  hold: "hold",
  cr_2_unit: "cr2Unit",
  paid_units_share: "paidUnitsShare",
  flex_share: "flexShare",
  cr_2_flex: "cr2Flex",
  slay_share: "slayShare",
  cr_2_slay: "cr2Slay",
  cpu_slay: "cpuSlay",
  roi: "roi",
  success: "success",
};

export const REQUIRED_SOURCE_COLUMNS = ["audience", "success", "spend"];
