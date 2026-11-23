import { useState } from 'react';
import { Activity, CalendarClock, KeyRound, Mail, Phone, ShieldCheck, X } from 'lucide-react';

const permissionRows = [
  ['canSellPOS', 'Operar punto de venta', 'Registrar ventas y cobrar tickets'],
  ['canCancelSales', 'Cancelar ventas', 'Anular ventas con motivo y trazabilidad'],
  ['canRegisterShrinkage', 'Registrar mermas', 'Capturar pérdidas y ajustes de merma'],
  ['canEditPrices', 'Editar precios', 'Modificar precios del catálogo'],
  ['canViewReports', 'Consultar reportes', 'Acceder a reportes comerciales'],
  ['canManageUsers', 'Gestionar usuarios', 'Crear cuentas y administrar accesos'],
];
const roleNames = { ADMIN: 'Administrador', ENCARGADO: 'Encargado', CAJERO: 'Cajero POS', ALMACENISTA: 'Almacenista' };
const shiftNames = { MATUTINO: 'Matutino', VESPERTINO: 'Vespertino', MIXTO: 'Mixto' };

function formatDate(value) {
  if (!value) return 'Sin actividad registrada';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin actividad registrada' : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function EmployeeDetailDrawer({ employee, onClose, onEdit, onPermissionChange }) {
  const [savingPermission, setSavingPermission] = useState('');
  const [permissionError, setPermissionError] = useState('');
  if (!employee) return null;

  const togglePermission = async (key) => {
    setSavingPermission(key);
    setPermissionError('');
    try {
      await onPermissionChange(employee.id, { [key]: !employee.permissions[key] });
    } catch (requestError) {
      setPermissionError(requestError.message || 'No fue posible actualizar el permiso.');
    } finally {
      setSavingPermission('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[1px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="employee-detail-title">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-5 w-5" /></span><div><h2 id="employee-detail-title" className="text-base font-bold text-slate-900">{employee.name}</h2><p className="mt-1 text-xs text-slate-500">{roleNames[employee.role]} · Turno {shiftNames[employee.shift]}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${employee.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{employee.status === 1 ? 'Activo' : 'Inactivo'}</span></div></div><button type="button" onClick={onClose} aria-label="Cerrar detalle" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button></header>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Mail className="h-3 w-3" />Correo</p><p className="mt-1 break-all text-xs font-semibold text-slate-700">{employee.email}</p></div><div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><Phone className="h-3 w-3" />Teléfono</p><p className="mt-1 text-xs font-semibold text-slate-700">{employee.phone || '—'}</p></div><div className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Último acceso</p><p className="mt-1 text-xs font-semibold text-slate-700">{formatDate(employee.lastAccess)}</p></div><div className="rounded-xl border border-slate-200 p-3"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><KeyRound className="h-3 w-3" />PIN de caja</p><p className="mt-1 text-xs font-semibold text-slate-700">{employee.hasPin ? 'Configurado · 4 dígitos' : 'Sin configurar'}</p></div></section>

          <section><div className="mb-3 flex items-center justify-between"><div><h3 className="text-xs font-bold text-slate-800">Permisos por módulo</h3><p className="mt-1 text-[10px] text-slate-400">Los cambios se aplican y auditan inmediatamente.</p></div><span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">{Object.values(employee.permissions).filter(Boolean).length} activos</span></div>{permissionError && <p role="alert" className="mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{permissionError}</p>}<div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">{permissionRows.map(([key, label, description]) => <div key={key} className="flex items-center justify-between gap-3 px-3 py-3"><div><p className="text-xs font-semibold text-slate-700">{label}</p><p className="mt-0.5 text-[10px] text-slate-400">{description}</p></div><button type="button" role="switch" aria-checked={employee.permissions[key]} aria-label={`${employee.permissions[key] ? 'Desactivar' : 'Activar'} permiso: ${label}`} disabled={savingPermission === key} onClick={() => togglePermission(key)} className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${employee.permissions[key] ? 'bg-emerald-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${employee.permissions[key] ? 'left-[22px]' : 'left-0.5'}`} /></button></div>)}</div></section>

          <section><div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-800"><Activity className="h-3.5 w-3.5 text-emerald-600" />Bitácora de actividad</h3><span className="text-[10px] text-slate-400">{employee.auditLog.length} eventos</span></div>{employee.auditLog.length ? <div className="space-y-2">{employee.auditLog.slice(0, 10).map((entry) => <div key={entry.id} className="flex gap-3 rounded-xl border border-slate-100 px-3 py-2.5"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${entry.critical ? 'bg-amber-500' : 'bg-slate-300'}`} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-slate-700">{entry.action}</p>{entry.critical && <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">Crítica</span>}</div><p className="mt-1 text-[10px] text-slate-500">{entry.description}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarClock className="h-3 w-3" />{formatDate(entry.date)}</p></div></div>)}</div> : <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Sin actividad registrada.</p>}</section>
        </div>
        <footer className="border-t border-slate-100 p-4"><button type="button" onClick={() => onEdit(employee)} className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">Editar empleado</button></footer>
      </aside>
    </div>
  );
}
