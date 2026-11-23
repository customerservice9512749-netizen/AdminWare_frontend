import { Download, FileSpreadsheet, FileText } from 'lucide-react';

const presets = [['TODAY', 'Hoy'], ['7D', '7 días'], ['MONTH', 'Mes actual'], ['CUSTOM', 'Personalizado']];
const fieldClass = 'h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function ReportsFilterBar({
  datePreset, onDatePresetChange, customRange, onCustomRangeChange, shiftFilter, onShiftChange,
  branchFilter, onBranchChange, onExport, isExporting, reportPeriodLabel,
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 sm:w-fit">{presets.map(([value, label]) => <button key={value} type="button" aria-pressed={datePreset === value} onClick={() => onDatePresetChange(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${datePreset === value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>)}</div>
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {datePreset === 'CUSTOM' && <div className="flex items-center gap-2"><label className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">Desde<input type="date" value={customRange.start} onChange={(event) => onCustomRangeChange((current) => ({ ...current, start: event.target.value }))} className={fieldClass} /></label><label className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">Hasta<input type="date" value={customRange.end} onChange={(event) => onCustomRangeChange((current) => ({ ...current, end: event.target.value }))} className={fieldClass} /></label></div>}
          <label><span className="sr-only">Turno</span><select value={shiftFilter} onChange={(event) => onShiftChange(event.target.value)} className={fieldClass}><option value="ALL">Todos los turnos</option><option value="MATUTINO">Matutino</option><option value="VESPERTINO">Vespertino</option></select></label>
          <label><span className="sr-only">Sucursal</span><select value={branchFilter} onChange={(event) => onBranchChange(event.target.value)} className={fieldClass}><option value="ALL">Todas las sucursales</option><option value="Sucursal Centro">Sucursal Centro</option><option value="Sucursal Mercado">Sucursal Mercado</option></select></label>
          <span className="text-[10px] text-slate-400">{reportPeriodLabel}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={isExporting} onClick={() => onExport('xlsx')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60"><FileSpreadsheet className="h-4 w-4" />{isExporting ? 'Preparando…' : 'Exportar Excel'}</button>
          <button type="button" disabled={isExporting} onClick={() => onExport('pdf')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"><FileText className="h-4 w-4" /><Download className="h-3 w-3" />Exportar PDF</button>
        </div>
      </div>
    </section>
  );
}
