import { useCallback, useEffect, useMemo, useState } from 'react';
import * as suppliersApi from '../api/suppliersApi';
import { adaptSupplierFromBackend, adaptSupplierToBackend } from '../adapters/supplierAdapter';

const weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const today = weekdayNames[new Date().getDay()];
const initialFormFilters = { search: '', category: 'ALL', payment: 'ALL', status: 'ALL' };

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([suppliersApi.getSuppliers(), suppliersApi.getSupplierProductCatalog()])
      .then(([response, catalog]) => {
        if (!active) return;
        setSuppliers(response.map(adaptSupplierFromBackend));
        setProductCatalog(catalog);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar los proveedores.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(suppliers.map((supplier) => supplier.category).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second, 'es-MX')),
    [suppliers],
  );

  const filteredSuppliers = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('es-MX');
    return suppliers.filter((supplier) => {
      const productNames = supplier.products.map((product) => product.name).join(' ');
      const matchesSearch = !query || [
        supplier.commercialName, supplier.businessName, supplier.contactName, supplier.phone, supplier.email, productNames,
      ].join(' ').toLocaleLowerCase('es-MX').includes(query);
      return matchesSearch
        && (categoryFilter === 'ALL' || supplier.category === categoryFilter)
        && (paymentFilter === 'ALL'
          || (paymentFilter === 'CASH' && supplier.paymentTerms === 'CONTADO')
          || (paymentFilter === 'CREDIT' && supplier.paymentTerms !== 'CONTADO'))
        && (statusFilter === 'ALL'
          || (statusFilter === 'ACTIVE' && supplier.status === 1)
          || (statusFilter === 'INACTIVE' && supplier.status === 0));
    });
  }, [categoryFilter, paymentFilter, searchTerm, statusFilter, suppliers]);

  const kpis = useMemo(() => ({
    activeCount: suppliers.filter((supplier) => supplier.status === 1).length,
    deliveriesToday: suppliers.filter((supplier) => supplier.status === 1 && supplier.deliveryDays.includes(today)).length,
    pendingBalance: suppliers.reduce((total, supplier) => total + supplier.pendingBalance, 0),
    monthlyPurchases: suppliers.reduce((total, supplier) => total + supplier.monthlyPurchases, 0),
  }), [suppliers]);

  const createSupplier = useCallback(async (data) => {
    setError('');
    try {
      const created = adaptSupplierFromBackend(await suppliersApi.createSupplier(adaptSupplierToBackend(data)));
      setSuppliers((current) => [created, ...current]);
      setIsFormModalOpen(false);
      setEditingSupplier(null);
      return created;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible crear el proveedor.');
      throw requestError;
    }
  }, []);

  const updateSupplier = useCallback(async (id, data) => {
    setError('');
    try {
      const updated = adaptSupplierFromBackend(await suppliersApi.updateSupplier(id, adaptSupplierToBackend({ ...data, id })));
      setSuppliers((current) => current.map((supplier) => String(supplier.id) === String(id) ? updated : supplier));
      setSelectedSupplier((current) => current && String(current.id) === String(id) ? updated : current);
      setIsFormModalOpen(false);
      setEditingSupplier(null);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar el proveedor.');
      throw requestError;
    }
  }, []);

  const toggleSupplierStatus = useCallback(async (id) => {
    setError('');
    try {
      const updated = adaptSupplierFromBackend(await suppliersApi.toggleSupplierStatus(id));
      setSuppliers((current) => current.map((supplier) => String(supplier.id) === String(id) ? updated : supplier));
      setSelectedSupplier((current) => current && String(current.id) === String(id) ? updated : current);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cambiar el estatus del proveedor.');
      throw requestError;
    }
  }, []);

  const openDetailDrawer = useCallback((supplier) => setSelectedSupplier(supplier), []);
  const clearFilters = useCallback(() => {
    setSearchTerm(initialFormFilters.search);
    setCategoryFilter(initialFormFilters.category);
    setPaymentFilter(initialFormFilters.payment);
    setStatusFilter(initialFormFilters.status);
  }, []);
  const clearError = useCallback(() => setError(''), []);
  const openCreateModal = useCallback(() => {
    setEditingSupplier(null);
    setIsFormModalOpen(true);
  }, []);
  const openEditModal = useCallback((supplier) => {
    setEditingSupplier(supplier);
    setIsFormModalOpen(true);
  }, []);
  const closeFormModal = useCallback(() => {
    setEditingSupplier(null);
    setIsFormModalOpen(false);
  }, []);

  return {
    suppliers,
    productCatalog,
    filteredSuppliers,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    paymentFilter,
    setPaymentFilter,
    statusFilter,
    setStatusFilter,
    selectedSupplier,
    setSelectedSupplier,
    isFormModalOpen,
    editingSupplier,
    loading,
    error,
    clearError,
    categories,
    kpis,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
    openDetailDrawer,
    clearFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
  };
}
