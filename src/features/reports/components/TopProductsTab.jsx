import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export default function TopProductsTab({ products, loading }) {
  const [sortBy, setSortBy] = useState('profit');
  const ranked = useMemo(() => {
    const totalRevenue = products.reduce((sum, product) => sum + product.revenue, 0) || 1;
    return [...products]
      .sort((first, second) => sortBy === 'profit' ? second.profit - first.profit : second.volume - first.volume)
      .map((product, index) => ({ ...product, rank: index + 1, share: product.revenue / totalRevenue * 100 }));
  }, [products, sortBy]);

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Calculando ranking…</div>;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-sm font-bold text-slate-900">Productos con mayor desempeño</h2><p className="mt-1 text-xs text-slate-500">Ordena por contribución a utilidad o volumen vendido</p></div><div role="group" aria-label="Ordenar productos" className="flex rounded-xl bg-slate-100 p-1"><button type="button" aria-pressed={sortBy === 'profit'} onClick={() => setSortBy('profit')} className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition ${sortBy === 'profit' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}><ArrowUpWideNarrow className="mr-1 inline h-3.5 w-3.5" />Mayor utilidad</button><button type="button" aria-pressed={sortBy === 'volume'} onClick={() => setSortBy('volume')} className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition ${sortBy === 'volume' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}><ArrowDownWideNarrow className="mr-1 inline h-3.5 w-3.5" />Mayor volumen</button></div></div>
        {ranked.length ? <div className="mt-5 space-y-3">{ranked.map((product) => <article key={product.name} className="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-100">
          <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">#{product.rank}</span><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"><div><h3 className="text-xs font-bold text-slate-800">{product.name}</h3><p className="mt-1 text-[10px] text-slate-400">{product.category} · {product.volume.toLocaleString('es-MX', { maximumFractionDigits: 2 })} {product.unit}</p></div><div className="text-left sm:text-right"><p className="text-xs font-bold text-emerald-700">{formatCurrency(product.profit)} utilidad</p><p className="mt-1 text-[10px] text-slate-400">{formatCurrency(product.revenue)} en ventas</p></div></div>
            <div className="mt-3 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(product.share, 100)}%` }} /></div><span className="w-12 text-right text-[10px] font-semibold text-slate-500">{product.share.toLocaleString('es-MX', { maximumFractionDigits: 1 })}%</span></div>
          </div></div>
        </article>)}</div> : <p className="mt-6 text-center text-xs text-slate-400">No hay productos vendidos en este periodo.</p>}
      </section>
      {ranked.some((product) => product.lowRotation) && <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-amber-900"><TrendingDown className="h-4 w-4" />Alerta de baja rotación</h3><div className="mt-3 flex flex-wrap gap-2">{ranked.filter((product) => product.lowRotation).map((product) => <span key={product.name} className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] text-amber-900">{product.name} · {product.daysWithoutSale} días sin venta</span>)}</div></section>}
    </div>
  );
}
