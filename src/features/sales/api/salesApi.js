const daysAgo = (days, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

const createSale = (id, days, payment, status, total, options = {}) => {
  const subtotal = Number((total / 1.16).toFixed(2));
  const tax = Number((total - subtotal).toFixed(2));
  const quantity = options.quantity ?? 1;
  const itemName = options.itemName ?? 'Venta de mostrador';

  return {
    IdVenta: id,
    Folio: `V-${String(26000 + id).padStart(6, '0')}`,
    FechaVenta: daysAgo(days, 9 + (id % 10)),
    MontoTotal: total,
    MetodoPago: payment,
    Estatus: status === 'Cancelada' ? 0 : status === 'Pago Parcial' ? 2 : 1,
    NombreCajero: options.cashier ?? ['Ana García', 'Luis Torres', 'María López'][id % 3],
    NombreCliente: options.customer ?? ['Público general', 'Comercial del Norte', 'Cliente frecuente'][id % 3],
    IdUsuarioAuditoria: 100 + (id % 3),
    UsuarioAuditoria: options.cashier ?? ['Ana García', 'Luis Torres', 'María López'][id % 3],
    Subtotal: subtotal,
    IVA: tax,
    PagoRecibido: options.montoPagado ?? (payment === 'Efectivo' ? Math.ceil(total / 100) * 100 : total),
    MontoPagado: status === 'Cancelada' ? 0 : options.montoPagado ?? total,
    SaldoPendiente: status === 'Pago Parcial' ? Number((total - options.montoPagado).toFixed(2)) : 0,
    HistorialAbonos: options.historialAbonos ?? (status === 'Pago Parcial' ? [{
      Fecha: daysAgo(days, 9 + (id % 10)),
      Monto: options.montoPagado,
      MetodoPago: payment,
      Cajero: options.cashier ?? ['Ana García', 'Luis Torres', 'María López'][id % 3],
    }] : []),
    Cambio: status === 'Pago Parcial' || payment !== 'Efectivo' ? 0 : Number((Math.ceil(total / 100) * 100 - total).toFixed(2)),
    MotivoCancelacion: status === 'Cancelada' ? 'Solicitud de corrección del cliente' : '',
    DetallesVenta: [{
      IdProducto: 500 + id,
      NombreProducto: itemName,
      Cantidad: quantity,
      UnidadMedida: options.unit ?? 'PZA',
      PrecioUnitario: Number((subtotal / quantity).toFixed(2)),
      Subtotal: subtotal,
      TasaIVA: 0.16,
      IVA: tax,
      Total: total,
    }],
    Trazabilidad: status === 'Cancelada'
      ? [{
        Accion: 'Venta cancelada',
        Usuario: 'Supervisor de turno',
        Fecha: daysAgo(days, 11 + (id % 8)),
        Motivo: 'Solicitud de corrección del cliente',
      }]
      : [{
        Accion: 'Venta creada',
        Usuario: options.cashier ?? ['Ana García', 'Luis Torres', 'María López'][id % 3],
        Fecha: daysAgo(days, 9 + (id % 10)),
        Motivo: '',
      }],
  };
};

let simulatedSales = [
  createSale(1, 0, 'Efectivo', 'Completada', 1285.40, { itemName: 'Canasta de abarrotes', quantity: 2 }),
  createSale(2, 0, 'Tarjeta', 'Completada', 742.00, { itemName: 'Aceite vegetal 1 L', quantity: 4 }),
  createSale(3, 1, 'Efectivo', 'Completada', 389.50, { itemName: 'Fruta de temporada', quantity: 1.25, unit: 'KG' }),
  createSale(4, 1, 'Tarjeta', 'Cancelada', 1599.00, { itemName: 'Licuadora 10 velocidades' }),
  createSale(5, 2, 'Tarjeta', 'Completada', 2140.00, { itemName: 'Despensa semanal' }),
  createSale(6, 3, 'Efectivo', 'Completada', 276.00, { itemName: 'Lácteos y panadería' }),
  createSale(7, 4, 'Tarjeta', 'Completada', 945.80, { itemName: 'Productos de limpieza' }),
  createSale(8, 6, 'Efectivo', 'Cancelada', 425.00, { itemName: 'Compra de mostrador' }),
  createSale(9, 8, 'Tarjeta', 'Completada', 1820.00, { itemName: 'Despensa familiar' }),
  createSale(10, 12, 'Efectivo', 'Completada', 618.50, { itemName: 'Carnes y verduras' }),
  createSale(11, 18, 'Tarjeta', 'Completada', 3105.00, { itemName: 'Compra mayorista', quantity: 3 }),
  createSale(12, 27, 'Efectivo', 'Completada', 532.00, { itemName: 'Abarrotes varios' }),
  createSale(13, 0, 'Efectivo', 'Pago Parcial', 200000.00, {
    itemName: 'Pedido mayorista de abarrotes',
    customer: 'Comercial del Norte',
    cashier: 'Ana García',
    montoPagado: 80000.00,
  }),
  createSale(14, 2, 'Tarjeta', 'Pago Parcial', 12500.00, {
    itemName: 'Equipo de refrigeración',
    customer: 'Restaurante La Esquina',
    cashier: 'Luis Torres',
    montoPagado: 5000.00,
  }),
];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Simula GET /sales con DTOs C# para que el módulo funcione sin un servidor conectado.
export async function getSalesHistory() {
  await wait(180);
  return simulatedSales.map((sale) => structuredClone(sale));
}

// Simula PATCH /sales/{id}/cancel y conserva la actualización durante la sesión.
export async function cancelSaleRequest(id, reason) {
  await wait(120);
  const sale = simulatedSales.find((item) => item.IdVenta === id);
  if (!sale) throw new Error('No se encontró la venta que deseas cancelar.');
  if (sale.Estatus === 0 || sale.Estatus === 'Cancelada') throw new Error('Esta venta ya está cancelada.');

  const now = new Date().toISOString();
  sale.Estatus = 0;
  sale.MotivoCancelacion = reason;
  sale.Trazabilidad = [
    ...(sale.Trazabilidad ?? []),
    { Accion: 'Venta cancelada', Usuario: 'Usuario actual', Fecha: now, Motivo: reason },
  ];
  return structuredClone(sale);
}

export async function registerInstallmentPaymentRequest(id, amount, paymentMethod) {
  await wait(120);
  const sale = simulatedSales.find((item) => item.IdVenta === id);
  if (!sale) throw new Error('No se encontró la venta que deseas abonar.');
  if (sale.Estatus === 0 || sale.Estatus === 'Cancelada') throw new Error('No se puede abonar una venta cancelada.');

  const installment = Number(amount);
  if (!Number.isFinite(installment) || installment <= 0) throw new Error('El monto del abono debe ser mayor que cero.');
  if (!['Efectivo', 'Tarjeta'].includes(paymentMethod)) throw new Error('Selecciona un método de pago válido.');

  const balance = Number(sale.SaldoPendiente ?? 0);
  const roundedAmount = Number(installment.toFixed(2));
  if (roundedAmount <= 0) throw new Error('El monto del abono debe ser mayor que cero.');
  if (roundedAmount > balance) throw new Error('El abono no puede ser mayor que el saldo pendiente.');

  const paid = Number((Number(sale.MontoPagado ?? 0) + roundedAmount).toFixed(2));
  const remaining = Number((balance - roundedAmount).toFixed(2));
  sale.MontoPagado = paid;
  sale.PagoRecibido = paid;
  sale.SaldoPendiente = remaining;
  sale.Estatus = remaining === 0 ? 1 : 2;
  sale.HistorialAbonos = [
    ...(sale.HistorialAbonos ?? []),
    {
      Fecha: new Date().toISOString(),
      Monto: roundedAmount,
      MetodoPago: paymentMethod,
      Cajero: 'Usuario actual',
    },
  ];
  return structuredClone(sale);
}
