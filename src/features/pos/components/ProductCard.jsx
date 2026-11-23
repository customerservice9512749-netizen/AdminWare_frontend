import { Plus } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="group bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-2">
        {product.isBulk && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">PLU {product.plu}</span>}
        <span className="ml-auto text-[10px] text-slate-500">{product.stock} disp.</span>
      </div>
      <img src={product.image} alt="" className="mt-3 h-24 w-full rounded-xl object-contain" />
      <h3 className="mt-3 text-sm font-bold text-slate-900">{product.name}</h3>
      <p className="mt-1 text-xs font-semibold text-slate-500">{formatCurrency(product.price)} {product.isBulk ? '/ kg' : '/ pieza'}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <strong className="text-sm text-slate-900">{formatCurrency(product.price)}</strong>
        <button onClick={() => onAdd(product)} className="flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>
    </article>
  );
}
