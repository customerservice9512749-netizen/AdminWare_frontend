import { Banknote, CircleDollarSign, Scale, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const cards = [
  { key: 'revenue', title: 'Ingresos brutos', icon: Banknote, tone: 'emerald' },
  { key: 'profit', title: 'Utilidad neta', icon: TrendingUp, tone: 'blue' },
  { key: 'shrinkageCost', title: 'Costo de merma', icon: Scale, tone: 'amber' },
  { key: 'cashCutBalance', title: 'Balance de cortes', icon: CircleDollarSign, tone: 'violet' },
];
const tones = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
};

export default function ReportsKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores ejecutivos" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, title, icon: Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(kpis[key])}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span></div>
          {key === 'profit' ? <p className="mt-2 text-[11px] font-semibold text-emerald-700">Margen neto {Number(kpis.margin || 0).toLocaleString('es-MX', { maximumFractionDigits: 2 })}%</p>
            : key === 'cashCutBalance' ? <p className="mt-2 text-[11px] text-slate-400">Diferencias netas de efectivo en el periodo</p>
              : <p className="mt-2 text-[11px] text-slate-400">{key === 'revenue' ? 'Venta acumulada antes de costos' : 'Mermas valorizadas a costo'}</p>}
        </article>
      ))}
    </section>
  );
}
