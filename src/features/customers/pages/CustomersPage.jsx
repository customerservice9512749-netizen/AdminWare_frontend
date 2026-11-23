import { useMemo } from 'react';
import { ContactRound, Plus } from 'lucide-react';
import CustomersFilterBar from '../components/CustomersFilterBar';
import CustomersKPIHeader from '../components/CustomersKPIHeader';
import CustomerDetailDrawer from '../components/CustomerDetailDrawer';
import CustomerFormModal from '../components/CustomerFormModal';
import CustomerPaymentModal from '../components/CustomerPaymentModal';
import CustomersTable from '../components/CustomersTable';
import useCustomers from '../hooks/useCustomers';

export default function CustomersPage() {
  const customers = useCustomers();
  const closeDrawer = () => customers.setSelectedCustomer(null);
  const handleSubmit = async (data) => (customers.editingCustomer
    ? customers.updateCustomer(customers.editingCustomer.id, data)
    : customers.createCustomer(data));
  const toggleStatus = async (customer) => {
    try {
      await customers.toggleCustomerStatus(customer.id);
    } catch {
      // The hook exposes the request error in the page.
    }
  };
  const formKey = useMemo(() => customers.editingCustomer?.id ?? 'new-customer', [customers.editingCustomer]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><ContactRound className="h-5 w-5" /></span><div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de clientes</h1><p className="mt-1 text-xs text-slate-500">Consulta expedientes, compras y saldos de crédito de tus clientes.</p></div></div>
        <button type="button" onClick={customers.openCreateModal} className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:self-auto"><Plus className="h-4 w-4" />Nuevo cliente</button>
      </header>

      {customers.error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{customers.error}</span><button type="button" onClick={customers.clearError} aria-label="Cerrar mensaje" className="font-bold">×</button></div>}
      <CustomersKPIHeader kpis={customers.kpis} />
      <CustomersFilterBar
        searchTerm={customers.searchTerm}
        onSearchChange={customers.setSearchTerm}
        typeFilter={customers.typeFilter}
        onTypeChange={customers.setTypeFilter}
        creditFilter={customers.creditFilter}
        onCreditChange={customers.setCreditFilter}
        statusFilter={customers.statusFilter}
        onStatusChange={customers.setStatusFilter}
        onClear={customers.clearFilters}
      />
      <CustomersTable
        customers={customers.filteredCustomers}
        loading={customers.loading}
        onView={customers.openDetailDrawer}
        onPayment={customers.setPaymentModalCustomer}
        onEdit={customers.openEditModal}
        onToggleStatus={toggleStatus}
      />
      {customers.isFormModalOpen && <CustomerFormModal
        key={formKey}
        isOpen
        customer={customers.editingCustomer}
        onClose={customers.closeFormModal}
        onSubmit={handleSubmit}
      />}
      {customers.paymentModalCustomer && <CustomerPaymentModal
        key={customers.paymentModalCustomer.id}
        customer={customers.paymentModalCustomer}
        onClose={() => customers.setPaymentModalCustomer(null)}
        onSubmit={customers.registerPayment}
      />}
      <CustomerDetailDrawer
        customer={customers.selectedCustomer}
        onClose={closeDrawer}
        onPayment={(customer) => {
          closeDrawer();
          customers.setPaymentModalCustomer(customer);
        }}
        onEdit={(customer) => {
          closeDrawer();
          customers.openEditModal(customer);
        }}
      />
    </div>
  );
}
