import { useCallback, useEffect, useMemo, useState } from 'react';
import * as productsApi from '../api/productsApi';
import {
  adaptProductFromBackend,
  adaptProductToBackend,
  generateProductCode,
} from '../adapters/productAdapter';

const EMPTY_PRODUCTS = [];
const initialFilters = { search: '', category: 'Todas', unit: 'Todos', status: 'Todos' };

function getProductList(response) {
  if (Array.isArray(response)) return response;
  if (response == null) return [];
  const items = response?.products ?? response?.Productos
    ?? response?.data?.products ?? response?.data?.Productos ?? response?.data;
  if (!Array.isArray(items)) throw new Error('La respuesta del catálogo tiene un formato no válido.');
  return items;
}

function getId(response) {
  return response?.product?.IdProducto ?? response?.product?.id
    ?? response?.Producto?.IdProducto ?? response?.IdProducto ?? response?.id;
}

function getProductResponse(response, fallback) {
  const product = response?.product ?? response?.Producto ?? response?.data ?? response;
  return product && typeof product === 'object' ? { ...fallback, ...product } : fallback;
}

export default function useProducts(initialProducts = EMPTY_PRODUCTS, { load = true } = {}) {
  const [products, setProducts] = useState(() => initialProducts.map(adaptProductFromBackend));
  const [loading, setLoading] = useState(() => load && initialProducts.length === 0);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('name');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const adaptedInitialProducts = useMemo(
    () => initialProducts.map(adaptProductFromBackend),
    [initialProducts],
  );

  useEffect(() => {
    if (initialProducts.length) return undefined;
    if (!load) return undefined;

    let active = true;
    productsApi.getProducts()
      .then((response) => {
        if (active) setProducts(getProductList(response).map(adaptProductFromBackend));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar los productos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [initialProducts, load]);

  const catalogProducts = !hasLocalChanges && (initialProducts.length > 0 || !load)
    ? adaptedInitialProducts
    : products;

  const categories = useMemo(() => {
    const seen = new Map();
    catalogProducts.forEach((product) => {
      const name = product.category || 'General';
      if (!seen.has(name)) seen.set(name, { id: product.categoryId, name });
    });
    return [...seen.values()];
  }, [catalogProducts]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase('es-MX');
    const result = catalogProducts.filter((product) => {
      const searchableText = [product.name, product.code, product.barcode, product.plu]
        .join(' ')
        .toLocaleLowerCase('es-MX');
      return (!query || searchableText.includes(query))
        && (filters.category === 'Todas' || product.category === filters.category)
        && (filters.unit === 'Todos' || product.unit === filters.unit)
        && (filters.status === 'Todos' || (filters.status === 'Activo' ? product.status : !product.status));
    });

    return result.sort((first, second) => {
      if (sortBy === 'stock') return first.stock - second.stock;
      if (sortBy === 'price') return first.salePrice - second.salePrice;
      if (sortBy === 'category') return first.category.localeCompare(second.category, 'es-MX');
      return first.name.localeCompare(second.name, 'es-MX');
    });
  }, [catalogProducts, filters, sortBy]);

  const createProduct = useCallback(async (formData) => {
    setError('');
    const backendProduct = adaptProductToBackend(formData);
    try {
      const response = await productsApi.createProduct(backendProduct);
      const id = getId(response) ?? `local-${Date.now()}`;
      const created = adaptProductFromBackend({
        ...getProductResponse(response, backendProduct),
        IdProducto: getId(response) ?? id,
      });
      const product = { ...created, id: created.id ?? id };
      setProducts((current) => [product, ...(current.length ? current : catalogProducts).filter((item) => item.id !== product.id)]);
      setHasLocalChanges(true);
      return product;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible crear el producto.');
      throw requestError;
    }
  }, [catalogProducts]);

  const updateProduct = useCallback(async (id, changes) => {
    setError('');
    const currentProduct = catalogProducts.find((product) => product.id === id);
    if (!currentProduct) throw new Error('No se encontró el producto que deseas actualizar.');
    const updatedData = { ...currentProduct, ...changes };
    try {
      const payload = adaptProductToBackend(updatedData);
      const response = await productsApi.updateProduct(id, payload);
      const updated = adaptProductFromBackend({
        ...getProductResponse(response, payload),
        IdProducto: getId(response) ?? id,
      });
      const product = { ...updated, id: updated.id ?? id };
      setProducts((current) => (current.length ? current : catalogProducts).map((item) => (item.id === id ? product : item)));
      setHasLocalChanges(true);
      return product;
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar el producto.');
      throw requestError;
    }
  }, [catalogProducts]);

  const deleteProduct = useCallback(async (id) => {
    setError('');
    try {
      await productsApi.deleteProduct(id);
      setProducts((current) => (current.length ? current : catalogProducts).filter((product) => product.id !== id));
      setHasLocalChanges(true);
    } catch (requestError) {
      setError(requestError.message || 'No fue posible eliminar el producto.');
      throw requestError;
    }
  }, [catalogProducts]);

  const adjustStock = useCallback(async (id, { type, quantity }) => {
    const product = catalogProducts.find((item) => item.id === id);
    if (!product) throw new Error('No se encontró el producto seleccionado.');
    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Ingresa una cantidad válida mayor a cero.');
    if (!product.isBulk && !Number.isInteger(amount)) throw new Error('La cantidad debe ser un número entero para productos por pieza.');

    const isReduction = type === 'remove' || type === 'waste';
    const stock = product.stock + (isReduction ? -amount : amount);
    if (stock < 0) throw new Error('La cantidad no puede superar las existencias actuales.');

    return updateProduct(id, {
      currentStock: stock,
      stock,
      waste: product.waste + (type === 'waste' ? amount : 0),
    });
  }, [catalogProducts, updateProduct]);

  const generateCode = useCallback((unit = 'PZA') => generateProductCode(unit), []);
  const clearFilters = useCallback(() => setFilters(initialFilters), []);
  const kpis = useMemo(() => ({
    total: catalogProducts.length,
    bulk: catalogProducts.filter((product) => product.isBulk).length,
    lowStock: catalogProducts.filter((product) => product.stock <= product.minStock).length,
    waste: catalogProducts.reduce((total, product) => total + product.waste, 0),
  }), [catalogProducts]);

  return {
    products: catalogProducts,
    filteredProducts,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    categories,
    kpis,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    generateCode,
    clearFilters,
  };
}
