import { apiRequest } from '../../../services/apiService';

const productsPath = '/products';

export function getProducts() {
  return apiRequest(productsPath);
}

export function createProduct(product) {
  return apiRequest(productsPath, {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`${productsPath}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`${productsPath}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
