const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toBoolean = (value) => value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
const dateValue = (value) => value ?? null;

export function adaptCustomerFromBackend(dto = {}) {
  const tickets = (dto.HistorialTickets ?? dto.Tickets ?? []).map((item) => ({
    id: item.IdVenta ?? item.id ?? null,
    folio: item.Folio ?? item.folio ?? '',
    date: item.FechaVenta ?? item.Fecha ?? item.date ?? '',
    total: toNumber(item.MontoTotal ?? item.Total ?? item.total),
    paymentMethod: item.MetodoPago ?? item.paymentMethod ?? '',
    status: item.Estatus ?? item.status ?? 'Completada',
    products: (item.Productos ?? item.DetallesVenta ?? []).map((product) => ({
      name: product.NombreProducto ?? product.name ?? '',
      quantity: toNumber(product.Cantidad ?? product.quantity),
      unit: product.Unidad ?? product.UnidadMedida ?? product.unit ?? '',
    })),
  }));
  const topProducts = (dto.ProductosMasComprados ?? dto.ProductosFrecuentes ?? []).map((product) => ({
    name: product.NombreProducto ?? product.Nombre ?? product.name ?? '',
    quantity: toNumber(product.Cantidad ?? product.quantity),
    unit: product.Unidad ?? product.UnidadMedida ?? product.unit ?? '',
    total: toNumber(product.Total ?? product.MontoTotal ?? product.total),
  }));
  const payments = (dto.HistorialAbonos ?? dto.Abonos ?? []).map((item) => ({
    id: item.IdAbono ?? item.id ?? null,
    date: item.Fecha ?? item.FechaAbono ?? item.date ?? '',
    amount: toNumber(item.Monto ?? item.MontoAbono ?? item.amount),
    method: item.MetodoPago ?? item.paymentMethod ?? '',
    reference: item.Referencia ?? item.Folio ?? item.reference ?? '',
  }));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlySalesFromTickets = tickets.reduce((total, item) => {
    const saleDate = new Date(item.date);
    return saleDate >= monthStart && item.status !== 'Cancelada' ? total + item.total : total;
  }, 0);

  return {
    id: dto.IdCliente ?? dto.id ?? null,
    name: dto.NombreCompleto ?? dto.Nombre ?? dto.name ?? '',
    businessName: dto.NombreNegocio ?? dto.Negocio ?? dto.businessName ?? '',
    type: dto.TipoCliente ?? dto.type ?? 'FRECUENTE',
    phone: dto.Telefono ?? dto.phone ?? '',
    email: dto.Correo ?? dto.Email ?? dto.email ?? '',
    taxId: dto.RFC ?? dto.taxId ?? '',
    creditActive: toBoolean(dto.CreditoActivo ?? dto.TieneCredito ?? dto.creditActive),
    creditLimit: toNumber(dto.LimiteCredito ?? dto.creditLimit),
    pendingBalance: toNumber(dto.SaldoPendiente ?? dto.SaldoActual ?? dto.pendingBalance),
    totalPurchased: toNumber(dto.TotalHistorico ?? dto.TotalComprado ?? dto.TotalCompras ?? dto.totalPurchased),
    ticketCount: toNumber(dto.TotalTickets ?? dto.ConteoTickets ?? dto.ticketCount),
    lastPurchase: dateValue(dto.UltimaVisita ?? dto.UltimaCompra ?? dto.lastPurchase),
    status: (dto.Estatus ?? dto.status) === true ? 1 : Number(dto.Estatus ?? dto.status) === 1 ? 1 : 0,
    tickets,
    topProducts,
    payments,
    monthlySales: dto.VentasMes != null || dto.monthlySales != null
      ? toNumber(dto.VentasMes ?? dto.monthlySales)
      : monthlySalesFromTickets,
  };
}

export function adaptCustomerToBackend(customer = {}) {
  return {
    IdCliente: customer.id ?? 0,
    Nombre: String(customer.name ?? '').trim(),
    Negocio: String(customer.businessName ?? '').trim(),
    TipoCliente: customer.type ?? 'FRECUENTE',
    Telefono: String(customer.phone ?? '').trim(),
    Correo: String(customer.email ?? '').trim(),
    RFC: String(customer.taxId ?? '').trim().toUpperCase(),
    CreditoActivo: toBoolean(customer.creditActive),
    LimiteCredito: toNumber(customer.creditLimit),
    SaldoPendiente: toNumber(customer.pendingBalance),
    Estatus: (customer.status ?? 1) === true ? 1 : Number(customer.status ?? 1) === 1 ? 1 : 0,
  };
}
