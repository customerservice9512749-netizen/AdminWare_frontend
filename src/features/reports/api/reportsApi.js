const dayOffset = (days, hour = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const categorySeed = [
  { Categoria: 'Frutas', Ingresos: 205150, Costo: 123430, Utilidad: 81720 },
  { Categoria: 'Verduras', Ingresos: 96300, Costo: 69500, Utilidad: 26800 },
  { Categoria: 'Empacados', Ingresos: 48400, Costo: 42950, Utilidad: 5450 },
];

const productSeed = [
  { NombreProducto: 'Aguacate Hass', Categoria: 'Frutas', Volumen: 1450, Unidad: 'kg', Ingresos: 62500, Utilidad: 29500, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Limón Colima', Categoria: 'Frutas', Volumen: 2380, Unidad: 'kg', Ingresos: 51200, Utilidad: 22400, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Tomate Saladette', Categoria: 'Verduras', Volumen: 4250, Unidad: 'kg', Ingresos: 74500, Utilidad: 18300, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Plátano Chiapas', Categoria: 'Frutas', Volumen: 3890, Unidad: 'kg', Ingresos: 48250, Utilidad: 14100, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Manzana Gala', Categoria: 'Frutas', Volumen: 1240, Unidad: 'kg', Ingresos: 42000, Utilidad: 15600, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Cilantro', Categoria: 'Verduras', Volumen: 1550, Unidad: 'pzas', Ingresos: 21800, Utilidad: 8500, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Cajas de fruta mixta', Categoria: 'Empacados', Volumen: 1850, Unidad: 'pzas', Ingresos: 48400, Utilidad: 5450, RotacionBaja: false, DiasSinVenta: 0 },
  { NombreProducto: 'Pera de importación', Categoria: 'Frutas', Volumen: 34, Unidad: 'kg', Ingresos: 1200, Utilidad: 120, RotacionBaja: true, DiasSinVenta: 12 },
];

const cashCutSeed = [
  { IdCorte: 8801, FolioCorte: 'COR-008801', Fecha: dayOffset(0, 7), Cajero: 'Carlos Ramírez', Turno: 'MATUTINO', Sucursal: 'Sucursal Centro', FondoInicial: 1500, VentasEfectivo: 18450, VentasTarjeta: 12380, Retiros: 600, EfectivoEsperado: 19350, EfectivoContado: 19350, Diferencia: 0, EstatusCierre: 'CERRADO' },
  { IdCorte: 8802, FolioCorte: 'COR-008802', Fecha: dayOffset(0, 15), Cajero: 'Sofía Méndez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Mercado', FondoInicial: 1500, VentasEfectivo: 22180, VentasTarjeta: 14560, Retiros: 1000, EfectivoEsperado: 22680, EfectivoContado: 22580, Diferencia: -100, EstatusCierre: 'CERRADO' },
  { IdCorte: 8798, FolioCorte: 'COR-008798', Fecha: dayOffset(1, 7), Cajero: 'Carlos Ramírez', Turno: 'MATUTINO', Sucursal: 'Sucursal Centro', FondoInicial: 1500, VentasEfectivo: 16800, VentasTarjeta: 11120, Retiros: 0, EfectivoEsperado: 18300, EfectivoContado: 18400, Diferencia: 100, EstatusCierre: 'CERRADO' },
  { IdCorte: 8797, FolioCorte: 'COR-008797', Fecha: dayOffset(1, 15), Cajero: 'Sofía Méndez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Mercado', FondoInicial: 1500, VentasEfectivo: 19580, VentasTarjeta: 12700, Retiros: 500, EfectivoEsperado: 20580, EfectivoContado: 20580, Diferencia: 0, EstatusCierre: 'CERRADO' },
  { IdCorte: 8791, FolioCorte: 'COR-008791', Fecha: dayOffset(2, 7), Cajero: 'Carlos Ramírez', Turno: 'MATUTINO', Sucursal: 'Sucursal Centro', FondoInicial: 1500, VentasEfectivo: 15700, VentasTarjeta: 10800, Retiros: 700, EfectivoEsperado: 16500, EfectivoContado: 16450, Diferencia: -50, EstatusCierre: 'CERRADO' },
  { IdCorte: 8780, FolioCorte: 'COR-008780', Fecha: dayOffset(4, 15), Cajero: 'Laura Sánchez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Centro', FondoInicial: 2000, VentasEfectivo: 25900, VentasTarjeta: 17300, Retiros: 2500, EfectivoEsperado: 25400, EfectivoContado: 25400, Diferencia: 0, EstatusCierre: 'CERRADO' },
  { IdCorte: 8751, FolioCorte: 'COR-008751', Fecha: dayOffset(8, 7), Cajero: 'Carlos Ramírez', Turno: 'MATUTINO', Sucursal: 'Sucursal Mercado', FondoInicial: 1500, VentasEfectivo: 14200, VentasTarjeta: 9500, Retiros: 300, EfectivoEsperado: 15400, EfectivoContado: 15400, Diferencia: 0, EstatusCierre: 'CERRADO' },
  { IdCorte: 8712, FolioCorte: 'COR-008712', Fecha: dayOffset(12, 15), Cajero: 'Laura Sánchez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Centro', FondoInicial: 2000, VentasEfectivo: 24300, VentasTarjeta: 16800, Retiros: 1800, EfectivoEsperado: 24500, EfectivoContado: 24550, Diferencia: 50, EstatusCierre: 'CERRADO' },
];

const shrinkageSeed = [
  { IdMerma: 301, Fecha: dayOffset(0, 8), NombreProducto: 'Aguacate Hass', Cantidad: 3.2, Unidad: 'kg', Motivo: 'Producto maduro / echado a perder', CostoUnitario: 42, Importe: 134.4, Responsable: 'Jorge Hernández', Turno: 'MATUTINO', Sucursal: 'Sucursal Centro' },
  { IdMerma: 302, Fecha: dayOffset(1, 13), NombreProducto: 'Tomate Saladette', Cantidad: 5.5, Unidad: 'kg', Motivo: 'Daño en manejo/traslado', CostoUnitario: 18.5, Importe: 101.75, Responsable: 'Jorge Hernández', Turno: 'VESPERTINO', Sucursal: 'Sucursal Mercado' },
  { IdMerma: 303, Fecha: dayOffset(3, 10), NombreProducto: 'Plátano Chiapas', Cantidad: 4, Unidad: 'kg', Motivo: 'Producto maduro / echado a perder', CostoUnitario: 16, Importe: 64, Responsable: 'Laura Sánchez', Turno: 'MATUTINO', Sucursal: 'Sucursal Centro' },
  { IdMerma: 304, Fecha: dayOffset(5, 9), NombreProducto: 'Cilantro', Cantidad: 8, Unidad: 'pzas', Motivo: 'Caducidad', CostoUnitario: 4.5, Importe: 36, Responsable: 'Jorge Hernández', Turno: 'MATUTINO', Sucursal: 'Sucursal Mercado' },
  { IdMerma: 305, Fecha: dayOffset(8, 11), NombreProducto: 'Limón Colima', Cantidad: 2.8, Unidad: 'kg', Motivo: 'Daño en manejo/traslado', CostoUnitario: 21, Importe: 58.8, Responsable: 'Carlos Ramírez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Centro' },
  { IdMerma: 306, Fecha: dayOffset(12, 12), NombreProducto: 'Manzana Gala', Cantidad: 1.6, Unidad: 'kg', Motivo: 'Producto maduro / echado a perder', CostoUnitario: 32, Importe: 51.2, Responsable: 'Jorge Hernández', Turno: 'MATUTINO', Sucursal: 'Sucursal Mercado' },
  { IdMerma: 307, Fecha: dayOffset(19, 10), NombreProducto: 'Tomate Saladette', Cantidad: 7, Unidad: 'kg', Motivo: 'Otro', CostoUnitario: 18.5, Importe: 129.5, Responsable: 'Laura Sánchez', Turno: 'VESPERTINO', Sucursal: 'Sucursal Centro' },
];

function resolveRange({ datePreset, customRange = {} }) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  if (datePreset === 'TODAY') start.setHours(0, 0, 0, 0);
  else if (datePreset === '7D') {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (datePreset === 'MONTH') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (datePreset === 'CUSTOM') {
    if (!customRange.start || !customRange.end) throw new Error('Selecciona las fechas de inicio y fin del reporte.');
    const [startYear, startMonth, startDay] = customRange.start.split('-').map(Number);
    const [endYear, endMonth, endDay] = customRange.end.split('-').map(Number);
    start.setFullYear(startYear, startMonth - 1, startDay);
    start.setHours(0, 0, 0, 0);
    end.setFullYear(endYear, endMonth - 1, endDay);
    end.setHours(23, 59, 59, 999);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      throw new Error('El rango personalizado no es válido.');
    }
    if ((end - start) / 86400000 > 365) throw new Error('El rango no puede superar 366 días.');
  } else {
    throw new Error('El periodo de reporte no es válido.');
  }
  return { start, end };
}

