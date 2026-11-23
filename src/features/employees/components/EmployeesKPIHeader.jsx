import { ClipboardCheck, ShieldCheck, UserCheck, UsersRound } from 'lucide-react';

const cards = [
  { key: 'activeEmployees', label: 'Personal activo', description: 'Cuentas habilitadas', icon: UsersRound, tone: 'emerald' },
  { key: 'onShiftToday', label: 'En turno hoy', description: 'Acceso registrado hoy', icon: UserCheck, tone: 'blue' },
  { key: 'supervisorsCount', label: 'Administradores / encargados', description: 'Personal con rol de supervisión', icon: ShieldCheck, tone: 'violet' },
  { key: 'auditedActionsCount', label: 'Operaciones auditadas', description: 'Acciones críticas este mes', icon: ClipboardCheck, tone: 'amber' },
];
const tones = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
};

export default function EmployeesKPIHeader({ kpis }) {
  return (
    <section aria-label="Indicadores del equipo" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, description, icon: Icon, tone }) => (
        <article key={key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{kpis[key]}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span></div>
          <p className="mt-2 text-[11px] text-slate-400">{description}</p>
        </article>
      ))}
    </section>
  );
}
