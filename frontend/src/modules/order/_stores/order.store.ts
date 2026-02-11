import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '../_services/order.service'

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

export type OrderItem = {
  id: string
  quantity: number
  priceAtTime: number
  product: {
    id: string
    name: string
    imageUrl?: string
  }
}

export type Order = {
  id: string
  shippingAmount: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

export const useOrderStore = defineStore('order', () => {
  // ============ STATE ============
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const page = ref(1)
  const limit = ref(10)
  const totalPages = ref(1)
  const total = ref(0)

  // ============ ACTIONS ============
  async function createOrder(items: { productId: string; quantity: number }[]) {
    loading.value = true
    error.value = null

    try {
      const order = await orderApi.create(items)
      currentOrder.value = order
      return order
    } catch (e: any) {
      error.value = e.message || 'Failed to create order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMyOrders(pageNum = 1) {
    loading.value = true

    try {
      const response = await orderApi.getMyOrders(pageNum, limit.value)
      error.value = null
      orders.value = response.data
      page.value = response.meta.page
      totalPages.value = response.meta.totalPages
      total.value = response.meta.total
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(orderId: string) {
    loading.value = true

    try {
      const order = await orderApi.getById(orderId)
      error.value = null
      currentOrder.value = order
      return order
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function payOrder(orderId: string) {
    loading.value = true

    try {
      const order = await orderApi.pay(orderId)
      error.value = null
      currentOrder.value = order
      // Update in list if exists
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx >= 0) {
        orders.value[idx] = order
      }
      return order
    } catch (e: any) {
      error.value = e.message || 'Failed to pay order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(orderId: string) {
    loading.value = true
    error.value = null

    try {
      const order = await orderApi.cancel(orderId)
      currentOrder.value = order
      // Update in list if exists
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx >= 0) {
        orders.value[idx] = order
      }
      return order
    } catch (e: any) {
      error.value = e.message || 'Failed to cancel order'
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  function clearError() {
    error.value = null
  }

  /**
   * Create a Stripe PaymentIntent and return the clientSecret.
   * Used by StripePaymentForm to confirm payment on the client.
   */
  async function createPaymentIntent(orderId: string) {
    loading.value = true
    error.value = null

    try {
      const { clientSecret } = await orderApi.createPaymentIntent(orderId)
      return clientSecret as string
    } catch (e: any) {
      error.value = e.message || 'Failed to start payment'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Verify a payment with Stripe and update the order status.
   * Returns the updated order.
   */
  async function verifyPayment(orderId: string) {
    loading.value = true
    error.value = null

    try {
      const order = await orderApi.verifyPayment(orderId)
      currentOrder.value = order
      // Update in list if exists
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx >= 0) {
        orders.value[idx] = order
      }
      return order
    } catch (e: any) {
      error.value = e.message || 'Failed to verify payment'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ============ RETURN ============
  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    page,
    limit,
    totalPages,
    total,

    // Actions
    createOrder,
    fetchMyOrders,
    fetchOrderById,
    payOrder,
    cancelOrder,
    clearCurrentOrder,
    clearError,
    createPaymentIntent,
    verifyPayment,
  }
})
