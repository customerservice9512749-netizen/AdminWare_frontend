import { useState } from 'react';
import { Plus, RefreshCw, Boxes } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import AddProductModal from '../components/AddProductModal';
import ProductFilterBar from '../components/ProductFilterBar';
import ProductKPIHeader from '../components/ProductKPIHeader';
import ProductsTable from '../components/ProductsTable';
import StockAdjustModal from '../components/StockAdjustModal';
import useProducts from '../hooks/useProducts';

const EMPTY_PRODUCTS = [];

function ProductGrid({ products, onEdit, onAdjustStock, onDelete }) {
  if (!products.length) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No hay productos que coincidan con los filtros.</div>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const lowStock = product.stock <= product.minStock;
        const ratio = product.minStock > 0 ? Math.min((product.stock / (product.minStock * 2)) * 100, 100) : (product.stock ? 100 : 0);
        return (
          <article key={product.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
            <div className="flex items-start gap-3">
              {product.image ? <img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Boxes className="h-5 w-5" /></span>}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-slate-900">{product.name}</h2>
                <p className="mt-1 truncate text-[11px] text-slate-400">{product.code || 'Sin código'} · {product.category}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${product.isBulk ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{product.isBulk ? 'KG' : 'PZA'}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-sm font-bold text-slate-900">{formatCurrency(product.salePrice)}<span className="ml-1 text-[10px] font-medium text-slate-400">/ {product.isBulk ? 'kg' : 'pza'}</span></p>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${product.status ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{product.status ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[11px]">
                <span className={`font-semibold ${lowStock ? 'text-orange-700' : 'text-slate-600'}`}>Stock: {product.stock} {product.isBulk ? 'kg' : 'pzas'}</span>
                <span className="text-slate-400">Mínimo: {product.minStock}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${lowStock ? 'bg-orange-400' : 'bg-emerald-500'}`} style={{ width: `${ratio}%` }} />
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <button type="button" onClick={() => onEdit(product)} className="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700">Editar</button>
              <button type="button" onClick={() => onAdjustStock(product)} className="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700">Ajustar stock</button>
              <button type="button" onClick={() => onDelete(product)} className="rounded-lg border border-slate-200 px-2.5 py-2 text-[11px] font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50">Eliminar</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ProductsView({ inventory }) {
  const [viewMode, setViewMode] = useState('table');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToAdjust, setProductToAdjust] = useState(null);

  const submitProduct = (data) => (productToEdit
    ? inventory.updateProduct(productToEdit.id, data)
    : inventory.createProduct(data));

  const removeProduct = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
    try {
      await inventory.deleteProduct(product.id);
    } catch {
      // The hook keeps and exposes the request error in the page.
    }
  };

  const closeProductModal = () => {
    setIsAddOpen(false);
    setProductToEdit(null);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsAddOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Boxes className="h-5 w-5" /></span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de productos</h1>
            <p className="mt-1 text-xs text-slate-500">Administra el catálogo, precios y existencias de tu negocio.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {inventory.loading && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" aria-label="Cargando" />}
          <button type="button" onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <Plus className="h-4 w-4" /> Nuevo producto
          </button>
        </div>
      </header>

      {inventory.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{inventory.error}</div>}
      <ProductKPIHeader kpis={inventory.kpis} />
      <ProductFilterBar
        filters={inventory.filters}
        onFiltersChange={inventory.setFilters}
        categories={inventory.categories}
        sortBy={inventory.sortBy}
        onSortByChange={inventory.setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClear={inventory.clearFilters}
      />

      {viewMode === 'table' ? (
        <ProductsTable
          products={inventory.filteredProducts}
          loading={inventory.loading}
          onEdit={openEditModal}
          onAdjustStock={setProductToAdjust}
          onDelete={removeProduct}
        />
      ) : inventory.loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando catálogo…</div>
      ) : (
        <ProductGrid products={inventory.filteredProducts} onEdit={openEditModal} onAdjustStock={setProductToAdjust} onDelete={removeProduct} />
      )}

      {isAddOpen && (
        <AddProductModal
          isOpen
          onClose={closeProductModal}
          onSubmit={submitProduct}
          product={productToEdit}
          categories={inventory.categories}
          generateCode={inventory.generateCode}
        />
      )}
      {productToAdjust && (
        <StockAdjustModal
          product={productToAdjust}
          onClose={() => setProductToAdjust(null)}
          onSubmit={inventory.adjustStock}
        />
      )}
    </div>
  );
}

function StandaloneProductsPage({ initialProducts }) {
  const inventory = useProducts(initialProducts);
  return <ProductsView inventory={inventory} />;
}

export default function ProductsPage({ products = EMPTY_PRODUCTS, inventory }) {
  if (inventory) return <ProductsView inventory={inventory} />;
  return <StandaloneProductsPage initialProducts={products} />;
}
