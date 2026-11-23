import { useMemo } from 'react';
import { Plus, Truck } from 'lucide-react';
import SuppliersFilterBar from '../components/SuppliersFilterBar';
import SuppliersKPIHeader from '../components/SuppliersKPIHeader';
import SupplierDetailDrawer from '../components/SupplierDetailDrawer';
import SupplierFormModal from '../components/SupplierFormModal';
import SuppliersTable from '../components/SuppliersTable';
import useSuppliers from '../hooks/useSuppliers';

export default function SuppliersPage({ products = [] }) {
  const suppliers = useSuppliers();
  const closeDrawer = () => suppliers.setSelectedSupplier(null);
  const handleSubmit = async (data) => (suppliers.editingSupplier
    ? suppliers.updateSupplier(suppliers.editingSupplier.id, data)
    : suppliers.createSupplier(data));
  const toggleStatus = async (supplier) => {
    try {
      await suppliers.toggleSupplierStatus(supplier.id);
    } catch {
      // The hook exposes the request error in the page.
    }
  };
  const modalKey = useMemo(() => suppliers.editingSupplier?.id ?? 'new-supplier', [suppliers.editingSupplier]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Truck className="h-5 w-5" /></span>
          <div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de proveedores</h1><p className="mt-1 text-xs text-slate-500">Administra abastecimiento, condiciones comerciales y entregas.</p></div>
        </div>
        <button type="button" onClick={suppliers.openCreateModal} className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:self-auto"><Plus className="h-4 w-4" />Nuevo proveedor</button>
      </header>

      {suppliers.error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{suppliers.error}</span><button type="button" onClick={suppliers.clearError} aria-label="Cerrar mensaje" className="font-bold">×</button></div>}
      <SuppliersKPIHeader kpis={suppliers.kpis} />
      <SuppliersFilterBar
        searchTerm={suppliers.searchTerm}
        onSearchChange={suppliers.setSearchTerm}
        categories={suppliers.categories}
        categoryFilter={suppliers.categoryFilter}
        onCategoryChange={suppliers.setCategoryFilter}
        paymentFilter={suppliers.paymentFilter}
        onPaymentChange={suppliers.setPaymentFilter}
        statusFilter={suppliers.statusFilter}
        onStatusChange={suppliers.setStatusFilter}
        onClear={suppliers.clearFilters}
      />
      <SuppliersTable
        suppliers={suppliers.filteredSuppliers}
        loading={suppliers.loading}
        onView={suppliers.openDetailDrawer}
        onEdit={suppliers.openEditModal}
        onToggleStatus={toggleStatus}
      />
      {suppliers.isFormModalOpen && <SupplierFormModal
        key={modalKey}
        isOpen
        supplier={suppliers.editingSupplier}
        products={[...suppliers.productCatalog, ...products]}
        onClose={suppliers.closeFormModal}
        onSubmit={handleSubmit}
      />}
      <SupplierDetailDrawer
        supplier={suppliers.selectedSupplier}
        onClose={closeDrawer}
        onEdit={(supplier) => {
          closeDrawer();
          suppliers.openEditModal(supplier);
        }}
      />
    </div>
  );
}
