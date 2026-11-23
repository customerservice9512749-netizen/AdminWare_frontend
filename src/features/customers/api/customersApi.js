const dateOffset = (days, hour = 11) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

const ticket = (id, days, total, paymentMethod, products) => ({
  IdVenta: id,
  Folio: `V-${String(31000 + id).padStart(6, '0')}`,
  FechaVenta: dateOffset(days),
  MontoTotal: total,
  MetodoPago: paymentMethod,
  Estatus: 'Completada',
  Productos: products,
});

const payment = (id, days, amount, method) => ({
  IdAbono: id,
  Fecha: dateOffset(days, 14),
  Monto: amount,
  MetodoPago: method,
  Referencia: `AB-${String(id).padStart(5, '0')}`,
});

let customers = [
  {
    IdCliente: 1, Nombre: 'Público General', Negocio: '', TipoCliente: 'PUBLICO_GENERAL',
    Telefono: '', Correo: '', RFC: '', CreditoActivo: false, LimiteCredito: 0,
    SaldoPendiente: 0, TotalHistorico: 0, TotalTickets: 0, UltimaVisita: null, Estatus: 1,
    HistorialTickets: [], ProductosMasComprados: [], HistorialAbonos: [],
  },
  {
    IdCliente: 2, Nombre: 'Javier Ramírez', Negocio: 'Taquería Los Compadres', TipoCliente: 'MAYORISTA',
    Telefono: '55 4208 7190', Correo: 'compras@taquerialoscompadres.mx', RFC: 'TLC1908237P2',
    CreditoActivo: true, LimiteCredito: 25000, SaldoPendiente: 6800, TotalHistorico: 338450,
    TotalTickets: 176, UltimaVisita: dateOffset(0), Estatus: 1,
    HistorialTickets: [
      ticket(2201, 0, 3850, 'Crédito', [{ NombreProducto: 'Tomate Saladette', Cantidad: 24, Unidad: 'kg' }, { NombreProducto: 'Cilantro', Cantidad: 10, Unidad: 'pzas' }]),
      ticket(2190, 3, 4120, 'Crédito', [{ NombreProducto: 'Aguacate Hass', Cantidad: 18, Unidad: 'kg' }, { NombreProducto: 'Limón Colima', Cantidad: 20, Unidad: 'kg' }]),
      ticket(2174, 8, 2890, 'Crédito', [{ NombreProducto: 'Tomate Saladette', Cantidad: 20, Unidad: 'kg' }, { NombreProducto: 'Cilantro', Cantidad: 8, Unidad: 'pzas' }]),
      ticket(2150, 38, 3650, 'Crédito', [{ NombreProducto: 'Plátano Chiapas', Cantidad: 16, Unidad: 'kg' }]),
    ],
    ProductosMasComprados: [
      { NombreProducto: 'Tomate Saladette', Cantidad: 845, Unidad: 'kg', Total: 15632.5 },
      { NombreProducto: 'Limón Colima', Cantidad: 620, Unidad: 'kg', Total: 13020 },
      { NombreProducto: 'Cilantro', Cantidad: 320, Unidad: 'pzas', Total: 1440 },
    ],
    HistorialAbonos: [payment(501, 2, 5000, 'Transferencia'), payment(488, 12, 3500, 'Efectivo'), payment(467, 26, 4200, 'Transferencia')],
  },
  {
    IdCliente: 3, Nombre: 'Martha Elena Ruiz', Negocio: '', TipoCliente: 'FRECUENTE',
    Telefono: '55 3190 6021', Correo: 'martha.ruiz@email.mx', RFC: '',
    CreditoActivo: true, LimiteCredito: 5000, SaldoPendiente: 1250, TotalHistorico: 48620,
    TotalTickets: 92, UltimaVisita: dateOffset(1), Estatus: 1,
    HistorialTickets: [
      ticket(2200, 1, 423.5, 'Tarjeta', [{ NombreProducto: 'Manzana Gala', Cantidad: 2, Unidad: 'kg' }, { NombreProducto: 'Aguacate Hass', Cantidad: 1, Unidad: 'kg' }]),
      ticket(2180, 5, 689, 'Efectivo', [{ NombreProducto: 'Plátano Chiapas', Cantidad: 3, Unidad: 'kg' }]),
      ticket(2160, 36, 512, 'Efectivo', [{ NombreProducto: 'Manzana Gala', Cantidad: 2.5, Unidad: 'kg' }]),
    ],
    ProductosMasComprados: [
      { NombreProducto: 'Manzana Gala', Cantidad: 112, Unidad: 'kg', Total: 3584 },
      { NombreProducto: 'Aguacate Hass', Cantidad: 48, Unidad: 'kg', Total: 2016 },
      { NombreProducto: 'Plátano Chiapas', Cantidad: 44, Unidad: 'kg', Total: 704 },
    ],
    HistorialAbonos: [payment(502, 7, 900, 'Efectivo'), payment(476, 24, 1200, 'Tarjeta')],
  },
  {
    IdCliente: 4, Nombre: 'Paola Jiménez', Negocio: 'Jugos y Licuados El Sol', TipoCliente: 'MAYORISTA',
    Telefono: '55 7682 0403', Correo: 'administracion@jugoselsol.mx', RFC: 'JES2106168D4',
    CreditoActivo: true, LimiteCredito: 15000, SaldoPendiente: 8500, TotalHistorico: 215780,
    TotalTickets: 124, UltimaVisita: dateOffset(0), Estatus: 1,
    HistorialTickets: [
      ticket(2199, 0, 2680, 'Crédito', [{ NombreProducto: 'Naranja Valencia', Cantidad: 30, Unidad: 'kg' }, { NombreProducto: 'Plátano Chiapas', Cantidad: 16, Unidad: 'kg' }]),
      ticket(2186, 4, 3120, 'Crédito', [{ NombreProducto: 'Manzana Gala', Cantidad: 18, Unidad: 'kg' }, { NombreProducto: 'Limón Colima', Cantidad: 10, Unidad: 'kg' }]),
      ticket(2144, 42, 2890, 'Crédito', [{ NombreProducto: 'Plátano Chiapas', Cantidad: 20, Unidad: 'kg' }]),
    ],
    ProductosMasComprados: [
      { NombreProducto: 'Naranja Valencia', Cantidad: 980, Unidad: 'kg', Total: 20580 },
      { NombreProducto: 'Plátano Chiapas', Cantidad: 540, Unidad: 'kg', Total: 8640 },
      { NombreProducto: 'Manzana Gala', Cantidad: 315, Unidad: 'kg', Total: 10080 },
    ],
    HistorialAbonos: [payment(503, 5, 3000, 'Transferencia'), payment(479, 19, 5000, 'Transferencia')],
  },
  {
    IdCliente: 5, Nombre: 'Miguel Ángel Soto', Negocio: 'Mariscos La Bahía', TipoCliente: 'MAYORISTA',
    Telefono: '55 6125 8420', Correo: 'm.soto@mariscosbahia.mx', RFC: 'MLB180402P32',
    CreditoActivo: true, LimiteCredito: 35000, SaldoPendiente: 17400, TotalHistorico: 492300,
    TotalTickets: 230, UltimaVisita: dateOffset(2), Estatus: 1,
    HistorialTickets: [
      ticket(2191, 2, 6430, 'Crédito', [{ NombreProducto: 'Limón Colima', Cantidad: 35, Unidad: 'kg' }, { NombreProducto: 'Cilantro', Cantidad: 16, Unidad: 'pzas' }]),
      ticket(2178, 6, 5740, 'Crédito', [{ NombreProducto: 'Limón Colima', Cantidad: 30, Unidad: 'kg' }, { NombreProducto: 'Tomate Saladette', Cantidad: 20, Unidad: 'kg' }]),
      ticket(2128, 44, 6980, 'Crédito', [{ NombreProducto: 'Limón Colima', Cantidad: 32, Unidad: 'kg' }]),
    ],
    ProductosMasComprados: [
      { NombreProducto: 'Limón Colima', Cantidad: 1620, Unidad: 'kg', Total: 34020 },
      { NombreProducto: 'Cilantro', Cantidad: 440, Unidad: 'pzas', Total: 1980 },
      { NombreProducto: 'Tomate Saladette', Cantidad: 380, Unidad: 'kg', Total: 7030 },
    ],
    HistorialAbonos: [payment(504, 3, 7500, 'Transferencia'), payment(481, 18, 6500, 'Transferencia')],
  },
  {
    IdCliente: 6, Nombre: 'Carlos Mendoza', Negocio: '', TipoCliente: 'FRECUENTE',
    Telefono: '55 4512 9093', Correo: 'carlos.mendoza@email.mx', RFC: '',
    CreditoActivo: false, LimiteCredito: 0, SaldoPendiente: 0, TotalHistorico: 27480,
    TotalTickets: 61, UltimaVisita: dateOffset(3), Estatus: 1,
    HistorialTickets: [
      ticket(2184, 3, 785, 'Tarjeta', [{ NombreProducto: 'Aguacate Hass', Cantidad: 2, Unidad: 'kg' }, { NombreProducto: 'Manzana Gala', Cantidad: 3, Unidad: 'kg' }]),
      ticket(2168, 9, 642, 'Efectivo', [{ NombreProducto: 'Tomate Saladette', Cantidad: 2, Unidad: 'kg' }]),
      ticket(2148, 39, 520, 'Tarjeta', [{ NombreProducto: 'Plátano Chiapas', Cantidad: 2, Unidad: 'kg' }]),
    ],
    ProductosMasComprados: [
      { NombreProducto: 'Aguacate Hass', Cantidad: 78, Unidad: 'kg', Total: 3276 },
      { NombreProducto: 'Manzana Gala', Cantidad: 65, Unidad: 'kg', Total: 2080 },
    ],
    HistorialAbonos: [],
  },
];

