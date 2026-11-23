const today = new Date();
const atDayOffset = (offset, hour = 9) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
};

let inventory = [
  { IdProducto: 1, NombreProducto: 'Tomate Saladette', CodigoPLU: '4011', EsGranel: true, Categoria: 'Verduras', StockActual: 45.5, StockMinimo: 12, StockMaximo: 60, CostoUnitario: 18.5, Unidad: 'kg' },
  { IdProducto: 2, NombreProducto: 'Aguacate Hass', CodigoPLU: '4046', EsGranel: true, Categoria: 'Frutas', StockActual: 8.25, StockMinimo: 10, StockMaximo: 30, CostoUnitario: 42, Unidad: 'kg' },
  { IdProducto: 3, NombreProducto: 'Plátano Chiapas', CodigoPLU: '4235', EsGranel: true, Categoria: 'Frutas', StockActual: 32.75, StockMinimo: 15, StockMaximo: 45, CostoUnitario: 16, Unidad: 'kg' },
  { IdProducto: 4, NombreProducto: 'Limón Colima', CodigoPLU: '4053', EsGranel: true, Categoria: 'Frutas', StockActual: 0, StockMinimo: 8, StockMaximo: 35, CostoUnitario: 21, Unidad: 'kg' },
  { IdProducto: 5, NombreProducto: 'Cilantro', CodigoPLU: '4899', EsGranel: false, Categoria: 'Hierbas', StockActual: 120, StockMinimo: 25, StockMaximo: 150, CostoUnitario: 4.5, Unidad: 'pzas' },
  { IdProducto: 6, NombreProducto: 'Manzana Gala', CodigoPLU: '4131', EsGranel: true, Categoria: 'Frutas', StockActual: 18.4, StockMinimo: 10, StockMaximo: 40, CostoUnitario: 32, Unidad: 'kg' },
];

let nextMovementId = 100;
let movements = [
  { IdMovimiento: 99, FolioMovimiento: 'KDX-00099', IdProducto: 2, NombreProducto: 'Aguacate Hass', CodigoPLU: '4046', EsGranel: true, TipoMovimiento: 'MERMA', Cantidad: 1.25, StockAnterior: 9.5, StockNuevo: 8.25, CostoUnitario: 42, Motivo: 'Producto maduro / echado a perder', UsuarioResponsable: 'María López', FechaMovimiento: atDayOffset(0, 10) },
  { IdMovimiento: 98, FolioMovimiento: 'KDX-00098', IdProducto: 1, NombreProducto: 'Tomate Saladette', CodigoPLU: '4011', EsGranel: true, TipoMovimiento: 'ENTRADA', Cantidad: 20, StockAnterior: 25.5, StockNuevo: 45.5, CostoUnitario: 18.5, Motivo: 'Reposición de proveedor', UsuarioResponsable: 'Carlos Ruiz', FechaMovimiento: atDayOffset(0, 8) },
  { IdMovimiento: 97, FolioMovimiento: 'KDX-00097', IdProducto: 5, NombreProducto: 'Cilantro', CodigoPLU: '4899', EsGranel: false, TipoMovimiento: 'SALIDA_VENTA', Cantidad: 12, StockAnterior: 132, StockNuevo: 120, CostoUnitario: 4.5, Motivo: 'Venta en caja', UsuarioResponsable: 'Sistema POS', FechaMovimiento: atDayOffset(-1, 16) },
  { IdMovimiento: 96, FolioMovimiento: 'KDX-00096', IdProducto: 3, NombreProducto: 'Plátano Chiapas', CodigoPLU: '4235', EsGranel: true, TipoMovimiento: 'AJUSTE', Cantidad: 2.5, StockAnterior: 30.25, StockNuevo: 32.75, CostoUnitario: 16, Motivo: 'Conteo físico semanal', UsuarioResponsable: 'María López', FechaMovimiento: atDayOffset(-2, 11) },
  { IdMovimiento: 95, FolioMovimiento: 'KDX-00095', IdProducto: 6, NombreProducto: 'Manzana Gala', CodigoPLU: '4131', EsGranel: true, TipoMovimiento: 'MERMA', Cantidad: 0.6, StockAnterior: 19, StockNuevo: 18.4, CostoUnitario: 32, Motivo: 'Daño en manejo/traslado', UsuarioResponsable: 'Carlos Ruiz', FechaMovimiento: atDayOffset(-4, 13) },
  { IdMovimiento: 94, FolioMovimiento: 'KDX-00094', IdProducto: 4, NombreProducto: 'Limón Colima', CodigoPLU: '4053', EsGranel: true, TipoMovimiento: 'SALIDA_VENTA', Cantidad: 8, StockAnterior: 8, StockNuevo: 0, CostoUnitario: 21, Motivo: 'Venta en caja', UsuarioResponsable: 'Sistema POS', FechaMovimiento: atDayOffset(-5, 15) },
  { IdMovimiento: 93, FolioMovimiento: 'KDX-00093', IdProducto: 2, NombreProducto: 'Aguacate Hass', CodigoPLU: '4046', EsGranel: true, TipoMovimiento: 'ENTRADA', Cantidad: 9.5, StockAnterior: 0, StockNuevo: 9.5, CostoUnitario: 42, Motivo: 'Compra a proveedor', UsuarioResponsable: 'Carlos Ruiz', FechaMovimiento: atDayOffset(-8, 9) },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export async function getInventory() {
  return clone(inventory);
}

export async function getKardexMovements() {
  return clone(movements);
}

export async function registerInventoryMovement({
  productId, type, quantity, unitCost, reason, notes, user = 'Usuario actual',
}) {
  const product = inventory.find((item) => String(item.IdProducto) === String(productId));
  if (!product) throw new Error('No se encontró el producto seleccionado.');

  const amount = Number(quantity);
  if (!Number.isFinite(amount) || amount === 0) throw new Error('Ingresa una cantidad válida distinta de cero.');
  if (!product.EsGranel && !Number.isInteger(amount)) throw new Error('La cantidad debe ser un número entero para productos por pieza.');
  if (type !== 'AJUSTE' && amount < 0) throw new Error('La cantidad debe ser mayor a cero.');

  const delta = type === 'ENTRADA' ? amount
    : type === 'AJUSTE' ? amount : -amount;
  const previousStock = Number(product.StockActual);
  const newStock = previousStock + delta;
  if (newStock < 0) throw new Error('La cantidad de salida no puede superar las existencias actuales.');

  const movement = {
    IdMovimiento: nextMovementId,
    FolioMovimiento: `KDX-${String(nextMovementId).padStart(5, '0')}`,
    IdProducto: product.IdProducto,
    NombreProducto: product.NombreProducto,
    CodigoPLU: product.CodigoPLU,
    EsGranel: product.EsGranel,
    TipoMovimiento: type,
    Cantidad: Math.abs(amount),
    StockAnterior: previousStock,
    StockNuevo: newStock,
    CostoUnitario: Number(unitCost) || Number(product.CostoUnitario),
    Motivo: [reason, notes].filter(Boolean).join(' — '),
    UsuarioResponsable: user,
    FechaMovimiento: new Date().toISOString(),
  };

  product.StockActual = newStock;
  if (type === 'ENTRADA' && Number(unitCost) > 0) product.CostoUnitario = Number(unitCost);
  movements = [movement, ...movements];
  nextMovementId += 1;
  return clone(movement);
}
