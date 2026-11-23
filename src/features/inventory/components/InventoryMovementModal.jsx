import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Boxes, X } from 'lucide-react';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';
const wasteReasons = ['Producto maduro / echado a perder', 'Daño en manejo/traslado', 'Caducidad', 'Otro'];
const labels = { ENTRADA: 'Entrada de mercancía', MERMA: 'Registrar merma', AJUSTE: 'Ajuste físico' };

export default function InventoryMovementModal({
  isOpen, config, products, onClose, onSubmit, formatCurrency,
}) {
  const [selectedType, setSelectedType] = useState(() => config?.type || 'ENTRADA');
  const [productId, setProductId] = useState(() => config?.preselectedProduct ? String(config.preselectedProduct.id) : '');
  const [quantity, setQuantity] = useState('');
  const [direction, setDirection] = useState(() => config?.type === 'AJUSTE' ? 'increase' : 'decrease');
  const [unitCost, setUnitCost] = useState(() => config?.preselectedProduct ? String(config.preselectedProduct.unitCost) : '');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const product = useMemo(() => products.find((item) => String(item.id) === String(productId)), [productId, products]);
  if (!isOpen) return null;

  const type = selectedType;
  const amount = Number(quantity) || 0;
  const signedAmount = type === 'AJUSTE' && direction === 'decrease' ? -amount : amount;
  const resultingStock = product ? product.stock + (type === 'ENTRADA' ? amount : type === 'AJUSTE' ? signedAmount : -amount) : 0;
  const unit = product?.unit || (product?.isBulk ? 'kg' : 'pzas');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!product) {
      setError('Selecciona un producto para continuar.');
      return;
    }
    if (!amount || !Number.isFinite(amount)) {
      setError('Ingresa una cantidad válida mayor a cero.');
      return;
    }
    if (type === 'MERMA' && !reason) {
      setError('Selecciona el motivo de la merma.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        productId: product.id,
        type,
        quantity: type === 'AJUSTE' ? signedAmount : amount,
        unitCost: Number(unitCost),
        reason: type === 'MERMA' && reason === 'Otro' ? (notes.trim() || reason) : reason || notes.trim() || labels[type],
        notes: type === 'MERMA' && reason === 'Otro' ? '' : notes.trim(),
      });
      onClose();
    } catch (submitError) {
      setError(submitError.message || 'No fue posible registrar el movimiento.');
    } finally {
      setSaving(false);
    }
  };

  const titleIcon = type === 'ENTRADA' ? <ArrowDownToLine className="h-5 w-5" /> : <ArrowUpFromLine className="h-5 w-5" />;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="inventory-movement-title">
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${type === 'MERMA' ? 'bg-amber-50 text-amber-700' : type === 'AJUSTE' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700'}`}>{titleIcon}</span>
            <div><h2 id="inventory-movement-title" className="text-sm font-bold text-slate-900">{labels[type] || 'Registrar movimiento'}</h2><p className="mt-1 text-xs text-slate-500">El movimiento quedará registrado en el Kardex.</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Tipo de movimiento</span>
            <select value={type} onChange={(event) => {
              const nextType = event.target.value;
              setSelectedType(nextType);
              setQuantity('');
              setReason('');
              setDirection(nextType === 'AJUSTE' ? 'increase' : 'decrease');
            }} className={inputClass}>
              <option value="ENTRADA">Entrada de mercancía</option>
              <option value="MERMA">Merma</option>
              <option value="AJUSTE">Ajuste físico</option>
            </select>
          </label>
          {!config?.preselectedProduct && (
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Producto</span>
              <select required value={productId} onChange={(event) => {
                const nextProduct = products.find((item) => String(item.id) === event.target.value);
                setProductId(event.target.value);
                setUnitCost(nextProduct ? String(nextProduct.unitCost) : '');
              }} className={inputClass}>
                <option value="">Selecciona un producto…</option>
                {products.map((item) => <option key={item.id} value={item.id}>{item.name} · {Number(item.stock).toLocaleString('es-MX')} {item.unit}</option>)}
              </select>
            </label>
          )}

          {product && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Stock actual</p>
                <p className="mt-1 text-sm font-bold text-slate-800">{Number(product.stock).toLocaleString('es-MX', { maximumFractionDigits: 2 })} {unit}</p>
              </div>
              <div className={`rounded-xl border p-3 ${resultingStock < 0 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Stock resultante</p>
                <p className={`mt-1 text-sm font-bold ${resultingStock < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{Number(resultingStock).toLocaleString('es-MX', { maximumFractionDigits: 2 })} {unit}</p>
              </div>
            </div>
          )}

          {type === 'AJUSTE' && (
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Tipo de ajuste</span>
              <select value={direction} onChange={(event) => setDirection(event.target.value)} className={inputClass}>
                <option value="increase">Aumentar existencias</option>
                <option value="decrease">Disminuir existencias</option>
              </select>
            </label>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Cantidad ({unit})</span>
              <input required type="number" min={product?.isBulk ? '0.001' : '1'} step={product?.isBulk ? '0.01' : '1'} value={quantity} onChange={(event) => setQuantity(event.target.value)} className={inputClass} />
            </label>
            {type === 'ENTRADA' && (
              <label>
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Costo unitario</span>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span><input type="number" min="0" step="0.01" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} className={`${inputClass} pl-7`} /></div>
              </label>
            )}
          </div>

          {type === 'MERMA' && (
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Motivo de merma <span className="text-rose-600">*</span></span>
              <select required value={reason} onChange={(event) => setReason(event.target.value)} className={inputClass}>
                <option value="">Selecciona el motivo…</option>
                {wasteReasons.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          )}

          {type !== 'MERMA' || reason === 'Otro' ? (
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{type === 'MERMA' ? 'Describe el motivo' : 'Motivo / observaciones'}</span>
              <textarea rows="2" value={notes} onChange={(event) => setNotes(event.target.value)} className={inputClass} placeholder={type === 'MERMA' ? 'Especifica el motivo…' : 'Ej. Reposición de proveedor, conteo físico…'} />
            </label>
          ) : null}

          {product && <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500"><Boxes className="h-4 w-4 text-slate-400" />Valor actual del producto: <span className="font-semibold text-slate-700">{formatCurrency(product.stock * product.unitCost)}</span></div>}
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={saving || !product || resultingStock < 0} className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${type === 'MERMA' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{saving ? 'Guardando…' : 'Registrar movimiento'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}
