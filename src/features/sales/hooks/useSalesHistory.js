import { useCallback, useEffect, useMemo, useState } from 'react';
import { adaptSaleFromBackend } from '../adapters/salesAdapter';
import { cancelSaleRequest, getSalesHistory, registerInstallmentPaymentRequest } from '../api/salesApi';
import { formatCurrency } from '../../../utils/formatters';

const initialFilters = { searchTerm: '', cashierFilter: 'Todos', paymentMethod: 'Todas', status: 'Todas' };
const initialDateRange = { preset: '30', startDate: '', endDate: '' };

function isWithinRange(sale, range) {
  const date = new Date(sale.date);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (range.preset.toUpperCase() === 'CUSTOM') {
    const from = range.startDate ? new Date(`${range.startDate}T00:00:00`) : null;
    const to = range.endDate ? new Date(`${range.endDate}T23:59:59.999`) : null;
    return (!from || date >= from) && (!to || date <= to);
  }
  if (range.preset === 'all') return date <= today;

  const days = Number(range.preset);
  if (!Number.isFinite(days)) return true;
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  return date >= start && date <= today;
}

function filterSales(sales, filters, dateRange) {
  const search = filters.searchTerm.trim().toLocaleLowerCase('es-MX');
  return sales.filter((sale) => {
    const searchableText = [sale.folio, sale.cajero ?? sale.cashier]
      .join(' ')
      .toLocaleLowerCase('es-MX');
    return (!search || searchableText.includes(search))
      && (filters.cashierFilter === 'Todos' || sale.cashier === filters.cashierFilter)
      && (filters.paymentMethod === 'Todas' || sale.paymentMethod === filters.paymentMethod)
      && (filters.status === 'Todas'
        || (filters.status === 'PARCIAL' ? sale.estatus === 2 : sale.status === filters.status))
      && isWithinRange(sale, dateRange);
  });
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

function downloadFile(contents, filename, mimeType) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportSales(sales, format) {
  const columns = ['Folio', 'Fecha', 'Cajero', 'Cliente', 'Método de pago', 'Estatus', 'Total'];
  const rows = sales.map((sale) => [
    sale.folio,
    new Date(sale.date).toLocaleString('es-MX'),
    sale.cashier,
    sale.customer,
    sale.paymentMethod,
    sale.status,
    sale.total.toFixed(2),
  ]);
  const filename = `historial-ventas-${new Date().toISOString().slice(0, 10)}`;

  if (format === 'csv') {
    downloadFile(`\uFEFF${[columns, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}`, `${filename}.csv`, 'text/csv;charset=utf-8');
    return;
  }
  if (format === 'excel') {
    const table = [columns, ...rows].map((row) => (
      `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`
    )).join('');
    downloadFile(`<!doctype html><html><meta charset="utf-8"><table>${table}</table></html>`, `${filename}.xls`, 'application/vnd.ms-excel;charset=utf-8');
    return;
  }
  if (format === 'pdf') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) throw new Error('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para exportar a PDF.');
    printWindow.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><title>Historial de ventas</title><style>body{font:12px Arial,sans-serif;color:#0f172a;padding:24px}h1{font-size:20px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9}</style><h1>Historial de ventas</h1><table><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table><script>window.onload=()=>window.print()</script></html>`);
    printWindow.document.close();
    return;
  }
  throw new Error('Formato de exportación no soportado.');
}

