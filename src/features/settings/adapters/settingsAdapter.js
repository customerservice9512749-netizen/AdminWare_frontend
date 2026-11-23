export function adaptSettingsFromBackend(dto) {
  const business = dto?.NegocioConfig ?? {};
  const ticket = dto?.TicketConfig ?? {};
  const rules = dto?.ReglasOperativasConfig ?? {};

  return {
    business: {
      commercialName: business.NombreComercial ?? '',
      legalName: business.RazonSocial ?? '',
      rfc: business.RFC ?? '',
      phone: business.Telefono ?? '',
      address: business.Direccion ?? '',
      currency: business.Moneda ?? 'MXN',
      logoUrl: business.LogoUrl ?? '',
    },
    ticket: {
      paperWidth: ticket.AnchoPapel ?? '80mm',
      showLogo: ticket.MostrarLogo ?? true,
      showRfc: ticket.MostrarRFC ?? true,
      showCashier: ticket.MostrarCajero ?? true,
      headerText: ticket.TextoEncabezado ?? '',
      footerText: ticket.MensajePie ?? '',
      automaticCopies: Number(ticket.CopiasAutomaticas ?? 1),
    },
    rules: {
      freshProduceVat: Number(rules.IVAFrescos ?? 0),
      packagedGoodsVat: Number(rules.IVAEmpacados ?? 16),
      cashRounding: rules.RedondeoEfectivo ?? true,
      pinForCancellation: rules.ExigirPINCancelacion ?? true,
      pinForShrinkage: rules.ExigirPINMerma ?? true,
      defaultMinimumStock: Number(rules.StockMinimoDefault ?? 10),
    },
  };
}

export function adaptSettingsToBackend(settings) {
  return {
    NegocioConfig: {
      NombreComercial: settings.business.commercialName.trim(),
      RazonSocial: settings.business.legalName.trim(),
      RFC: settings.business.rfc.trim().toUpperCase(),
      Telefono: settings.business.phone.trim(),
      Direccion: settings.business.address.trim(),
      Moneda: 'MXN',
      LogoUrl: settings.business.logoUrl,
    },
    TicketConfig: {
      AnchoPapel: settings.ticket.paperWidth,
      MostrarLogo: settings.ticket.showLogo,
      MostrarRFC: settings.ticket.showRfc,
      MostrarCajero: settings.ticket.showCashier,
      TextoEncabezado: settings.ticket.headerText,
      MensajePie: settings.ticket.footerText,
      CopiasAutomaticas: Number(settings.ticket.automaticCopies),
    },
    ReglasOperativasConfig: {
      IVAFrescos: Number(settings.rules.freshProduceVat),
      IVAEmpacados: Number(settings.rules.packagedGoodsVat),
      RedondeoEfectivo: settings.rules.cashRounding,
      ExigirPINCancelacion: settings.rules.pinForCancellation,
      ExigirPINMerma: settings.rules.pinForShrinkage,
      StockMinimoDefault: Number(settings.rules.defaultMinimumStock),
    },
  };
}

export function adaptBackupFromBackend(dto) {
  return {
    id: dto.IdRespaldo,
    date: dto.Fecha,
    type: dto.Tipo,
    size: dto.Tamano,
    status: dto.Estatus,
  };
}

export function adaptSystemStatusFromBackend(dto) {
  return {
    apiStatus: dto.EstadoAPI,
    databaseStatus: dto.EstadoBaseDatos,
    checkedAt: dto.UltimaVerificacion,
    apiVersion: dto.VersionAPI,
  };
}
