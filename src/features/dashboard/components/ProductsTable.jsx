import { MoreVertical } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductsTable({ products }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Productos Recientes</h2>
          <p className="text-xs text-slate-400 mt-0.5">Últimos artículos registrados en el catálogo</p>
        </div>
        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Ver todos</button>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
          <tr><th className="p-4 pl-6">Producto</th><th className="p-4">SKU</th><th className="p-4">Precio</th><th className="p-4">Stock</th><th className="p-4">Estado</th><th className="p-4 text-right pr-6">Acciones</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {products.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
              <td className="p-4 pl-6 font-semibold text-slate-900">{item.name}</td>
              <td className="p-4 text-slate-500">{item.sku}</td>
              <td className="p-4 font-medium">{formatCurrency(item.price)}</td>
              <td className="p-4">{item.stock} unidades</td>
              <td className="p-4"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${item.status === 'En Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'}`}>{item.status}</span></td>
              <td className="p-4 text-right pr-6"><button className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
