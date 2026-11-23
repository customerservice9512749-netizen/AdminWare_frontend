const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const currentDay = dayLabels[new Date().getDay()];

const dateOffset = (days, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const delivery = (id, daysAgo, amount, status = 'Recibida') => ({
  IdEntrega: id,
  Folio: `ENT-${String(id).padStart(5, '0')}`,
  Fecha: dateOffset(daysAgo),
  Monto: amount,
  Estatus: status,
});

const products = [
  { IdProducto: 'fruit-1', NombreProducto: 'Tomate Saladette', Categoria: 'Verduras', UltimoCosto: 18.5, Unidad: 'kg' },
  { IdProducto: 'fruit-2', NombreProducto: 'Aguacate Hass', Categoria: 'Frutas', UltimoCosto: 42, Unidad: 'kg' },
  { IdProducto: 'fruit-3', NombreProducto: 'Plátano Chiapas', Categoria: 'Frutas', UltimoCosto: 16, Unidad: 'kg' },
  { IdProducto: 'fruit-4', NombreProducto: 'Limón Colima', Categoria: 'Frutas', UltimoCosto: 21, Unidad: 'kg' },
  { IdProducto: 'fruit-5', NombreProducto: 'Cilantro', Categoria: 'Hierbas', UltimoCosto: 4.5, Unidad: 'pzas' },
  { IdProducto: 'fruit-6', NombreProducto: 'Manzana Gala', Categoria: 'Frutas', UltimoCosto: 32, Unidad: 'kg' },
  { IdProducto: 'fruit-7', NombreProducto: 'Caja de cartón', Categoria: 'Empaques', UltimoCosto: 8.75, Unidad: 'pzas' },
  { IdProducto: 'fruit-8', NombreProducto: 'Semilla de hortaliza', Categoria: 'Semillas', UltimoCosto: 115, Unidad: 'pzas' },
];

const productLinks = (ids) => ids.map((id) => {
  const product = products.find((item) => item.IdProducto === id);
  return { ...product };
});

let suppliers = [
  {
    IdProveedor: 1, NombreComercial: 'Agrícola El Valle', RazonSocial: 'Productores Agrícolas del Valle, S.A. de C.V.',
    RFC: 'PAV180625M71', Contacto: 'Jorge Mendoza', Telefono: '667 214 8090', Correo: 'pedidos@agricolaelvalle.mx',
    Categoria: 'Frutas y verduras', DiasSurtido: ['Lun', 'Mié', currentDay, 'Sáb'], CondicionPago: 'CREDITO_15',
    SaldoPendiente: 18500.5, Estatus: 1, ProductosAsociados: productLinks(['fruit-1', 'fruit-3', 'fruit-5']),
    HistorialEntregas: [delivery(1001, 0, 12850), delivery(992, -4, 9400), delivery(961, -11, 15600)],
  },
  {
    IdProveedor: 2, NombreComercial: 'Distribuidora Citrícola del Pacífico', RazonSocial: 'Cítricos del Pacífico, S. de R.L. de C.V.',
    RFC: 'DCP200317K82', Contacto: 'Lucía Valenzuela', Telefono: '669 118 2264', Correo: 'ventas@citricospacifico.mx',
    Categoria: 'Cítricos', DiasSurtido: ['Mar', 'Jue', currentDay], CondicionPago: 'CREDITO_30',
    SaldoPendiente: 32750, Estatus: 1, ProductosAsociados: productLinks(['fruit-4']),
    HistorialEntregas: [delivery(1002, -1, 18300), delivery(986, -6, 21200), delivery(958, -13, 16900)],
  },
  {
    IdProveedor: 3, NombreComercial: 'Bodega Central Abastos #42', RazonSocial: 'Comercializadora Central de Abastos, S.A.',
    RFC: 'CCA150908QH3', Contacto: 'Roberto Salas', Telefono: '55 5687 4210', Correo: 'bodega42@centralabastos.mx',
    Categoria: 'Mayoreo', DiasSurtido: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], CondicionPago: 'CONTADO',
    SaldoPendiente: 0, Estatus: 1, ProductosAsociados: productLinks(['fruit-1', 'fruit-2', 'fruit-4', 'fruit-6']),
    HistorialEntregas: [delivery(1003, -2, 22100), delivery(989, -7, 14700), delivery(953, -14, 19850)],
  },
  {
    IdProveedor: 4, NombreComercial: 'Empaques y Semillas del Norte', RazonSocial: 'Empaques y Semillas del Norte, S.A. de C.V.',
    RFC: 'ESN190412D56', Contacto: 'Mónica Treviño', Telefono: '81 8354 1902', Correo: 'monica@empaquesnorte.mx',
    Categoria: 'Empaques y semillas', DiasSurtido: ['Mié', 'Vie'], CondicionPago: 'CREDITO_7',
    SaldoPendiente: 6840, Estatus: 1, ProductosAsociados: productLinks(['fruit-7', 'fruit-8']),
    HistorialEntregas: [delivery(1004, -3, 6850), delivery(990, -8, 4720), delivery(957, -15, 9200)],
  },
  {
    IdProveedor: 5, NombreComercial: 'Huertas San José', RazonSocial: 'Huertas San José de Michoacán, S.P.R. de R.L.',
    RFC: 'HSJ170220LJ8', Contacto: 'Ana María Ochoa', Telefono: '443 309 6752', Correo: 'contacto@huertassanjose.mx',
    Categoria: 'Fruta de temporada', DiasSurtido: ['Lun', 'Jue', 'Sáb'], CondicionPago: 'CREDITO_15',
    SaldoPendiente: 12400, Estatus: 0, ProductosAsociados: productLinks(['fruit-2', 'fruit-6']),
    HistorialEntregas: [delivery(1005, -5, 13600), delivery(987, -10, 11200), delivery(951, -17, 15100)],
  },
];

let nextSupplierId = 6;
const clone = (value) => JSON.parse(JSON.stringify(value));

export async function getSuppliers() {
  return clone(suppliers);
}

export async function getSupplierProductCatalog() {
  return clone(products);
}

export async function createSupplier(supplier) {
  const created = {
    ...clone(supplier),
    IdProveedor: nextSupplierId,
    Estatus: supplier.Estatus ?? 1,
    SaldoPendiente: Number(supplier.SaldoPendiente) || 0,
    HistorialEntregas: [],
  };
  nextSupplierId += 1;
  suppliers = [created, ...suppliers];
  return clone(created);
}

export async function updateSupplier(id, supplier) {
  const index = suppliers.findIndex((item) => String(item.IdProveedor) === String(id));
  if (index < 0) throw new Error('No se encontró el proveedor que deseas actualizar.');
  const updated = { ...suppliers[index], ...clone(supplier), IdProveedor: suppliers[index].IdProveedor };
  suppliers = suppliers.map((item, itemIndex) => itemIndex === index ? updated : item);
  return clone(updated);
}

export async function toggleSupplierStatus(id) {
  const supplier = suppliers.find((item) => String(item.IdProveedor) === String(id));
  if (!supplier) throw new Error('No se encontró el proveedor seleccionado.');
  supplier.Estatus = Number(supplier.Estatus) === 1 ? 0 : 1;
  return clone(supplier);
}
