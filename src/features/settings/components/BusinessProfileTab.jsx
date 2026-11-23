import { ImagePlus, Store } from 'lucide-react';

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10';

function Field({ label, value, onChange, placeholder, required = false, ...props }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label}{required && <span className="ml-1 text-rose-500">*</span>}
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} {...props} />
    </label>
  );
}

export default function BusinessProfileTab({ business, onChange }) {
  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      event.target.setCustomValidity('Selecciona una imagen PNG, JPG o WebP.');
      event.target.reportValidity();
      event.target.setCustomValidity('');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      event.target.setCustomValidity('El logotipo debe pesar menos de 2 MB.');
      event.target.reportValidity();
      event.target.setCustomValidity('');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange('logoUrl', String(reader.result));
    reader.onerror = () => {
      event.target.setCustomValidity('No fue posible leer el archivo seleccionado.');
      event.target.reportValidity();
      event.target.setCustomValidity('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Store className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-slate-900">Datos de la empresa</h2><p className="mt-1 text-xs text-slate-500">Identidad comercial y fiscal que aparecerá en tus documentos.</p></div></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre comercial" value={business.commercialName} onChange={(value) => onChange('commercialName', value)} placeholder="Nombre visible para tus clientes" required />
          <Field label="Razón social" value={business.legalName} onChange={(value) => onChange('legalName', value)} placeholder="Razón social registrada" />
          <Field label="RFC" value={business.rfc} onChange={(value) => onChange('rfc', value.toUpperCase())} placeholder="RFC" required maxLength={13} />
          <Field label="Teléfono" value={business.phone} onChange={(value) => onChange('phone', value)} placeholder="669 000 0000" type="tel" />
          <label className="block text-xs font-semibold text-slate-700 md:col-span-2">Dirección
            <textarea className={`${inputClass} min-h-20 resize-y`} value={business.address} onChange={(event) => onChange('address', event.target.value)} placeholder="Calle, colonia, ciudad y estado" rows={3} />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Moneda
            <input className={`${inputClass} bg-slate-50 text-slate-500`} value="MXN · Peso mexicano" readOnly />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4"><h2 className="text-sm font-bold text-slate-900">Logotipo del negocio</h2><p className="mt-1 text-xs text-slate-500">PNG, JPG o WebP · máximo 2 MB.</p></div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
            {business.logoUrl ? <img src={business.logoUrl} alt="Logotipo del negocio" className="h-full w-full object-contain" /> : <ImagePlus className="h-7 w-7" />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            <ImagePlus className="h-4 w-4" />{business.logoUrl ? 'Cambiar logotipo' : 'Cargar logotipo'}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleLogoFile} />
          </label>
          {business.logoUrl && <button type="button" onClick={() => onChange('logoUrl', '')} className="text-xs font-semibold text-rose-600 hover:text-rose-700">Quitar logotipo</button>}
        </div>
      </section>
    </div>
  );
}
