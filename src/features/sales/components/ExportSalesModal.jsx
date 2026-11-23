import { useState } from 'react';
import { FileDown, FileSpreadsheet, FileText, X } from 'lucide-react';

const formats = [
  { value: 'excel', label: 'Excel', description: 'Archivo compatible con Microsoft Excel', Icon: FileSpreadsheet },
  { value: 'pdf', label: 'PDF', description: 'Imprimir o guardar como PDF', Icon: FileText },
  { value: 'csv', label: 'CSV', description: 'Valores separados por comas', Icon: FileDown },
];

export default function ExportSalesModal({ isOpen, onClose, onExport, salesCount }) {
  const [error, setError] = useState('');
  if (!isOpen) return null;

  const handleExport = (format) => {
    try {
      onExport(format);
      setError('');
      onClose();
    } catch (exportError) {
      setError(exportError.message || 'No fue posible exportar los datos.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="export-sales-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <header className="flex items-start justify-between">
          <div>
            <h2 id="export-sales-title" className="text-base font-bold text-slate-900">Exportar historial</h2>
            <p className="mt-1 text-xs text-slate-500">{salesCount} transacciones con los filtros actuales</p>
          </div>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </header>
        <div className="mt-5 space-y-2">
          {formats.map(({ value, label, description, Icon }) => (
            <button key={value} type="button" onClick={() => handleExport(value)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span>
              <span><span className="block text-xs font-bold text-slate-800">{label}</span><span className="mt-0.5 block text-[10px] text-slate-500">{description}</span></span>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700">{error}</p>}
      </section>
    </div>
  );
}
