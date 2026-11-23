import { ContactRound, HandCoins, ShoppingBag, Store } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const cards = [
  { key: 'totalCustomers', title: 'Clientes registrados', caption: 'Clientes activos', icon: ContactRound, tone: 'emerald' },
  { key: 'wholesaleCount', title: 'Mayoristas / negocios', caption: 'Cuentas comerciales', icon: Store, tone: 'blue' },
  { key: 'accountsReceivable', title: 'Saldo por cobrar', caption: 'Cartera de crédito pendiente', icon: HandCoins, tone: 'amber' },
  { key: 'monthlyCustomerSales', title: 'Ventas del mes', caption: 'Ventas vinculadas a clientes', icon: ShoppingBag, tone: 'violet' },
];
const tones = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
};

export default function CustomersKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores de clientes" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, title, caption, icon: Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{title}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {key === 'totalCustomers' || key === 'wholesaleCount' ? kpis[key] : formatCurrency(kpis[key])}
              </p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">{caption}</p>
        </article>
      ))}
    </section>
  );
}
