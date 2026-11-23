const initialSettings = {
  NegocioConfig: {
    NombreComercial: 'Frutería y Verdulería El Valle',
    RazonSocial: 'Comercializadora El Valle de Sinaloa, S. de R.L. de C.V.',
    RFC: 'CEV180512AB3',
    Telefono: '669 982 4510',
    Direccion: 'Av. Ejército Mexicano 1203, Col. Juárez, Mazatlán, Sinaloa',
    Moneda: 'MXN',
    LogoUrl: '',
  },
  TicketConfig: {
    AnchoPapel: '80mm',
    MostrarLogo: true,
    MostrarRFC: true,
    MostrarCajero: true,
    TextoEncabezado: 'Frutas frescas todos los días',
    MensajePie: '¡Gracias por su compra! Vuelva pronto.',
    CopiasAutomaticas: 1,
  },
  ReglasOperativasConfig: {
    IVAFrescos: 0,
    IVAEmpacados: 16,
    RedondeoEfectivo: true,
    ExigirPINCancelacion: true,
    ExigirPINMerma: true,
    StockMinimoDefault: 10,
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));
let settings = clone(initialSettings);
const now = new Date();
const dateAt = (daysAgo, hour) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

let backups = [
  { IdRespaldo: 'BKP-20261120-0600', Fecha: dateAt(0, 6), Tipo: 'Automático', Tamano: '2.4 MB', Estatus: 'COMPLETADO' },
  { IdRespaldo: 'BKP-20261119-0600', Fecha: dateAt(1, 6), Tipo: 'Automático', Tamano: '2.4 MB', Estatus: 'COMPLETADO' },
  { IdRespaldo: 'BKP-20261118-0600', Fecha: dateAt(2, 6), Tipo: 'Automático', Tamano: '2.3 MB', Estatus: 'COMPLETADO' },
];

export async function getSettings() {
  return clone(settings);
}

export async function updateSettings(dto) {
  if (!dto?.NegocioConfig?.NombreComercial?.trim()) {
    throw new Error('El nombre comercial es obligatorio.');
  }
  if (!dto?.NegocioConfig?.RFC?.trim()) {
    throw new Error('El RFC es obligatorio.');
  }
  if (!['58mm', '80mm'].includes(dto?.TicketConfig?.AnchoPapel)) {
    throw new Error('El ancho de papel seleccionado no es válido.');
  }
  const stockMinimum = Number(dto?.ReglasOperativasConfig?.StockMinimoDefault);
  if (!Number.isFinite(stockMinimum) || stockMinimum < 0) {
    throw new Error('El stock mínimo debe ser un número igual o mayor a cero.');
  }
  const freshVat = Number(dto?.ReglasOperativasConfig?.IVAFrescos);
  const packagedVat = Number(dto?.ReglasOperativasConfig?.IVAEmpacados);
  if (![freshVat, packagedVat].every((rate) => Number.isFinite(rate) && rate >= 0 && rate <= 100)) {
    throw new Error('Las tasas de IVA deben estar entre 0 y 100%.');
  }
  if (![1, 2].includes(Number(dto?.TicketConfig?.CopiasAutomaticas))) {
    throw new Error('El número de copias automáticas no es válido.');
  }
  settings = clone(dto);
  return clone(settings);
}

export async function getSystemStatus() {
  return {
    EstadoAPI: 'EN_LINEA',
    EstadoBaseDatos: 'EN_LINEA',
    UltimaVerificacion: new Date().toISOString(),
    VersionAPI: '1.0.0-mock',
  };
}

export async function getBackupHistory() {
  return clone(backups);
}

export async function createManualBackup(settingsSnapshot) {
  if (!settingsSnapshot) throw new Error('No hay configuración para respaldar.');
  const date = new Date();
  const folio = `BKP-MAN-${date.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
  const snapshotSize = new TextEncoder().encode(JSON.stringify(settingsSnapshot)).length;
  const backup = {
    IdRespaldo: folio,
    Fecha: date.toISOString(),
    Tipo: 'Manual',
    Tamano: `${Math.max(1, Math.ceil(snapshotSize / 1024))} KB`,
    Estatus: 'COMPLETADO',
  };
  backups = [backup, ...backups];
  return clone(backup);
}
