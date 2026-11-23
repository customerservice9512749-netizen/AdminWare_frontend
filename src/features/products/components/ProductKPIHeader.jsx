import { AlertTriangle, Package, Scale, Trash2 } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total productos', Icon: Package, tone: 'slate' },
  { key: 'bulk', label: 'A granel', Icon: Scale, tone: 'emerald' },
  { key: 'lowStock', label: 'Bajo stock', Icon: AlertTriangle, tone: 'orange' },
  { key: 'waste', label: 'Mermas', Icon: Trash2, tone: 'rose' },
];

const tones = {
  slate: 'bg-slate-100 text-slate-600',
  emerald: 'bg-emerald-50 text-emerald-700',
  orange: 'bg-orange-50 text-orange-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function ProductKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores de productos" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map(({ key, label, Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}>
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {key === 'waste' ? Number(kpis[key] ?? 0).toLocaleString('es-MX') : kpis[key] ?? 0}
          </p>
        </article>
      ))}
    </section>
  );
}
