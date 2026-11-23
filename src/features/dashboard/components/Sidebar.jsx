import {
  LayoutDashboard, ShoppingBag, History, Package, Boxes, Truck, Users,
  UserCheck, BarChart3, Settings, LogOut,
} from 'lucide-react';
import logoAdminware from '../../../assets/logoAdminware.png';

const groups = [
  {
    label: 'General',
    items: [
      ['overview', 'Panel de control', LayoutDashboard],
      ['pos', 'Punto de venta', ShoppingBag],
      ['sales_history', 'Historial de ventas', History],
    ],
  },
  {
    label: 'Gestión Comercial',
    items: [
      ['products', 'Productos', Package],
      ['inventory', 'Inventario', Boxes],
      ['suppliers', 'Proveedores', Truck],
      ['customers', 'Clientes', Users],
    ],
  },
  {
    label: 'Administración',
    items: [
      ['employees', 'Empleados', UserCheck],
      ['reports', 'Reportes', BarChart3],
      ['settings', 'Configuración', Settings],
    ],
  },
];

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 sticky top-0 h-screen z-20">
      <div className="overflow-y-auto pr-1">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src={logoAdminware} alt="AdminWare" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">ADMINWARE</h2>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">POS & MANAGEMENT</span>
          </div>
        </div>

        <nav className="space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeTab === id ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === id ? 'text-emerald-600' : ''}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
