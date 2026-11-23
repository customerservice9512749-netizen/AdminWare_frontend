const asNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const asBoolean = (value) => value === true || value === 1 || value === '1'
  || ['true', 'activo', 'en stock', 'stock bajo'].includes(String(value).toLocaleLowerCase('es-MX'));

function eanChecksum(firstTwelveDigits) {
  const sum = firstTwelveDigits
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return String((10 - (sum % 10)) % 10);
}

export function generateProductCode(unit = 'PZA') {
  if (String(unit).toUpperCase() === 'KG') {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  const firstTwelveDigits = `750${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')}`;
  return `${firstTwelveDigits}${eanChecksum(firstTwelveDigits)}`;
}

export const adaptProductFromBackend = (apiData = {}) => {
  const unit = String(apiData.UnidadMedida ?? apiData.unit
    ?? (asBoolean(apiData.EsGranel ?? apiData.isBulk ?? apiData.IsBulk) ? 'KG' : 'PZA')).toUpperCase();
  const isBulk = asBoolean(apiData.EsGranel ?? apiData.isBulk ?? apiData.IsBulk) || unit === 'KG';
  const code = String(apiData.Codigo ?? apiData.code ?? apiData.sku
    ?? (isBulk ? apiData.PLU ?? apiData.plu : apiData.Barcode ?? apiData.CodigoBarras ?? apiData.barcode) ?? '');
  const salePrice = asNumber(apiData.Precio ?? apiData.PrecioVenta ?? apiData.salePrice ?? apiData.price);
  const stock = asNumber(apiData.Stock ?? apiData.StockActual ?? apiData.currentStock ?? apiData.stock);
  const statusValue = apiData.Estatus ?? apiData.Status ?? apiData.status ?? true;

  return {
    id: apiData.IdProducto ?? apiData.id ?? null,
    code,
    barcode: String(apiData.Barcode ?? apiData.CodigoBarras ?? apiData.barcode ?? (!isBulk ? code : '')),
    plu: String(apiData.PLU ?? apiData.plu ?? (isBulk ? code : '')),
    name: apiData.Nombre ?? apiData.name ?? '',
    categoryId: asNumber(apiData.IdCategoria ?? apiData.categoryId, 0),
    category: apiData.NombreCategoria ?? apiData.Categoria ?? apiData.category ?? 'General',
    costPrice: asNumber(apiData.Costo ?? apiData.PrecioCompra ?? apiData.costPrice),
    salePrice,
    price: salePrice,
    unit,
    isBulk,
    currentStock: stock,
    stock,
    minStock: asNumber(apiData.StockMinimo ?? apiData.minStock),
    description: apiData.Descripcion ?? apiData.description ?? '',
    image: apiData.Imagen ?? apiData.image ?? '',
    status: asBoolean(statusValue),
    promoType: apiData.TipoPromocion ?? apiData.promoType ?? null,
    waste: asNumber(apiData.Merma ?? apiData.Mermas ?? apiData.waste),
  };
};

export const adaptProductToBackend = (formData = {}) => {
  const unit = String(formData.unit ?? (formData.isBulk ? 'KG' : 'PZA')).toUpperCase();
  const code = String(formData.code ?? '').trim() || generateProductCode(unit);
  const isBulk = unit === 'KG';
  const stock = asNumber(formData.currentStock ?? formData.stock);
  const salePrice = asNumber(formData.salePrice ?? formData.price);

  return {
    IdProducto: formData.id ?? 0,
    Barcode: isBulk ? '' : String(formData.barcode || code),
    PLU: isBulk ? String(formData.plu || code) : '',
    Nombre: String(formData.name ?? '').trim(),
    IdCategoria: asNumber(formData.categoryId, 0),
    Categoria: String(formData.category ?? 'General'),
    EsGranel: isBulk,
    Precio: salePrice,
    Costo: asNumber(formData.costPrice),
    Stock: stock,
    StockMinimo: asNumber(formData.minStock),
    Estatus: formData.status === false ? 0 : 1,
    Descripcion: String(formData.description ?? ''),
    Imagen: String(formData.image ?? ''),
    TipoPromocion: formData.promoType ? asNumber(formData.promoType) : null,
    Merma: asNumber(formData.waste),
  };
};
