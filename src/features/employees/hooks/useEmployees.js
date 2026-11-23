import { useCallback, useEffect, useMemo, useState } from 'react';
import * as employeesApi from '../api/employeesApi';
import { adaptEmployeeFromBackend, adaptEmployeeToBackend } from '../adapters/employeeAdapter';

const initialFilters = { search: '', role: 'ALL', shift: 'ALL', status: 'ALL' };
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const tomorrowStart = new Date(todayStart);
tomorrowStart.setDate(tomorrowStart.getDate() + 1);

export default function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    employeesApi.getEmployees()
      .then((response) => {
        if (active) setEmployees(response.map(adaptEmployeeFromBackend));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar el equipo de trabajo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('es-MX');
    return employees.filter((employee) => {
      const searchable = `${employee.name} ${employee.email} ${employee.phone}`.toLocaleLowerCase('es-MX');
      return (!query || searchable.includes(query))
        && (roleFilter === 'ALL' || employee.role === roleFilter)
        && (shiftFilter === 'ALL' || employee.shift === shiftFilter)
        && (statusFilter === 'ALL'
          || (statusFilter === 'ACTIVE' && employee.status === 1)
          || (statusFilter === 'INACTIVE' && employee.status === 0));
    });
  }, [employees, roleFilter, searchTerm, shiftFilter, statusFilter]);

  const kpis = useMemo(() => ({
    activeEmployees: employees.filter((employee) => employee.status === 1).length,
    onShiftToday: employees.filter((employee) => {
      if (employee.status !== 1 || !employee.lastAccess) return false;
      const lastAccess = new Date(employee.lastAccess);
      return lastAccess >= todayStart && lastAccess < tomorrowStart;
    }).length,
    supervisorsCount: employees.filter((employee) => employee.role === 'ADMIN' || employee.role === 'ENCARGADO').length,
    auditedActionsCount: employees.reduce((total, employee) => total + employee.monthlyCriticalActions, 0),
  }), [employees]);

  const createEmployee = useCallback(async (data) => {
    setError('');
    try {
      const created = adaptEmployeeFromBackend(await employeesApi.createEmployee(adaptEmployeeToBackend(data)));
      setEmployees((current) => [created, ...current]);
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      return created;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible registrar al empleado.');
      throw requestError;
    }
  }, []);

  const updateEmployee = useCallback(async (id, data) => {
    setError('');
    try {
      const updated = adaptEmployeeFromBackend(await employeesApi.updateEmployee(id, adaptEmployeeToBackend({ ...data, id })));
      setEmployees((current) => current.map((employee) => String(employee.id) === String(id) ? updated : employee));
      setSelectedEmployee((current) => current && String(current.id) === String(id) ? updated : current);
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar al empleado.');
      throw requestError;
    }
  }, []);

  const toggleEmployeeStatus = useCallback(async (id) => {
    setError('');
    try {
      const updated = adaptEmployeeFromBackend(await employeesApi.toggleEmployeeStatus(id));
      setEmployees((current) => current.map((employee) => String(employee.id) === String(id) ? updated : employee));
      setSelectedEmployee((current) => current && String(current.id) === String(id) ? updated : current);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cambiar el estatus del empleado.');
      throw requestError;
    }
  }, []);

  const updatePermissions = useCallback(async (employeeId, updatedPermissions) => {
    setError('');
    try {
      const updated = adaptEmployeeFromBackend(await employeesApi.updateEmployeePermissions(employeeId, updatedPermissions));
      setEmployees((current) => current.map((employee) => String(employee.id) === String(employeeId) ? updated : employee));
      setSelectedEmployee((current) => current && String(current.id) === String(employeeId) ? updated : current);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar los permisos.');
      throw requestError;
    }
  }, []);

  const resetPin = useCallback(async (employeeId, newPin) => {
    setError('');
    try {
      if (!/^\d{4}$/.test(String(newPin))) throw new Error('El PIN debe contener exactamente 4 dígitos.');
      const updated = adaptEmployeeFromBackend(await employeesApi.resetEmployeePin(employeeId, newPin));
      setEmployees((current) => current.map((employee) => String(employee.id) === String(employeeId) ? updated : employee));
      setSelectedEmployee((current) => current && String(current.id) === String(employeeId) ? updated : current);
      return updated;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible restablecer el PIN.');
      throw requestError;
    }
  }, []);

  const openDetailDrawer = useCallback((employee) => setSelectedEmployee(employee), []);
  const clearFilters = useCallback(() => {
    setSearchTerm(initialFilters.search);
    setRoleFilter(initialFilters.role);
    setShiftFilter(initialFilters.shift);
    setStatusFilter(initialFilters.status);
  }, []);
  const openCreateModal = useCallback(() => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  }, []);
  const openEditModal = useCallback((employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  }, []);
  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  }, []);
  const clearError = useCallback(() => setError(''), []);

  return {
    employees,
    filteredEmployees,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    shiftFilter,
    setShiftFilter,
    statusFilter,
    setStatusFilter,
    selectedEmployee,
    setSelectedEmployee,
    isFormModalOpen,
    editingEmployee,
    loading,
    error,
    clearError,
    kpis,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    updatePermissions,
    resetPin,
    openDetailDrawer,
    clearFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
  };
}
