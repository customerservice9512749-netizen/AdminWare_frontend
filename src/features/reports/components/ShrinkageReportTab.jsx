import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ShrinkageReportTab({ shrinkage, loading, total }) {
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Calculando mermas…</div>;
  if (!shrinkage.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">Sin mermas registradas en el periodo.</div>;
  const reasons = [...new Set(shrinkage.map((item) => item.reason))];
  return (
    <div className="space-y-4">
      <section className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><AlertTriangle className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-amber-950">Impacto económico de mermas</h2><p className="mt-1 text-xs text-amber-800">Pérdida valorizada a costo de compra durante el periodo</p></div></div><p className="text-xl font-bold text-amber-900">{formatCurrency(total)}</p></section>
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold text-slate-900">Detalle por producto y motivo</h2><p className="mt-1 text-xs text-slate-500">{shrinkage.length} registros · {reasons.length} motivos</p></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{['Fecha', 'Producto', 'Cantidad', 'Motivo', 'Costo unitario', 'Impacto MXN', 'Responsable'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{shrinkage.map((item) => <tr key={item.id}><td className="px-4 py-3.5 text-xs text-slate-600">{formatDate(item.date)}</td><td className="px-4 py-3.5 text-xs font-semibold text-slate-800">{item.product}</td><td className="px-4 py-3.5 text-xs text-slate-600">{item.quantity.toLocaleString('es-MX', { maximumFractionDigits: 2 })} {item.unit}</td><td className="px-4 py-3.5"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">{item.reason}</span></td><td className="px-4 py-3.5 text-xs text-slate-600">{formatCurrency(item.unitCost)} / {item.unit}</td><td className="px-4 py-3.5 text-xs font-bold text-red-700">{formatCurrency(item.amount)}</td><td className="px-4 py-3.5 text-xs text-slate-600">{item.responsible}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
