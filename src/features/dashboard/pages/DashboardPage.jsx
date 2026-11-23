import { lazy, Suspense } from 'react';
import { Plus } from 'lucide-react';
import { PosPage } from '../../pos';
import { AddProductModal, ProductsPage, useProducts } from '../../products';
import { SalesHistoryPage } from '../../sales';
import { InventoryPage } from '../../inventory';
import { SuppliersPage } from '../../suppliers';
import { CustomersPage } from '../../customers';
import { EmployeesPage } from '../../employees';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCards from '../components/StatCards';
import SalesChart from '../components/SalesChart';
import StockAlerts from '../components/StockAlerts';
import ProductsTable from '../components/ProductsTable';
import useDashboard from '../hooks/useDashboard';

const ReportsPage = lazy(() => import('../../reports/pages/ReportsPage'));
const SettingsPage = lazy(() => import('../../settings/pages/SettingsPage'));

export default function DashboardPage({ onLogout }) {
  const dashboard = useDashboard();
  const productInventory = useProducts(dashboard.productsList, { load: false });

  const handleCreateProduct = async (formData) => {
    await productInventory.createProduct(formData);
    dashboard.closeProductModal();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans relative">
      <Sidebar activeTab={dashboard.activeTab} onTabChange={dashboard.setActiveTab} onLogout={onLogout} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        {dashboard.activeTab === 'overview' ? (
          <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
            <div className="flex items-center justify-between">
              <div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1><p className="text-xs text-slate-500 mt-0.5">Resumen de ventas, rendimiento e inventario en tiempo real.</p></div>
              <button onClick={dashboard.openProductModal} className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"><Plus className="w-4 h-4" />Nuevo Producto</button>
            </div>
            <StatCards products={dashboard.productsList} /> 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><SalesChart data={dashboard.salesData} /><StockAlerts alerts={dashboard.stockAlerts} /></div>
            <ProductsTable products={dashboard.productsList} />
          </div>
        ) : dashboard.activeTab === 'pos' ? <PosPage products={productInventory.products} /> : dashboard.activeTab === 'products' ? <ProductsPage inventory={productInventory} /> : dashboard.activeTab === 'inventory' ? <InventoryPage /> : dashboard.activeTab === 'suppliers' ? <SuppliersPage products={productInventory.products} /> : dashboard.activeTab === 'customers' ? <CustomersPage /> : dashboard.activeTab === 'employees' ? <EmployeesPage /> : dashboard.activeTab === 'reports' ? <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Cargando reportes…</div>}><ReportsPage /></Suspense> : dashboard.activeTab === 'settings' ? <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Cargando configuración…</div>}><SettingsPage /></Suspense> : dashboard.activeTab === 'sales_history' ? <SalesHistoryPage /> : <div className="p-12 text-center text-slate-400"><h3 className="text-lg font-bold text-slate-600">Módulo en Desarrollo</h3><p className="text-xs mt-1">Próximamente conectaremos esta sección.</p></div>}
      </main>
      <AddProductModal
        isOpen={dashboard.isModalOpen}
        onClose={dashboard.closeProductModal}
        onSubmit={handleCreateProduct}
        categories={productInventory.categories}
        generateCode={productInventory.generateCode}
      />
    </div>
  );
}
 