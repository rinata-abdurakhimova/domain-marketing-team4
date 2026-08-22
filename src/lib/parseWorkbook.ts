import type { Creative } from "@/types/creative";
import { CREATIVE_COLUMN_MAP, REQUIRED_SOURCE_COLUMNS } from "@/lib/creativeColumnMap";

export interface ParsedWorkbook {
  creatives: Creative[];
  sheetName: string;
}

function normalizeCell(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return null;
  return value;
}

function normalizeHeaderKey(key: string): string {
  return key.trim().toLowerCase();
}

/** Re-keys a parsed row so column matching is resilient to header
 * whitespace/casing differences from re-saving a file in Excel/Sheets
 * (e.g. "Success", " success ", "SUCCESS" all match "success"). */
function normalizeRowKeys(row: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeHeaderKey(key)] = value;
  }
  return normalized;
}

/** Parses an uploaded .xlsx/.xls/.csv file into Creative[], using the same
 * column mapping as scripts/convertData.mjs. Runs entirely in the browser —
 * the xlsx parser is dynamically imported so it doesn't bloat the initial
 * bundle, and it auto-detects CSV vs. binary workbook formats from the file
 * content, so no format switch is needed in the UI. */
export async function parseWorkbookFile(file: File): Promise<ParsedWorkbook> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("This workbook has no sheets.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: true,
  });

  if (rawRows.length === 0) {
    throw new Error("The first sheet is empty.");
  }

  const rows = rawRows.map(normalizeRowKeys);

  const firstRowKeys = new Set(Object.keys(rows[0]));
  const missing = REQUIRED_SOURCE_COLUMNS.filter((col) => !firstRowKeys.has(col));
  if (missing.length > 0) {
    throw new Error(
      `Missing required column(s): ${missing.join(", ")}. Expected the same columns as data.xlsx.`
    );
  }

  const creatives: Creative[] = rows.map((row, index) => {
    const record: Record<string, unknown> = { id: index + 1 };
    for (const [sourceKey, targetKey] of Object.entries(CREATIVE_COLUMN_MAP)) {
      record[targetKey] = normalizeCell(row[sourceKey]);
    }
    const successValue =
      typeof record.success === "string" ? record.success.trim().toUpperCase() : record.success;
    record.success = successValue === "YES" || successValue === "NO" ? successValue : record.success;
    record.isEffective = successValue === "YES";
    return record as unknown as Creative;
  });

  return { creatives, sheetName };
}
