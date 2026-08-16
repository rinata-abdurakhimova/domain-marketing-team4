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

/** Parses an uploaded .xlsx/.xls file into Creative[], using the same column
 * mapping as scripts/convertData.mjs. Runs entirely in the browser — the xlsx
 * parser is dynamically imported so it doesn't bloat the initial bundle. */
export async function parseWorkbookFile(file: File): Promise<ParsedWorkbook> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("This workbook has no sheets.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: true,
  });

  if (rows.length === 0) {
    throw new Error("The first sheet is empty.");
  }

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
    record.isEffective = record.success === "YES";
    return record as unknown as Creative;
  });

  return { creatives, sheetName };
}
