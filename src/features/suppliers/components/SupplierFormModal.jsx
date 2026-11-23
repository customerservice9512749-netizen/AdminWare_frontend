import { useState } from 'react';
import { Building2, PackagePlus, X } from 'lucide-react';

const dayOptions = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const paymentOptions = [
  ['CONTADO', 'Contado'],
  ['CREDITO_7', 'Crédito a 7 días'],
  ['CREDITO_15', 'Crédito a 15 días'],
  ['CREDITO_30', 'Crédito a 30 días'],
];
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

function getInitialForm(supplier) {
  return supplier ? {
    commercialName: supplier.commercialName,
    businessName: supplier.businessName,
    taxId: supplier.taxId,
    contactName: supplier.contactName,
    phone: supplier.phone,
    email: supplier.email,
    category: supplier.category,
    deliveryDays: [...supplier.deliveryDays],
    paymentTerms: supplier.paymentTerms,
    pendingBalance: supplier.pendingBalance,
    status: supplier.status,
    products: supplier.products.map((product) => ({ ...product })),
    monthlyPurchases: supplier.monthlyPurchases,
  } : {
    commercialName: '', businessName: '', taxId: '', contactName: '', phone: '', email: '',
    category: '', deliveryDays: [], paymentTerms: 'CONTADO', pendingBalance: 0, status: 1,
    products: [], monthlyPurchases: 0,
  };
}

function toCatalogProduct(product) {
  return {
    productId: product.IdProducto ?? product.id,
    name: product.NombreProducto ?? product.name ?? '',
    category: product.Categoria ?? product.category ?? '',
    lastCost: Number(product.UltimoCosto ?? product.CostoUnitario ?? product.costPrice ?? product.salePrice) || 0,
    unit: product.Unidad ?? product.unit ?? '',
  };
}

export default function SupplierFormModal({ isOpen, supplier, products, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => getInitialForm(supplier));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!isOpen) return null;

  const editing = Boolean(supplier);
  const catalogProducts = products.map(toCatalogProduct);
  const availableProducts = [
    ...catalogProducts,
    ...formData.products.filter((linked) => !catalogProducts.some((product) => String(product.productId) === String(linked.productId))),
  ];

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));
  const toggleDay = (day) => updateField(
    'deliveryDays',
    formData.deliveryDays.includes(day) ? formData.deliveryDays.filter((item) => item !== day) : [...formData.deliveryDays, day],
  );
  const toggleProduct = (product) => {
    const exists = formData.products.some((item) => String(item.productId) === String(product.productId));
    updateField('products', exists
      ? formData.products.filter((item) => String(item.productId) !== String(product.productId))
      : [...formData.products, product]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!formData.deliveryDays.length) {
      setError('Selecciona al menos un día de entrega.');
      return;
    }
    if (!formData.products.length) {
      setError('Vincula al menos un producto surtido por este proveedor.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        commercialName: formData.commercialName.trim(),
        businessName: formData.businessName.trim(),
        taxId: formData.taxId.trim().toUpperCase(),
        pendingBalance: Number(formData.pendingBalance) || 0,
        status: Number(formData.status) === 1 ? 1 : 0,
      });
    } catch (submitError) {
      setError(submitError.message || 'No fue posible guardar el proveedor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="supplier-form-title">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div><h2 id="supplier-form-title" className="text-lg font-bold text-slate-900">{editing ? 'Editar proveedor' : 'Nuevo proveedor'}</h2><p className="mt-0.5 text-xs text-slate-500">Administra información, logística y productos asociados.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><Building2 className="h-4 w-4 text-emerald-600" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Datos de la empresa</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre comercial *</span><input required value={formData.commercialName} onChange={(event) => updateField('commercialName', event.target.value)} className={fieldClass} placeholder="Ej. Agrícola El Valle" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Razón social</span><input value={formData.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={fieldClass} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">RFC *</span><input required minLength="12" maxLength="13" value={formData.taxId} onChange={(event) => updateField('taxId', event.target.value.toUpperCase())} className={fieldClass} placeholder="AAA010101AA1" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Categoría / especialidad *</span><input required value={formData.category} onChange={(event) => updateField('category', event.target.value)} className={fieldClass} placeholder="Frutas y verduras" /></label>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Contacto directo</h3></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre de contacto *</span><input required value={formData.contactName} onChange={(event) => updateField('contactName', event.target.value)} className={fieldClass} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono *</span><input required type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Correo electrónico</span><input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className={fieldClass} /></label>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Logística y crédito</h3></div>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-slate-700">Días de entrega *</legend>
              <div className="flex flex-wrap gap-2">{dayOptions.map((day) => <label key={day} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold transition ${formData.deliveryDays.includes(day) ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><input type="checkbox" checked={formData.deliveryDays.includes(day)} onChange={() => toggleDay(day)} className="sr-only" />{day}</label>)}</div>
            </fieldset>
            <div className="grid gap-3 sm:grid-cols-2">
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Condición de pago</span><select value={formData.paymentTerms} onChange={(event) => updateField('paymentTerms', event.target.value)} className={fieldClass}>{paymentOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Saldo pendiente (MXN)</span><input type="number" min="0" step="0.01" value={formData.pendingBalance} onChange={(event) => updateField('pendingBalance', event.target.value)} className={fieldClass} /></label>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><PackagePlus className="h-4 w-4 text-emerald-600" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Productos que surte</h3><span className="text-[10px] text-slate-400">Selecciona uno o varios</span></div>
            {availableProducts.length ? (
              <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                {availableProducts.map((product) => {
                  const checked = formData.products.some((item) => String(item.productId) === String(product.productId));
                  return <label key={product.productId} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'}`}><input type="checkbox" checked={checked} onChange={() => toggleProduct(product)} className="h-4 w-4 accent-emerald-600" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-700">{product.name}</span><span className="mt-0.5 block text-[10px] text-slate-400">{product.category || 'Catálogo'}{product.unit ? ` · ${product.unit}` : ''}</span></span></label>;
                })}
              </div>
            ) : <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">No hay productos disponibles en el catálogo.</p>}
          </section>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700"><input type="checkbox" checked={Number(formData.status) === 1} onChange={(event) => updateField('status', event.target.checked ? 1 : 0)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />Proveedor activo</label>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear proveedor'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}
