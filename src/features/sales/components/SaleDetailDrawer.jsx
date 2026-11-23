import { useEffect, useState } from 'react';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Clock3, X } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const dateFormatter = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'short' });

export default function SaleDetailDrawer({ sale, onClose, onCancelSale, onRegisterInstallmentPayment }) {
  const [reason, setReason] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentMethod, setInstallmentMethod] = useState('Efectivo');
  const [installmentError, setInstallmentError] = useState('');
  const [registeringInstallment, setRegisteringInstallment] = useState(false);

  useEffect(() => {
    if (!sale) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, sale]);

  if (!sale) return null;

  const subtotal = sale.subtotal || sale.details.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = sale.tax || sale.details.reduce((sum, item) => sum + item.tax, 0);
  const submitCancellation = async (event) => {
    event.preventDefault();
    setCancelError('');
    setCancelling(true);
    try {
      await onCancelSale(sale.id, reason);
      setReason('');
    } catch (error) {
      setCancelError(error.message || 'No fue posible cancelar la venta.');
    } finally {
      setCancelling(false);
    }
  };
  const submitInstallment = async (event) => {
    event.preventDefault();
    setInstallmentError('');
    setRegisteringInstallment(true);
    try {
      await onRegisterInstallmentPayment(sale.id, installmentAmount, installmentMethod);
      setInstallmentAmount('');
    } catch (error) {
      setInstallmentError(error.message || 'No fue posible registrar el abono.');
    } finally {
      setRegisteringInstallment(false);
    }
  };
  const paymentHistory = sale.historialAbonos ?? [];
  const showInstallmentBreakdown = sale.montoPagado < sale.total || paymentHistory.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button type="button" aria-label="Cerrar detalle" onClick={onClose} className="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-[1px]" />
      <aside role="dialog" aria-modal="true" aria-labelledby="sale-detail-title" className="relative flex h-full w-full max-w-96 flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Detalle del ticket</p>
            <h2 id="sale-detail-title" className="mt-1 text-lg font-bold text-slate-900">{sale.folio}</h2>
            <p className="mt-1 text-[11px] text-slate-500">{dateFormatter.format(new Date(sale.date))}</p>
          </div>
          <button type="button" aria-label="Cerrar panel" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              sale.estatus === 2
                ? 'bg-amber-100 text-amber-800'
                : sale.estatus === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>{sale.estatus === 2 ? 'Pago Parcial' : sale.status}</span>
            <span className="text-xs font-semibold text-slate-500">{sale.paymentMethod}</span>
          </div>

          <section>
            <h3 className="mb-3 text-xs font-bold text-slate-800">Artículos</h3>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {sale.details.map((item, index) => (
                <div key={`${item.productId ?? item.name}-${index}`} className="px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-700">{formatCurrency(item.total || item.subtotal + item.tax)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2 rounded-xl bg-slate-50 p-3 text-xs">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>IVA (16%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900"><span>Total</span><span>{formatCurrency(sale.total)}</span></div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Pago</h3>
            <div className="flex items-center justify-between text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" />Recibido</span><span>{formatCurrency(sale.paymentReceived)}</span></div>
            <div className="flex items-center justify-between text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />Cambio</span><span>{formatCurrency(sale.change)}</span></div>
          </section>

          {showInstallmentBreakdown && (
            <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
              <h3 className="text-xs font-bold text-slate-800">Desglose de Pagos y Saldo</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600"><span>Total</span><span>{formatCurrency(sale.total)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Monto abonado</span><span>{formatCurrency(sale.montoPagado)}</span></div>
                <div className="flex justify-between border-t border-amber-200 pt-2 font-bold text-orange-700"><span>Saldo pendiente</span><span>{formatCurrency(sale.saldoPendiente)}</span></div>
              </div>
              {paymentHistory.length > 0 && (
                <div className="space-y-2 border-t border-amber-200 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Abonos realizados</p>
                  {paymentHistory.map((payment, index) => (
                    <div key={`${payment.fecha}-${index}`} className="flex items-start justify-between gap-2 text-[10px]">
                      <div>
                        <p className="font-semibold text-slate-700">{payment.metodoPago} · {payment.cajero}</p>
                        <p className="text-slate-500">{payment.fecha ? dateFormatter.format(new Date(payment.fecha)) : 'Fecha no disponible'}</p>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-800">{formatCurrency(payment.monto)}</span>
                    </div>
                  ))}
                </div>
              )}
              {sale.saldoPendiente > 0 && (
                <form onSubmit={submitInstallment} className="space-y-2 border-t border-amber-200 pt-3">
                  <p className="text-[10px] font-bold text-slate-700">Registrar nuevo abono</p>
                  <input
                    type="number"
                    min="0.01"
                    max={sale.saldoPendiente}
                    step="0.01"
                    required
                    value={installmentAmount}
                    onChange={(event) => setInstallmentAmount(event.target.value)}
                    placeholder="Monto del abono"
                    aria-label="Monto del abono"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                  <select
                    value={installmentMethod}
                    onChange={(event) => setInstallmentMethod(event.target.value)}
                    aria-label="Método de pago del abono"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                  {installmentError && <p role="alert" className="text-[11px] text-rose-600">{installmentError}</p>}
                  <button type="submit" disabled={registeringInstallment} className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                    {registeringInstallment ? 'Registrando...' : 'Registrar abono'}
                  </button>
                </form>
              )}
            </section>
          )}

          <section className="border-t border-slate-100 pt-4">
            <h3 className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-slate-800"><Clock3 className="h-3.5 w-3.5 text-emerald-600" />Auditoría y trazabilidad</h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-[10px] text-slate-400">Usuario responsable</p>
                <p className="mt-1 text-xs font-semibold text-slate-700">{sale.auditUserName} <span className="font-normal text-slate-400">{sale.auditUserId ? `(ID ${sale.auditUserId})` : ''}</span></p>
                <p className="mt-1 text-[10px] text-slate-500">Creada: {dateFormatter.format(new Date(sale.date))}</p>
              </div>
              {sale.auditTrail.map((entry, index) => (
                <div key={`${entry.action}-${index}`} className="relative border-l-2 border-emerald-100 pl-3">
                  <p className="text-[11px] font-semibold text-slate-700">{entry.action}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{entry.user} · {entry.date ? dateFormatter.format(new Date(entry.date)) : 'Fecha no disponible'}</p>
                  {entry.reason && <p className="mt-1 rounded-lg bg-rose-50 px-2 py-1.5 text-[10px] text-rose-700">Motivo: {entry.reason}</p>}
                </div>
              ))}
            </div>
          </section>

          {sale.status === 'Cancelada' && sale.cancellationReason && (
            <div className="flex gap-2 rounded-xl bg-rose-50 p-3 text-[11px] text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Motivo de cancelación: {sale.cancellationReason}</span>
            </div>
          )}

          {sale.estatus !== 0 && (
            <form onSubmit={submitCancellation} className="space-y-2 border-t border-slate-100 pt-4">
              <label htmlFor="cancellation-reason" className="block text-xs font-bold text-slate-700">Cancelar venta</label>
              <textarea
                id="cancellation-reason"
                required
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Registra el motivo de cancelación..."
                rows="2"
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10"
              />
              {cancelError && <p role="alert" className="text-[11px] text-rose-600">{cancelError}</p>}
              <button type="submit" disabled={cancelling} className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50">
                {cancelling ? 'Cancelando...' : 'Confirmar cancelación'}
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
