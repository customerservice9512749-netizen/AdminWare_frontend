import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as inventoryApi from '../api/inventoryApi';
import { adaptInventoryItem, adaptKardexMovement } from '../adapters/inventoryAdapter';

const initialModalConfig = { type: 'ENTRADA', preselectedProduct: null };
const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
const loadedAt = new Date();
const monthStart = new Date(loadedAt.getFullYear(), loadedAt.getMonth(), 1);
const todayStart = new Date(loadedAt.getFullYear(), loadedAt.getMonth(), loadedAt.getDate());

export default function useInventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [kardexMovements, setKardexMovements] = useState([]);
  const [activeTab, setActiveTab] = useState('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(initialModalConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsRef = useRef(inventoryItems);
  const transactionRef = useRef(false);

  useEffect(() => {
    let active = true;
    Promise.all([inventoryApi.getInventory(), inventoryApi.getKardexMovements()])
      .then(([items, movements]) => {
        if (!active) return;
        const adaptedItems = items.map(adaptInventoryItem);
        itemsRef.current = adaptedItems;
        setInventoryItems(adaptedItems);
        setKardexMovements(movements.map(adaptKardexMovement));
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'No fue posible cargar el inventario.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(inventoryItems.map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'es-MX')),
    [inventoryItems],
  );

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('es-MX');
    return inventoryItems.filter((item) => {
      const matchesSearch = !query || `${item.name} ${item.code} ${item.id}`.toLocaleLowerCase('es-MX').includes(query);
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesStock = stockFilter === 'ALL'
        || (stockFilter === 'OUT' && item.stock === 0)
        || (stockFilter === 'LOW' && item.stock > 0 && item.stock <= item.minStock)
        || (stockFilter === 'OPTIMAL' && item.stock > item.minStock);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [categoryFilter, inventoryItems, searchTerm, stockFilter]);

  const kpis = useMemo(() => {
    const monthWaste = kardexMovements.filter((movement) => movement.type === 'MERMA' && new Date(movement.date) >= monthStart);
    return {
      inventoryValue: inventoryItems.reduce((sum, item) => sum + item.stock * item.unitCost, 0),
      criticalStock: inventoryItems.filter((item) => item.stock <= item.minStock).length,
      wasteValue: monthWaste.reduce((sum, movement) => sum + movement.quantity * movement.unitCost, 0),
      wasteQuantity: monthWaste.reduce((sum, movement) => sum + movement.quantity, 0),
      todayMovements: kardexMovements.filter((movement) => new Date(movement.date) >= todayStart).length,
    };
  }, [inventoryItems, kardexMovements]);

  const openMovementModal = useCallback((type = 'ENTRADA', preselectedProduct = null) => {
    setModalConfig({ type, preselectedProduct });
    setIsModalOpen(true);
  }, []);
  const closeMovementModal = useCallback(() => setIsModalOpen(false), []);

  const registerMovement = useCallback(async ({ productId, type, quantity, unitCost, reason, notes }) => {
    if (transactionRef.current) throw new Error('Hay otro movimiento en proceso. Inténtalo de nuevo.');
    transactionRef.current = true;
    setError('');
    try {
      const item = itemsRef.current.find((product) => String(product.id) === String(productId));
      if (!item) throw new Error('No se encontró el producto seleccionado.');
      const amount = Number(quantity);
      if (!Number.isFinite(amount) || amount === 0) throw new Error('Ingresa una cantidad válida distinta de cero.');
      if (!item.isBulk && !Number.isInteger(amount)) throw new Error('La cantidad debe ser un número entero para productos por pieza.');
      if (type === 'MERMA' && !reason) throw new Error('Selecciona el motivo de la merma.');
      if (type !== 'AJUSTE' && amount < 0) throw new Error('La cantidad debe ser mayor a cero.');
      const resultingStock = item.stock + (type === 'ENTRADA' ? amount : type === 'AJUSTE' ? amount : -amount);
      if (resultingStock < 0) throw new Error('La cantidad de salida no puede superar las existencias actuales.');

      const dto = await inventoryApi.registerInventoryMovement({
        productId, type, quantity: amount, unitCost, reason, notes,
      });
      const movement = adaptKardexMovement(dto);
      const updatedItems = itemsRef.current.map((product) => (
        String(product.id) === String(productId)
          ? { ...product, stock: movement.newStock, unitCost: type === 'ENTRADA' && Number(unitCost) > 0 ? Number(unitCost) : product.unitCost }
          : product
      ));
      itemsRef.current = updatedItems;
      setInventoryItems(updatedItems);
      setKardexMovements((current) => [movement, ...current]);
      return movement;
    } catch (movementError) {
      setError(movementError.message || 'No fue posible registrar el movimiento.');
      throw movementError;
    } finally {
      transactionRef.current = false;
    }
  }, []);

  return {
    inventoryItems,
    kardexMovements,
    filteredItems,
    categories,
    kpis,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    isModalOpen,
    modalConfig,
    openMovementModal,
    closeMovementModal,
    registerMovement,
    loading,
    error,
    formatCurrency: (value) => currency.format(Number(value) || 0),
  };
}
