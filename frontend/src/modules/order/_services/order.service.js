import { http } from '@/lib/http'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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

  /**
   * Download PDF receipt for a paid order.
   * Triggers a browser file download.
   * @param {string} orderId
   */
  downloadReceipt: async (orderId) => {
    const token = localStorage.getItem('access_token')
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message || `Download failed (${res.status})`)
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${orderId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },
}
