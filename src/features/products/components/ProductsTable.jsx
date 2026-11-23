import { Pencil, Scale, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

function StockIndicator({ product }) {
  const isLow = product.stock <= product.minStock;
  const progress = product.minStock > 0
    ? Math.min((product.stock / (product.minStock * 2)) * 100, 100)
    : (product.stock > 0 ? 100 : 0);

  return (
    <div className="min-w-28">
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
        <span className={`font-semibold ${isLow ? 'text-orange-700' : 'text-slate-700'}`}>
          {product.stock} {product.isBulk ? 'kg' : 'pzas'}
        </span>
        <span className="text-slate-400">Mín. {product.minStock}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${isLow ? 'bg-orange-400' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}

function ProductActions({ product, onEdit, onAdjustStock, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={() => onEdit(product)} aria-label={`Editar ${product.name}`} title="Editar" className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700">
        <Pencil className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onAdjustStock(product)} aria-label={`Ajustar stock de ${product.name}`} title="Ajustar stock" className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700">
        <Scale className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => onDelete(product)} aria-label={`Eliminar ${product.name}`} title="Eliminar" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function ProductsTable({ products, loading, onEdit, onAdjustStock, onDelete }) {
  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando catálogo…</div>;
  }
  if (products.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay productos que coincidan con los filtros.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Existencias</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {product.image ? <img src={product.image} alt="" className="h-9 w-9 rounded-lg object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{product.name.slice(0, 1).toUpperCase() || 'P'}</span>}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">{product.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{product.code || 'Sin código'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{product.category}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${product.isBulk ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {product.isBulk ? 'KG' : 'PZA'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">{formatCurrency(product.salePrice)}</td>
                <td className="px-4 py-3.5"><StockIndicator product={product} /></td>
                <td className="px-4 py-3.5"><StatusBadge active={product.status} /></td>
                <td className="px-4 py-3.5">
                  <ProductActions product={product} onEdit={onEdit} onAdjustStock={onAdjustStock} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
