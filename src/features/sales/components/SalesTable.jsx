import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Printer } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const pageSize = 8;
const dateFormatter = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

function printTicket(sale) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) throw new Error('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para reimprimir el ticket.');
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
  const items = sale.details.map((item) => `<tr><td>${safe(item.name)}<br><small>${item.quantity} ${safe(item.unit)}</small></td><td>${formatCurrency(item.total)}</td></tr>`).join('');
  printWindow.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Ticket ${safe(sale.folio)}</title><style>body{font:13px monospace;max-width:320px;margin:24px auto;color:#111}h1{text-align:center;font-size:17px}table{width:100%;border-collapse:collapse}td{padding:7px 0;border-bottom:1px dashed #bbb}td:last-child{text-align:right}p{display:flex;justify-content:space-between}</style><h1>ADMINWARE<br>Ticket de venta</h1><p>${safe(sale.folio)}<span>${safe(dateFormatter.format(new Date(sale.date)))}</span></p><table>${items}</table><p><strong>Total</strong><strong>${formatCurrency(sale.total)}</strong></p><p>Método de pago: ${safe(sale.paymentMethod)}</p><script>window.onload=()=>window.print()</script></html>`);
  printWindow.document.close();
}

export default function SalesTable({ sales, loading, onSelectSale }) {
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState('');

  const sortedSales = useMemo(() => [...sales].sort((first, second) => {
    const left = first[sort.key] ?? '';
    const right = second[sort.key] ?? '';
    const comparison = typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left).localeCompare(String(right), 'es-MX', { numeric: true });
    return sort.direction === 'asc' ? comparison : -comparison;
  }), [sales, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedSales.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleSales = sortedSales.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const updateSort = (key) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
  }));
  const handleReprint = (sale) => {
    try {
      printTicket(sale);
      setActionError('');
    } catch (error) {
      setActionError(error.message || 'No fue posible reimprimir el ticket.');
    }
  };
  const sortButton = (key, label) => (
    <button type="button" onClick={() => updateSort(key)} className="inline-flex items-center gap-1 hover:text-slate-700">
      {label}<ChevronDown className={`h-3 w-3 transition-transform ${sort.key === key && sort.direction === 'asc' ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Transacciones</h2>
          <p className="mt-0.5 text-xs text-slate-500">{sales.length} ventas encontradas</p>
        </div>
        {actionError && <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-xs text-rose-700">{actionError}</p>}
        <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">Página {currentPage} de {totalPages}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3">{sortButton('folio', 'Folio')}</th>
              <th className="px-4 py-3">{sortButton('date', 'Fecha y hora')}</th>
              <th className="px-4 py-3">Cajero</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">{sortButton('paymentMethod', 'Método')}</th>
              <th className="px-4 py-3">{sortButton('status', 'Estatus')}</th>
              <th className="px-4 py-3 text-right">{sortButton('total', 'Total')}</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr><td colSpan="8" className="px-5 py-14 text-center text-slate-400">Cargando historial de ventas...</td></tr>
            ) : visibleSales.length === 0 ? (
              <tr><td colSpan="8" className="px-5 py-14 text-center text-slate-400">No hay ventas que coincidan con los filtros.</td></tr>
            ) : visibleSales.map((sale) => (
              <tr key={sale.id} className="transition-colors hover:bg-slate-50">
                <td className="px-5 py-3.5 font-bold text-slate-900">{sale.folio}</td>
                <td className="px-4 py-3.5 text-slate-500">{dateFormatter.format(new Date(sale.date))}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">{sale.cashier}</td>
                <td className="px-4 py-3.5 text-slate-500">{sale.customer}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${sale.paymentMethod === 'Efectivo' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{sale.paymentMethod}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    sale.estatus === 2
                      ? 'bg-amber-100 text-amber-800'
                      : sale.estatus === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>{sale.estatus === 2 ? 'Pago Parcial' : sale.status}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="block font-bold text-slate-900">{formatCurrency(sale.total)}</span>
                  {sale.estatus === 2 && <span className="mt-1 block text-[10px] font-semibold text-orange-600">Resta: {formatCurrency(sale.saldoPendiente)}</span>}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    {sale.estatus === 2 && (
                      <button type="button" onClick={() => onSelectSale(sale.id)} title="Registrar un abono" aria-label={`Abonar a ${sale.folio}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-50">
                        Abonar
                      </button>
                    )}
                    <button type="button" onClick={() => onSelectSale(sale.id)} title="Ver detalle" aria-label={`Ver detalle de ${sale.folio}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                      <Eye className="h-3.5 w-3.5" /> Ver detalle
                    </button>
                    <button type="button" onClick={() => handleReprint(sale)} title="Reimprimir ticket" aria-label={`Reimprimir ticket ${sale.folio}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                      <Printer className="h-3.5 w-3.5" /> Reimprimir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-[11px] text-slate-500">
          {sales.length ? `Mostrando ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, sales.length)} de ${sales.length}` : 'Sin resultados'}
        </p>
        <div className="flex gap-1">
          <button type="button" aria-label="Página anterior" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Página siguiente" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
