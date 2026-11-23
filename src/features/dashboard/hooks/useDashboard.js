import { useEffect, useState } from 'react';
import { getDashboardData } from '../api/dashboardApi';
import { adaptDashboardResponse } from '../adapters/dashboardAdapter';
import { initialProduct } from '../constants/dashboardData';

export default function useDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(initialProduct);
  const [productsList, setProductsList] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getDashboardData().then((response) => {
      if (!isMounted) return;
      const dashboard = adaptDashboardResponse(response);
      setSalesData(dashboard.sales);
      setStockAlerts(dashboard.stockAlerts);
      setProductsList(dashboard.products);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const openProductModal = () => setIsModalOpen(true);

  const closeProductModal = () => {
    setIsModalOpen(false);
    setNewProduct(initialProduct);
  };

  const handleCreateProduct = (event) => {
    event.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.price || !newProduct.stock) {
      alert('Por favor llena todos los campos obligatorios');
      return;
    }

    const stock = Number(newProduct.stock);
    const product = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku,
      price: parseFloat(newProduct.price),
      stock,
      status: stock <= 10 ? 'Stock Bajo' : 'En Stock',
    };

    setProductsList((products) => [product, ...products]);
    closeProductModal();
  };

  return {
    activeTab,
    isModalOpen,
    newProduct,
    productsList,
    salesData,
    stockAlerts,
    setActiveTab,
    setNewProduct,
    openProductModal,
    closeProductModal,
    handleCreateProduct,
  };
}
