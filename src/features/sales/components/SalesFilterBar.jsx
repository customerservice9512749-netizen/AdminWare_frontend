import { CalendarDays, Download, RefreshCw, Search, X } from 'lucide-react';

const controlClass = 'h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function SalesFilterBar({
  filters,
  onFiltersChange,
  cashiers,
  dateRange,
  onDateRangeChange,
  onClear,
  onExport,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) {
  const updateFilter = (key, value) => onFiltersChange((current) => ({ ...current, [key]: value }));

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.searchTerm}
            onChange={(event) => updateFilter('searchTerm', event.target.value)}
            placeholder="Buscar por folio o cajero..."
            aria-label="Buscar por folio o cajero"
            className={`${controlClass} w-full pl-9`}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <label className="relative">
            <span className="sr-only">Cajero / Empleado</span>
            <select
              aria-label="Cajero / Empleado"
              value={filters.cashierFilter}
              onChange={(event) => updateFilter('cashierFilter', event.target.value)}
              className={controlClass}
            >
              <option value="Todos">Todos los cajeros</option>
              {cashiers.map((cashier) => <option key={cashier} value={cashier}>{cashier}</option>)}
            </select>
          </label>

          <label className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              aria-label="Rango de fecha"
              value={dateRange.preset}
              onChange={(event) => onDateRangeChange((current) => ({ ...current, preset: event.target.value }))}
              className={`${controlClass} pl-9`}
            >
              <option value="all">Todas las fechas</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="CUSTOM">Personalizado</option>
            </select>
          </label>

          <select aria-label="Método de pago" value={filters.paymentMethod} onChange={(event) => updateFilter('paymentMethod', event.target.value)} className={controlClass}>
            <option value="Todas">Todos los pagos</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
          <select aria-label="Estatus de venta" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className={controlClass}>
            <option value="Todas">Todos los estatus</option>
            <option value="Completada">Completada</option>
            <option value="PARCIAL">Pago Parcial / Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          {dateRange.preset.toUpperCase() === 'CUSTOM' && (
            <>
              <label className="flex flex-col gap-1 text-[10px] font-semibold text-slate-500">
                Fecha de inicio
                <input
                  aria-label="Fecha de inicio"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(event) => onDateRangeChange((current) => ({
                    ...current,
                    startDate: event.target.value,
                    endDate: current.endDate && current.endDate < event.target.value ? '' : current.endDate,
                  }))}
                  className={controlClass}
                />
              </label>
              <label className="flex flex-col gap-1 text-[10px] font-semibold text-slate-500">
                Fecha de cierre
                <input
                  aria-label="Fecha de cierre"
                  type="date"
                  min={dateRange.startDate || undefined}
                  value={dateRange.endDate}
                  onChange={(event) => onDateRangeChange((current) => ({ ...current, endDate: event.target.value }))}
                  className={controlClass}
                />
              </label>
            </>
          )}

          <button type="button" onClick={onExport} className={`${controlClass} inline-flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50`}>
            <Download className="h-4 w-4 text-emerald-600" /> Exportar <span aria-hidden="true">▾</span>
          </button>
          <button type="button" onClick={onClear} className={`${controlClass} inline-flex items-center gap-1.5 border-transparent bg-slate-50 font-semibold text-slate-600 hover:bg-slate-100`}>
            <X className="h-3.5 w-3.5" /> Limpiar filtros
          </button>
          <button type="button" onClick={onRefresh} disabled={isRefreshing} className={`${controlClass} inline-flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50`}>
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>
      <p className="mt-3 text-right text-[10px] text-slate-400">
        {lastUpdated
          ? `Última actualización: ${new Date(lastUpdated).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
          : 'Sin sincronizaciones recientes'}
      </p>
    </section>
  );
}
