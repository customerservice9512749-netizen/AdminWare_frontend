import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export default function CartTicket({ cart, subtotal, iva, total, onRemove, onCheckout }) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 lg:w-[380px]">
      <h2 className="border-b border-slate-100 pb-4 text-sm font-bold text-slate-900">Ticket actual</h2>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">{item.name}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {item.isBulk
                  ? `${Number(item.quantity).toFixed(3)} kg @ ${formatCurrency(item.price)}/kg`
                  : `${item.quantity}x ${item.name}`}
              </p>
            </div>
            <strong className="text-xs text-slate-800">{formatCurrency(item.total ?? item.price * item.quantity)}</strong>
            <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-rose-600" aria-label="Eliminar producto">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between text-slate-500"><span>IVA (16%)</span><span>{formatCurrency(iva)}</span></div>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-xl font-extrabold text-slate-900">
          <span>Total</span><span className="text-emerald-600">{formatCurrency(total)}</span>
        </div>
        <button disabled={!cart.length} onClick={onCheckout} className="mt-3 w-full rounded-xl bg-emerald-500 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400">
          COBRAR (F12)
        </button>
      </div>
    </aside>
  );
}
