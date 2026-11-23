import { Banknote, Minus, Plus, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CashCutDetailModal({ cashCut, onClose }) {
  if (!cashCut) return null;
  const status = cashCut.difference === 0
    ? { label: 'Cuadrado', styles: 'bg-emerald-100 text-emerald-700' }
    : cashCut.difference < 0
      ? { label: 'Faltante', styles: 'bg-red-100 text-red-700' }
      : { label: 'Sobrante', styles: 'bg-blue-100 text-blue-700' };
  const details = [
    { label: 'Fondo inicial', value: cashCut.initialFund, icon: Banknote },
    { label: 'Ventas en efectivo', value: cashCut.cashSales, icon: Plus },
    { label: 'Retiros de efectivo', value: -cashCut.withdrawals, icon: Minus },
  ];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="cash-cut-title">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4"><div><div className="flex items-center gap-2"><h2 id="cash-cut-title" className="text-sm font-bold text-slate-900">Detalle de corte · {cashCut.folio}</h2><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.styles}`}>{status.label}</span></div><p className="mt-1 text-xs text-slate-500">{formatDate(cashCut.date)} · {cashCut.cashier} · {cashCut.shift === 'MATUTINO' ? 'Matutino' : 'Vespertino'}</p></div><button type="button" onClick={onClose} aria-label="Cerrar detalle" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button></header>
        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">Desglose de efectivo</p><div className="space-y-2">{details.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center justify-between text-xs"><span className="inline-flex items-center gap-2 text-slate-600"><Icon className="h-3.5 w-3.5 text-slate-400" />{label}</span><span className={`font-semibold ${value < 0 ? 'text-red-700' : 'text-slate-800'}`}>{value < 0 ? '−' : ''}{formatCurrency(Math.abs(value))}</span></div>)}<div className="flex items-center justify-between border-t border-slate-200 pt-2 text-xs"><span className="font-bold text-slate-700">Efectivo esperado</span><span className="font-bold text-slate-900">{formatCurrency(cashCut.expectedCash)}</span></div><div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-700">Efectivo contado</span><span className="font-bold text-slate-900">{formatCurrency(cashCut.countedCash)}</span></div></div></div>
          <div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ventas en tarjeta</p><p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(cashCut.cardSales)}</p></div><div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Ventas totales del sistema</p><p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(cashCut.totalSales || cashCut.cashSales + cashCut.cardSales)}</p></div></div>
          <div className={`flex items-center justify-between rounded-xl p-4 ${cashCut.difference < 0 ? 'bg-red-50' : cashCut.difference > 0 ? 'bg-blue-50' : 'bg-emerald-50'}`}><span className="text-xs font-semibold text-slate-700">Diferencia del corte</span><span className={`text-lg font-bold ${cashCut.difference < 0 ? 'text-red-700' : cashCut.difference > 0 ? 'text-blue-700' : 'text-emerald-700'}`}>{cashCut.difference > 0 ? '+' : ''}{formatCurrency(cashCut.difference)}</span></div>
        </div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Cerrar</button></footer>
      </div>
    </div>
  );
}
