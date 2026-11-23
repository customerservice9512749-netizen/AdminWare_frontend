import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useCart(products = []) {
  const [cart, setCart] = useState([]);
  const [selectedProductForWeight, setSelectedProductForWeight] = useState(null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const scanBuffer = useRef('');
  const lastScanKeyTime = useRef(0);

  const addToCart = useCallback((product, weight) => {
    if (product.isBulk && weight === undefined) {
      setSelectedProductForWeight(product);
      setIsWeightModalOpen(true);
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (product.isBulk) {
        const quantity = Number(weight);
        if (!Number.isFinite(quantity) || quantity <= 0) return current;
        return existing
          ? current.map((item) => item.id === product.id
            ? { ...item, quantity: Number(item.quantity) + quantity, total: (Number(item.quantity) + quantity) * Number(item.price) }
            : item)
          : [...current, { ...product, quantity, total: quantity * Number(product.price) }];
      }

      return existing
        ? current.map((item) => item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * Number(item.price) }
          : item)
        : [...current, { ...product, quantity: 1, total: Number(product.price) }];
    });
  }, []);

  const closeWeightModal = useCallback(() => {
    setIsWeightModalOpen(false);
    setSelectedProductForWeight(null);
  }, []);

  const removeFromCart = useCallback((id) => setCart((current) => current.filter((item) => item.id !== id)), []);
  const updateQuantity = useCallback((id, newQty) => {
    const quantity = Number(newQty);
    setCart((current) => quantity > 0
      ? current.map((item) => item.id === id
        ? { ...item, quantity, total: quantity * Number(item.price) }
        : item)
      : current.filter((item) => item.id !== id));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const now = Date.now();
      if (now - lastScanKeyTime.current > 80) scanBuffer.current = '';
      lastScanKeyTime.current = now;

      if (event.key === 'Enter') {
        const code = scanBuffer.current.trim();
        scanBuffer.current = '';
        if (code.length < 3) return;
        const product = products.find((item) => String(item.barcode) === code || String(item.plu) === code);
        if (product) addToCart(product);
        return;
      }
      if (event.key.length === 1) scanBuffer.current += event.key;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToCart, products]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.total ?? item.price * item.quantity), 0),
    [cart],
  );
  const iva = useMemo(() => subtotal * 0.16, [subtotal]);
  const total = useMemo(() => subtotal + iva, [subtotal, iva]);

  return {
    cart,
    selectedProductForWeight,
    isWeightModalOpen,
    addToCart,
    closeWeightModal,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    iva,
    total,
  };
}
