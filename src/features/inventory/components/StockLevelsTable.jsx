import { ArrowDownToLine, ArrowUpFromLine, Boxes, Package } from 'lucide-react';

function getStatus(item) {
  if (item.stock === 0) return { text: 'Agotado', className: 'bg-red-100 text-red-700', bar: 'bg-red-500' };
  if (item.stock <= item.minStock) return { text: 'Bajo Stock', className: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500' };
  return { text: 'Óptimo', className: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' };
}

export default function StockLevelsTable({ items, loading, onMovement, formatCurrency }) {
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando existencias…</div>;
  if (!items.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay productos que coincidan con los filtros.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>{['Producto', 'Existencia', 'Estado', 'Stock mínimo', 'Costo unitario', 'Valor total', 'Acciones'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const status = getStatus(item);
              const ratio = item.maxStock > 0 ? Math.min((item.stock / item.maxStock) * 100, 100) : 0;
              const unit = item.unit || (item.isBulk ? 'kg' : 'pzas');
              return (
                <tr key={item.id} className="align-middle transition hover:bg-slate-50/60">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">{item.isBulk ? <Boxes className="h-4 w-4" /> : <Package className="h-4 w-4" />}</span>
                      <div><p className="text-xs font-bold text-slate-800">{item.name}</p><p className="mt-1 text-[10px] text-slate-400">{item.code || 'Sin código'} · {item.category}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="min-w-32">
                      <p className="text-xs font-semibold text-slate-800">{Number(item.stock).toLocaleString('es-MX', { maximumFractionDigits: 2 })} <span className="font-normal text-slate-400">{unit}</span></p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${status.bar}`} style={{ width: `${ratio}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.text}</span></td>
                  <td className="px-4 py-4 text-xs text-slate-600">{Number(item.minStock).toLocaleString('es-MX')} {unit}</td>
                  <td className="px-4 py-4 text-xs text-slate-600">{formatCurrency(item.unitCost)}<span className="text-slate-400"> / {unit}</span></td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-800">{formatCurrency(item.stock * item.unitCost)}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => onMovement('ENTRADA', item)} title={`Registrar entrada: ${item.name}`} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1.5 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-50"><ArrowDownToLine className="h-3.5 w-3.5" />Entrada</button>
                      <button type="button" onClick={() => onMovement('MERMA', item)} title={`Registrar merma: ${item.name}`} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-2 py-1.5 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-50"><ArrowUpFromLine className="h-3.5 w-3.5" />Merma</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400">{items.length} {items.length === 1 ? 'producto' : 'productos'} en la vista</footer>
    </div>
  );
}
