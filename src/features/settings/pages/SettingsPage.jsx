import { AlertCircle, Check, Save, Settings2, Undo2 } from 'lucide-react';
import BusinessProfileTab from '../components/BusinessProfileTab';
import OperationalRulesTab from '../components/OperationalRulesTab';
import SettingsSidebar from '../components/SettingsSidebar';
import SystemBackupTab from '../components/SystemBackupTab';
import TicketSettingsTab from '../components/TicketSettingsTab';
import useSettings from '../hooks/useSettings';

export default function SettingsPage() {
  const config = useSettings();
  let activeContent = null;
  if (config.draftSettings && config.activeSection === 'ticket') {
    activeContent = <TicketSettingsTab ticket={config.draftSettings.ticket} business={config.draftSettings.business} onChange={(field, value) => config.updateSectionField('ticket', field, value)} />;
  } else if (config.draftSettings && config.activeSection === 'rules') {
    activeContent = <OperationalRulesTab rules={config.draftSettings.rules} onChange={(field, value) => config.updateSectionField('rules', field, value)} />;
  } else if (config.draftSettings && config.activeSection === 'backup') {
    activeContent = <SystemBackupTab systemStatus={config.systemStatus} backups={config.backups} onCreateBackup={config.createManualBackup} isCreatingBackup={config.isCreatingBackup} />;
  } else if (config.draftSettings) {
    activeContent = <BusinessProfileTab business={config.draftSettings.business} onChange={(field, value) => config.updateSectionField('business', field, value)} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-5 md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Settings2 className="h-5 w-5" /></span><div><h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Configuración del sistema</h1><p className="mt-1 text-xs text-slate-500">Administra el negocio, el punto de venta y las reglas operativas.</p></div></div>
        <div className="flex items-center gap-2">
          <button type="button" disabled={!config.hasUnsavedChanges || config.isSaving} onClick={config.discardChanges} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Undo2 className="h-4 w-4" />Descartar</button>
          <button type="button" disabled={!config.hasUnsavedChanges || config.isSaving || config.isLoading} onClick={config.saveAllSettings} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{config.isSaving ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </header>

      {config.error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{config.error}</span><button type="button" onClick={config.dismissMessages} aria-label="Cerrar error" className="ml-auto font-bold">×</button></div>}
      {config.notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"><Check className="h-4 w-4 shrink-0" /><span>{config.notice}</span><button type="button" onClick={config.dismissMessages} aria-label="Cerrar aviso" className="ml-auto font-bold">×</button></div>}
      {config.hasUnsavedChanges && <p className="text-[11px] font-medium text-amber-700">Tienes cambios sin guardar.</p>}

      {config.isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Cargando configuración…</div> : (
        <div className="grid items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"><SettingsSidebar activeSection={config.activeSection} onSectionChange={config.setActiveSection} /></aside>
          <div className="min-w-0">{activeContent}</div>
        </div>
      )}
    </div>
  );
}