function isWithinRange(value, range) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date >= range.start && date <= range.end;
}

function sum(rows, property) {
  return rows.reduce((total, row) => total + Number(row[property] || 0), 0);
}

function createSeries(range, filterScale) {
  const dates = [];
  const cursor = new Date(range.start);
  cursor.setHours(12, 0, 0, 0);
  const last = new Date(range.end);
  last.setHours(12, 0, 0, 0);
  while (cursor <= last) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  const targetRevenue = 349850 * (dates.length / 30) * filterScale;
  const targetCost = 235880 * (dates.length / 30) * filterScale;
  const rawWeights = dates.map((date, index) => 8200 + ((index * 1597 + date.getDate() * 83) % 7400) + (date.getDay() === 0 || date.getDay() === 6 ? 1500 : 0));
  const weightTotal = rawWeights.reduce((total, value) => total + value, 0) || 1;
  const rows = dates.map((date, index) => ({
    Fecha: dateKey(date),
    Ingresos: Number((targetRevenue * rawWeights[index] / weightTotal).toFixed(2)),
    Costo: Number((targetCost * rawWeights[index] / weightTotal).toFixed(2)),
  }));
  rows.forEach((row) => { row.Utilidad = Number((row.Ingresos - row.Costo).toFixed(2)); });

  const bucketSize = Math.max(1, Math.ceil(rows.length / 31));
  return Array.from({ length: Math.ceil(rows.length / bucketSize) }, (_, index) => {
    const bucket = rows.slice(index * bucketSize, (index + 1) * bucketSize);
    return {
      Fecha: bucket.length === 1 ? bucket[0].Fecha : `${bucket[0].Fecha} – ${bucket[bucket.length - 1].Fecha}`,
      Ingresos: Number(sum(bucket, 'Ingresos').toFixed(2)),
      Costo: Number(sum(bucket, 'Costo').toFixed(2)),
      Utilidad: Number(sum(bucket, 'Utilidad').toFixed(2)),
    };
  });
}

