export function adaptDashboardResponse(response = {}) {
  return {
    sales: Array.isArray(response.sales) ? response.sales : [],
    stockAlerts: Array.isArray(response.stockAlerts) ? response.stockAlerts : [],
    products: Array.isArray(response.products) ? response.products : [],
  };
}
