<template>
  <Navbar />

  <!-- Header Banner -->
  <div class="bg-gray-50 pt-24 pb-4">
    <div class="max-w-4xl mx-auto px-4" v-if="order">

      <!-- CANCELLED — always takes priority regardless of URL params -->
      <CancelledResult
        v-if="order.status === 'CANCELLED'"
        title="Order Cancelled"
        subtitle="This order has been cancelled."
      >
        <template #details>
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <div>
              <p class="text-gray-500">Order Number</p>
              <p class="font-bold text-[#0b2c5f]">{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-gray-500">Date</p>
              <p class="font-medium text-[#0b2c5f]">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Total</p>
              <p class="font-bold text-[#0b2c5f]">${{ Number(order.totalAmount).toFixed(2) }}</p>
            </div>
          </div>
        </template>
        <template #action>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink
              to="/orders"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium
              hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Receipt class="w-5 h-5" />
              View All Orders
            </RouterLink>
            <RouterLink
              to="/products"
              class="px-6 py-3 bg-primary text-white rounded-xl font-medium
              hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <ShoppingBag class="w-5 h-5" />
              Continue Shopping
            </RouterLink>
          </div>
        </template>
      </CancelledResult>

      <!-- PAID / PROCESSING / SHIPPED / DELIVERED / COMPLETED -->
      <SuccessResult
        v-else-if="order.status !== 'PENDING'"
        :title="paymentStatus === 'success' ? 'Payment Successful!' : 'Order Confirmed!'"
        :subtitle="paymentStatus === 'success' ? 'Your payment has been processed' : 'Your order has been paid'"
      >
        <template #details>
          <div class="flex flex-wrap justify-center gap-6 text-sm">
            <div>
              <p class="text-gray-500">Order Number</p>
              <p class="font-bold text-[#0b2c5f]">{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-gray-500">Date</p>
              <p class="font-medium text-[#0b2c5f]">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Total Paid</p>
              <p class="font-bold text-green-600">${{ Number(order.totalAmount).toFixed(2) }}</p>
            </div>
          </div>
        </template>
        <template #action>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink
              to="/orders"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium
              hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Receipt class="w-5 h-5" />
              View All Orders
            </RouterLink>
            <RouterLink
              to="/products"
              class="px-6 py-3 bg-primary text-white rounded-xl font-medium
              hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <ShoppingBag class="w-5 h-5" />
              Continue Shopping
            </RouterLink>
          </div>
        </template>
      </SuccessResult>

      <!-- PENDING: payment cancelled or awaiting payment -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-md p-8 text-center"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <Info class="w-10 h-10 text-amber-500" />
        </div>
        <h2 class="text-2xl font-bold text-[#0b2c5f] mb-2">
          {{ paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Order Awaiting Payment' }}
        </h2>
        <p class="text-gray-500 mb-4">
          {{ paymentStatus === 'cancelled'
            ? 'No worries — your order is saved. You can pay anytime.'
            : 'Your order has been created. Complete the payment to confirm it.' }}
        </p>
        <div class="flex flex-wrap justify-center gap-6 text-sm mb-6">
          <div>
            <p class="text-gray-500">Order Number</p>
            <p class="font-bold text-[#0b2c5f]">{{ order.id.slice(0, 8).toUpperCase() }}</p>
          </div>
          <div>
            <p class="text-gray-500">Date</p>
            <p class="font-medium text-[#0b2c5f]">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div>
            <p class="text-gray-500">Total</p>
            <p class="font-bold text-[#0b2c5f]">${{ Number(order.totalAmount).toFixed(2) }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Order Details -->
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="orderStore.loading" class="text-center py-12">
        <Loader2 class="w-12 h-12 text-primary animate-spin mx-auto" />
        <p class="text-gray-500 mt-4">Loading order details...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="orderStore.error || !order"
        class="bg-white rounded-2xl shadow-md p-12 text-center"
      >
        <AlertCircle class="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-600 mb-2">Order Not Found</h2>
        <p class="text-gray-400 mb-6">{{ orderStore.error || 'Unable to load order details.' }}</p>
        <RouterLink
          to="/orders"
          class="inline-block px-6 py-3 bg-primary text-white rounded-xl
          font-semibold hover:bg-primary/90 transition-colors"
        >
          View All Orders
        </RouterLink>
      </div>

      <!-- Order Details -->
      <div v-else class="space-y-6">
        <!-- Order Info Card - Improved Layout -->
        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <!-- Header Section -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 border-b border-blue-100">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <!-- Order Number & Date -->
              <div class="flex-1">
                <p class="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Order Number</p>
                <p class="text-3xl font-bold text-[#0b2c5f] tracking-tight mb-3">
                  {{ order.id.slice(0, 8).toUpperCase() }}
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>

              <!-- Status & Total -->
              <div class="flex items-center gap-8">
                <div class="flex flex-col items-center">
                  <p class="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Status</p>
                  <span :class="statusClass">{{ order.status }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <p class="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Total Amount</p>
                  <p class="text-4xl font-bold text-[#0b2c5f]">
                    ${{ Number(order.totalAmount).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="p-6 md:p-8">
            <h3 class="font-semibold text-[#0b2c5f] text-lg mb-4 flex items-center gap-2">
              <Package class="w-5 h-5" />
              Order Items
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div class="w-20 h-20 shrink-0 bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    :src="getImageUrl(item.product?.imageUrl)"
                    :alt="item.product?.name"
                    class="w-full h-full object-contain"
                    @error="onImageError($event)"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-[#0b2c5f] text-lg truncate mb-1">
                    {{ item.product?.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Quantity: <span class="font-medium text-gray-700">{{ item.quantity }}</span> ×
                    <span class="font-medium text-gray-700">${{ Number(item.priceAtTime).toFixed(2) }}</span>
                  </p>
                </div>
                <p class="font-bold text-[#0b2c5f] text-xl">
                  ${{ (item.quantity * Number(item.priceAtTime)).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info class="w-5 h-5" />
            What's Next?
          </h3>
          <p class="text-blue-800 text-sm leading-relaxed">
            Your order is currently <strong>{{ order.status }}</strong>.
            <span v-if="order.status === 'PENDING'">
              Complete your payment to start processing.
            </span>
            <span v-else-if="order.status === 'PAID'">
              We're preparing your order for shipment.
            </span>
            <span v-else-if="order.status === 'CANCELLED'">
              This order has been cancelled. Stock has been restored.
            </span>
            <span v-else>
              You will receive updates via email.
            </span>
          </p>
        </div>

        <!-- Pay Now Button (for PENDING orders) -->
        <div v-if="order.status === 'PENDING'" class="flex justify-center">
          <button
            @click="handlePayNow"
            :disabled="payLoading"
            class="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg
            hover:bg-primary/90 transition-colors disabled:opacity-50
            disabled:cursor-not-allowed flex items-center gap-3 shadow-lg
            hover:shadow-xl"
          >
            <Loader2 v-if="payLoading" class="w-6 h-6 animate-spin" />
            <CreditCard v-else class="w-6 h-6" />
            {{ payLoading ? 'Redirecting to payment...' : 'Pay Now' }}
          </button>
        </div>

        <!-- Pay Error -->
        <div
          v-if="payError"
          class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-red-700">Payment Error</p>
            <p class="text-sm text-red-600">{{ payError }}</p>
          </div>
        </div>

        <!-- Cancel Order Button -->
        <div v-if="canCancelOrder" class="flex justify-center">
          <button
            @click="handleCancelOrder"
            :disabled="orderStore.loading"
            class="px-6 py-3 bg-red-500 text-white rounded-xl font-medium
            hover:bg-red-600 transition-colors disabled:opacity-50
            disabled:cursor-not-allowed flex items-center gap-2"
          >
            <XCircle class="w-5 h-5" />
            {{ orderStore.loading ? 'Cancelling...' : 'Cancel Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  Package,
  Receipt,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Info,
  XCircle,
  CreditCard,
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SuccessResult from '../_components/SuccessResult.vue'
import CancelledResult from '../_components/CancelledResult.vue'
import { useOrderStore } from '../_stores/order.store'
import placeholderImg from '@/assets/img/placeholder.png'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)

// Payment state from URL query params
const paymentStatus = computed(() => route.query.payment || null)

const payLoading = ref(false)
const payError = ref('')

const canCancelOrder = computed(() => {
  if (!order.value) return false
  const cancellableStatuses = ['PENDING', 'PAID', 'PROCESSING']
  return cancellableStatuses.includes(order.value.status)
})

/**
 * Redirect user to checkout page to pay for this order.
 */
async function handlePayNow() {
  if (!order.value) return
  router.push(`/checkout?orderId=${order.value.id}`)
}

async function handleCancelOrder() {
  if (!order.value) return

  const confirmed = confirm(
    'Are you sure you want to cancel this order?'
  )

  if (!confirmed) return

  try {
    await orderStore.cancelOrder(order.value.id)
    // Re-fetch to get fresh data — the banner will reactively update
    await orderStore.fetchOrderById(order.value.id)
  } catch (error) {
    alert(`Failed to cancel order: ${error.message}`)
  }
}

const statusClass = computed(() => {
  const status = order.value?.status
  const base = 'px-4 py-2 rounded-full text-sm font-bold inline-block'
  switch (status) {
    case 'PENDING':
      return `${base} bg-yellow-100 text-yellow-700`
    case 'PAID':
      return `${base} bg-green-100 text-green-700`
    case 'PROCESSING':
      return `${base} bg-blue-100 text-blue-700`
    case 'SHIPPED':
      return `${base} bg-purple-100 text-purple-700`
    case 'DELIVERED':
    case 'COMPLETED':
      return `${base} bg-green-100 text-green-700`
    case 'CANCELLED':
      return `${base} bg-red-100 text-red-700`
    default:
      return `${base} bg-gray-100 text-gray-700`
  }
})

const API = import.meta.env.VITE_API_URL

function getImageUrl(img) {
  if (!img) return placeholderImg
  return img.startsWith('http') ? img : API + img
}

function onImageError(event) {
  event.target.src = placeholderImg
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  const orderId = route.params.id
  if (!orderId) return

  // If payment just succeeded, verify with Stripe and update order status
  if (route.query.payment === 'success') {
    try {
      await orderStore.verifyPayment(orderId)
    } catch {
      // Verification failed – still fetch the order below
    }
  }

  // Always fetch the latest order data
  await orderStore.fetchOrderById(orderId)
})
</script>
