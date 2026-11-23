import { ShoppingCart } from 'lucide-react';
import CartItemCard from './CartItemCard';

export default function CartGrid({ items, onAdd, onUpdateQuantity, onRemove }) {
  if (!items.length) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Escanea un código de barras o teclea un PLU para iniciar la venta
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onAdd={onAdd}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
