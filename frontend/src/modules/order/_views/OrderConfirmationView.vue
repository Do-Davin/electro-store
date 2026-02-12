<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <!-- Header Banner -->
      <div class="bg-[#0a0a0a] pt-24 pb-4">
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
              <p class="text-gray-400">Order Number</p>
              <p class="font-bold text-white">{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-gray-400">Date</p>
              <p class="font-medium text-white">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-400">Total</p>
              <p class="font-bold text-white">${{ Number(order.totalAmount).toFixed(2) }}</p>
            </div>
          </div>
        </template>
        <template #action>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink
              to="/orders"
              class="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium
              hover:bg-white/20 transition-colors flex items-center gap-2"
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
              <p class="text-gray-400">Order Number</p>
              <p class="font-bold text-white">{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-gray-400">Date</p>
              <p class="font-medium text-white">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-400">Total Paid</p>
              <p class="font-bold text-green-400">${{ Number(order.totalAmount).toFixed(2) }}</p>
            </div>
          </div>
        </template>
        <template #action>
          <div class="flex flex-wrap gap-4 justify-center">
            <RouterLink
              to="/orders"
              class="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium
              hover:bg-white/20 transition-colors flex items-center gap-2"
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
        class="bg-[#111111] rounded-2xl shadow-md p-8 text-center border border-white/[0.06]"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Info class="w-10 h-10 text-amber-400" />
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">
          {{ paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Order Awaiting Payment' }}
        </h2>
        <p class="text-gray-400 mb-4">
          {{ paymentStatus === 'cancelled'
            ? 'No worries — your order is saved. You can pay anytime.'
            : 'Your order has been created. Complete the payment to confirm it.' }}
        </p>
        <div class="flex flex-wrap justify-center gap-6 text-sm mb-6">
          <div>
            <p class="text-gray-400">Order Number</p>
            <p class="font-bold text-white">{{ order.id.slice(0, 8).toUpperCase() }}</p>
          </div>
          <div>
            <p class="text-gray-400">Date</p>
            <p class="font-medium text-white">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Total</p>
            <p class="font-bold text-white">${{ Number(order.totalAmount).toFixed(2) }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Order Details -->
  <div class="min-h-screen bg-[#000000] py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Loading State (initial only) -->
      <SkeletonLoader v-if="orderStore.loading && !orderStore.error" variant="list" :count="1" />

      <!-- Error State -->
      <StateView
        v-else-if="orderStore.error || !order"
        variant="error"
        title="Order Not Found"
        :subtitle="orderStore.error || 'Unable to load order details.'"
        :loading="orderStore.loading"
        action-to="/orders"
        action-text="View All Orders"
        @retry="reloadOrder"
      />

      <!-- Order Details -->
      <div v-else class="space-y-6">
        <!-- Order Info Card - Improved Layout -->
        <div class="bg-[#111111] rounded-2xl shadow-md overflow-hidden border border-white/[0.06]">
          <!-- Header Section -->
          <div class="bg-white/5 p-6 md:p-8 border-b border-white/[0.06]">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <!-- Order Number & Date -->
              <div class="flex-1">
                <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Order Number</p>
                <p class="text-3xl font-bold text-white tracking-tight mb-3">
                  {{ order.id.slice(0, 8).toUpperCase() }}
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-400">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>

              <!-- Status & Total -->
              <div class="flex items-center gap-8">
                <div class="flex flex-col items-center">
                  <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Status</p>
                  <span :class="statusClass">{{ order.status }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Total Amount</p>
                  <p class="text-4xl font-bold text-white">
                    ${{ Number(order.totalAmount).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="p-6 md:p-8">
            <h3 class="font-semibold text-white text-lg mb-4 flex items-center gap-2">
              <Package class="w-5 h-5" />
              Order Items
            </h3>
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div class="w-20 h-20 shrink-0 bg-[#0a0a0a] rounded-lg overflow-hidden shadow-sm">
                  <img
                    :src="getImageUrl(item.product?.imageUrl)"
                    :alt="item.product?.name"
                    class="w-full h-full object-contain"
                    @error="onImageError($event)"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-white text-lg truncate mb-1">
                    {{ item.product?.name }}
                  </p>
                  <p class="text-sm text-gray-400">
                    Quantity: <span class="font-medium text-gray-300">{{ item.quantity }}</span> ×
                    <span class="font-medium text-gray-300">${{ Number(item.priceAtTime).toFixed(2) }}</span>
                  </p>
                </div>
                <p class="font-bold text-white text-xl">
                  ${{ (item.quantity * Number(item.priceAtTime)).toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
              <div class="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${{ orderOriginalSubtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>VAT (10%)</span>
                <span>${{ orderVat.toFixed(2) }}</span>
              </div>
              <div v-if="orderDiscount > 0" class="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-${{ orderDiscount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>VAT (10%)</span>
                <span>${{ orderVat.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span v-if="Number(order.shippingAmount ?? 0) === 0" class="text-green-400 font-medium">Free</span>
                <span v-else class="font-medium">${{ Number(order.shippingAmount).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                <span>Total</span>
                <span>${{ Number(order.totalAmount).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-primary/10 rounded-2xl p-6 border border-primary/20">
          <h3 class="font-semibold text-primary mb-2 flex items-center gap-2">
            <Info class="w-5 h-5" />
            What's Next?
          </h3>
          <p class="text-gray-300 text-sm leading-relaxed">
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
        <ErrorBanner
          v-if="payError"
          title="Payment Error"
          :message="payError"
        />

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

        <!-- Download Receipt Button (paid orders only) -->
        <div v-if="canDownloadReceipt" class="flex justify-center">
          <button
            @click="handleDownloadReceipt"
            :disabled="receiptLoading"
            class="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium
            hover:bg-white/20 transition-colors disabled:opacity-50
            disabled:cursor-not-allowed flex items-center gap-2 border border-white/[0.06]"
          >
            <Loader2 v-if="receiptLoading" class="w-5 h-5 animate-spin" />
            <Download v-else class="w-5 h-5" />
            {{ receiptLoading ? 'Downloading...' : 'Download Receipt' }}
          </button>
        </div>
      </div>
    </div>
  </div>

    </main>

    <Footer />

    <!-- Cancel Order Confirm Modal -->
    <ConfirmModal
      :isOpen="cancelModal.open"
      type="warning"
      title="Cancel Order"
      message="Are you sure you want to cancel this order? This action cannot be undone."
      confirmText="Cancel Order"
      cancelText="Keep Order"
      :loading="cancelModal.loading"
      @confirm="executeCancelOrder"
      @cancel="cancelModal = { open: false, loading: false }"
      @close="cancelModal = { open: false, loading: false }"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  Package,
  Receipt,
  ShoppingBag,
  Loader2,
  Info,
  XCircle,
  CreditCard,
  Download,
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import SuccessResult from '../_components/SuccessResult.vue'
import CancelledResult from '../_components/CancelledResult.vue'
import { useOrderStore } from '../_stores/order.store'
import { orderApi } from '../_services/order.service'
import { placeholderSvg } from '@/lib/utils'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)

// Derived price breakdown from order items
const orderItemsSubtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.priceAtTime),
    0,
  )
})

// Original subtotal (before discount) from product prices
const orderOriginalSubtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.product?.price ?? item.priceAtTime),
    0,
  )
})

// Discount on VAT-inclusive amount
const orderDiscount = computed(() => {
  const baseDiscount = orderOriginalSubtotal.value - orderItemsSubtotal.value
  return Math.round(baseDiscount * 1.10 * 100) / 100
})

// VAT: 10% on original subtotal (before discount)
const orderVat = computed(() => {
  return Math.round(orderOriginalSubtotal.value * 0.10 * 100) / 100
})

// Payment state from URL query params
const paymentStatus = computed(() => route.query.payment || null)

const payLoading = ref(false)
const payError = ref('')

const toast = useToast()

// Cancel order modal state
const cancelModal = ref({
  open: false,
  loading: false,
})

const canCancelOrder = computed(() => {
  if (!order.value) return false
  return order.value.status === 'PENDING'
})

const canDownloadReceipt = computed(() => {
  if (!order.value) return false
  return ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order.value.status)
})

const receiptLoading = ref(false)

async function handleDownloadReceipt() {
  if (!order.value) return
  receiptLoading.value = true
  try {
    await orderApi.downloadReceipt(order.value.id)
    toast.success('Receipt downloaded successfully!')
  } catch (error) {
    toast.error(error?.message || 'Failed to download receipt')
  } finally {
    receiptLoading.value = false
  }
}

/**
 * Redirect user to checkout page to pay for this order.
 */
async function handlePayNow() {
  if (!order.value) return
  router.push(`/checkout?orderId=${order.value.id}`)
}

async function handleCancelOrder() {
  if (!order.value) return
  cancelModal.value = { open: true, loading: false }
}

async function executeCancelOrder() {
  cancelModal.value.loading = true

  try {
    await orderStore.cancelOrder(order.value.id)
    // Re-fetch to get fresh data — the banner will reactively update
    await orderStore.fetchOrderById(order.value.id)
    toast.success('Order has been cancelled successfully.')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message || 'Failed to cancel order')
  } finally {
    cancelModal.value = { open: false, loading: false }
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
  if (!img) return placeholderSvg
  return img.startsWith('http') ? img : API + img
}

function onImageError(event) {
  event.target.src = placeholderSvg
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

async function reloadOrder() {
  const orderId = route.params.id
  if (orderId) await orderStore.fetchOrderById(orderId)
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
