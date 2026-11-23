import { Building2, DatabaseBackup, Printer, ShieldCheck } from 'lucide-react';

const sections = [
  ['business', 'Datos del Negocio', 'Información comercial y fiscal', Building2],
  ['ticket', 'Tickets e Impresión', 'Formato y vista previa', Printer],
  ['rules', 'Reglas Operativas e Impuestos', 'IVA y controles operativos', ShieldCheck],
  ['backup', 'Base de Datos y Respaldos', 'Estado y copias de seguridad', DatabaseBackup],
];

export default function SettingsSidebar({ activeSection, onSectionChange }) {
  return (
    <nav aria-label="Secciones de configuración" className="space-y-1">
      {sections.map(([id, title, description, Icon]) => (
        <button
          key={id}
          type="button"
          onClick={() => onSectionChange(id)}
          aria-current={activeSection === id ? 'page' : undefined}
          className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
            activeSection === id
              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            activeSection === id ? 'bg-white text-emerald-700 shadow-sm' : 'bg-slate-100 text-slate-500'
          }`}><Icon className="h-4 w-4" /></span>
          <span className="min-w-0"><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[10px] text-slate-500">{description}</span></span>
        </button>
      ))}
    </nav>
  );
}
