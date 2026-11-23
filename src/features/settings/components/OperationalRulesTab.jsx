import { AlertTriangle, BadgePercent, LockKeyhole, PackageCheck } from 'lucide-react';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10';

function PolicyToggle({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200">
      <span><span className="block text-xs font-semibold text-slate-800">{title}</span><span className="mt-1 block text-[11px] text-slate-500">{description}</span></span>
      <span className="relative shrink-0"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" /><span className={`block h-6 w-11 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`} /><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} /></span>
    </label>
  );
}

export default function OperationalRulesTab({ rules, onChange }) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BadgePercent className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-slate-900">Impuestos por tipo de producto</h2><p className="mt-1 text-xs text-slate-500">Reglas iniciales para distinguir alimentos frescos de productos procesados.</p></div></div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="mb-3 flex items-center gap-2 text-emerald-800"><PackageCheck className="h-4 w-4" /><span className="text-xs font-bold">Frutas y verduras frescas</span></div><label className="block text-[11px] font-semibold text-slate-600">Tasa IVA (%)<input type="number" min="0" max="100" step="0.01" value={rules.freshProduceVat} onChange={(event) => onChange('freshProduceVat', event.target.value)} className={inputClass} /></label><p className="mt-2 text-[10px] text-slate-600">Predeterminado: 0% para productos frescos a granel.</p></div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4"><div className="mb-3 flex items-center gap-2 text-blue-800"><BadgePercent className="h-4 w-4" /><span className="text-xs font-bold">Productos procesados o empacados</span></div><label className="block text-[11px] font-semibold text-slate-600">Tasa IVA (%)<input type="number" min="0" max="100" step="0.01" value={rules.packagedGoodsVat} onChange={(event) => onChange('packagedGoodsVat', event.target.value)} className={inputClass} /></label><p className="mt-2 text-[10px] text-slate-600">Predeterminado: 16% para productos procesados.</p></div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Confirma las tasas aplicables con tu asesor fiscal antes de emitir comprobantes. Estas reglas sirven como configuración operativa inicial.</div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><LockKeyhole className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-slate-900">Seguridad y operación</h2><p className="mt-1 text-xs text-slate-500">Solicita autorización para movimientos sensibles de caja e inventario.</p></div></div>
        <div className="space-y-3">
          <PolicyToggle title="Redondeo de efectivo" description="Ajusta el total cobrado al múltiplo de $0.50 más cercano." checked={rules.cashRounding} onChange={(value) => onChange('cashRounding', value)} />
          <PolicyToggle title="PIN para cancelar ventas" description="Solicita autorización de un encargado antes de cancelar una venta." checked={rules.pinForCancellation} onChange={(value) => onChange('pinForCancellation', value)} />
          <PolicyToggle title="PIN para registrar mermas" description="Protege los ajustes por merma con el PIN de un usuario autorizado." checked={rules.pinForShrinkage} onChange={(value) => onChange('pinForShrinkage', value)} />
          <label className="block max-w-sm text-xs font-semibold text-slate-700">Stock mínimo predeterminado
            <input type="number" min="0" step="1" value={rules.defaultMinimumStock} onChange={(event) => onChange('defaultMinimumStock', event.target.value)} className={inputClass} />
            <span className="mt-1 block text-[10px] font-normal text-slate-500">Se usa como alerta inicial al crear productos nuevos.</span>
          </label>
        </div>
      </section>
    </div>
  );
}
