import { useState } from 'react';
import { Building2, Eye, Pencil, Power, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const paymentLabels = { CONTADO: 'Contado', CREDITO_7: 'Crédito 7 días', CREDITO_15: 'Crédito 15 días', CREDITO_30: 'Crédito 30 días' };

export default function SuppliersTable({ suppliers, loading, onView, onEdit, onToggleStatus }) {
  const [page, setPage] = useState(1);
  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(suppliers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleSuppliers = suppliers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando proveedores…</div>;
  if (!suppliers.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay proveedores que coincidan con los filtros.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>{['Proveedor', 'Especialidad', 'Días de entrega', 'Contacto', 'Condición de pago', 'Saldo pendiente', 'Estatus', 'Acciones'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleSuppliers.map((supplier) => (
              <tr key={supplier.id} className="transition hover:bg-slate-50/60">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Building2 className="h-4 w-4" /></span>
                    <div className="min-w-0"><button type="button" onClick={() => onView(supplier)} className="block max-w-52 truncate text-left text-xs font-bold text-slate-800 hover:text-emerald-700">{supplier.commercialName}</button><p className="mt-1 text-[10px] text-slate-400">{supplier.taxId}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">{supplier.category}</span><p className="mt-1 text-[10px] text-slate-400">{supplier.products.length} productos</p></td>
                <td className="px-4 py-3.5"><div className="flex max-w-36 flex-wrap gap-1">{supplier.deliveryDays.length ? supplier.deliveryDays.map((day) => <span key={day} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{day}</span>) : <span className="text-[10px] text-slate-400">Sin programar</span>}</div></td>
                <td className="px-4 py-3.5"><p className="text-xs font-medium text-slate-700">{supplier.contactName || '—'}</p><p className="mt-1 text-[10px] text-slate-400">{supplier.phone || supplier.email || 'Sin contacto'}</p></td>
                <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${supplier.paymentTerms === 'CONTADO' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'}`}>{paymentLabels[supplier.paymentTerms] || supplier.paymentTerms}</span></td>
                <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">{formatCurrency(supplier.pendingBalance)}</td>
                <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${supplier.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{supplier.status === 1 ? 'Activo' : 'Inactivo'}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => onView(supplier)} title="Ver detalle" aria-label={`Ver detalle de ${supplier.commercialName}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
                    <button type="button" onClick={() => onEdit(supplier)} title="Editar" aria-label={`Editar ${supplier.commercialName}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => onToggleStatus(supplier)} title={supplier.status === 1 ? 'Desactivar proveedor' : 'Activar proveedor'} aria-label={`${supplier.status === 1 ? 'Desactivar' : 'Activar'} ${supplier.commercialName}`} className={`rounded-lg p-2 transition ${supplier.status === 1 ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-600' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'}`}><Power className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <p className="text-[10px] text-slate-400">Mostrando {Math.min((currentPage - 1) * pageSize + 1, suppliers.length)}–{Math.min(currentPage * pageSize, suppliers.length)} de {suppliers.length} proveedores</p>
        <div className="flex items-center gap-2">
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-[10px] font-semibold text-slate-500">Página {currentPage} de {pageCount}</span>
          <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Página siguiente" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </footer>
    </div>
  );
}
