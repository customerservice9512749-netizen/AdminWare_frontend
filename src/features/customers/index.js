export { default as CustomersPage } from './pages/CustomersPage';
export { default as CustomersKPIHeader } from './components/CustomersKPIHeader';
export { default as CustomersFilterBar } from './components/CustomersFilterBar';
export { default as CustomersTable } from './components/CustomersTable';
export { default as CustomerFormModal } from './components/CustomerFormModal';
export { default as CustomerPaymentModal } from './components/CustomerPaymentModal';
export { default as CustomerDetailDrawer } from './components/CustomerDetailDrawer';
export { default as useCustomers } from './hooks/useCustomers';
export { adaptCustomerFromBackend, adaptCustomerToBackend } from './adapters/customerAdapter';
export {
  createCustomer, getCustomers, registerCustomerPayment, toggleCustomerStatus, updateCustomer,
} from './api/customersApi';
