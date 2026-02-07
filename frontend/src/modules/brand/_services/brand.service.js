import { http } from '@/lib/http'

/**
 * Brand API service — read-only calls to the backend /brands endpoints.
 */
export const brandApi = {
  /**
   * Get all brands
   * @returns {Promise<Brand[]>}
   */
  getAll: () => http.get('/brands'),

  /**
   * Get a single brand by ID
   * @param {string} brandId
   * @returns {Promise<Brand>}
   */
  getById: (brandId) => http.get(`/brands/${brandId}`),
}
