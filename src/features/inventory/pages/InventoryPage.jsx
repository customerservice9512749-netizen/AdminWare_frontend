import { useMemo } from 'react';
import { ArrowDownToLine, Boxes } from 'lucide-react';
import InventoryFilterBar from '../components/InventoryFilterBar';
import InventoryKPIHeader from '../components/InventoryKPIHeader';
import InventoryMovementModal from '../components/InventoryMovementModal';
import KardexHistoryTable from '../components/KardexHistoryTable';
import StockLevelsTable from '../components/StockLevelsTable';
import useInventory from '../hooks/useInventory';

export default function InventoryPage() {
  const inventory = useInventory();
  const visibleMovements = useMemo(() => {
    const query = inventory.searchTerm.trim().toLocaleLowerCase('es-MX');
    return inventory.kardexMovements.filter((movement) => {
      const matchesQuery = !query || `${movement.productName} ${movement.code} ${movement.reason} ${movement.user}`
        .toLocaleLowerCase('es-MX').includes(query);
      const product = inventory.inventoryItems.find((item) => String(item.id) === String(movement.productId));
      const matchesCategory = inventory.categoryFilter === 'ALL' || product?.category === inventory.categoryFilter;
      const matchesStock = inventory.stockFilter === 'ALL'
        || (inventory.stockFilter === 'OUT' && product?.stock === 0)
        || (inventory.stockFilter === 'LOW' && product?.stock > 0 && product?.stock <= product?.minStock)
        || (inventory.stockFilter === 'OPTIMAL' && product?.stock > product?.minStock);
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [inventory.categoryFilter, inventory.inventoryItems, inventory.kardexMovements, inventory.searchTerm, inventory.stockFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Boxes className="h-5 w-5" /></span>
          <div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Control de inventario</h1><p className="mt-1 text-xs text-slate-500">Existencias, movimientos y trazabilidad de productos en un solo lugar.</p></div>
        </div>
      </header>

      {inventory.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{inventory.error}</div>}
      <InventoryKPIHeader kpis={inventory.kpis} formatCurrency={inventory.formatCurrency} />
      <InventoryFilterBar
        activeTab={inventory.activeTab}
        onTabChange={inventory.setActiveTab}
        searchTerm={inventory.searchTerm}
        onSearchChange={inventory.setSearchTerm}
        categories={inventory.categories}
        categoryFilter={inventory.categoryFilter}
        onCategoryChange={inventory.setCategoryFilter}
        stockFilter={inventory.stockFilter}
        onStockFilterChange={inventory.setStockFilter}
      />
      {inventory.activeTab === 'stock' ? (
        <StockLevelsTable items={inventory.filteredItems} loading={inventory.loading} onMovement={inventory.openMovementModal} formatCurrency={inventory.formatCurrency} />
      ) : (
        <KardexHistoryTable movements={visibleMovements} loading={inventory.loading} />
      )}
      {!inventory.loading && (
        <div className="flex items-start gap-2 text-[10px] text-slate-400"><ArrowDownToLine className="mt-0.5 h-3.5 w-3.5 shrink-0" />Cada entrada, venta, merma o ajuste se conserva en el historial con existencias antes y después del movimiento.</div>
      )}
      {inventory.isModalOpen && <InventoryMovementModal
        key={`${inventory.modalConfig.type}-${inventory.modalConfig.preselectedProduct?.id ?? 'new'}`}
        isOpen={inventory.isModalOpen}
        config={inventory.modalConfig}
        products={inventory.inventoryItems}
        onClose={inventory.closeMovementModal}
        onSubmit={inventory.registerMovement}
        formatCurrency={inventory.formatCurrency}
      />}
    </div>
  );
}
