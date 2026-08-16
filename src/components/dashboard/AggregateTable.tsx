import { formatCurrency, formatPercent } from "@/lib/format";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";

interface Row {
  name: string;
  spend: number;
  creatives: number;
  effective: number;
  ineffective: number;
  successRate: number;
  ineffectiveSpend: number;
}

export function AggregateTable({ nameLabel, rows }: { nameLabel: string; rows: Row[] }) {
  if (rows.length === 0) return <EmptyState />;

  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-2 py-2">{nameLabel}</th>
            <th className="px-2 py-2 text-right">Spend</th>
            <th className="px-2 py-2 text-right">Creatives</th>
            <th className="px-2 py-2 text-right">🟢 Effective</th>
            <th className="px-2 py-2 text-right">🔴 Ineffective</th>
            <th className="px-2 py-2 text-right">Success Rate</th>
            <th className="px-2 py-2 text-right">Ineffective Spend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-blue-50 last:border-0 hover:bg-blue-50/40">
              <td className="max-w-[220px] truncate px-2 py-2 font-medium text-slate-700" title={row.name}>
                {row.name}
              </td>
              <td className="px-2 py-2 text-right text-slate-700">{formatCurrency(row.spend)}</td>
              <td className="px-2 py-2 text-right text-slate-500">{row.creatives}</td>
              <td className="px-2 py-2 text-right text-green-600">{row.effective}</td>
              <td className="px-2 py-2 text-right text-red-600">{row.ineffective}</td>
              <td className="px-2 py-2 text-right font-medium text-slate-700">
                {formatPercent(row.successRate)}
              </td>
              <td className="px-2 py-2 text-right text-red-600">{formatCurrency(row.ineffectiveSpend)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
