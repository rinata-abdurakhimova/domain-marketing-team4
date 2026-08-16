"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FILTERS, type Creative, type FilterState } from "@/types/creative";
import { applyFilters } from "@/lib/analytics";

export type DatasetSource = "default" | "uploaded";

interface FilterContextValue {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  allData: Creative[];
  filteredData: Creative[];
  datasetSource: DatasetSource;
  uploadedFileName: string | null;
  setUploadedDataset: (rows: Creative[], fileName: string) => void;
  resetToDefaultDataset: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({
  data,
  children,
}: {
  data: Creative[];
  children: ReactNode;
}) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [uploadedData, setUploadedData] = useState<Creative[] | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeData = uploadedData ?? data;

  const filteredData = useMemo(() => applyFilters(activeData, filters), [activeData, filters]);

  const setUploadedDataset = (rows: Creative[], fileName: string) => {
    setUploadedData(rows);
    setUploadedFileName(fileName);
    resetFilters();
  };

  const resetToDefaultDataset = () => {
    setUploadedData(null);
    setUploadedFileName(null);
    resetFilters();
  };

  const value: FilterContextValue = {
    filters,
    setFilter,
    resetFilters,
    allData: activeData,
    filteredData,
    datasetSource: uploadedData ? "uploaded" : "default",
    uploadedFileName,
    setUploadedDataset,
    resetToDefaultDataset,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
