"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FILTERS, type Creative, type FilterState } from "@/types/creative";
import { applyFilters } from "@/lib/analytics";

interface FilterContextValue {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  allData: Creative[];
  filteredData: Creative[];
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

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredData = useMemo(() => applyFilters(data, filters), [data, filters]);

  const value: FilterContextValue = {
    filters,
    setFilter,
    resetFilters,
    allData: data,
    filteredData,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
