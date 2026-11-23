import { ShoppingBag, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function StatCards({ products }) {
  const lowStock = products.filter((product) => product.stock <= 10).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas de Hoy</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$29,800.00 MXN</h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2"><ArrowUpRight className="w-3 h-3" /> +24.9% vs ayer</span>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Productos</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length} items</h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2"><ArrowUpRight className="w-3 h-3" /> En catálogo activo</span>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Package className="w-5 h-5" /></div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas de Stock</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{lowStock} Productos</h3>
          <span className="text-[11px] font-medium text-rose-600 mt-2 block">Atención inmediata requerida</span>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
      </div>
    </div>
  );
}
