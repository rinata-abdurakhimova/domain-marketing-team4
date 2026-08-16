// Reads data.xlsx and writes src/data/data.json for the Next.js app to consume.
// Run manually with `node scripts/convertData.mjs`, or automatically via the
// predev/prebuild npm scripts.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import XLSX from "xlsx";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourcePath = path.join(rootDir, "data.xlsx");
const outputDir = path.join(rootDir, "src", "data");
const outputPath = path.join(outputDir, "data.json");

const COLUMN_MAP = {
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

function normalizeCell(value) {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function convert() {
  const workbook = XLSX.readFile(sourcePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });

  const creatives = rows.map((row, index) => {
    const record = { id: index + 1 };
    for (const [sourceKey, targetKey] of Object.entries(COLUMN_MAP)) {
      record[targetKey] = normalizeCell(row[sourceKey]);
    }
    // success is already the analyst-provided effective/ineffective flag.
    record.isEffective = record.success === "YES";
    return record;
  });

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(creatives, null, 2), "utf-8");
  console.log(
    `[convertData] Wrote ${creatives.length} rows from "${sheetName}" to ${path.relative(rootDir, outputPath)}`
  );
}

convert();
