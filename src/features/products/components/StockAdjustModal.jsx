import { useState } from 'react';
import { X } from 'lucide-react';

const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

export default function StockAdjustModal({ product, onClose, onSubmit }) {
  const [type, setType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!product) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(product.id, { type, quantity: Number(quantity) });
      onClose();
    } catch (submitError) {
      setError(submitError.message || 'No fue posible ajustar las existencias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="stock-modal-title">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="stock-modal-title" className="text-sm font-bold text-slate-900">Ajustar existencias</h2>
            <p className="mt-1 text-xs text-slate-500">{product.name} · Actual: {product.stock} {product.isBulk ? 'kg' : 'pzas'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Movimiento</span>
            <select value={type} onChange={(event) => setType(event.target.value)} className={fieldClass}>
              <option value="add">Entrada de inventario</option>
              <option value="remove">Ajuste de salida</option>
              <option value="waste">Registrar merma</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Cantidad ({product.isBulk ? 'kg' : 'pzas'})</span>
            <input required type="number" min="0.001" step={product.isBulk ? '0.001' : '1'} value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} />
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={saving} className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60 ${type === 'waste' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {saving ? 'Guardando…' : type === 'waste' ? 'Registrar merma' : 'Aplicar ajuste'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
