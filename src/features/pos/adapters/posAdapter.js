export { adaptProduct as adaptPosProduct } from '../api/posAdapter';

export function adaptPosCatalog(response = []) {
  const products = Array.isArray(response) ? response : response.products ?? [];
  return products.map(adaptPosProduct);
}
