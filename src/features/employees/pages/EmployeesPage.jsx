import { useMemo, useState } from 'react';
import { Plus, UserRoundCog } from 'lucide-react';
import EmployeesFilterBar from '../components/EmployeesFilterBar';
import EmployeesKPIHeader from '../components/EmployeesKPIHeader';
import EmployeeDetailDrawer from '../components/EmployeeDetailDrawer';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeesTable from '../components/EmployeesTable';
import useEmployees from '../hooks/useEmployees';

function makePin() {
  const value = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(value);
  else value[0] = Math.floor(Math.random() * 0xFFFFFFFF);
  return String(1000 + (value[0] % 9000));
}

export default function EmployeesPage() {
  const employees = useEmployees();
  const [notice, setNotice] = useState('');
  const closeDrawer = () => employees.setSelectedEmployee(null);
  const handleSubmit = async (data) => (employees.editingEmployee
    ? employees.updateEmployee(employees.editingEmployee.id, data)
    : employees.createEmployee(data));
  const toggleStatus = async (employee) => {
    try {
      await employees.toggleEmployeeStatus(employee.id);
    } catch {
      // The hook exposes the request error in the page.
    }
  };
  const handleResetPin = async (employee) => {
    if (!window.confirm(`¿Generar un nuevo PIN de caja para ${employee.name}?`)) return;
    const pin = makePin();
    try {
      await employees.resetPin(employee.id, pin);
      setNotice(`PIN nuevo de ${employee.name}: ${pin}. Compártelo de forma segura.`);
    } catch {
      // The hook exposes the request error in the page.
    }
  };
  const handlePermissionChange = async (employeeId, permissions) => {
    await employees.updatePermissions(employeeId, permissions);
  };
  const formKey = useMemo(() => employees.editingEmployee?.id ?? 'new-employee', [employees.editingEmployee]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><UserRoundCog className="h-5 w-5" /></span><div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de usuarios y empleados</h1><p className="mt-1 text-xs text-slate-500">Administra el equipo, roles, permisos y actividad auditada.</p></div></div><button type="button" onClick={employees.openCreateModal} className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:self-auto"><Plus className="h-4 w-4" />Nuevo empleado</button></header>

      {employees.error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{employees.error}</span><button type="button" onClick={employees.clearError} aria-label="Cerrar mensaje" className="font-bold">×</button></div>}
      {notice && <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Cerrar aviso" className="font-bold">×</button></div>}
      <EmployeesKPIHeader kpis={employees.kpis} />
      <EmployeesFilterBar
        searchTerm={employees.searchTerm}
        onSearchChange={employees.setSearchTerm}
        roleFilter={employees.roleFilter}
        onRoleChange={employees.setRoleFilter}
        shiftFilter={employees.shiftFilter}
        onShiftChange={employees.setShiftFilter}
        statusFilter={employees.statusFilter}
        onStatusChange={employees.setStatusFilter}
        onClear={employees.clearFilters}
      />
      <EmployeesTable
        employees={employees.filteredEmployees}
        loading={employees.loading}
        onView={employees.openDetailDrawer}
        onEdit={employees.openEditModal}
        onToggleStatus={toggleStatus}
        onResetPin={handleResetPin}
      />
      {employees.isFormModalOpen && <EmployeeFormModal
        key={formKey}
        isOpen
        employee={employees.editingEmployee}
        onClose={employees.closeFormModal}
        onSubmit={handleSubmit}
      />}
      <EmployeeDetailDrawer
        employee={employees.selectedEmployee}
        onClose={closeDrawer}
        onEdit={(employee) => {
          closeDrawer();
          employees.openEditModal(employee);
        }}
        onPermissionChange={handlePermissionChange}
      />
    </div>
  );
}