export default function useSalesHistory() {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [filters, setFilters] = useState(initialFilters);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;
    getSalesHistory()
      .then((response) => {
        if (active) {
          const updatedSales = response.map(adaptSaleFromBackend);
          setSalesList(updatedSales);
          setSelectedSale((current) => current
            ? updatedSales.find((sale) => sale.id === current.id) ?? null
            : null);
          setLastUpdated(new Date());
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar el historial de ventas.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setIsRefreshing(false);
        }
      });
    return () => { active = false; };
  }, [refreshVersion]);

  const filteredSales = useMemo(
    () => filterSales(salesList, filters, dateRange),
    [salesList, filters, dateRange],
  );
  const applyFilters = useCallback(
    () => filterSales(salesList, filters, dateRange),
    [salesList, filters, dateRange],
  );

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setDateRange({ preset: 'all', startDate: '', endDate: '' });
  }, []);
  const refreshSales = useCallback(() => {
    setError('');
    setIsRefreshing(true);
    setRefreshVersion((version) => version + 1);
  }, []);

  const selectSale = useCallback((id) => {
    setSelectedSale(salesList.find((sale) => sale.id === id) ?? null);
  }, [salesList]);

  const replaceSale = useCallback((updatedSale) => {
    setSalesList((sales) => sales.map((sale) => sale.id === updatedSale.id ? updatedSale : sale));
    setSelectedSale((current) => current?.id === updatedSale.id ? updatedSale : current);
  }, []);

  const cancelSale = useCallback(async (id, reason) => {
    const normalizedReason = String(reason ?? '').trim();
    if (!normalizedReason) throw new Error('Indica el motivo de cancelación.');
    setError('');
    try {
      const updatedSale = adaptSaleFromBackend(await cancelSaleRequest(id, normalizedReason));
      replaceSale(updatedSale);
      return updatedSale;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cancelar la venta.');
      throw requestError;
    }
  }, [replaceSale]);

  const registerInstallmentPayment = useCallback(async (saleId, amount, paymentMethod) => {
    setError('');
    try {
      const updatedSale = adaptSaleFromBackend(
        await registerInstallmentPaymentRequest(saleId, amount, paymentMethod),
      );
      replaceSale(updatedSale);
      return updatedSale;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible registrar el abono.');
      throw requestError;
    }
  }, [replaceSale]);

  const exportData = useCallback((format) => exportSales(filteredSales, format), [filteredSales]);

  const kpis = useMemo(() => {
    const activeSales = filteredSales.filter((sale) => sale.estatus !== 0);
    const sumPaid = (sales) => sales.reduce((total, sale) => total + sale.montoPagado, 0);
    const sumByMethod = (sales, method) => sales.reduce((total, sale) => {
      const payments = sale.historialAbonos;
      const recorded = payments.reduce((sum, payment) => (
        sum + (payment.metodoPago === method ? payment.monto : 0)
      ), 0);
      const unrecorded = Math.max(0, sale.montoPagado - payments.reduce((sum, payment) => sum + payment.monto, 0));
      return total + recorded + (sale.paymentMethod === method ? unrecorded : 0);
    }, 0);
    const totalPaid = sumPaid(activeSales);
    const completedSalesCount = filteredSales.filter((sale) => sale.estatus === 1).length;
    return {
      totalSales: totalPaid,
      transactions: activeSales.length,
      completedSalesCount,
      cash: sumByMethod(activeSales, 'Efectivo'),
      card: sumByMethod(activeSales, 'Tarjeta'),
      average: activeSales.length ? totalPaid / activeSales.length : 0,
      saldoPorCobrar: activeSales.reduce((total, sale) => total + sale.saldoPendiente, 0),
      cancellations: filteredSales.filter((sale) => sale.status === 'Cancelada').length,
    };
  }, [filteredSales]);

  return {
    salesList,
    cashiers: [...new Set(salesList.map((sale) => sale.cashier))].sort((a, b) => a.localeCompare(b, 'es-MX')),
    filteredSales,
    loading,
    isRefreshing,
    lastUpdated,
    error,
    selectedSale,
    dateRange,
    setDateRange,
    filters,
    setFilters,
    kpis,
    applyFilters,
    clearFilters,
    refreshSales,
    selectSale,
    closeSale: () => setSelectedSale(null),
    cancelSale,
    registerInstallmentPayment,
    exportData,
    formatCurrency,
  };
}
