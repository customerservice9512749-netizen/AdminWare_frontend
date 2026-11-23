import { ClipboardList, PackageSearch, Search } from 'lucide-react';

const inputClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function InventoryFilterBar({
  activeTab, onTabChange, searchTerm, onSearchChange, categories, categoryFilter, onCategoryChange,
  stockFilter, onStockFilterChange,
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        <button type="button" onClick={() => onTabChange('stock')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${activeTab === 'stock' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}><PackageSearch className="h-4 w-4" />Existencias</button>
        <button type="button" onClick={() => onTabChange('kardex')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${activeTab === 'kardex' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}><ClipboardList className="h-4 w-4" />Kardex</button>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_180px]">
        <label className="relative">
          <span className="sr-only">Buscar producto</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar por nombre, PLU o código…" className={`${inputClass} pl-9`} />
        </label>
        <label>
          <span className="sr-only">Categoría</span>
          <select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)} className={inputClass}>
            <option value="ALL">Todas las categorías</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Nivel de stock</span>
          <select value={stockFilter} onChange={(event) => onStockFilterChange(event.target.value)} className={inputClass}>
            <option value="ALL">Todos los niveles</option>
            <option value="OPTIMAL">Óptimo</option>
            <option value="LOW">Bajo stock</option>
            <option value="OUT">Agotado</option>
          </select>
        </label>
      </div>
    </section>
  );
}
