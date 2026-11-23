import { apiRequest } from '../../../services/apiService';
import { posProducts } from '../constants/posData';

export function getPosCatalog() {
  return apiRequest('/products').catch(() => posProducts);
}

export function createSale(sale) {
  return apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(sale),
  });
}
