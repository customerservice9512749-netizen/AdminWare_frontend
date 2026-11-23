import { useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatters';

const periods = [
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: 'CUSTOM', label: 'Personalizado' },
];

function getChartDays(dateRange) {
  if (dateRange.preset === '7' || dateRange.preset === '30') return Number(dateRange.preset);
  if (dateRange.preset.toUpperCase() === 'CUSTOM' && dateRange.startDate && dateRange.endDate) {
    const difference = Math.round((new Date(`${dateRange.endDate}T00:00:00`) - new Date(`${dateRange.startDate}T00:00:00`)) / 86400000) + 1;
    return Math.max(1, difference);
  }
  return 30;
}

export default function SalesAnalyticsChart({ sales, dateRange, onDateRangeChange }) {
  const { points, maxAmount, chartStart } = useMemo(() => {
    const days = getChartDays(dateRange);
    const latestSaleDate = sales.reduce((latest, sale) => {
      const date = new Date(sale.date);
      return !Number.isNaN(date.getTime()) && date > latest ? date : latest;
    }, new Date('1970-01-01T12:00:00'));
    const end = dateRange.preset.toUpperCase() === 'CUSTOM' && dateRange.endDate
      ? new Date(`${dateRange.endDate}T12:00:00`)
      : latestSaleDate;
    const first = dateRange.preset.toUpperCase() === 'CUSTOM' && dateRange.startDate
      ? new Date(`${dateRange.startDate}T12:00:00`)
      : new Date(end);
    if (!(dateRange.preset.toUpperCase() === 'CUSTOM' && dateRange.startDate)) first.setDate(first.getDate() - days + 1);
    const chartDays = dateRange.preset.toUpperCase() === 'CUSTOM' && !dateRange.endDate
      ? Math.max(1, Math.floor((end - first) / 86400000) + 1)
      : days;
    const bucketCount = Math.min(chartDays, 30);
    const amounts = Array.from({ length: bucketCount }, () => 0);

    sales.forEach((sale) => {
      const date = new Date(sale.date);
      if (Number.isNaN(date.getTime())) return;
      const offset = Math.floor((date.setHours(12, 0, 0, 0) - new Date(first).setHours(12, 0, 0, 0)) / 86400000);
      const index = Math.floor((offset / chartDays) * bucketCount);
      if (offset >= 0 && index < bucketCount && sale.estatus !== 0) amounts[index] += sale.montoPagado;
    });

    const peak = Math.max(...amounts, 1);
    const values = amounts.map((amount, index) => ({
      amount,
      x: bucketCount === 1 ? 50 : 5 + (index / (bucketCount - 1)) * 90,
      y: 92 - (amount / peak) * 78,
      label: new Date(first.getFullYear(), first.getMonth(), first.getDate() + Math.floor(index * chartDays / bucketCount))
        .toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
    }));
    return { points: values, maxAmount: peak, chartStart: first };
  }, [dateRange, sales]);

  const path = points.map((point, index) => (
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  )).join(' ');
  const smoothPath = points.length > 2
    ? points.reduce((result, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      const midpoint = (previous.x + point.x) / 2;
      return `${result} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`;
    }, '')
    : path;
  const areaPath = `${smoothPath} L ${points.at(-1)?.x ?? 95} 100 L ${points[0]?.x ?? 5} 100 Z`;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Tendencia de ventas</h2>
          <p className="mt-1 text-xs text-slate-500">Ingresos diarios · periodo seleccionado</p>
        </div>
        <div role="tablist" aria-label="Periodo de la gráfica" className="flex rounded-xl bg-slate-100 p-1">
          {periods.map((period) => (
            <button
              key={period.value}
              type="button"
              role="tab"
              aria-selected={dateRange.preset === period.value}
              onClick={() => onDateRangeChange((current) => ({ ...current, preset: period.value }))}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition ${dateRange.preset === period.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
        <span>{formatCurrency(maxAmount)} máx.</span>
        <span>{dateRange.preset.toUpperCase() === 'CUSTOM' ? 'Rango personalizado' : `Desde ${chartStart.toLocaleDateString('es-MX')}`}</span>
      </div>
      <div className="relative mt-2 h-48 w-full">
        <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">
          {[0, 1, 2, 3].map((line) => <span key={line} className="border-t border-dashed border-slate-100" />)}
        </div>
        <svg role="img" aria-label="Gráfica de tendencia diaria de ventas" viewBox="0 0 100 100" preserveAspectRatio="none" className="relative h-full w-full overflow-visible">
          <defs>
            <linearGradient id="sales-area-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity=".28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#sales-area-gradient)" />
          <path d={smoothPath} fill="none" stroke="#10b981" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {points.map((point) => (
            <circle key={point.label} cx={point.x} cy={point.y} r=".9" fill="#059669" stroke="white" strokeWidth=".45" vectorEffect="non-scaling-stroke">
              <title>{`${point.label}: ${formatCurrency(point.amount)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between gap-1 overflow-hidden text-[9px] text-slate-400">
        {points.map((point, index) => (
          (points.length <= 7 || index % Math.ceil(points.length / 7) === 0 || index === points.length - 1)
            ? <span key={`label-${point.label}`} className="whitespace-nowrap">{point.label}</span>
            : null
        ))}
      </div>
    </section>
  );
}
