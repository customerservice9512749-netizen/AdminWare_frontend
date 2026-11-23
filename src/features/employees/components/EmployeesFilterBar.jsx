import { RotateCcw, Search } from 'lucide-react';

const fieldClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function EmployeesFilterBar({
  searchTerm, onSearchChange, roleFilter, onRoleChange, shiftFilter, onShiftChange,
  statusFilter, onStatusChange, onClear,
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_190px_170px_150px_auto]">
        <label className="relative"><span className="sr-only">Buscar empleado</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar nombre, correo o teléfono…" className={`${fieldClass} pl-9`} /></label>
        <label><span className="sr-only">Rol</span><select value={roleFilter} onChange={(event) => onRoleChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los roles</option><option value="ADMIN">Administrador</option><option value="ENCARGADO">Encargado</option><option value="CAJERO">Cajero</option><option value="ALMACENISTA">Almacenista</option></select></label>
        <label><span className="sr-only">Turno</span><select value={shiftFilter} onChange={(event) => onShiftChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los turnos</option><option value="MATUTINO">Matutino</option><option value="VESPERTINO">Vespertino</option><option value="MIXTO">Mixto</option></select></label>
        <label><span className="sr-only">Estatus</span><select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los estatus</option><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></label>
        <button type="button" onClick={onClear} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"><RotateCcw className="h-3.5 w-3.5" />Limpiar</button>
      </div>
    </section>
  );
}
