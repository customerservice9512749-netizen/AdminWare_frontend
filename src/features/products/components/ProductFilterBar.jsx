import { LayoutGrid, List, Search, X } from 'lucide-react';

const controlClass = 'h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';

export default function ProductFilterBar({
  filters,
  onFiltersChange,
  categories,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onClear,
}) {
  const updateFilter = (key, value) => onFiltersChange((current) => ({ ...current, [key]: value }));

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Nombre, código o PLU..."
            aria-label="Buscar por nombre, código o PLU"
            className={`${controlClass} w-full pl-9`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Categoría" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className={controlClass}>
            <option value="Todas">Todas las categorías</option>
            {categories.map((category, index) => <option key={`${category.id}-${category.name}-${index}`} value={category.name}>{category.name}</option>)}
          </select>
          <select aria-label="Tipo de venta" value={filters.unit} onChange={(event) => updateFilter('unit', event.target.value)} className={controlClass}>
            <option value="Todos">Todos los tipos</option>
            <option value="KG">Por peso · KG</option>
            <option value="PZA">Por pieza · PZA</option>
          </select>
          <select aria-label="Estatus" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className={controlClass}>
            <option value="Todos">Todos los estatus</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select aria-label="Ordenar productos" value={sortBy} onChange={(event) => onSortByChange(event.target.value)} className={controlClass}>
            <option value="name">Ordenar: nombre</option>
            <option value="category">Ordenar: categoría</option>
            <option value="stock">Ordenar: stock</option>
            <option value="price">Ordenar: precio</option>
          </select>

          <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Formato de vista">
            <button type="button" aria-label="Vista de cuadrícula" aria-pressed={viewMode === 'grid'} onClick={() => onViewModeChange('grid')} className={`rounded-lg p-2 transition ${viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Vista de tabla" aria-pressed={viewMode === 'table'} onClick={() => onViewModeChange('table')} className={`rounded-lg p-2 transition ${viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <button type="button" onClick={onClear} className={`${controlClass} inline-flex items-center gap-1.5 border-transparent bg-slate-50 font-semibold text-slate-600 hover:bg-slate-100`}>
            <X className="h-3.5 w-3.5" /> Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}
