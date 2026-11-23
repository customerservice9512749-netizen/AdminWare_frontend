import { useState } from 'react';
import { History } from 'lucide-react';
import useSalesHistory from '../hooks/useSalesHistory';
import ExportSalesModal from '../components/ExportSalesModal';
import SaleDetailDrawer from '../components/SaleDetailDrawer';
import SalesAnalyticsChart from '../components/SalesAnalyticsChart';
import SalesFilterBar from '../components/SalesFilterBar';
import SalesKPIHeader from '../components/SalesKPIHeader';
import SalesTable from '../components/SalesTable';

export default function SalesHistoryPage() {
  const sales = useSalesHistory();
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <History className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Historial de ventas</h1>
            <p className="mt-1 text-xs text-slate-500">Consulta, analiza y administra las transacciones de tu negocio.</p>
          </div>
        </div>
      </header>

      {sales.error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {sales.error}
        </div>
      )}

      <SalesKPIHeader kpis={sales.kpis} />
      <SalesFilterBar
        filters={sales.filters}
        onFiltersChange={sales.setFilters}
        cashiers={sales.cashiers}
        dateRange={sales.dateRange}
        onDateRangeChange={sales.setDateRange}
        onClear={sales.clearFilters}
        onExport={() => setIsExportOpen(true)}
        onRefresh={sales.refreshSales}
        isRefreshing={sales.isRefreshing}
        lastUpdated={sales.lastUpdated}
      />
      <SalesAnalyticsChart sales={sales.filteredSales} dateRange={sales.dateRange} onDateRangeChange={sales.setDateRange} />
      <SalesTable sales={sales.filteredSales} loading={sales.loading} onSelectSale={sales.selectSale} />

      {sales.selectedSale && <SaleDetailDrawer key={sales.selectedSale.id} sale={sales.selectedSale} onClose={sales.closeSale} onCancelSale={sales.cancelSale} onRegisterInstallmentPayment={sales.registerInstallmentPayment} />}
      <ExportSalesModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={sales.exportData}
        salesCount={sales.filteredSales.length}
      />
    </div>
  );
}
