export default function SalesChart({ data }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Rendimiento de Ventas</h2>
          <p className="text-xs text-slate-400 mt-0.5">Ingresos diarios acumulados de esta semana</p>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">Semana Actual</span>
      </div>
      <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-100 pb-2">
        {data.map((item, index) => (
          <div key={`${item.day}-${index}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{item.amount}</span>
            <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-500" style={{ height: item.height }} />
            <span className="text-[11px] font-medium text-slate-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
