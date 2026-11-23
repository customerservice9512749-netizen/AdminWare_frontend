export default function StockAlerts({ alerts }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 text-sm">Reabastecimiento</h2>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">Prioridad Alta</span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.name} className={`p-3 rounded-xl border flex items-center justify-between ${alert.level === 'Crítico' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div>
                <p className="text-xs font-bold text-slate-800">{alert.name}</p>
                <span className="text-[10px] text-slate-500">Stock actual: {alert.stock} | Mínimo: {alert.minimum}</span>
              </div>
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${alert.level === 'Crítico' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{alert.level}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer">Generar Orden de Compra</button>
    </div>
  );
}
