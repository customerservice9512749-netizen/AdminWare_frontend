const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export function adaptExecutiveReport(dto = {}) {
  const financial = dto.ResumenFinanciero ?? dto.resumenFinanciero ?? {};
  const series = (financial.SerieTemporal ?? financial.Serie ?? dto.SerieTemporal ?? []).map((item) => ({
    date: item.Fecha ?? item.date ?? '',
    revenue: toNumber(item.Ingresos ?? item.IngresosTotales ?? item.revenue),
    cost: toNumber(item.Costo ?? item.Costos ?? item.CostoVentas ?? item.cost),
    profit: toNumber(item.Utilidad ?? item.UtilidadNeta ?? item.profit),
  }));
  const categories = (dto.VentasPorCategoria ?? dto.Categorias ?? []).map((item) => ({
    name: item.Categoria ?? item.NombreCategoria ?? item.name ?? '',
    revenue: toNumber(item.Ingresos ?? item.IngresosTotales ?? item.revenue),
    cost: toNumber(item.Costo ?? item.CostoVentas ?? item.cost),
    profit: toNumber(item.Utilidad ?? item.UtilidadNeta ?? item.profit),
    margin: toNumber(item.MargenPorcentaje ?? item.margin
      ?? (Number(item.Ingresos ?? item.revenue) > 0
        ? Number(item.Utilidad ?? item.profit) / Number(item.Ingresos ?? item.revenue) * 100 : 0)),
  }));
  const products = (dto.TopProductos ?? dto.RankingProductos ?? []).map((item) => ({
    name: item.NombreProducto ?? item.Producto ?? item.name ?? '',
    category: item.Categoria ?? item.category ?? '',
    volume: toNumber(item.Volumen ?? item.CantidadVendida ?? item.quantity),
    unit: item.Unidad ?? item.UnidadMedida ?? item.unit ?? 'pzas',
    revenue: toNumber(item.Ingresos ?? item.Ventas ?? item.revenue),
    profit: toNumber(item.Utilidad ?? item.UtilidadNeta ?? item.profit),
    lowRotation: item.RotacionBaja === true || item.RotacionBaja === 1 || item.lowRotation === true,
    daysWithoutSale: toNumber(item.DiasSinVenta ?? item.daysWithoutSale),
  }));
  const cuts = (dto.CortesCaja ?? dto.ListaCortes ?? []).map((item) => {
    const expectedCash = toNumber(item.EfectivoEsperado ?? item.EfectivoSistema ?? item.expectedCash);
    const countedCash = toNumber(item.EfectivoContado ?? item.ContadoFisico ?? item.countedCash);
    return {
      id: item.IdCorte ?? item.id ?? null,
      folio: item.FolioCorte ?? item.Folio ?? item.folio ?? '',
      date: item.Fecha ?? item.FechaCorte ?? item.date ?? '',
      cashier: item.Cajero ?? item.NombreCajero ?? item.cashier ?? '',
      shift: item.Turno ?? item.shift ?? '',
      branch: item.Sucursal ?? item.branch ?? '',
      systemSales: toNumber(item.VentasSistema ?? expectedCash),
      totalSales: toNumber(item.VentaTotalSistema ?? item.TotalVentas ?? item.totalSales),
      countedCash,
      difference: toNumber(item.Diferencia ?? item.difference ?? countedCash - expectedCash),
      status: item.EstatusCierre ?? item.status ?? 'CERRADO',
      initialFund: toNumber(item.FondoInicial ?? item.initialFund),
      cashSales: toNumber(item.VentasEfectivo ?? item.cashSales),
      cardSales: toNumber(item.VentasTarjeta ?? item.cardSales),
      withdrawals: toNumber(item.Retiros ?? item.withdrawals),
      expectedCash,
    };
  });
  const shrinkageDto = dto.ResumenMermas ?? {};
  const shrinkage = (shrinkageDto.DetalleMermas ?? dto.DetalleMermas ?? []).map((item) => ({
    id: item.IdMerma ?? item.id ?? null,
    date: item.Fecha ?? item.FechaMerma ?? item.date ?? '',
    product: item.NombreProducto ?? item.Producto ?? item.product ?? '',
    quantity: toNumber(item.Cantidad ?? item.quantity),
    unit: item.Unidad ?? item.UnidadMedida ?? item.unit ?? '',
    reason: item.Motivo ?? item.reason ?? '',
    unitCost: toNumber(item.CostoUnitario ?? item.unitCost),
    amount: toNumber(item.Importe ?? item.TotalMerma ?? item.amount),
    responsible: item.Responsable ?? item.Usuario ?? item.responsible ?? '',
  }));
  const revenue = toNumber(financial.IngresosTotales ?? financial.IngresosBrutos ?? financial.revenue);
  const cost = toNumber(financial.CostoVentas ?? financial.cost);
  const profit = toNumber(financial.UtilidadNeta ?? financial.profit);
  const margin = toNumber(financial.MargenPorcentaje ?? financial.margin
    ?? (revenue ? profit / revenue * 100 : 0));

  return {
    summary: {
      revenue,
      cost,
      profit,
      margin,
      shrinkageCost: toNumber(financial.TotalMermaDinero ?? shrinkageDto.TotalMermaDinero ?? shrinkageDto.Total ?? shrinkage.reduce((total, item) => total + item.amount, 0)),
      cashCutBalance: toNumber(financial.DiferenciaCortes ?? cuts.reduce((total, item) => total + item.difference, 0)),
    },
    timeSeries: series,
    categories,
    products,
    cashCuts: cuts,
    shrinkage,
  };
}
