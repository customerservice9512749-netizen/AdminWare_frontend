import { useMemo, useState } from 'react';
import useCart from './useCart';

export default function usePos(products) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [discount, setDiscount] = useState(0);
  const cartState = useCart();

  const categories = useMemo(() => ['Todos', ...new Set(products.map((product) => product.category))], [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const discountAmount = cartState.subtotal * Number(discount) / 100;
  const total = cartState.subtotal - discountAmount;

  return {
    selectedCategory,
    searchQuery,
    paymentMethod,
    discount,
    categories,
    filteredProducts,
    total,
    setSelectedCategory,
    setSearchQuery,
    setPaymentMethod,
    setDiscount,
    ...cartState,
  };
}
