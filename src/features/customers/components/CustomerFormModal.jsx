import { useState } from 'react';
import { CreditCard, UserRound, X } from 'lucide-react';

const types = [
  ['FRECUENTE', 'Frecuente'],
  ['MAYORISTA', 'Mayorista / Negocio'],
  ['PUBLICO_GENERAL', 'Público General'],
];
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

function initialForm(customer) {
  return customer ? {
    name: customer.name,
    businessName: customer.businessName,
    type: customer.type,
    phone: customer.phone,
    email: customer.email,
    taxId: customer.taxId,
    creditActive: customer.creditActive,
    creditLimit: String(customer.creditLimit),
    pendingBalance: customer.pendingBalance,
    totalPurchased: customer.totalPurchased,
    ticketCount: customer.ticketCount,
    lastPurchase: customer.lastPurchase,
    status: customer.status,
  } : {
    name: '', businessName: '', type: 'FRECUENTE', phone: '', email: '', taxId: '',
    creditActive: false, creditLimit: '0', pendingBalance: 0, totalPurchased: 0,
    ticketCount: 0, lastPurchase: null, status: 1,
  };
}

export default function CustomerFormModal({ isOpen, customer, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => initialForm(customer));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!isOpen) return null;

  const editing = Boolean(customer);
  const isWholesale = formData.type === 'MAYORISTA';
  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (formData.creditActive && Number(formData.creditLimit) <= 0) {
      setError('El límite de crédito debe ser mayor a cero.');
      return;
    }
    if (!formData.creditActive && Number(formData.pendingBalance) > 0) {
      setError('No puedes desactivar el crédito mientras exista un saldo pendiente.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        creditLimit: formData.creditActive ? Number(formData.creditLimit) : 0,
        status: Number(formData.status) === 1 ? 1 : 0,
      });
    } catch (submitError) {
      setError(submitError.message || 'No fue posible guardar el cliente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="customer-form-title">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div><h2 id="customer-form-title" className="text-lg font-bold text-slate-900">{editing ? 'Editar cliente' : 'Registrar cliente'}</h2><p className="mt-0.5 text-xs text-slate-500">Datos de contacto y configuración de crédito.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><UserRound className="h-4 w-4 text-emerald-600" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Datos del cliente</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre completo *</span><input required value={formData.name} onChange={(event) => updateField('name', event.target.value)} className={fieldClass} placeholder="Nombre y apellidos" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Tipo de cliente *</span><select value={formData.type} onChange={(event) => updateField('type', event.target.value)} className={fieldClass}>{types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className={isWholesale ? 'sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3' : ''}><span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre del negocio {isWholesale && <span className="text-blue-700">· recomendado para mayoristas</span>}</span><input value={formData.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={fieldClass} placeholder={isWholesale ? 'Ej. Taquería Los Compadres' : 'Opcional'} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono</span><input type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Correo electrónico</span><input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className={fieldClass} /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">RFC <span className="font-normal text-slate-400">· opcional para facturación</span></span><input maxLength="13" value={formData.taxId} onChange={(event) => updateField('taxId', event.target.value.toUpperCase())} className={fieldClass} placeholder="AAA010101AA1" /></label>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-600" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Configuración de crédito</h3></div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-50 p-3">
              <span><span className="block text-xs font-semibold text-slate-800">Habilitar línea de crédito</span><span className="mt-1 block text-[10px] text-slate-500">Permite registrar compras pendientes y abonos.</span></span>
              <input type="checkbox" checked={formData.creditActive} onChange={(event) => updateField('creditActive', event.target.checked)} className="h-5 w-5 accent-emerald-600" />
            </label>
            {formData.creditActive && <label className="block max-w-xs"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Límite máximo (MXN) *</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span><input required type="number" min="0.01" step="0.01" value={formData.creditLimit} onChange={(event) => updateField('creditLimit', event.target.value)} className={`${fieldClass} pl-7`} /></div>{customer?.pendingBalance > 0 && <span className="mt-1 block text-[10px] text-slate-500">Saldo actual: ${Number(customer.pendingBalance).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>}</label>}
          </section>

          {editing && <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700"><input type="checkbox" checked={Number(formData.status) === 1} onChange={(event) => updateField('status', event.target.checked ? 1 : 0)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />Cliente activo</label>}
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button><button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear cliente'}</button></footer>
        </form>
      </div>
    </div>
  );
}
