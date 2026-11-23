import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta'];
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

export default function CustomerPaymentModal({ customer, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!customer) return null;

  const paymentAmount = Number(amount);
  const resultingBalance = Math.max(customer.pendingBalance - (Number.isFinite(paymentAmount) ? paymentAmount : 0), 0);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError('Ingresa un abono mayor a cero.');
      return;
    }
    if (paymentAmount > customer.pendingBalance) {
      setError('El abono no puede superar el saldo pendiente.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit(customer.id, paymentAmount, paymentMethod);
    } catch (submitError) {
      setError(submitError.message || 'No fue posible registrar el abono.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="customer-payment-title">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><CreditCard className="h-5 w-5" /></span><div><h2 id="customer-payment-title" className="text-sm font-bold text-slate-900">Registrar abono</h2><p className="mt-1 text-xs text-slate-500">{customer.businessName || customer.name}</p></div></div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Saldo pendiente</p><p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(customer.pendingBalance)}</p></div><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Saldo después del abono</p><p className="mt-1 text-sm font-bold text-emerald-700">{formatCurrency(resultingBalance)}</p></div></div>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Monto del abono (MXN)</span><div className="flex gap-2"><div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span><input autoFocus required type="number" min="0.01" max={customer.pendingBalance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={`${fieldClass} pl-7`} /></div><button type="button" onClick={() => setAmount(String(customer.pendingBalance))} className="rounded-xl border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">Liquidar</button></div></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Método de pago</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className={fieldClass}>{paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}</select></label>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button type="submit" disabled={saving || !customer.creditActive || customer.pendingBalance <= 0} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Registrando…' : 'Aplicar abono'}</button></footer>
        </form>
      </div>
    </div>
  );
}
