import { CalendarDays, Mail, MapPin, Phone, Truck, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const paymentLabels = { CONTADO: 'Contado', CREDITO_7: 'Crédito a 7 días', CREDITO_15: 'Crédito a 15 días', CREDITO_30: 'Crédito a 30 días' };

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SupplierDetailDrawer({ supplier, onClose, onEdit }) {
  if (!supplier) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[1px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="supplier-detail-title">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Truck className="h-5 w-5" /></span>
            <div><h2 id="supplier-detail-title" className="text-base font-bold text-slate-900">{supplier.commercialName}</h2><p className="mt-1 text-xs text-slate-500">{supplier.businessName}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${supplier.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{supplier.status === 1 ? 'Activo' : 'Inactivo'}</span></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalle" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">RFC</p><p className="mt-1 text-xs font-semibold text-slate-700">{supplier.taxId || '—'}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Especialidad</p><p className="mt-1 text-xs font-semibold text-slate-700">{supplier.category}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Phone className="h-3 w-3" />Contacto</p><p className="mt-1 text-xs font-semibold text-slate-700">{supplier.contactName || '—'}</p><p className="mt-1 text-[10px] text-slate-500">{supplier.phone}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Mail className="h-3 w-3" />Correo</p><p className="mt-1 break-all text-xs font-semibold text-slate-700">{supplier.email || '—'}</p></div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700"><MapPin className="h-3 w-3" />Condición de pago</p><p className="mt-1 text-xs font-semibold text-slate-700">{paymentLabels[supplier.paymentTerms] || supplier.paymentTerms}</p><p className="mt-1 text-[10px] text-slate-500">Saldo: {formatCurrency(supplier.pendingBalance)}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><CalendarDays className="h-3 w-3" />Días de entrega</p><div className="mt-2 flex flex-wrap gap-1">{supplier.deliveryDays.map((day) => <span key={day} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{day}</span>)}</div></div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800">Productos asociados</h3><span className="text-[10px] text-slate-400">{supplier.products.length} productos</span></div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-3 py-2.5">Producto</th><th className="px-3 py-2.5">Categoría</th><th className="px-3 py-2.5 text-right">Último costo</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{supplier.products.length ? supplier.products.map((product) => <tr key={product.productId}><td className="px-3 py-2.5 text-xs font-medium text-slate-700">{product.name}</td><td className="px-3 py-2.5 text-[10px] text-slate-500">{product.category || '—'}</td><td className="px-3 py-2.5 text-right text-xs font-semibold text-slate-700">{formatCurrency(product.lastCost)}{product.unit ? ` / ${product.unit}` : ''}</td></tr>) : <tr><td colSpan="3" className="px-3 py-5 text-center text-xs text-slate-400">Sin productos asociados</td></tr>}</tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800">Últimas entregas</h3><span className="text-[10px] text-slate-400">Compras de este mes: {formatCurrency(supplier.monthlyPurchases)}</span></div>
            {supplier.deliveries.length ? <div className="space-y-2">{supplier.deliveries.slice(0, 5).map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"><div><p className="text-xs font-semibold text-slate-700">{item.folio || 'Entrega'}</p><p className="mt-1 text-[10px] text-slate-400">{formatDate(item.date)} · {item.status}</p></div><p className="text-xs font-bold text-slate-800">{formatCurrency(item.amount)}</p></div>)}</div> : <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Aún no hay entregas registradas.</p>}
          </section>
        </div>
        <footer className="border-t border-slate-100 p-4"><button type="button" onClick={() => onEdit(supplier)} className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">Editar proveedor</button></footer>
      </aside>
    </div>
  );
}
