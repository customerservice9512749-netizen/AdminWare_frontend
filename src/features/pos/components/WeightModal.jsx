import { useEffect, useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';

export default function WeightModal({ product, onConfirm, onClose }) {
  const [weight, setWeight] = useState('');
  const numericWeight = Number(weight) || 0;

  useEffect(() => setWeight(''), [product]);

  const confirm = () => {
    if (numericWeight > 0) onConfirm(product, numericWeight);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 p-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pesaje</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{product.name}</h2>
          <input autoFocus type="number" min="0" step="0.001" value={weight} onChange={(event) => setWeight(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') confirm(); }}
            placeholder="0.000" className="mt-6 w-full border-0 border-b border-slate-200 bg-transparent text-center text-5xl font-bold text-slate-900 outline-none focus:border-emerald-500" />
          <span className="mt-2 block text-sm text-slate-400">kg</span>
          <p className="mt-5 text-3xl font-extrabold text-emerald-600">{formatCurrency(numericWeight * Number(product.price))}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600">Cancelar</button>
          <button disabled={numericWeight <= 0} onClick={confirm} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl">Agregar peso</button>
        </div>
      </div>
    </div>
  );
}