let nextCustomerId = 7;
let nextPaymentId = 505;
const clone = (value) => structuredClone(value);

export async function getCustomers() {
  return clone(customers);
}

export async function createCustomer(customer) {
  const created = {
    ...clone(customer),
    IdCliente: nextCustomerId,
    SaldoPendiente: 0,
    TotalHistorico: 0,
    TotalTickets: 0,
    UltimaVisita: null,
    HistorialTickets: [],
    ProductosMasComprados: [],
    HistorialAbonos: [],
  };
  nextCustomerId += 1;
  customers = [created, ...customers];
  return clone(created);
}

export async function updateCustomer(id, customer) {
  const index = customers.findIndex((item) => String(item.IdCliente) === String(id));
  if (index < 0) throw new Error('No se encontró el cliente que deseas actualizar.');
  const updated = { ...customers[index], ...clone(customer), IdCliente: customers[index].IdCliente };
  customers = customers.map((item, itemIndex) => itemIndex === index ? updated : item);
  return clone(updated);
}

export async function toggleCustomerStatus(id) {
  const customer = customers.find((item) => String(item.IdCliente) === String(id));
  if (!customer) throw new Error('No se encontró el cliente seleccionado.');
  customer.Estatus = Number(customer.Estatus) === 1 ? 0 : 1;
  return clone(customer);
}

export async function registerCustomerPayment(id, amount, paymentMethod) {
  const customer = customers.find((item) => String(item.IdCliente) === String(id));
  if (!customer) throw new Error('No se encontró el cliente seleccionado.');
  if (!customer.CreditoActivo) throw new Error('El cliente no tiene una línea de crédito activa.');
  const paymentAmount = Number(amount);
  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) throw new Error('El abono debe ser mayor a cero.');
  if (paymentAmount > Number(customer.SaldoPendiente)) throw new Error('El abono no puede superar el saldo pendiente.');

  const newPayment = {
    IdAbono: nextPaymentId,
    Fecha: new Date().toISOString(),
    Monto: paymentAmount,
    MetodoPago: paymentMethod,
    Referencia: `AB-${String(nextPaymentId).padStart(5, '0')}`,
  };
  nextPaymentId += 1;
  customer.SaldoPendiente = Number((Number(customer.SaldoPendiente) - paymentAmount).toFixed(2));
  customer.HistorialAbonos = [newPayment, ...(customer.HistorialAbonos ?? [])];
  return clone(customer);
}
