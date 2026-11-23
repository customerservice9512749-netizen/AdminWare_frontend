import { useCallback, useEffect, useMemo, useState } from 'react';
import * as customersApi from '../api/customersApi';
import { adaptCustomerFromBackend, adaptCustomerToBackend } from '../adapters/customerAdapter';

const initialFilters = { search: '', type: 'ALL', credit: 'ALL', status: 'ALL' };

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [creditFilter, setCreditFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [paymentModalCustomer, setPaymentModalCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    customersApi.getCustomers()
      .then((response) => {
        if (active) setCustomers(response.map(adaptCustomerFromBackend));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar los clientes.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('es-MX');
    return customers.filter((customer) => {
      const searchable = `${customer.name} ${customer.businessName} ${customer.phone} ${customer.email}`
        .toLocaleLowerCase('es-MX');
      return (!query || searchable.includes(query))
        && (typeFilter === 'ALL' || customer.type === typeFilter)
        && (creditFilter === 'ALL' || (creditFilter === 'PENDING' && customer.pendingBalance > 0))
        && (statusFilter === 'ALL'
          || (statusFilter === 'ACTIVE' && customer.status === 1)
          || (statusFilter === 'INACTIVE' && customer.status === 0));
    });
  }, [creditFilter, customers, searchTerm, statusFilter, typeFilter]);

  const kpis = useMemo(() => ({
    totalCustomers: customers.filter((customer) => customer.status === 1).length,
    wholesaleCount: customers.filter((customer) => customer.type === 'MAYORISTA').length,
    accountsReceivable: customers.reduce((total, customer) => total + customer.pendingBalance, 0),
    monthlyCustomerSales: customers.reduce((total, customer) => total + customer.monthlySales, 0),
  }), [customers]);

  const createCustomer = useCallback(async (data) => {
    setError('');
    try {
      const created = adaptCustomerFromBackend(await customersApi.createCustomer(adaptCustomerToBackend(data)));
      setCustomers((current) => [created, ...current]);
      setIsFormModalOpen(false);
      setEditingCustomer(null);
      return created;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible registrar el cliente.');
      throw requestError;
    }
  }, []);

  const updateCustomer = useCallback(async (id, data) => {
    setError('');
    try {
      const updated = adaptCustomerFromBackend(await customersApi.updateCustomer(id, adaptCustomerToBackend({ ...data, id })));
      setCustomers((current) => current.map((customer) => String(customer.id) === String(id) ? updated : customer));
      setSelectedCustomer((current) => current && String(current.id) === String(id) ? updated : current);
      setIsFormModalOpen(false);
      setEditingCustomer(null);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar el cliente.');
      throw requestError;
    }
  }, []);

  const toggleCustomerStatus = useCallback(async (id) => {
    setError('');
    try {
      const updated = adaptCustomerFromBackend(await customersApi.toggleCustomerStatus(id));
      setCustomers((current) => current.map((customer) => String(customer.id) === String(id) ? updated : customer));
      setSelectedCustomer((current) => current && String(current.id) === String(id) ? updated : current);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cambiar el estatus del cliente.');
      throw requestError;
    }
  }, []);

  const registerPayment = useCallback(async (customerId, amount, paymentMethod) => {
    setError('');
    try {
      const customer = customers.find((item) => String(item.id) === String(customerId));
      if (!customer) throw new Error('No se encontró el cliente seleccionado.');
      const paymentAmount = Number(amount);
      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) throw new Error('El abono debe ser mayor a cero.');
      if (!customer.creditActive) throw new Error('El cliente no tiene una línea de crédito activa.');
      if (paymentAmount > customer.pendingBalance) throw new Error('El abono no puede superar el saldo pendiente.');
      const updated = adaptCustomerFromBackend(await customersApi.registerCustomerPayment(customerId, paymentAmount, paymentMethod));
      setCustomers((current) => current.map((item) => String(item.id) === String(customerId) ? updated : item));
      setSelectedCustomer((current) => current && String(current.id) === String(customerId) ? updated : current);
      setPaymentModalCustomer(null);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible registrar el abono.');
      throw requestError;
    }
  }, [customers]);

  const openDetailDrawer = useCallback((customer) => setSelectedCustomer(customer), []);
  const clearFilters = useCallback(() => {
    setSearchTerm(initialFilters.search);
    setTypeFilter(initialFilters.type);
    setCreditFilter(initialFilters.credit);
    setStatusFilter(initialFilters.status);
  }, []);
  const openCreateModal = useCallback(() => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  }, []);
  const openEditModal = useCallback((customer) => {
    setEditingCustomer(customer);
    setIsFormModalOpen(true);
  }, []);
  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingCustomer(null);
  }, []);

  return {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    creditFilter,
    setCreditFilter,
    statusFilter,
    setStatusFilter,
    selectedCustomer,
    setSelectedCustomer,
    isFormModalOpen,
    editingCustomer,
    paymentModalCustomer,
    setPaymentModalCustomer,
    loading,
    error,
    clearError: () => setError(''),
    kpis,
    createCustomer,
    updateCustomer,
    toggleCustomerStatus,
    registerPayment,
    openDetailDrawer,
    clearFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
  };
}
