import { Banknote, CreditCard, ReceiptText, ShoppingCart, TrendingUp, Wallet, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const cards = [
  { key: 'totalSales', label: 'Ventas totales', Icon: TrendingUp, currency: true, tone: 'emerald' },
  { key: 'completedSalesCount', label: 'Ventas Completadas', Icon: ReceiptText, tone: 'slate' },
  { key: 'cash', label: 'Efectivo', Icon: Banknote, currency: true, tone: 'emerald' },
  { key: 'card', label: 'Tarjeta', Icon: CreditCard, currency: true, tone: 'blue' },
  { key: 'saldoPorCobrar', label: 'Saldo por cobrar', Icon: Wallet, currency: true, tone: 'amber' },
  { key: 'average', label: 'Ticket promedio', Icon: ShoppingCart, currency: true, tone: 'slate' },
  { key: 'cancellations', label: 'Cancelaciones', Icon: XCircle, tone: 'rose' },
];

const tones = {
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-600',
};

export default function SalesKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores de ventas" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-7">
      {cards.map(({ key, label, Icon, currency, tone }) => (
        <article key={key} className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-semibold text-slate-500">{label}</p>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className={`mt-3 truncate text-xl font-bold tracking-tight ${tone === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>
            {currency ? formatCurrency(kpis[key]) : kpis[key]}
          </p>
          {key === 'completedSalesCount' && (
            <span className="mt-1 inline-block text-[10px] text-slate-400">Tickets liquidados al 100%</span>
          )}
          {key === 'cancellations' && <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">En el periodo</span>}
        </article>
      ))}
    </section>
  );
}
