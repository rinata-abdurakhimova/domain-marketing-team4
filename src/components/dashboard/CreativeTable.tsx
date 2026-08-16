import type { Creative } from "@/types/creative";
import { StatusBadge } from "@/components/dashboard/ui/StatusBadge";
import { formatCurrency, formatCpuSlay, formatSignedPercent } from "@/lib/format";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right";
}

const BASE_COLUMNS: Column[] = [
  { key: "creativeName", label: "Creative" },
  { key: "audience", label: "Audience" },
  { key: "concept", label: "Concept" },
  { key: "influencerName", label: "Influencer" },
  { key: "spend", label: "Spend", align: "right" },
  { key: "metric", label: "ROI / CPU Slay", align: "right" },
  { key: "status", label: "Status", align: "right" },
];

interface CreativeTableProps {
  data: Creative[];
  extraColumn?: { key: string; label: string; render: (c: Creative) => string };
}

export function CreativeTable({ data, extraColumn }: CreativeTableProps) {
  if (data.length === 0) return <EmptyState />;

  const columns = extraColumn
    ? [...BASE_COLUMNS.slice(0, 5), { key: extraColumn.key, label: extraColumn.label, align: "right" as const }, ...BASE_COLUMNS.slice(5)]
    : BASE_COLUMNS;

  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {columns.map((col) => (
              <th key={col.key} className={`px-2 py-2 ${col.align === "right" ? "text-right" : "text-left"}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-b border-blue-50 last:border-0 hover:bg-blue-50/40">
              <td className="max-w-[220px] truncate px-2 py-2 font-medium text-slate-700" title={c.creativeName}>
                {c.creativeName}
              </td>
              <td className="px-2 py-2 text-slate-500">{c.audience}</td>
              <td className="max-w-[160px] truncate px-2 py-2 text-slate-500" title={c.concept}>
                {c.concept}
              </td>
              <td className="max-w-[160px] truncate px-2 py-2 text-slate-500" title={c.influencerName}>
                {c.influencerName}
              </td>
              <td className="px-2 py-2 text-right font-medium text-slate-700">{formatCurrency(c.spend)}</td>
              {extraColumn && (
                <td className="px-2 py-2 text-right text-slate-500">{extraColumn.render(c)}</td>
              )}
              <td className="px-2 py-2 text-right text-slate-500">
                {c.audience === "MN" ? formatSignedPercent(c.roi) : formatCpuSlay(c.cpuSlay)}
              </td>
              <td className="px-2 py-2 text-right">
                <StatusBadge isEffective={c.isEffective} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
