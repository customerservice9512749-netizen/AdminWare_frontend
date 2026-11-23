import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export default function CartItemCard({ item, onAdd, onUpdateQuantity, onRemove }) {
  const isBulk = Boolean(item.isBulk);
  const quantity = Number(item.quantity) || 0;
  const subtotal = item.total ?? quantity * Number(item.price || 0);

  const decrease = () => {
    if (isBulk) {
      onUpdateQuantity(item.id, Math.max(0, quantity - 0.1));
      return;
    }
    onUpdateQuantity(item.id, quantity - 1);
  };

  const increase = () => {
    if (isBulk) {
      onAdd(item);
      return;
    }
    onUpdateQuantity(item.id, quantity + 1);
  };

  return (
    <article className="flex min-h-36 gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-emerald-200">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        <img
          src={item.image || '/favicon.svg'}
          alt={item.name}
          className="h-full w-full object-contain"
          onError={(event) => {
            event.currentTarget.src = '/favicon.svg';
          }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{item.name}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {isBulk
                ? `${quantity.toFixed(3)} kg @ ${formatCurrency(item.price)}/kg`
                : `${quantity}x @ ${formatCurrency(item.price)}/pza`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button type="button" onClick={decrease} className="p-2 text-slate-600 hover:bg-slate-50" aria-label="Disminuir cantidad">
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-12 border-x border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-800">
              {isBulk ? quantity.toFixed(3) : quantity}
            </span>
            <button type="button" onClick={increase} className="p-2 text-emerald-600 hover:bg-emerald-50" aria-label={isBulk ? 'Agregar peso' : 'Aumentar cantidad'}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <strong className="text-xl font-extrabold text-slate-900">{formatCurrency(subtotal)}</strong>
        </div>
      </div>
    </article>
  );
}
