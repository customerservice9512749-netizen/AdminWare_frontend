import { Check, Printer, ReceiptText } from 'lucide-react';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10';

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 px-3 py-3 transition hover:bg-slate-50">
      <span><span className="block text-xs font-semibold text-slate-700">{label}</span>{description && <span className="mt-1 block text-[10px] text-slate-500">{description}</span>}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} /></span>
    </label>
  );
}

export default function TicketSettingsTab({ ticket, business, onChange }) {
  const paperClass = ticket.paperWidth === '58mm' ? 'max-w-[250px]' : 'max-w-[310px]';
  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Printer className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-slate-900">Formato del ticket</h2><p className="mt-1 text-xs text-slate-500">Configura la impresión de recibos en el punto de venta.</p></div></div>
        <div className="space-y-4">
          <fieldset><legend className="mb-2 text-xs font-semibold text-slate-700">Ancho de papel</legend><div className="grid grid-cols-2 gap-2">{['58mm', '80mm'].map((width) => <button key={width} type="button" aria-pressed={ticket.paperWidth === width} onClick={() => onChange('paperWidth', width)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${ticket.paperWidth === width ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{width}</button>)}</div></fieldset>
          <label className="block text-xs font-semibold text-slate-700">Texto de encabezado
            <input className={inputClass} value={ticket.headerText} maxLength={80} onChange={(event) => onChange('headerText', event.target.value)} placeholder="Mensaje debajo del nombre del negocio" />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Mensaje al pie
            <textarea className={`${inputClass} min-h-20 resize-y`} value={ticket.footerText} maxLength={120} onChange={(event) => onChange('footerText', event.target.value)} rows={3} placeholder="Agradecimiento o mensaje promocional" />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Copias automáticas
            <select className={inputClass} value={ticket.automaticCopies} onChange={(event) => onChange('automaticCopies', Number(event.target.value))}><option value={1}>1 copia</option><option value={2}>2 copias</option></select>
          </label>
          <div className="space-y-2 pt-1">
            <Toggle label="Mostrar logotipo" checked={ticket.showLogo} onChange={(value) => onChange('showLogo', value)} />
            <Toggle label="Mostrar RFC" checked={ticket.showRfc} onChange={(value) => onChange('showRfc', value)} />
            <Toggle label="Mostrar cajero" checked={ticket.showCashier} onChange={(value) => onChange('showCashier', value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-900">Vista previa en vivo</h2><p className="mt-1 text-xs text-slate-500">El recibo refleja tus cambios al instante.</p></div><ReceiptText className="h-5 w-5 text-emerald-700" /></div>
        <div className="flex justify-center rounded-xl bg-slate-200/70 p-4">
          <div className={`w-full ${paperClass} border-t-4 border-slate-800 bg-white px-5 py-6 font-mono text-[11px] leading-relaxed text-slate-800 shadow-md`}>
            {ticket.showLogo && business.logoUrl && <img src={business.logoUrl} alt="" className="mx-auto mb-2 h-10 max-w-24 object-contain" />}
            <h3 className="text-center text-sm font-bold uppercase">{business.commercialName || 'Nombre del negocio'}</h3>
            {ticket.headerText && <p className="mt-1 text-center text-[10px]">{ticket.headerText}</p>}
            <p className="mt-2 text-center">Mazatlán, Sinaloa</p>
            {ticket.showRfc && <p className="text-center">RFC: {business.rfc || 'RFC DEL NEGOCIO'}</p>}
            <div className="my-3 border-t border-dashed border-slate-400" />
            <div className="flex justify-between font-bold"><span>PRODUCTO</span><span>IMPORTE</span></div>
            <div className="mt-2 flex justify-between"><span>Tomate Saladette 1 kg</span><span>$32.00</span></div>
            <div className="flex justify-between"><span>Aguacate Hass 0.5 kg</span><span>$37.50</span></div>
            <div className="my-3 border-t border-dashed border-slate-400" />
            <div className="flex justify-between text-xs font-bold"><span>TOTAL</span><span>$69.50</span></div>
            {ticket.showCashier && <p className="mt-2">Atendió: Laura Sánchez</p>}
            <p className="mt-1">Fecha: Vista previa</p>
            <p className="mt-1">Artículos: 2</p>
            <div className="my-3 border-t border-dashed border-slate-400" />
            {ticket.footerText && <p className="text-center">{ticket.footerText}</p>}
            <p className="mt-3 flex items-center justify-center gap-1 text-[9px] text-slate-500"><Check className="h-3 w-3" /> {ticket.paperWidth} · Vista previa</p>
          </div>
        </div>
      </section>
    </div>
  );
}
