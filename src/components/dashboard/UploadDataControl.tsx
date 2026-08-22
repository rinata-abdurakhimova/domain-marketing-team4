"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useFilters } from "@/context/FilterContext";
import { parseWorkbookFile, type ParsedWorkbook } from "@/lib/parseWorkbook";
import { Card } from "@/components/dashboard/ui/Card";
import { StatusBadge } from "@/components/dashboard/ui/StatusBadge";
import { formatCurrency, formatNumber } from "@/lib/format";

const PREVIEW_ROW_COUNT = 5;

type PreviewState = "idle" | "loading" | "ready" | "error";

export function UploadDataControl() {
  const { datasetSource, uploadedFileName, allData, setUploadedDataset, resetToDefaultDataset } =
    useFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>("idle");
  const [previewResult, setPreviewResult] = useState<ParsedWorkbook | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const resetSelection = () => {
    setPendingFile(null);
    setPreviewState("idle");
    setPreviewResult(null);
    setPreviewError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
    setPreviewResult(null);
    setPreviewError(null);

    if (!file) {
      setPreviewState("idle");
      return;
    }

    setPreviewState("loading");
    try {
      const result = await parseWorkbookFile(file);
      setPreviewResult(result);
      setPreviewState("ready");
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Couldn't read that file.");
      setPreviewState("error");
    }
  };

  const handleRunAnalysis = () => {
    if (!pendingFile || !previewResult) return;
    setIsApplying(true);
    setUploadedDataset(previewResult.creatives, pendingFile.name);
    resetSelection();
    setIsApplying(false);
  };

  const handleReset = () => {
    resetToDefaultDataset();
    resetSelection();
  };

  const previewRows = previewResult?.creatives.slice(0, PREVIEW_ROW_COUNT) ?? [];

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
          📄 Choose .xlsx or .csv file
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <span className="max-w-[16rem] truncate text-sm text-slate-600">
          {pendingFile ? pendingFile.name : "No file selected"}
        </span>

        <button
          onClick={handleRunAnalysis}
          disabled={previewState !== "ready" || isApplying}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-blue-300 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isApplying ? "Applying…" : "Run Analysis"}
        </button>

        {datasetSource === "uploaded" && (
          <button
            onClick={handleReset}
            className="ml-auto text-sm font-semibold text-blue-700 hover:underline"
          >
            Reset to default data.xlsx
          </button>
        )}
      </div>

      {datasetSource === "uploaded" && uploadedFileName && previewState === "idle" && (
        <p className="mt-2 text-xs text-slate-500">
          🟢 Showing {formatNumber(allData.length)} rows from uploaded file “{uploadedFileName}”.
        </p>
      )}

      {previewState === "loading" && (
        <p className="mt-3 text-xs font-medium text-slate-500">👀 Reading file…</p>
      )}

      {previewState === "error" && previewError && (
        <p className="mt-3 text-xs font-medium text-red-600">⚠️ {previewError}</p>
      )}

      {previewState === "ready" && previewResult && (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">
              👀
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Preview</p>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
              {formatNumber(previewResult.creatives.length)} rows detected
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
              Sheet: {previewResult.sheetName}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-blue-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Creative</th>
                  <th className="px-3 py-2">Audience</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Language</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.id} className="border-b border-blue-50 last:border-0">
                    <td className="max-w-[200px] truncate px-3 py-2 font-medium text-slate-700" title={row.creativeName}>
                      {row.creativeName ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{row.audience ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-500">{row.type ?? "—"}</td>
                    <td className="px-3 py-2 text-slate-500">{row.language ?? "—"}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.spend)}</td>
                    <td className="px-3 py-2 text-right">
                      <StatusBadge isEffective={row.isEffective} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Showing the first {Math.min(PREVIEW_ROW_COUNT, previewResult.creatives.length)} of{" "}
            {formatNumber(previewResult.creatives.length)} rows. Looks right? Click{" "}
            <span className="font-semibold text-blue-700">Run Analysis</span> to apply it to the
            dashboard.
          </p>
        </div>
      )}
    </Card>
  );
}
