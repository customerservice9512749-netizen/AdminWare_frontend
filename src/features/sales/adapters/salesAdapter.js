const asNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeStatus = (status) => {
  const value = String(status ?? 'Completada').trim().toLowerCase();
  if (['0', 'cancelada', 'cancelado', 'cancelled', 'canceled', 'anulada'].includes(value)) return 0;
  if (['2', 'parcial', 'pago parcial', 'pendiente', 'partial'].includes(value)) return 2;
  return 1;
};

const getStatusLabel = (status) => ({
  0: 'Cancelada',
  1: 'Completada',
  2: 'Pago Parcial',
}[status]);

const normalizePaymentMethod = (method) => {
  const value = String(method ?? 'Efectivo').toLowerCase();
  return value.includes('tarjeta') || value.includes('card') ? 'Tarjeta' : 'Efectivo';
};

export function adaptSaleFromBackend(apiData = {}) {
  const details = apiData.DetallesVenta ?? apiData.detalles ?? apiData.items ?? [];
  const audit = apiData.Trazabilidad ?? apiData.AuditTrail ?? apiData.auditTrail ?? [];
  const payments = apiData.HistorialAbonos ?? apiData.historialAbonos ?? [];
  const saleDetails = Array.isArray(details) ? details : [];
  const auditTrail = Array.isArray(audit) ? audit : [];
  const paymentHistory = Array.isArray(payments) ? payments : [];
  const total = asNumber(apiData.MontoTotal ?? apiData.total);
  const initialStatus = normalizeStatus(apiData.Estatus ?? apiData.estatus ?? apiData.status);
  const rawBalance = apiData.SaldoPendiente ?? apiData.saldoPendiente;
  const rawPaid = apiData.MontoPagado ?? apiData.montoPagado;
  const historyTotal = paymentHistory.reduce((sum, entry) => (
    sum + asNumber(entry.Monto ?? entry.monto)
  ), 0);
  const hasRecordedPayment = rawPaid != null || paymentHistory.length > 0;
  const montoPagado = asNumber(
    rawPaid,
    initialStatus === 0
      ? 0
      : paymentHistory.length
        ? historyTotal
        : initialStatus === 2
          ? Math.max(0, total - asNumber(rawBalance))
          : total,
  );
  const inferredBalance = initialStatus === 2 || hasRecordedPayment
    ? Math.max(0, total - montoPagado)
    : 0;
  const saldoPendiente = asNumber(rawBalance, inferredBalance);
  const estatus = initialStatus === 0 ? 0 : saldoPendiente > 0 ? 2 : 1;

  return {
    id: apiData.IdVenta ?? apiData.id ?? null,
    folio: String(apiData.Folio ?? apiData.folio ?? ''),
    date: apiData.FechaVenta ?? apiData.date ?? apiData.fecha ?? '',
    total,
    paymentMethod: normalizePaymentMethod(apiData.MetodoPago ?? apiData.paymentMethod),
    estatus,
    status: getStatusLabel(estatus),
    cashier: apiData.NombreCajero ?? apiData.Cajero ?? apiData.cashier ?? 'Sin asignar',
    customer: apiData.NombreCliente ?? apiData.Cliente ?? apiData.customer ?? 'Público general',
    auditUserId: apiData.IdUsuarioAuditoria ?? apiData.auditUserId ?? null,
    auditUserName: apiData.UsuarioAuditoria ?? apiData.auditUserName ?? apiData.NombreCajero ?? apiData.Cajero ?? 'Sin asignar',
    subtotal: asNumber(apiData.Subtotal ?? apiData.subtotal),
    tax: asNumber(apiData.IVA ?? apiData.Tax ?? apiData.tax),
    montoPagado,
    saldoPendiente,
    historialAbonos: paymentHistory.map((entry) => ({
      fecha: entry.Fecha ?? entry.fecha ?? '',
      monto: asNumber(entry.Monto ?? entry.monto),
      metodoPago: normalizePaymentMethod(entry.MetodoPago ?? entry.metodoPago),
      cajero: entry.Cajero ?? entry.cajero ?? 'Sin asignar',
    })),
    paymentReceived: asNumber(apiData.PagoRecibido ?? apiData.paymentReceived ?? montoPagado),
    change: asNumber(apiData.Cambio ?? apiData.change),
    cancellationReason: apiData.MotivoCancelacion ?? apiData.cancellationReason ?? '',
    details: saleDetails.map((item) => ({
      productId: item.IdProducto ?? item.productId ?? null,
      name: item.NombreProducto ?? item.Nombre ?? item.name ?? 'Artículo',
      quantity: asNumber(item.Cantidad ?? item.quantity, 1),
      unit: String(item.UnidadMedida ?? item.unit ?? 'PZA').toUpperCase(),
      unitPrice: asNumber(item.PrecioUnitario ?? item.unitPrice),
      subtotal: asNumber(item.Subtotal ?? item.subtotal),
      taxRate: asNumber(item.TasaIVA ?? item.taxRate, 0.16),
      tax: asNumber(item.IVA ?? item.Tax ?? item.tax),
      total: asNumber(item.Total ?? item.total),
    })),
    auditTrail: auditTrail.map((entry) => ({
      action: entry.Accion ?? entry.action ?? 'Actualización',
      user: entry.Usuario ?? entry.user ?? 'Sistema',
      date: entry.Fecha ?? entry.date ?? '',
      reason: entry.Motivo ?? entry.reason ?? '',
    })),
  };
}

export function adaptSaleToBackend(formData = {}) {
  const estatus = formData.estatus ?? normalizeStatus(formData.status);
  return {
    IdVenta: formData.id ?? 0,
    Folio: formData.folio ?? '',
    FechaVenta: formData.date ?? new Date().toISOString(),
    MontoTotal: asNumber(formData.total),
    MetodoPago: formData.paymentMethod ?? 'Efectivo',
    Estatus: estatus,
    NombreCajero: formData.cashier ?? '',
    NombreCliente: formData.customer ?? '',
    IdUsuarioAuditoria: formData.auditUserId ?? null,
    UsuarioAuditoria: formData.auditUserName ?? '',
    Subtotal: asNumber(formData.subtotal),
    IVA: asNumber(formData.tax),
    PagoRecibido: asNumber(formData.paymentReceived),
    MontoPagado: asNumber(formData.montoPagado),
    SaldoPendiente: asNumber(formData.saldoPendiente),
    HistorialAbonos: (formData.historialAbonos ?? []).map((entry) => ({
      Fecha: entry.fecha ?? '',
      Monto: asNumber(entry.monto),
      MetodoPago: entry.metodoPago ?? 'Efectivo',
      Cajero: entry.cajero ?? '',
    })),
    Cambio: asNumber(formData.change),
    MotivoCancelacion: formData.cancellationReason ?? '',
    Trazabilidad: (formData.auditTrail ?? []).map((entry) => ({
      Accion: entry.action ?? '',
      Usuario: entry.user ?? '',
      Fecha: entry.date ?? '',
      Motivo: entry.reason ?? '',
    })),
    DetallesVenta: (formData.details ?? []).map((item) => ({
      IdProducto: item.productId ?? null,
      NombreProducto: item.name ?? '',
      Cantidad: asNumber(item.quantity),
      UnidadMedida: item.unit ?? 'PZA',
      PrecioUnitario: asNumber(item.unitPrice),
      Subtotal: asNumber(item.subtotal),
      TasaIVA: asNumber(item.taxRate, 0.16),
      IVA: asNumber(item.tax),
      Total: asNumber(item.total),
    })),
  };
}
