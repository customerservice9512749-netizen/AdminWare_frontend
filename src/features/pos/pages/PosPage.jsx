import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { getPosCatalog } from '../api/posApi';
import { adaptPosCatalog } from '../adapters/posAdapter';
import useCart from '../hooks/useCart';
import CartGrid from '../components/CartGrid';
import CartTicket from '../components/CartTicket';
import WeightModal from '../components/WeightModal';

export default function PosPage({ products: sharedProducts }) {
  const [products, setProducts] = useState(sharedProducts ?? []);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const cart = useCart(products);

  useEffect(() => {
    if (sharedProducts) setProducts(sharedProducts);
  }, [sharedProducts]);

  useEffect(() => {
    if (sharedProducts) return undefined;
    getPosCatalog().then((response) => setProducts(adaptPosCatalog(response)));
  }, [sharedProducts]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    const matches = term.length >= 2
      ? products.filter((product) => {
        const searchableValues = [
          product.name,
          product.Nombre,
          product.code,
          product.Codigo,
          product.barcode,
          product.plu,
          product.PLU,
          product.codigo_barras,
          product.codigo_plu,
          product.id,
          product.IdProducto,
        ];
        return searchableValues.some((value) => String(value ?? '').toLowerCase().includes(term));
      })
      : [];

    setSuggestions(matches);
    setSelectedIndex((current) => {
      if (matches.length === 0) return -1;
      return current >= matches.length ? matches.length - 1 : current;
    });
  }, [search, products]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchContainerRef.current?.contains(event.target)) {
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    };
    const handleFocus = () => searchInputRef.current?.focus();

    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const visibleSuggestions = useMemo(
    () => (search.trim().length >= 2 ? suggestions : []),
    [search, suggestions],
  );

  const confirmWeight = (product, weight) => {
    cart.addToCart(product, weight);
    cart.closeWeightModal();
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!visibleSuggestions.length) return;
      setSelectedIndex((current) => current >= visibleSuggestions.length - 1 ? 0 : current + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!visibleSuggestions.length) return;
      setSelectedIndex((current) => current <= 0 ? visibleSuggestions.length - 1 : current - 1);
      return;
    }

    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();

    const code = search.trim();
    if (!code) return;

    const selectedProduct = selectedIndex >= 0 ? visibleSuggestions[selectedIndex] : undefined;
    const exactProduct = products.find((item) => {
      const normalizedCode = String(item.code ?? item.Codigo ?? item.barcode ?? item.codigo_barras ?? '').trim();
      const normalizedPlu = String(item.plu ?? item.PLU ?? item.codigo_plu ?? '').trim();
      return normalizedCode === code || normalizedPlu === code;
    });
    const product = selectedProduct || exactProduct;
    if (!product) return;

    cart.addToCart(product);
    setSearch('');
    setSuggestions([]);
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  const selectSuggestion = (product) => {
    cart.addToCart(product);
    setSearch('');
    setSuggestions([]);
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] min-w-0 gap-5 overflow-hidden bg-slate-50 p-5">
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div ref={searchContainerRef} className="relative mb-5">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input ref={searchInputRef} autoFocus value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Buscar por nombre, código de barras o PLU..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500" />
          {visibleSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-72 overflow-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md z-50">
              {visibleSuggestions.map((product, index) => (
                <button
                  key={product.id ?? product.IdProducto ?? product.code ?? product.Codigo ?? index}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(product)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left cursor-pointer transition-colors hover:bg-emerald-50 ${
                    selectedIndex === index ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-800">{product.name ?? product.Nombre}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{product.code ?? product.Codigo}</span>
                  </span>
                  {product.isBulk || String(product.unit ?? product.UnidadMedida).toUpperCase() === 'KG' ? (
                    <span className="ml-3 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                      PLU {product.plu ?? product.PLU}
                    </span>
                  ) : (
                    <span className="ml-3 text-xs text-slate-400">{product.unit ?? product.UnidadMedida ?? 'PZA'}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <CartGrid
            items={cart.cart}
            onAdd={cart.addToCart}
            onUpdateQuantity={cart.updateQuantity}
            onRemove={cart.removeFromCart}
          />
        </div>
      </section>
      <CartTicket {...cart} onRemove={cart.removeFromCart} onCheckout={cart.clearCart} />
      {cart.isWeightModalOpen && <WeightModal product={cart.selectedProductForWeight} onConfirm={confirmWeight} onClose={cart.closeWeightModal} />}
    </div>
  );
}
