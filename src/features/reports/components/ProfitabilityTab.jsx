import { useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatters';

const chartColors = { revenue: '#10b981', cost: '#94a3b8', profit: '#3b82f6' };

export default function ProfitabilityTab({ report, loading }) {
  const maxAmount = useMemo(() => Math.max(1, ...report.timeSeries.flatMap((item) => [item.revenue, item.cost, item.profit])), [report.timeSeries]);
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Calculando rentabilidad…</div>;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-sm font-bold text-slate-900">Ingresos, costos y utilidad</h2><p className="mt-1 text-xs text-slate-500">Comparativo diario del periodo seleccionado</p></div><div className="flex flex-wrap gap-3 text-[10px] font-semibold text-slate-500">{[['revenue', 'Ingresos'], ['cost', 'Costos'], ['profit', 'Utilidad']].map(([key, label]) => <span key={key} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: chartColors[key] }} />{label}</span>)}</div></div>
        {report.timeSeries.length ? <div className="mt-5">
          <div className="flex h-56 items-end gap-1 border-b border-slate-100 px-1 pb-1 sm:gap-2">{report.timeSeries.map((point) => <div key={point.date} className="group relative flex h-full min-w-0 flex-1 items-end justify-center gap-0.5 sm:gap-1">
            {[['revenue', point.revenue], ['cost', point.cost], ['profit', point.profit]].map(([key, value]) => <span key={key} title={`${key}: ${formatCurrency(value)}`} className="w-full max-w-5 rounded-t-sm transition-opacity group-hover:opacity-80" style={{ height: `${Math.max(3, (value / maxAmount) * 100)}%`, backgroundColor: chartColors[key] }} />)}
            <span className="absolute -bottom-5 max-w-full truncate text-[8px] text-slate-400">{point.date.slice(5)}</span>
          </div>)}</div>
          <p className="mt-8 text-center text-[10px] text-slate-400">Cada grupo representa un día · importes en MXN</p>
        </div> : <p className="mt-8 rounded-xl border border-dashed border-slate-200 p-10 text-center text-xs text-slate-400">Sin ventas para este periodo.</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold text-slate-900">Rentabilidad por categoría</h2><p className="mt-1 text-xs text-slate-500">Margen calculado sobre las ventas netas de cada categoría</p></div>
        {report.categories.length ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{['Categoría', 'Ingresos', 'Costo', 'Utilidad', 'Margen'].map((label) => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{report.categories.map((category) => <tr key={category.name}><td className="px-5 py-3.5 text-xs font-semibold text-slate-800">{category.name}</td><td className="px-5 py-3.5 text-xs text-slate-600">{formatCurrency(category.revenue)}</td><td className="px-5 py-3.5 text-xs text-slate-600">{formatCurrency(category.cost)}</td><td className="px-5 py-3.5 text-xs font-semibold text-emerald-700">{formatCurrency(category.profit)}</td><td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${category.margin >= 25 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{category.margin.toLocaleString('es-MX', { maximumFractionDigits: 1 })}%</span></td></tr>)}</tbody></table></div> : <p className="p-10 text-center text-xs text-slate-400">Sin categorías para mostrar.</p>}
      </section>
    </div>
  );
}