export async function getExecutiveReport(filters) {
  const range = resolveRange(filters);
  const shift = filters.shift ?? 'ALL';
  const branch = filters.branch ?? 'ALL';
  const shiftScale = shift === 'ALL' ? 1 : 0.55;
  const branchScale = branch === 'ALL' ? 1 : 0.58;
  const firstDay = Date.UTC(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
  const lastDay = Date.UTC(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());
  const dayCount = Math.round((lastDay - firstDay) / 86400000) + 1;
  const scale = dayCount / 30 * shiftScale * branchScale;
  const series = createSeries(range, shiftScale * branchScale);
  const rangeCuts = cashCutSeed.filter((cut) => isWithinRange(cut.Fecha, range)
    && (shift === 'ALL' || cut.Turno === shift)
    && (branch === 'ALL' || cut.Sucursal === branch));
  const rangeShrinkage = shrinkageSeed.filter((item) => isWithinRange(item.Fecha, range)
    && (shift === 'ALL' || item.Turno === shift)
    && (branch === 'ALL' || item.Sucursal === branch));
  const revenue = Number(series.reduce((total, item) => total + item.Ingresos, 0).toFixed(2));
  const cost = Number(series.reduce((total, item) => total + item.Costo, 0).toFixed(2));
  const profit = Number((revenue - cost).toFixed(2));
  const cutDifference = Number(sum(rangeCuts, 'Diferencia').toFixed(2));
  const shrinkageTotal = Number(sum(rangeShrinkage, 'Importe').toFixed(2));

  return {
    ResumenFinanciero: {
      IngresosTotales: revenue,
      CostoVentas: cost,
      UtilidadNeta: profit,
      MargenPorcentaje: revenue ? profit / revenue * 100 : 0,
      TotalMermaDinero: shrinkageTotal,
      DiferenciaCortes: cutDifference,
      SerieTemporal: series,
    },
    VentasPorCategoria: categorySeed.map((item) => ({
      ...item,
      Ingresos: Number((item.Ingresos * scale).toFixed(2)),
      Costo: Number((item.Costo * scale).toFixed(2)),
      Utilidad: Number((item.Utilidad * scale).toFixed(2)),
    })),
    TopProductos: productSeed.map((item) => ({
      ...item,
      Volumen: Number((item.Volumen * scale).toFixed(2)),
      Ingresos: Number((item.Ingresos * scale).toFixed(2)),
      Utilidad: Number((item.Utilidad * scale).toFixed(2)),
    })),
    CortesCaja: rangeCuts.map((cut) => ({
      ...cut,
      Fecha: cut.Fecha.toISOString(),
    })),
    ResumenMermas: {
      TotalMermaDinero: shrinkageTotal,
      DetalleMermas: rangeShrinkage.map((item) => ({ ...item, Fecha: item.Fecha.toISOString() })),
    },
  };
}
