export function getDashboardData() {
  return Promise.resolve({
    sales: [
      { day: 'Lun', amount: '$12,400', height: '40%' },
      { day: 'Mar', amount: '$18,600', height: '60%' },
      { day: 'Mié', amount: '$14,200', height: '45%' },
      { day: 'Jue', amount: '$22,100', height: '75%' },
      { day: 'Vie', amount: '$29,800', height: '95%' },
      { day: 'Sáb', amount: '$24,500', height: '80%' },
      { day: 'Dom', amount: '$16,900', height: '55%' },
    ],
    stockAlerts: [
      { name: 'Auriculares Bluetooth', stock: 2, minimum: 15, level: 'Crítico' },
      { name: 'Smartphone Galaxy X', stock: 5, minimum: 10, level: 'Bajo' },
    ],
    products: [
      { id: 1, name: 'Teclado Mecánico RGB', sku: 'AW-9021', price: 890, stock: 42, status: 'En Stock' },
      { id: 2, name: 'Monitor Gamer 27" 144Hz', sku: 'AW-4412', price: 5990, stock: 8, status: 'Stock Bajo' },
      { id: 3, name: 'Mouse Inalámbrico Pro', sku: 'AW-1020', price: 450, stock: 30, status: 'En Stock' },
    ],
  });
}
