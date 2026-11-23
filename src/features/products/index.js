
export { default as AddProductModal } from './components/AddProductModal';
export { default as ProductFilterBar } from './components/ProductFilterBar';
export { default as ProductKPIHeader } from './components/ProductKPIHeader';
export { default as ProductsTable } from './components/ProductsTable';
export { default as StockAdjustModal } from './components/StockAdjustModal';
export { default as useProducts } from './hooks/useProducts';
export { default as ProductsPage } from './pages/ProductsPage';
export { adaptProductFromBackend, adaptProductToBackend, generateProductCode } from './adapters/productAdapter';
export { createProduct, deleteProduct, getProducts, updateProduct } from './api/productsApi';