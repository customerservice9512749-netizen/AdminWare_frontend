import { useState } from 'react';
import { KeyRound, UserRound, X } from 'lucide-react';
import { getDefaultPermissions } from '../adapters/employeeAdapter';

const roleOptions = [['ADMIN', 'Administrador'], ['ENCARGADO', 'Encargado'], ['CAJERO', 'Cajero POS'], ['ALMACENISTA', 'Almacenista']];
const shiftOptions = [['MATUTINO', 'Matutino'], ['VESPERTINO', 'Vespertino'], ['MIXTO', 'Mixto']];
const permissionLabels = {
  canSellPOS: 'Operar punto de venta',
  canCancelSales: 'Cancelar ventas',
  canRegisterShrinkage: 'Registrar mermas',
  canEditPrices: 'Editar precios',
  canViewReports: 'Consultar reportes',
  canManageUsers: 'Gestionar usuarios',
};
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';
function makePin() {
  const value = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(value);
  else value[0] = Math.floor(Math.random() * 0xFFFFFFFF);
  return String(1000 + (value[0] % 9000));
}

function initialForm(employee) {
  return employee ? {
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    shift: employee.shift,
    password: '',
    authorizationPin: '',
    permissions: { ...employee.permissions },
    status: employee.status,
  } : {
    name: '', email: '', phone: '', role: 'CAJERO', shift: 'MATUTINO',
    password: '', authorizationPin: '', permissions: getDefaultPermissions('CAJERO'), status: 1,
  };
}

export default function EmployeeFormModal({ isOpen, employee, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => initialForm(employee));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!isOpen) return null;

  const editing = Boolean(employee);
  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));
  const handleRoleChange = (role) => setFormData((current) => ({
    ...current,
    role,
    permissions: getDefaultPermissions(role),
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!editing && formData.password.length < 8) {
      setError('La contraseña inicial debe tener al menos 8 caracteres.');
      return;
    }
    if (editing && formData.password && formData.password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (formData.authorizationPin && !/^\d{4}$/.test(formData.authorizationPin)) {
      setError('El PIN de autorización debe contener exactamente 4 dígitos.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ ...formData, status: Number(formData.status) === 1 ? 1 : 0 });
    } catch (submitError) {
      setError(submitError.message || 'No fue posible guardar al empleado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4"><div><h2 id="employee-form-title" className="text-lg font-bold text-slate-900">{editing ? 'Editar empleado' : 'Agregar empleado'}</h2><p className="mt-0.5 text-xs text-slate-500">Administra acceso, rol, turno y autorizaciones de caja.</p></div><button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button></header>
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <section className="space-y-3"><div className="flex items-center gap-2 border-b border-slate-100 pb-2"><UserRound className="h-4 w-4 text-emerald-600" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Datos personales</h3></div><div className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre completo *</span><input required value={formData.name} onChange={(event) => updateField('name', event.target.value)} className={fieldClass} placeholder="Nombre y apellidos" /></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Correo electrónico *</span><input required type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className={fieldClass} /></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono</span><input type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass} /></label>
          </div></section>

          <section className="space-y-3"><div className="border-b border-slate-100 pb-2"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">Acceso y permisos por rol</h3></div><div className="grid gap-3 sm:grid-cols-2">
            <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Rol *</span><select value={formData.role} onChange={(event) => handleRoleChange(event.target.value)} className={fieldClass}>{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-slate-700">Turno *</span><select value={formData.shift} onChange={(event) => updateField('shift', event.target.value)} className={fieldClass}>{shiftOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-slate-700">{editing ? 'Nueva contraseña (opcional)' : 'Contraseña inicial *'}</span><input required={!editing} type="password" autoComplete="new-password" minLength="8" value={formData.password} onChange={(event) => updateField('password', event.target.value)} className={fieldClass} placeholder={editing ? 'Dejar en blanco para conservar la actual' : 'Mínimo 8 caracteres'} /></label>
          </div><div className="grid gap-2 sm:grid-cols-2">{Object.entries(permissionLabels).map(([key, label]) => <div key={key} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${formData.permissions[key] ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}><span className={`h-1.5 w-1.5 rounded-full ${formData.permissions[key] ? 'bg-emerald-500' : 'bg-slate-300'}`} />{label}</div>)}</div><p className="text-[10px] text-slate-400">Al cambiar de rol se carga automáticamente la plantilla de permisos recomendada. Los permisos se pueden ajustar después.</p></section>

          {formData.permissions.canSellPOS && <section className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4"><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-700" /><h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">PIN de autorización para caja</h3></div><label className="block max-w-xs"><span className="mb-1.5 block text-xs font-semibold text-slate-700">{editing ? 'Nuevo PIN (opcional)' : 'PIN de 4 dígitos'}</span><div className="flex gap-2"><input inputMode="numeric" pattern="[0-9]{4}" maxLength="4" value={formData.authorizationPin} onChange={(event) => updateField('authorizationPin', event.target.value.replace(/\D/g, '').slice(0, 4))} className={fieldClass} placeholder={editing ? 'Dejar vacío para conservar' : '0000'} /><button type="button" onClick={() => updateField('authorizationPin', makePin())} className="shrink-0 rounded-xl border border-amber-200 px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100">Generar PIN</button></div></label></section>}

          {editing && <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700"><input type="checkbox" checked={Number(formData.status) === 1} onChange={(event) => updateField('status', event.target.checked ? 1 : 0)} className="h-4 w-4 accent-emerald-600" />Empleado activo</label>}
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear empleado'}</button></footer>
        </form>
      </div>
    </div>
  );
}
