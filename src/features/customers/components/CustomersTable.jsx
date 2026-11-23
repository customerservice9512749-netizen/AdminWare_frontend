import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Pencil, Power, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const customerTypes = {
  MAYORISTA: { label: 'Mayorista / Negocio', styles: 'bg-blue-100 text-blue-700' },
  FRECUENTE: { label: 'Frecuente', styles: 'bg-emerald-100 text-emerald-700' },
  PUBLICO_GENERAL: { label: 'Público General', styles: 'bg-slate-100 text-slate-700' },
};

function CreditUsage({ customer }) {
  if (!customer.creditActive) return <span className="text-xs text-slate-400">Contado</span>;
  const ratio = customer.creditLimit > 0 ? Math.min((customer.pendingBalance / customer.creditLimit) * 100, 100) : 0;
  const warning = ratio >= 80;
  return (
    <div className="min-w-32">
      <p className="text-[11px] font-semibold text-slate-700">{formatCurrency(customer.pendingBalance)} <span className="font-normal text-slate-400">/ {formatCurrency(customer.creditLimit)}</span></p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${warning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${ratio}%` }} /></div>
    </div>
  );
}

function formatLastPurchase(value) {
  if (!value) return 'Sin compras';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin compras' : date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

export default function CustomersTable({
  customers, loading, onView, onPayment, onEdit, onToggleStatus,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(customers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleCustomers = customers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando clientes…</div>;
  if (!customers.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay clientes que coincidan con los filtros.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{['Cliente', 'Tipo', 'Contacto', 'Crédito', 'Compras', 'Última compra', 'Estatus', 'Acciones'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {visibleCustomers.map((customer) => {
              const type = customerTypes[customer.type] || customerTypes.FRECUENTE;
              return (
                <tr key={customer.id} className="transition hover:bg-slate-50/60">
                  <td className="px-4 py-3.5"><div><button type="button" onClick={() => onView(customer)} className="max-w-52 truncate text-left text-xs font-bold text-slate-800 hover:text-emerald-700">{customer.businessName || customer.name}</button><p className="mt-1 text-[10px] text-slate-400">{customer.businessName ? customer.name : customer.taxId || `Cliente #${customer.id}`}</p></div></td>
                  <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${type.styles}`}>{type.label}</span></td>
                  <td className="px-4 py-3.5"><p className="text-xs text-slate-700">{customer.phone || '—'}</p><p className="mt-1 max-w-44 truncate text-[10px] text-slate-400">{customer.email || customer.taxId || 'Sin datos fiscales'}</p></td>
                  <td className="px-4 py-3.5"><CreditUsage customer={customer} /></td>
                  <td className="px-4 py-3.5"><p className="text-xs font-semibold text-slate-700">{formatCurrency(customer.totalPurchased)}</p><p className="mt-1 text-[10px] text-slate-400">{customer.ticketCount} tickets</p></td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{formatLastPurchase(customer.lastPurchase)}</td>
                  <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${customer.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{customer.status === 1 ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => onView(customer)} title="Ver expediente" aria-label={`Ver expediente de ${customer.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
                    {customer.pendingBalance > 0 && <button type="button" onClick={() => onPayment(customer)} title="Abonar" aria-label={`Registrar abono de ${customer.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"><Wallet className="h-4 w-4" /></button>}
                    <button type="button" onClick={() => onEdit(customer)} title="Editar" aria-label={`Editar ${customer.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => onToggleStatus(customer)} title={customer.status === 1 ? 'Desactivar cliente' : 'Activar cliente'} aria-label={`${customer.status === 1 ? 'Desactivar' : 'Activar'} ${customer.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Power className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <p className="text-[10px] text-slate-400">Mostrando {Math.min((currentPage - 1) * pageSize + 1, customers.length)}–{Math.min(currentPage * pageSize, customers.length)} de {customers.length} clientes</p>
        <div className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="text-[10px] font-semibold text-slate-500">Página {currentPage} de {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Página siguiente" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div>
      </footer>
    </div>
  );
}
