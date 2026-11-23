import { CalendarCheck2, HandCoins, ShoppingBasket, Store } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const metrics = [
  { key: 'activeCount', title: 'Proveedores activos', caption: 'Relaciones comerciales vigentes', icon: Store, color: 'emerald' },
  { key: 'deliveriesToday', title: 'Entregas hoy', caption: 'Proveedores con surtido programado', icon: CalendarCheck2, color: 'blue' },
  { key: 'pendingBalance', title: 'Saldo pendiente', caption: 'Cuentas por pagar a proveedores', icon: HandCoins, color: 'amber' },
  { key: 'monthlyPurchases', title: 'Compras del mes', caption: 'Total acumulado de entregas', icon: ShoppingBasket, color: 'violet' },
];
const colorClasses = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
};

export default function SuppliersKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores de proveedores" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, title, caption, icon: Icon, color }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{title}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {key === 'activeCount' || key === 'deliveriesToday' ? kpis[key] : formatCurrency(kpis[key])}
              </p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[color]}`}><Icon className="h-5 w-5" /></span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">{caption}</p>
        </article>
      ))}
    </section>
  );
}
