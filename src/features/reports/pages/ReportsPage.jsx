import { useMemo } from 'react';
import { BarChart3, ClipboardList, PackageSearch, Scale } from 'lucide-react';
import ReportsFilterBar from '../components/ReportsFilterBar';
import ReportsKPIHeader from '../components/ReportsKPIHeader';
import ProfitabilityTab from '../components/ProfitabilityTab';
import TopProductsTab from '../components/TopProductsTab';
import CashCutsTab from '../components/CashCutsTab';
import ShrinkageReportTab from '../components/ShrinkageReportTab';
import CashCutDetailModal from '../components/CashCutDetailModal';
import useReports from '../hooks/useReports';

const tabs = [
  ['profitability', 'Rentabilidad', BarChart3],
  ['products', 'Productos', PackageSearch],
  ['cashcuts', 'Cortes de caja', ClipboardList],
  ['shrinkage', 'Mermas', Scale],
];

export default function ReportsPage() {
  const reports = useReports();
  const content = useMemo(() => {
    if (!reports.reportData) return null;
    if (reports.activeTab === 'products') return <TopProductsTab products={reports.reportData.products} loading={reports.loading} />;
    if (reports.activeTab === 'cashcuts') return <CashCutsTab cuts={reports.reportData.cashCuts} loading={reports.loading} onSelect={reports.openCashCut} />;
    if (reports.activeTab === 'shrinkage') return <ShrinkageReportTab shrinkage={reports.reportData.shrinkage} loading={reports.loading} total={reports.kpis.shrinkageCost} />;
    return <ProfitabilityTab report={reports.reportData} loading={reports.loading} />;
  }, [reports.activeTab, reports.kpis.shrinkageCost, reports.loading, reports.openCashCut, reports.reportData]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><BarChart3 className="h-5 w-5" /></span><div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Reportes ejecutivos</h1><p className="mt-1 text-xs text-slate-500">Analiza rentabilidad, ventas, caja y mermas de tu operación.</p></div></header>
      {reports.error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{reports.error}</span><button type="button" onClick={reports.clearError} aria-label="Cerrar mensaje" className="font-bold">×</button></div>}
      {reports.exportMessage && <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"><span>{reports.exportMessage}</span><button type="button" onClick={reports.dismissExportMessage} aria-label="Cerrar aviso" className="font-bold">×</button></div>}
      <ReportsKPIHeader kpis={reports.kpis} />
      <ReportsFilterBar
        datePreset={reports.datePreset}
        onDatePresetChange={reports.setDatePreset}
        customRange={reports.customRange}
        onCustomRangeChange={reports.setCustomRange}
        shiftFilter={reports.shiftFilter}
        onShiftChange={reports.setShiftFilter}
        branchFilter={reports.branchFilter}
        onBranchChange={reports.setBranchFilter}
        onExport={(format) => reports.exportReport(format, reports.activeTab)}
        isExporting={reports.isExporting}
        reportPeriodLabel={reports.reportPeriodLabel}
      />
      <nav role="tablist" aria-label="Secciones de reportes" className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
        {tabs.map(([id, label, Icon]) => <button key={id} type="button" role="tab" aria-selected={reports.activeTab === id} onClick={() => reports.setActiveTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${reports.activeTab === id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><Icon className="h-4 w-4" />{label}</button>)}
      </nav>
      {reports.loading && !reports.reportData ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Preparando analítica…</div> : content}
      <CashCutDetailModal cashCut={reports.selectedCashCut} onClose={reports.closeCashCut} />
    </div>
  );
}
