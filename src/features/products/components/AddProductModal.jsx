import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { generateProductCode } from '../adapters/productAdapter';

const blankProduct = {
  code: '',
  name: '',
  categoryId: '',
  category: 'General',
  costPrice: '',
  salePrice: '',
  unit: 'KG',
  currentStock: '0',
  minStock: '0',
  description: '',
  image: '',
  status: true,
};

function getInitialFormData(product, categories) {
  const selectedCategory = product
    ? { id: product.categoryId, name: product.category }
    : categories[0];
  return product ? {
    ...blankProduct,
    ...product,
    categoryId: String(product.categoryId ?? ''),
    currentStock: String(product.currentStock ?? product.stock ?? 0),
    minStock: String(product.minStock ?? 0),
    costPrice: String(product.costPrice ?? ''),
    salePrice: String(product.salePrice ?? product.price ?? ''),
  } : {
    ...blankProduct,
    categoryId: String(selectedCategory?.id ?? ''),
    category: selectedCategory?.name ?? 'General',
  };
}

const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No fue posible leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  generateCode = generateProductCode,
}) {
  const [formData, setFormData] = useState(() => getInitialFormData(product, categories));
  const [imageName, setImageName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  if (!isOpen) return null;

  const updateField = (key, value) => setFormData((current) => ({ ...current, [key]: value }));

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    const category = categories.find((item) => String(item.id) === categoryId);
    setFormData((current) => ({
      ...current,
      categoryId,
      category: category?.name ?? 'General',
    }));
  };

  const handleImageChange = async (event) => {
    const [file] = event.target.files ?? [];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido.');
      return;
    }
    try {
      updateField('image', await readImage(file));
      setImageName(file.name);
      setError('');
    } catch (imageError) {
      setError(imageError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        categoryId: Number(formData.categoryId) || 0,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        costPrice: Number(formData.costPrice),
        salePrice: Number(formData.salePrice),
        code: String(formData.code).trim() || generateCode(formData.unit),
      });
      onClose();
    } catch (submitError) {
      setError(submitError.message || 'No fue posible guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 id="product-modal-title" className="text-lg font-bold text-slate-900">{isEditing ? 'Editar producto' : 'Agregar producto'}</h2>
            <p className="mt-0.5 text-xs text-slate-500">Completa los datos del catálogo e inventario.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre del producto *</span>
              <input required autoFocus value={formData.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Ej. Tomate saladette" className={fieldClass} />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Categoría *</span>
              <select required value={formData.categoryId} onChange={handleCategoryChange} className={fieldClass}>
                {categories.length === 0 && <option value="0">General</option>}
                {categories.map((category, index) => (
                  <option key={`${category.id}-${category.name}-${index}`} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="mb-1.5 text-xs font-semibold text-slate-700">Tipo de venta *</legend>
              <div className="flex h-[42px] gap-2">
                {['KG', 'PZA'].map((unit) => (
                  <label key={unit} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${formData.unit === unit ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="unit" value={unit} checked={formData.unit === unit} onChange={() => setFormData((current) => ({ ...current, unit, code: '' }))} className="accent-emerald-600" />
                    {unit === 'KG' ? 'Por peso · KG' : 'Por pieza · PZA'}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Código / PLU</span>
              <div className="flex gap-2">
                <input value={formData.code} onChange={(event) => updateField('code', event.target.value)} placeholder={formData.unit === 'KG' ? 'PLU de 4 dígitos' : 'Código EAN-13'} className={fieldClass} />
                <button type="button" onClick={() => updateField('code', generateCode(formData.unit))} className="shrink-0 rounded-xl border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">
                  Generar Código/PLU
                </button>
              </div>
              <span className="mt-1 block text-[11px] text-slate-400">{formData.unit === 'KG' ? 'Genera un PLU de 4 dígitos.' : 'Genera un código EAN-13 válido.'}</span>
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Precio de venta *</span>
              <input required type="number" min="0" step="0.01" value={formData.salePrice} onChange={(event) => updateField('salePrice', event.target.value)} placeholder="0.00" className={fieldClass} />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Costo *</span>
              <input required type="number" min="0" step="0.01" value={formData.costPrice} onChange={(event) => updateField('costPrice', event.target.value)} placeholder="0.00" className={fieldClass} />
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Existencias actuales</span>
              <input type="number" min="0" step={formData.unit === 'KG' ? '0.001' : '1'} value={formData.currentStock} onChange={(event) => updateField('currentStock', event.target.value)} className={fieldClass} />
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Stock mínimo</span>
              <input type="number" min="0" step={formData.unit === 'KG' ? '0.001' : '1'} value={formData.minStock} onChange={(event) => updateField('minStock', event.target.value)} className={fieldClass} />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Imagen del producto</span>
              <span className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3">
                {formData.image ? <img src={formData.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <ImagePlus className="h-5 w-5 text-slate-400" />}
                <span className="min-w-0 flex-1 truncate text-xs text-slate-500">{imageName || (formData.image ? 'Imagen cargada' : 'PNG, JPG o WEBP')}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="max-w-40 text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-700" />
              </span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={formData.status} onChange={(event) => updateField('status', event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
              Producto activo
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Descripción</span>
              <textarea rows="2" value={formData.description} onChange={(event) => updateField('description', event.target.value)} className={`${fieldClass} resize-y`} />
            </label>
          </div>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}

          <footer className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
              {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Guardar producto'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
