import { ClipboardList } from 'lucide-react';

const typeStyles = {
  ENTRADA: 'bg-emerald-100 text-emerald-700',
  SALIDA_VENTA: 'bg-blue-100 text-blue-700',
  MERMA: 'bg-amber-100 text-amber-800',
  AJUSTE: 'bg-slate-100 text-slate-700',
};
const typeLabels = { ENTRADA: 'Entrada', SALIDA_VENTA: 'Venta', MERMA: 'Merma', AJUSTE: 'Ajuste' };

export default function KardexHistoryTable({ movements, loading }) {
  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando historial…</div>;
  if (!movements.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay movimientos que coincidan con la búsqueda.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left">
          <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>{['Fecha / folio', 'Producto', 'Tipo', 'Cantidad', 'Stock resultante', 'Motivo', 'Responsable'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.map((movement) => {
              const isIncoming = movement.delta > 0;
              const unit = movement.isBulk ? 'kg' : 'pzas';
              const date = new Date(movement.date);
              return (
                <tr key={movement.id} className="transition hover:bg-slate-50/60">
                  <td className="px-4 py-4"><p className="text-xs font-medium text-slate-700">{Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</p><p className="mt-1 text-[10px] text-slate-400">{movement.folio || 'Kardex'}</p></td>
                  <td className="px-4 py-4"><p className="text-xs font-semibold text-slate-800">{movement.productName}</p><p className="mt-1 text-[10px] text-slate-400">{movement.code}</p></td>
                  <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${typeStyles[movement.type] || typeStyles.AJUSTE}`}>{typeLabels[movement.type] || movement.type}</span></td>
                  <td className={`px-4 py-4 text-xs font-bold ${isIncoming ? 'text-emerald-700' : 'text-amber-700'}`}>{isIncoming ? '+' : '−'}{Number(movement.quantity).toLocaleString('es-MX', { maximumFractionDigits: 2 })} {unit}</td>
                  <td className="px-4 py-4"><p className="text-xs font-semibold text-slate-800">{Number(movement.newStock).toLocaleString('es-MX', { maximumFractionDigits: 2 })} {unit}</p><p className="mt-1 text-[10px] text-slate-400">Antes: {Number(movement.previousStock).toLocaleString('es-MX', { maximumFractionDigits: 2 })}</p></td>
                  <td className="max-w-56 px-4 py-4 text-xs text-slate-600">{movement.reason || '—'}</td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 text-xs text-slate-600"><ClipboardList className="h-3.5 w-3.5 text-slate-400" />{movement.user || '—'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400">{movements.length} movimientos · historial de auditoría</footer>
    </div>
  );
}
