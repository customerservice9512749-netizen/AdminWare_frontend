const permissionKeys = [
  'canSellPOS',
  'canCancelSales',
  'canRegisterShrinkage',
  'canEditPrices',
  'canViewReports',
  'canManageUsers',
];

const rolePermissionTemplates = {
  ADMIN: {
    canSellPOS: true, canCancelSales: true, canRegisterShrinkage: true,
    canEditPrices: true, canViewReports: true, canManageUsers: true,
  },
  ENCARGADO: {
    canSellPOS: true, canCancelSales: true, canRegisterShrinkage: true,
    canEditPrices: false, canViewReports: true, canManageUsers: false,
  },
  CAJERO: {
    canSellPOS: true, canCancelSales: false, canRegisterShrinkage: false,
    canEditPrices: false, canViewReports: false, canManageUsers: false,
  },
  ALMACENISTA: {
    canSellPOS: false, canCancelSales: false, canRegisterShrinkage: true,
    canEditPrices: false, canViewReports: false, canManageUsers: false,
  },
};

const asBool = (value) => value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
const asNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;

export function getDefaultPermissions(role) {
  return { ...(rolePermissionTemplates[role] ?? rolePermissionTemplates.CAJERO) };
}

export function adaptEmployeeFromBackend(dto = {}) {
  const role = dto.Rol ?? dto.role ?? 'CAJERO';
  const rawPermissions = dto.Permisos ?? dto.permissions ?? {};
  const permissions = Object.fromEntries(permissionKeys.map((key) => [key, asBool(rawPermissions[key])]));
  const audits = (dto.Bitacora ?? dto.Auditoria ?? dto.AuditLog ?? []).map((item) => ({
    id: item.IdAuditoria ?? item.id ?? null,
    action: item.Accion ?? item.action ?? '',
    description: item.Descripcion ?? item.Detalle ?? item.description ?? '',
    date: item.Fecha ?? item.date ?? '',
    critical: asBool(item.EsCritica ?? item.Critica ?? item.critical),
  }));
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthlyCriticalActions = audits.filter((item) => {
    const date = new Date(item.date);
    return item.critical && date >= monthStart;
  }).length;

  return {
    id: dto.IdUsuario ?? dto.id ?? null,
    name: dto.NombreCompleto ?? dto.Nombre ?? dto.name ?? '',
    email: dto.Email ?? dto.Correo ?? dto.email ?? '',
    phone: dto.Telefono ?? dto.phone ?? '',
    role,
    shift: dto.Turno ?? dto.shift ?? 'MIXTO',
    hasPin: asBool(dto.TienePin ?? dto.HasPin ?? dto.hasPin ?? dto.PinAutorizacion),
    authorizationPin: String(dto.PinAutorizacion ?? dto.authorizationPin ?? ''),
    permissions,
    lastAccess: dto.UltimoAcceso ?? dto.lastAccess ?? null,
    monthlySales: asNumber(dto.VentasRealizadasMes ?? dto.monthlySales),
    monthlyTickets: asNumber(dto.TicketsMes ?? dto.monthlyTickets),
    status: (dto.Estatus ?? dto.status) === true ? 1 : Number(dto.Estatus ?? dto.status) === 1 ? 1 : 0,
    auditLog: audits,
    monthlyCriticalActions,
  };
}

export function adaptEmployeeToBackend(employee = {}) {
  const dto = {
    IdUsuario: employee.id ?? 0,
    NombreCompleto: String(employee.name ?? '').trim(),
    Email: String(employee.email ?? '').trim(),
    Telefono: String(employee.phone ?? '').trim(),
    Rol: employee.role ?? 'CAJERO',
    Turno: employee.shift ?? 'MIXTO',
    Permisos: Object.fromEntries(permissionKeys.map((key) => [key, asBool(employee.permissions?.[key])])),
    Estatus: (employee.status ?? 1) === true ? 1 : Number(employee.status ?? 1) === 1 ? 1 : 0,
  };
  const password = String(employee.password ?? '');
  const pin = String(employee.authorizationPin ?? '');
  if (password) dto.Contrasena = password;
  if (pin) dto.PinAutorizacion = pin;
  return dto;
}
