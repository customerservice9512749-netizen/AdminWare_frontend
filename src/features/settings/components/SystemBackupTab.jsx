import { Activity, CheckCircle2, Clock3, Database, Download, HardDriveDownload, LoaderCircle, RefreshCw, Server } from 'lucide-react';

function formatDate(value) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function StatusCard({ title, status, detail, Icon }) {
  const online = status === 'EN_LINEA';
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${online ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}><span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-rose-500'}`} />{online ? 'En línea' : 'Sin conexión'}</span></div>
      <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3><p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </article>
  );
}

export default function SystemBackupTab({ systemStatus, backups, onCreateBackup, isCreatingBackup }) {
  const sortedBackups = [...backups].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="space-y-5">
      <section>
        <div className="mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-700" /><h2 className="text-sm font-bold text-slate-900">Estado del sistema</h2></div>
        <div className="grid gap-3 sm:grid-cols-2"><StatusCard title="API AdminWare" status={systemStatus.apiStatus} detail={`Versión ${systemStatus.apiVersion}`} Icon={Server} /><StatusCard title="Base de datos" status={systemStatus.databaseStatus} detail={`Última verificación: ${formatDate(systemStatus.checkedAt)}`} Icon={Database} /></div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6"><div><div className="flex items-center gap-2"><HardDriveDownload className="h-4 w-4 text-emerald-700" /><h2 className="text-sm font-bold text-slate-900">Respaldos</h2></div><p className="mt-1 text-xs text-slate-500">Historial de copias de seguridad de configuración.</p></div><button type="button" disabled={isCreatingBackup} onClick={onCreateBackup} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{isCreatingBackup ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{isCreatingBackup ? 'Creando respaldo…' : 'Crear respaldo ahora'}</button></div>
        <div className="divide-y divide-slate-100">{sortedBackups.map((backup) => <div key={backup.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3.5 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:px-6"><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-800">{backup.id}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><Clock3 className="h-3 w-3" />{formatDate(backup.date)}</p></div><span className="hidden rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 md:inline-flex">{backup.type}</span><span className="text-[10px] text-slate-500">{backup.size}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Completo</span></div>)}</div>
        {sortedBackups.length === 0 && <div className="p-8 text-center text-xs text-slate-500">Todavía no hay respaldos registrados.</div>}
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] text-slate-500"><RefreshCw className="h-3.5 w-3.5" />Estado verificado: {formatDate(systemStatus.checkedAt)}</div>
      </section>
    </div>
  );
}
