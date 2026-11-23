const dateOffset = (days, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

const permissionsByRole = {
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

const auditEntry = (id, days, action, detail, critical = true) => ({
  IdAuditoria: id,
  Accion: action,
  Descripcion: detail,
  Fecha: dateOffset(days, 10 + (id % 8)),
  EsCritica: critical,
});

let employees = [
  {
    IdUsuario: 1, NombreCompleto: 'Santiago Lizárraga', Email: 'santiago@adminware.mx',
    Telefono: '667 183 2040', Rol: 'ADMIN', Turno: 'MIXTO', PinAutorizacion: '7391',
    TienePin: true, Permisos: permissionsByRole.ADMIN, UltimoAcceso: dateOffset(0, 8),
    VentasRealizadasMes: 148260, TicketsMes: 184, Estatus: 1,
    Bitacora: [
      auditEntry(1001, 0, 'Actualización de precios', 'Actualizó precios de temporada.', true),
      auditEntry(1002, 1, 'Alta de usuario', 'Registró un nuevo cajero.', true),
      auditEntry(1003, 3, 'Inicio de sesión', 'Acceso al panel administrativo.', false),
      auditEntry(1004, 8, 'Ajuste de permisos', 'Actualizó permisos de un usuario.', true),
    ],
  },
  {
    IdUsuario: 2, NombreCompleto: 'Laura Sánchez', Email: 'laura.sanchez@adminware.mx',
    Telefono: '667 210 4438', Rol: 'ENCARGADO', Turno: 'MATUTINO', PinAutorizacion: '3148',
    TienePin: true, Permisos: permissionsByRole.ENCARGADO, UltimoAcceso: dateOffset(0, 6),
    VentasRealizadasMes: 96840, TicketsMes: 126, Estatus: 1,
    Bitacora: [
      auditEntry(2001, 0, 'Cancelación de venta', 'Canceló ticket V-031945 por error de captura.', true),
      auditEntry(2002, 2, 'Registro de merma', 'Registró merma de producto fresco.', true),
      auditEntry(2003, 4, 'Inicio de sesión', 'Acceso al punto de venta.', false),
    ],
  },
  {
    IdUsuario: 3, NombreCompleto: 'Carlos Ramírez', Email: 'carlos.ramirez@adminware.mx',
    Telefono: '667 340 0128', Rol: 'CAJERO', Turno: 'MATUTINO', PinAutorizacion: '5812',
    TienePin: true, Permisos: permissionsByRole.CAJERO, UltimoAcceso: dateOffset(0, 7),
    VentasRealizadasMes: 325420, TicketsMes: 942, Estatus: 1,
    Bitacora: [
      auditEntry(3001, 0, 'Venta registrada', 'Cierre de ticket V-032201.', false),
      auditEntry(3002, 1, 'Venta registrada', 'Cierre de ticket V-032166.', false),
      auditEntry(3003, 5, 'Inicio de sesión', 'Acceso al punto de venta.', false),
    ],
  },
  {
    IdUsuario: 4, NombreCompleto: 'Sofía Méndez', Email: 'sofia.mendez@adminware.mx',
    Telefono: '667 592 1870', Rol: 'CAJERO', Turno: 'VESPERTINO', PinAutorizacion: '9064',
    TienePin: true, Permisos: permissionsByRole.CAJERO, UltimoAcceso: dateOffset(1, 15),
    VentasRealizadasMes: 251830, TicketsMes: 716, Estatus: 1,
    Bitacora: [
      auditEntry(4001, 1, 'Venta registrada', 'Cierre de ticket V-032145.', false),
      auditEntry(4002, 2, 'Inicio de sesión', 'Acceso al punto de venta.', false),
      auditEntry(4003, 7, 'Venta registrada', 'Cierre de ticket V-031940.', false),
    ],
  },
  {
    IdUsuario: 5, NombreCompleto: 'Jorge Hernández', Email: 'jorge.hernandez@adminware.mx',
    Telefono: '667 219 7750', Rol: 'ALMACENISTA', Turno: 'MATUTINO', PinAutorizacion: '',
    TienePin: false, Permisos: permissionsByRole.ALMACENISTA, UltimoAcceso: dateOffset(2, 7),
    VentasRealizadasMes: 0, TicketsMes: 0, Estatus: 1,
    Bitacora: [
      auditEntry(5001, 0, 'Recepción de mercancía', 'Registró entrada de fruta de temporada.', true),
      auditEntry(5002, 2, 'Registro de merma', 'Actualizó merma por producto dañado.', true),
      auditEntry(5003, 6, 'Inicio de sesión', 'Acceso al módulo de inventario.', false),
    ],
  },
];

let nextEmployeeId = 6;
let nextAuditId = 6000;
const clone = (value) => structuredClone(value);

function recordAudit(employee, action, description, critical = true) {
  employee.Bitacora = [
    {
      IdAuditoria: nextAuditId,
      Accion: action,
      Descripcion: description,
      Fecha: new Date().toISOString(),
      EsCritica: critical,
    },
    ...(employee.Bitacora ?? []),
  ];
  nextAuditId += 1;
}

function findEmployee(id) {
  const employee = employees.find((item) => String(item.IdUsuario) === String(id));
  if (!employee) throw new Error('No se encontró el empleado seleccionado.');
  return employee;
}

export async function getEmployees() {
  return clone(employees);
}

export async function createEmployee(employeeData) {
  const { Contrasena, ...safeData } = employeeData;
  if (!Contrasena || String(Contrasena).length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
  const employee = {
    ...clone(safeData),
    IdUsuario: nextEmployeeId,
    TienePin: Boolean(safeData.PinAutorizacion),
    UltimoAcceso: null,
    VentasRealizadasMes: 0,
    TicketsMes: 0,
    Estatus: safeData.Estatus ?? 1,
    Bitacora: [],
  };
  nextEmployeeId += 1;
  recordAudit(employee, 'Alta de empleado', `Se creó la cuenta de ${employee.NombreCompleto}.`);
  employees = [employee, ...employees];
  return clone(employee);
}

export async function updateEmployee(id, employeeData) {
  const employee = findEmployee(id);
  const { Contrasena, ...safeData } = employeeData;
  if (Contrasena && String(Contrasena).length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
  Object.assign(employee, clone(safeData), { IdUsuario: employee.IdUsuario });
  if (Object.prototype.hasOwnProperty.call(safeData, 'PinAutorizacion')) employee.TienePin = Boolean(safeData.PinAutorizacion);
  if (Contrasena) recordAudit(employee, 'Actualización de contraseña', 'Se actualizó la contraseña del empleado.');
  recordAudit(employee, 'Actualización de perfil', 'Se actualizaron los datos del empleado.', false);
  return clone(employee);
}

export async function toggleEmployeeStatus(id) {
  const employee = findEmployee(id);
  employee.Estatus = Number(employee.Estatus) === 1 ? 0 : 1;
  recordAudit(employee, 'Cambio de estatus', `Cuenta ${employee.Estatus ? 'activada' : 'desactivada'}.`);
  return clone(employee);
}

export async function updateEmployeePermissions(id, updatedPermissions) {
  const employee = findEmployee(id);
  const permissions = { ...employee.Permisos, ...clone(updatedPermissions) };
  const changedKeys = Object.keys(updatedPermissions).filter((key) => employee.Permisos[key] !== permissions[key]);
  if (changedKeys.length) {
    employee.Permisos = permissions;
    recordAudit(employee, 'Ajuste de permisos', `Permisos modificados: ${changedKeys.join(', ')}.`);
  }
  return clone(employee);
}

export async function resetEmployeePin(id, newPin) {
  if (!/^\d{4}$/.test(String(newPin))) throw new Error('El PIN debe contener exactamente 4 dígitos.');
  const employee = findEmployee(id);
  employee.PinAutorizacion = String(newPin);
  employee.TienePin = true;
  recordAudit(employee, 'Restablecimiento de PIN', 'Se generó un nuevo PIN de autorización.');
  return clone(employee);
}
