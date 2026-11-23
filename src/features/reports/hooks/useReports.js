import { useCallback, useEffect, useMemo, useState } from 'react';
import { getExecutiveReport } from '../api/reportsApi';
import { adaptExecutiveReport } from '../adapters/reportAdapter';

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const defaultCustomRange = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const format = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return { start: format(start), end: format(end) };
};
const tabLabels = {
  profitability: 'Rentabilidad',
  products: 'Productos',
  cashcuts: 'Cortes de caja',
  shrinkage: 'Mermas',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

function columnName(index) {
  let value = index + 1;
  let name = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index];
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  files.forEach(({ name, content }) => {
    const filename = encoder.encode(name);
    const data = encoder.encode(content);
    const checksum = crc32(data);
    const localHeader = new Uint8Array(30 + filename.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034B50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(8, 0, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, filename.length, true);
    localHeader.set(filename, 30);
    localParts.push(localHeader, data);

    const centralHeader = new Uint8Array(46 + filename.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014B50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, filename.length, true);
    centralView.setUint32(42, localOffset, true);
    centralHeader.set(filename, 46);
    centralParts.push(centralHeader);
    localOffset += localHeader.length + data.length;
  });
  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054B50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, localOffset, true);
  return new Blob([...localParts, ...centralParts, end], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

function makeXlsx(rows) {
  const xmlEscape = (value) => escapeHtml(value);
  const xmlRows = rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => {
    const reference = `${columnName(columnIndex)}${rowIndex + 1}`;
    if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${reference}"><v>${value}</v></c>`;
    return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(value)}</t></is></c>`;
  }).join('')}</row>`).join('');
  const lastCell = `${columnName(Math.max(...rows.map((row) => row.length), 1) - 1)}${rows.length}`;
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${lastCell}"/><sheetData>${xmlRows}</sheetData></worksheet>`;
  const files = [
    { name: '[Content_Types].xml', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>' },
    { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Reporte AdminWare" sheetId="1" r:id="rId1"/></sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: 'xl/worksheets/sheet1.xml', content: sheet },
  ];
  return zipStore(files);
}

function reportRows(report, tabName) {
  const summaryRows = [
    ['Reporte AdminWare', tabLabels[tabName] ?? tabName],
    ['Ingresos brutos', report.summary.revenue, 'Costo de ventas', report.summary.cost, 'Utilidad neta', report.summary.profit],
    [],
  ];
  if (tabName === 'profitability') return [...summaryRows, ['Categoría', 'Ingresos', 'Costo', 'Utilidad', 'Margen (%)'], ...report.categories.map((item) => [item.name, item.revenue, item.cost, item.profit, item.margin])];
  if (tabName === 'products') {
    const totalRevenue = report.products.reduce((total, item) => total + item.revenue, 0) || 1;
    return [...summaryRows, ['Producto', 'Categoría', 'Volumen', 'Unidad', 'Ingresos', 'Utilidad', 'Participación (%)', 'Rotación'], ...report.products.map((item) => [item.name, item.category, item.volume, item.unit, item.revenue, item.profit, item.revenue / totalRevenue * 100, item.lowRotation ? 'Baja' : 'Normal'])];
  }
  if (tabName === 'cashcuts') return [...summaryRows, ['Folio', 'Fecha', 'Cajero', 'Turno', 'Sucursal', 'Efectivo esperado', 'Contado físico', 'Diferencia', 'Estado'], ...report.cashCuts.map((item) => [item.folio, item.date, item.cashier, item.shift, item.branch, item.expectedCash, item.countedCash, item.difference, item.status])];
  return [...summaryRows, ['Fecha', 'Producto', 'Cantidad', 'Unidad', 'Motivo', 'Costo unitario', 'Impacto MXN', 'Responsable'], ...report.shrinkage.map((item) => [item.date, item.product, item.quantity, item.unit, item.reason, item.unitCost, item.amount, item.responsible])];
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderPrintReport(printWindow, rows, tabName) {
  const header = rows[0] ?? ['Reporte AdminWare'];
  const tableRows = rows.slice(4).map((row) => (
    `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
  )).join('');
  const columns = rows[3] ?? [];
  printWindow.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><title>${escapeHtml(header.join(' · '))}</title><style>body{font:12px Arial,sans-serif;color:#0f172a;padding:28px}h1{font-size:20px}p{color:#64748b}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;padding:9px;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9}button{padding:9px 14px;background:#059669;color:white;border:0;border-radius:8px;cursor:pointer}@media print{button{display:none}}</style><h1>${escapeHtml(header.join(' · '))}</h1><p>Reporte ${escapeHtml(tabLabels[tabName] ?? tabName)} · AdminWare</p><p>${rows[1]?.map((value) => escapeHtml(value)).join(' · ') ?? ''}</p><button onclick="window.print()">Imprimir / Guardar como PDF</button><table><thead><tr>${columns.map((cell) => `<th>${escapeHtml(cell)}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></html>`);
  printWindow.document.close();
}

export default function useReports() {
  const [datePreset, setDatePreset] = useState('MONTH');
  const [customRange, setCustomRange] = useState(defaultCustomRange);
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('profitability');
  const [reportData, setReportData] = useState(null);
  const [selectedCashCut, setSelectedCashCut] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loadedRequestKey, setLoadedRequestKey] = useState('');
  const [error, setError] = useState('');
  const [exportMessage, setExportMessage] = useState('');
  const requestKey = JSON.stringify([datePreset, customRange, shiftFilter, branchFilter]);
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    getExecutiveReport({ datePreset, customRange, shift: shiftFilter, branch: branchFilter })
      .then((response) => {
        if (active) {
          setReportData(adaptExecutiveReport(response));
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) {
          setReportData(null);
          setError(requestError.message || 'No fue posible generar el reporte.');
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => { active = false; };
  }, [branchFilter, customRange, datePreset, requestKey, shiftFilter]);

  const kpis = reportData?.summary ?? {
    revenue: 0, cost: 0, profit: 0, margin: 0, shrinkageCost: 0, cashCutBalance: 0,
  };

  const exportReport = useCallback(async (format, tabName = activeTab) => {
    if (!reportData || isExporting) return false;
    setError('');
    setExportMessage('');
    let printWindow = null;
    if (format === 'pdf') {
      printWindow = window.open('', '_blank');
      if (!printWindow) {
        setError('El navegador bloqueó la ventana de exportación. Permite ventanas emergentes para continuar.');
        return false;
      }
    }
    if (!['xlsx', 'pdf'].includes(format)) {
      setError('Formato de exportación no soportado.');
      return false;
    }
    setIsExporting(true);
    try {
      const rows = reportRows(reportData, tabName);
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      const filename = `adminware-${tabName}-${todayISO()}`;
      if (format === 'xlsx') {
        triggerDownload(makeXlsx(rows), `${filename}.xlsx`);
        setExportMessage('Reporte Excel generado y descargado.');
      } else {
        renderPrintReport(printWindow, rows, tabName);
        setExportMessage('Reporte PDF listo. Usa “Imprimir / Guardar como PDF” en la nueva pestaña.');
      }
      return true;
    } catch (exportError) {
      if (printWindow && !printWindow.closed) printWindow.close();
      setError(exportError.message || 'No fue posible exportar el reporte.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [activeTab, isExporting, reportData]);

  const openCashCut = useCallback((cashCut) => setSelectedCashCut(cashCut), []);
  const closeCashCut = useCallback(() => setSelectedCashCut(null), []);
  const clearError = useCallback(() => setError(''), []);
  const dismissExportMessage = useCallback(() => setExportMessage(''), []);

  const reportPeriodLabel = useMemo(() => {
    if (datePreset === 'TODAY') return 'Hoy';
    if (datePreset === '7D') return 'Últimos 7 días';
    if (datePreset === 'MONTH') return 'Mes actual';
    return `${customRange.start || '—'} a ${customRange.end || '—'}`;
  }, [customRange, datePreset]);

  return {
    datePreset,
    setDatePreset,
    customRange,
    setCustomRange,
    shiftFilter,
    setShiftFilter,
    branchFilter,
    setBranchFilter,
    activeTab,
    setActiveTab,
    reportData,
    kpis,
    selectedCashCut,
    openCashCut,
    closeCashCut,
    isExporting,
    exportReport,
    exportMessage,
    dismissExportMessage,
    loading,
    error,
    clearError,
    reportPeriodLabel,
  };
}
