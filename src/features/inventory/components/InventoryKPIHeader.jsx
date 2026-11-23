import { AlertTriangle, ArrowLeftRight, Boxes, CircleDollarSign } from 'lucide-react';

const cards = [
  { key: 'inventoryValue', title: 'Valor del inventario', detail: 'A costo de compra', icon: CircleDollarSign, tone: 'emerald' },
  { key: 'criticalStock', title: 'Stock crítico', detail: 'Productos para reponer', icon: AlertTriangle, tone: 'amber' },
  { key: 'wasteValue', title: 'Mermas del mes', detail: 'Costo · cantidad en kg/pzas', icon: Boxes, tone: 'rose' },
  { key: 'todayMovements', title: 'Movimientos hoy', detail: 'Entradas, ventas, mermas y ajustes', icon: ArrowLeftRight, tone: 'blue' },
];
const tones = {
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  blue: 'bg-blue-50 text-blue-700',
};

export default function InventoryKPIHeader({ kpis, formatCurrency }) {
  return (
    <section aria-label="Indicadores del inventario" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, title, detail, icon: Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{title}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {key === 'inventoryValue' || key === 'wasteValue' ? formatCurrency(kpis[key]) : kpis[key]}
              </p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {key === 'wasteValue' ? `${detail} · ${Number(kpis.wasteQuantity || 0).toLocaleString('es-MX')} kg/pzas` : detail}
          </p>
        </article>
      ))}
    </section>
  );
}
