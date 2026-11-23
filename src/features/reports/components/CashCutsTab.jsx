import { Eye } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function discrepancyStatus(difference) {
  if (difference === 0) return { label: 'Cuadrado', styles: 'bg-emerald-100 text-emerald-700' };
  if (difference < 0) return { label: 'Faltante', styles: 'bg-red-100 text-red-700' };
  return { label: 'Sobrante', styles: 'bg-blue-100 text-blue-700' };
}

export default function CashCutsTab({ cuts, loading, onSelect }) {
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando cortes de caja…</div>;
  if (!cuts.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay cortes para este periodo o filtro.</div>;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold text-slate-900">Cortes de caja</h2><p className="mt-1 text-xs text-slate-500">Conciliación de efectivo esperado contra conteo físico</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{['Folio de corte', 'Fecha', 'Cajero / turno', 'Venta sistema', 'Efectivo contado', 'Diferencia', 'Estado', ''].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{cuts.map((cut) => { const status = discrepancyStatus(cut.difference); return <tr key={cut.id} className="transition hover:bg-slate-50/60"><td className="px-4 py-3.5 text-xs font-bold text-slate-800">{cut.folio}</td><td className="px-4 py-3.5 text-xs text-slate-600">{formatDate(cut.date)}</td><td className="px-4 py-3.5"><p className="text-xs font-semibold text-slate-700">{cut.cashier}</p><p className="mt-1 text-[10px] text-slate-400">{cut.shift === 'MATUTINO' ? 'Matutino' : 'Vespertino'} · {cut.branch}</p></td><td className="px-4 py-3.5 text-xs text-slate-700">{formatCurrency(cut.systemSales)}</td><td className="px-4 py-3.5 text-xs text-slate-700">{formatCurrency(cut.countedCash)}</td><td className={`px-4 py-3.5 text-xs font-bold ${cut.difference < 0 ? 'text-red-700' : cut.difference > 0 ? 'text-blue-700' : 'text-emerald-700'}`}>{cut.difference > 0 ? '+' : ''}{formatCurrency(cut.difference)}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.styles}`}>{status.label}</span></td><td className="px-4 py-3.5"><button type="button" onClick={() => onSelect(cut)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"><Eye className="h-3.5 w-3.5" />Detalle</button></td></tr>; })}</tbody>
      </table></div>
      <footer className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400">{cuts.length} cortes · {cuts.filter((cut) => cut.difference !== 0).length} con diferencia</footer>
    </section>
  );
}
