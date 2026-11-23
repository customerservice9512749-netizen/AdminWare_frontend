import { useState } from 'react';
import { ChevronLeft, ChevronRight, KeyRound, Pencil, Power, Shield } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const roleStyles = {
  ADMIN: { label: 'Administrador', badge: 'bg-indigo-100 text-indigo-700', avatar: 'bg-indigo-50 text-indigo-700' },
  ENCARGADO: { label: 'Encargado', badge: 'bg-blue-100 text-blue-700', avatar: 'bg-blue-50 text-blue-700' },
  CAJERO: { label: 'Cajero POS', badge: 'bg-emerald-100 text-emerald-700', avatar: 'bg-emerald-50 text-emerald-700' },
  ALMACENISTA: { label: 'Almacenista', badge: 'bg-amber-100 text-amber-800', avatar: 'bg-amber-50 text-amber-800' },
};
const shifts = { MATUTINO: 'Matutino', VESPERTINO: 'Vespertino', MIXTO: 'Mixto' };

function initials(name) {
  return String(name ?? '').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toLocaleUpperCase('es-MX') || 'U';
}

function formatAccess(value) {
  if (!value) return 'Sin acceso';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin acceso' : date.toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function EmployeesTable({ employees, loading, onView, onEdit, onToggleStatus, onResetPin }) {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(employees.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleEmployees = employees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando equipo…</div>;
  if (!employees.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay empleados que coincidan con los filtros.</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr>{['Empleado', 'Rol', 'Turno', 'Actividad del mes', 'Último acceso', 'Estatus', 'Acciones'].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{visibleEmployees.map((employee) => {
            const role = roleStyles[employee.role] || roleStyles.CAJERO;
            return (
              <tr key={employee.id} className="transition hover:bg-slate-50/60">
                <td className="px-4 py-3.5"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${role.avatar}`}>{initials(employee.name)}</span><div className="min-w-0"><button type="button" onClick={() => onView(employee)} className="block max-w-48 truncate text-left text-xs font-bold text-slate-800 hover:text-emerald-700">{employee.name}</button><p className="mt-1 max-w-48 truncate text-[10px] text-slate-400">{employee.email}</p></div></div></td>
                <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${role.badge}`}>{role.label}</span></td>
                <td className="px-4 py-3.5"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{shifts[employee.shift] || employee.shift}</span></td>
                <td className="px-4 py-3.5"><p className="text-xs font-semibold text-slate-700">{employee.monthlyTickets.toLocaleString('es-MX')} tickets</p><p className="mt-1 text-[10px] text-slate-400">{formatCurrency(employee.monthlySales)} en ventas</p></td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{formatAccess(employee.lastAccess)}</td>
                <td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${employee.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{employee.status === 1 ? 'Activo' : 'Inactivo'}</span></td>
                <td className="px-4 py-3.5"><div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => onView(employee)} title="Permisos y actividad" aria-label={`Permisos y actividad de ${employee.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"><Shield className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onEdit(employee)} title="Editar" aria-label={`Editar ${employee.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onResetPin(employee)} title="Resetear PIN" aria-label={`Resetear PIN de ${employee.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"><KeyRound className="h-4 w-4" /></button>
                  <button type="button" onClick={() => onToggleStatus(employee)} title={employee.status === 1 ? 'Desactivar empleado' : 'Activar empleado'} aria-label={`${employee.status === 1 ? 'Desactivar' : 'Activar'} ${employee.name}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Power className="h-4 w-4" /></button>
                </div></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><p className="text-[10px] text-slate-400">Mostrando {Math.min((currentPage - 1) * pageSize + 1, employees.length)}–{Math.min(currentPage * pageSize, employees.length)} de {employees.length} empleados</p><div className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="text-[10px] font-semibold text-slate-500">Página {currentPage} de {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Página siguiente" className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></footer>
    </div>
  );
}
