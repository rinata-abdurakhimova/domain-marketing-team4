"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useFilters } from "@/context/FilterContext";
import { parseWorkbookFile } from "@/lib/parseWorkbook";
import { Card } from "@/components/dashboard/ui/Card";
import { formatNumber } from "@/lib/format";

export function UploadDataControl() {
  const { datasetSource, uploadedFileName, allData, setUploadedDataset, resetToDefaultDataset } =
    useFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPendingFile(file);
    setError(null);
  };

  const handleRunAnalysis = async () => {
    if (!pendingFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      const { creatives } = await parseWorkbookFile(pendingFile);
      setUploadedDataset(creatives, pendingFile.name);
      setPendingFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    resetToDefaultDataset();
    setPendingFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
          📄 Choose .xlsx file
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <span className="max-w-[16rem] truncate text-sm text-slate-600">
          {pendingFile ? pendingFile.name : "No file selected"}
        </span>

        <button
          onClick={handleRunAnalysis}
          disabled={!pendingFile || isProcessing}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-blue-300 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Processing…" : "Run Analysis"}
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

      {datasetSource === "uploaded" && uploadedFileName && !error && (
        <p className="mt-2 text-xs text-slate-500">
          🟢 Showing {formatNumber(allData.length)} rows from uploaded file “{uploadedFileName}”.
        </p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-red-600">⚠️ {error}</p>}
    </Card>
  );
}
