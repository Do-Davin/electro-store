import { http } from '@/lib/http'

/**
 * Order API service
 * All endpoints require authentication
 */
export const orderApi = {
  /**
   * Create a new order
   * @param {Array<{productId: string, quantity: number}>} items
   * @returns {Promise<Order>}
   */
  create: (items) => http.post('/orders', { items }),

  /**
   * Get current user's orders (paginated)
   * @param {number} page
   * @param {number} limit
   */
  getMyOrders: (page = 1, limit = 10) =>
    http.get(`/orders/me?page=${page}&limit=${limit}`),

  /**
   * Get single order by ID (user must own order)
   * @param {string} orderId
   */
  getById: (orderId) => http.get(`/orders/${orderId}`),

  /**
   * Pay for an order (changes status to PAID)
   * @param {string} orderId
   */
  pay: (orderId) => http.post(`/orders/${orderId}/pay`),

  /**
   * Cancel an order (changes status to CANCELLED)
   * @param {string} orderId
   */
  cancel: (orderId) => http.post(`/orders/${orderId}/cancel`),

  /**
   * Create a Stripe PaymentIntent for an order.
   * Returns { clientSecret: string } for Stripe Elements.
   * @param {string} orderId
   */
  createPaymentIntent: (orderId) =>
    http.post(`/payments/create-intent/${orderId}`),

  /**
   * Verify payment status with Stripe and update order.
   * Returns the updated order object.
   * @param {string} orderId
   */
  verifyPayment: (orderId) =>
    http.post(`/payments/verify/${orderId}`),
}
