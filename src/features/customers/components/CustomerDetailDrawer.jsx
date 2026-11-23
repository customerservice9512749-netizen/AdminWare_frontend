import { CalendarClock, CreditCard, Mail, Phone, ShoppingBag, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const typeLabels = { PUBLICO_GENERAL: 'Público General', FRECUENTE: 'Frecuente', MAYORISTA: 'Mayorista / Negocio' };

function formatDate(value, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('es-MX', options);
}

export default function CustomerDetailDrawer({ customer, onClose, onEdit, onPayment }) {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[1px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><ShoppingBag className="h-5 w-5" /></span><div><h2 id="customer-detail-title" className="text-base font-bold text-slate-900">{customer.businessName || customer.name}</h2>{customer.businessName && <p className="mt-1 text-xs text-slate-500">{customer.name}</p>}<span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">{typeLabels[customer.type] || customer.type}</span></div></div>
          <button type="button" onClick={onClose} aria-label="Cerrar expediente" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Datos fiscales</p><p className="mt-1 text-xs font-semibold text-slate-700">{customer.taxId || 'Sin RFC registrado'}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Phone className="h-3 w-3" />Teléfono</p><p className="mt-1 text-xs font-semibold text-slate-700">{customer.phone || '—'}</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Mail className="h-3 w-3" />Correo</p><p className="mt-1 break-all text-xs font-semibold text-slate-700">{customer.email || '—'}</p></div>
            <div className={`rounded-xl border p-3 ${customer.creditActive ? 'border-amber-100 bg-amber-50/60' : 'border-slate-200'}`}><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"><CreditCard className="h-3 w-3" />Línea de crédito</p><p className="mt-1 text-xs font-semibold text-slate-700">{customer.creditActive ? `${formatCurrency(customer.pendingBalance)} pendiente de ${formatCurrency(customer.creditLimit)}` : 'Contado'}</p></div>
          </section>

          <section className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Compras históricas</p><p className="mt-1 text-xs font-bold text-slate-800">{formatCurrency(customer.totalPurchased)}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Tickets</p><p className="mt-1 text-xs font-bold text-slate-800">{customer.ticketCount}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Última compra</p><p className="mt-1 text-xs font-bold text-slate-800">{formatDate(customer.lastPurchase, { day: '2-digit', month: 'short' })}</p></div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800">Tickets recientes</h3><span className="text-[10px] text-slate-400">{customer.tickets.length} movimientos</span></div>
            {customer.tickets.length ? <div className="space-y-2">{customer.tickets.slice(0, 5).map((ticket) => <div key={ticket.id} className="rounded-xl border border-slate-100 px-3 py-2.5"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-700">{ticket.folio || 'Ticket'}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarClock className="h-3 w-3" />{formatDate(ticket.date)} · {ticket.paymentMethod}</p></div><p className="text-xs font-bold text-slate-800">{formatCurrency(ticket.total)}</p></div>{ticket.products.length > 0 && <p className="mt-2 text-[10px] text-slate-500">{ticket.products.map((product) => `${product.name} (${product.quantity} ${product.unit})`).join(' · ')}</p>}</div>)}</div> : <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Sin tickets asociados.</p>}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800">Productos más comprados</h3></div>
            {customer.topProducts.length ? <div className="overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-400"><tr><th className="px-3 py-2.5">Producto</th><th className="px-3 py-2.5">Cantidad</th><th className="px-3 py-2.5 text-right">Acumulado</th></tr></thead><tbody className="divide-y divide-slate-100">{customer.topProducts.slice(0, 5).map((product) => <tr key={product.name}><td className="px-3 py-2.5 text-xs font-medium text-slate-700">{product.name}</td><td className="px-3 py-2.5 text-xs text-slate-500">{product.quantity} {product.unit}</td><td className="px-3 py-2.5 text-right text-xs font-semibold text-slate-700">{formatCurrency(product.total)}</td></tr>)}</tbody></table></div> : <p className="text-xs text-slate-400">Aún no hay productos destacados.</p>}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold text-slate-800">Bitácora de abonos</h3><span className="text-[10px] text-slate-400">{customer.payments.length} abonos</span></div>
            {customer.payments.length ? <div className="space-y-2">{customer.payments.slice(0, 5).map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"><div><p className="text-xs font-semibold text-slate-700">{item.reference || 'Abono'} · {item.method}</p><p className="mt-1 text-[10px] text-slate-400">{formatDate(item.date)}</p></div><p className="text-xs font-bold text-emerald-700">{formatCurrency(item.amount)}</p></div>)}</div> : <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Sin abonos registrados.</p>}
          </section>
        </div>
        <footer className="flex gap-2 border-t border-slate-100 p-4">{customer.pendingBalance > 0 && <button type="button" onClick={() => onPayment(customer)} className="flex-1 rounded-xl border border-amber-200 px-4 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-50">Registrar abono</button>}<button type="button" onClick={() => onEdit(customer)} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">Editar cliente</button></footer>
      </aside>
    </div>
  );
}
