import { RotateCcw, Search } from 'lucide-react';

const fieldClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function CustomersFilterBar({
  searchTerm, onSearchChange, typeFilter, onTypeChange, creditFilter, onCreditChange,
  statusFilter, onStatusChange, onClear,
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(230px,1fr)_190px_190px_150px_auto]">
        <label className="relative">
          <span className="sr-only">Buscar cliente</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar nombre, negocio o teléfono…" className={`${fieldClass} pl-9`} />
        </label>
        <label><span className="sr-only">Tipo de cliente</span><select value={typeFilter} onChange={(event) => onTypeChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los tipos</option><option value="FRECUENTE">Frecuente</option><option value="MAYORISTA">Mayorista / negocio</option><option value="PUBLICO_GENERAL">Público general</option></select></label>
        <label><span className="sr-only">Estado de crédito</span><select value={creditFilter} onChange={(event) => onCreditChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los estados de crédito</option><option value="PENDING">Con saldo pendiente</option></select></label>
        <label><span className="sr-only">Estatus</span><select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los estatus</option><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></label>
        <button type="button" onClick={onClear} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"><RotateCcw className="h-3.5 w-3.5" />Limpiar</button>
      </div>
    </section>
  );
}
