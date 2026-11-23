const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStatus = (value) => value === true || value === 'true' ? 1 : Number(value) === 1 ? 1 : 0;

export function adaptSupplierFromBackend(dto = {}) {
  const deliveries = (dto.HistorialEntregas ?? dto.Entregas ?? []).map((item) => ({
    id: item.IdEntrega ?? item.id ?? null,
    folio: item.Folio ?? item.folio ?? '',
    date: item.Fecha ?? item.FechaEntrega ?? item.date ?? '',
    amount: toNumber(item.Monto ?? item.Total ?? item.amount),
    status: item.Estatus ?? item.status ?? 'Recibida',
  }));
  const suppliedProducts = (dto.ProductosAsociados ?? dto.ProductosSurtidos ?? dto.products ?? []).map((item) => ({
    productId: item.IdProducto ?? item.productId ?? item.id ?? null,
    name: item.NombreProducto ?? item.Nombre ?? item.name ?? '',
    category: item.Categoria ?? item.category ?? '',
    lastCost: toNumber(item.UltimoCosto ?? item.CostoUnitario ?? item.lastCost ?? item.Costo),
    unit: item.Unidad ?? item.unit ?? '',
  }));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyDeliveriesTotal = deliveries.reduce((total, item) => {
    const deliveryDate = new Date(item.date);
    return deliveryDate >= monthStart ? total + item.amount : total;
  }, 0);

  return {
    id: dto.IdProveedor ?? dto.id ?? null,
    commercialName: dto.NombreComercial ?? dto.commercialName ?? '',
    businessName: dto.RazonSocial ?? dto.businessName ?? '',
    taxId: dto.RFC ?? dto.taxId ?? '',
    contactName: dto.Contacto ?? dto.NombreContacto ?? dto.contactName ?? '',
    phone: dto.Telefono ?? dto.phone ?? '',
    email: dto.Correo ?? dto.Email ?? dto.email ?? '',
    category: dto.Categoria ?? dto.CategoriaPrincipal ?? dto.category ?? 'General',
    deliveryDays: Array.isArray(dto.DiasSurtido ?? dto.DiasEntrega ?? dto.deliveryDays)
      ? [...(dto.DiasSurtido ?? dto.DiasEntrega ?? dto.deliveryDays)]
      : [],
    paymentTerms: dto.CondicionPago ?? dto.paymentTerms ?? 'CONTADO',
    pendingBalance: toNumber(dto.SaldoPendiente ?? dto.pendingBalance),
    status: normalizeStatus(dto.Estatus ?? dto.status),
    products: suppliedProducts,
    deliveries,
    monthlyPurchases: dto.ComprasMes != null || dto.monthlyPurchases != null
      ? toNumber(dto.ComprasMes ?? dto.monthlyPurchases)
      : monthlyDeliveriesTotal,
  };
}

export function adaptSupplierToBackend(supplier = {}) {
  return {
    IdProveedor: supplier.id ?? 0,
    NombreComercial: String(supplier.commercialName ?? '').trim(),
    RazonSocial: String(supplier.businessName ?? '').trim(),
    RFC: String(supplier.taxId ?? '').trim().toUpperCase(),
    Contacto: String(supplier.contactName ?? '').trim(),
    Telefono: String(supplier.phone ?? '').trim(),
    Correo: String(supplier.email ?? '').trim(),
    Categoria: String(supplier.category ?? 'General'),
    DiasSurtido: Array.isArray(supplier.deliveryDays) ? [...supplier.deliveryDays] : [],
    CondicionPago: supplier.paymentTerms ?? 'CONTADO',
    SaldoPendiente: toNumber(supplier.pendingBalance),
    Estatus: normalizeStatus(supplier.status ?? 1),
    ProductosAsociados: (supplier.products ?? []).map((product) => ({
      IdProducto: product.productId ?? product.id ?? null,
      NombreProducto: product.name ?? '',
      Categoria: product.category ?? '',
      UltimoCosto: toNumber(product.lastCost ?? product.costPrice ?? product.salePrice),
      Unidad: product.unit ?? '',
    })),
    ComprasMes: toNumber(supplier.monthlyPurchases),
  };
}
