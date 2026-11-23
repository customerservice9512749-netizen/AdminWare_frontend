const numberOrZero = (value) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
};

const isBulkValue = (value) => value === true || value === 1 || value === '1' || value === 'true';

export function adaptInventoryItem(dto = {}) {
  const isBulk = isBulkValue(dto.EsGranel ?? dto.isBulk);
  const stock = numberOrZero(dto.StockActual ?? dto.StockNuevo ?? dto.stockActual ?? dto.stock);
  const minStock = numberOrZero(dto.StockMinimo ?? dto.stockMinimo ?? dto.minStock);
  return {
    id: dto.IdProducto ?? dto.id ?? null,
    name: dto.NombreProducto ?? dto.Nombre ?? dto.name ?? '',
    code: String(dto.CodigoPLU ?? dto.Codigo ?? dto.code ?? dto.plu ?? ''),
    isBulk,
    unit: dto.Unidad ?? dto.unit ?? (isBulk ? 'kg' : 'pzas'),
    category: dto.Categoria ?? dto.NombreCategoria ?? dto.category ?? 'General',
    stock,
    minStock,
    maxStock: numberOrZero(dto.StockMaximo ?? dto.stockMaximo ?? dto.maxStock) || Math.max(minStock * 2, stock),
    unitCost: numberOrZero(dto.CostoUnitario ?? dto.Costo ?? dto.unitCost ?? dto.costPrice),
  };
}

export function adaptKardexMovement(dto = {}) {
  const previousStock = numberOrZero(dto.StockAnterior ?? dto.previousStock);
  const newStock = numberOrZero(dto.StockNuevo ?? dto.newStock);
  const rawType = dto.TipoMovimiento ?? dto.type ?? 'AJUSTE';
  const quantity = numberOrZero(dto.Cantidad ?? dto.quantity);
  const delta = rawType === 'AJUSTE'
    ? newStock - previousStock
    : rawType === 'ENTRADA' ? Math.abs(quantity) : -Math.abs(quantity);

  return {
    id: dto.IdMovimiento ?? dto.id ?? null,
    folio: dto.FolioMovimiento ?? dto.folio ?? '',
    productId: dto.IdProducto ?? dto.productId ?? null,
    productName: dto.NombreProducto ?? dto.productName ?? '',
    code: String(dto.CodigoPLU ?? dto.code ?? ''),
    isBulk: isBulkValue(dto.EsGranel ?? dto.isBulk),
    type: rawType,
    quantity: Math.abs(quantity),
    delta,
    previousStock,
    newStock,
    unitCost: numberOrZero(dto.CostoUnitario ?? dto.unitCost),
    reason: dto.Motivo ?? dto.reason ?? '',
    user: dto.UsuarioResponsable ?? dto.IdUsuario ?? dto.user ?? '',
    date: dto.FechaMovimiento ?? dto.Fecha ?? dto.date ?? '',
  };
}

export function adaptMovementToBackend(movement) {
  return {
    IdProducto: movement.productId,
    TipoMovimiento: movement.type,
    Cantidad: Math.abs(Number(movement.quantity)),
    CostoUnitario: Number(movement.unitCost) || 0,
    Motivo: movement.reason,
    Notas: movement.notes ?? '',
  };
}
