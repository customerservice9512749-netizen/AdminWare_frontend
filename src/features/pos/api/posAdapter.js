export function adaptProduct(apiData = {}) {
  const barcode = String(apiData.barcode ?? apiData.codigo_barras ?? apiData.sku ?? '');
  const plu = apiData.plu ?? apiData.codigo_plu ?? '';
  const candidateImage = String(apiData.image ?? apiData.imagen ?? apiData.icono ?? '');
  const image = /^(?:https?:\/\/|\/|data:image\/)/i.test(candidateImage) ? candidateImage : '/favicon.svg';
  const isBulk = Boolean(
    apiData.isBulk ?? apiData.es_granel ?? apiData.is_bulk ?? String(apiData.tipo ?? '').toLowerCase() === 'granel',
  );

  return {
    ...apiData,
    id: apiData.id ?? apiData.id_producto ?? apiData.sku ?? null,
    name: apiData.name ?? apiData.nombre_prod ?? apiData.nombre ?? 'Producto',
    price: Number.parseFloat(apiData.price ?? apiData.precio_venta ?? apiData.precio ?? 0) || 0,
    barcode,
    plu: String(plu ?? ''),
    isBulk,
    image,
    category: apiData.category ?? apiData.categoria ?? 'General',
    stock: Number(apiData.stock ?? apiData.existencias ?? 0),
    code: apiData.code ?? apiData.sku ?? barcode,
  };
}
