<template>
  <div>
    <!-- Loading State (initial only) -->
    <SkeletonLoader
      v-if="orderStore.loading && orders.length === 0 && !orderStore.error"
      variant="list"
      :count="3"
    />

    <!-- Not Logged In -->
    <div
      v-else-if="!loggedIn"
      class="bg-[#111111] rounded-2xl shadow-md p-12 text-center border border-white/6"
    >
      <LogIn class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-white mb-2">Please log in</h2>
      <p class="text-gray-400 mb-6">Log in to view your order history.</p>
      <RouterLink
        to="/auth/login"
        class="inline-block px-6 py-3 bg-primary text-white rounded-xl
        font-semibold hover:bg-primary/90 transition-colors"
      >
        Log In
      </RouterLink>
    </div>

    <!-- Empty State -->
    <StateView
      v-else-if="orders.length === 0 && !orderStore.loading && !orderStore.error"
      icon="order"
      title="No orders yet"
      subtitle="Your order history will appear here."
      action-to="/products"
      action-text="Start Shopping"
    />

    <!-- Error -->
    <StateView
      v-else-if="orderStore.error && orders.length === 0"
      variant="error"
      title="Failed to load orders"
      :subtitle="orderStore.error"
      :loading="orderStore.loading"
      @retry="orderStore.fetchMyOrders()"
    />

    <!-- Order List -->
    <div v-else class="space-y-4">
      <!-- Order Cards -->
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-[#111111] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border-3 border-primary"
      >
        <!-- Order Header -->
        <div class="flex flex-wrap justify-between items-center gap-3 px-6 py-4 bg-white/5 border-b border-white/6">
          <div class="flex items-center gap-4">
            <div>
              <p class="text-xs text-secondary/70 uppercase tracking-wider">Order</p>
              <p class="font-bold text-primary">#{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-xs text-secondary/70 uppercase tracking-wider">Date</p>
              <p class="text-sm text-secondary/70">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <OrderStatusBadge :status="order.status" />
            <p class="text-lg font-bold text-primary">${{ Number(order.totalAmount).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-6 py-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-4 py-3 border-b border-white/4 last:border-0"
          >
            <!-- Image -->
            <div
              class="w-14 h-14 shrink-0 bg-white rounded-xl overflow-hidden
              border-3 border-primary"
            >
              <img
                :src="getImageUrl(item.product?.imageUrl)"
                :alt="item.product?.name"
                class="w-full h-full object-contain"
                @error="onImageError($event)"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-primary truncate">{{ item.product?.name }}</p>
              <p class="text-sm text-secondary/70 mt-1">
                {{ item.quantity }} × ${{ Number(item.priceAtTime).toFixed(2) }}
              </p>
            </div>

            <!-- Item Total -->
            <p class="font-semibold text-primary">
              ${{ (item.quantity * Number(item.priceAtTime)).toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="flex justify-between items-center px-6 py-3 bg-white/5 border-t border-white/[0.06]">
          <RouterLink
            :to="`/orders/${order.id}/confirmation`"
            class="text-primary hover:underline text-sm font-medium"
          >
            View Details
          </RouterLink>

          <div class="flex items-center gap-3">
            <button
              v-if="order.status === 'PENDING'"
              @click="handlePay(order.id)"
              class="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
            >
              <CreditCard class="w-4 h-4" />
              Pay Now
            </button>

            <button
              v-if="canDownloadReceipt(order.status)"
              @click="handleDownloadReceipt(order.id)"
              :disabled="receiptLoading[order.id]"
              class="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Loader2 v-if="receiptLoading[order.id]" class="w-4 h-4 animate-spin" />
              <Download v-else class="w-4 h-4" />
              Receipt
            </button>

            <button
              v-if="canCancel(order.status)"
              @click="handleCancel(order.id)"
              class="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
            >
              <XCircle class="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="orderStore.totalPages > 1"
        class="flex justify-center items-center gap-4 pt-6"
      >
        <button
          :disabled="orderStore.page <= 1"
          @click="goToPage(orderStore.page - 1)"
          class="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/80
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95]"
        >
          Previous
        </button>

        <span class="text-sm text-secondary/70">
          Page {{ orderStore.page }} of {{ orderStore.totalPages }}
        </span>

        <button
          :disabled="orderStore.page >= orderStore.totalPages"
          @click="goToPage(orderStore.page + 1)"
          class="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/80
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.95]"
        >
          Next
        </button>
      </div>
    </div>

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
      @cancel="cancelModal = { open: false, orderId: null, loading: false }"
      @close="cancelModal = { open: false, orderId: null, loading: false }"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { LogIn, XCircle, CreditCard, Download, Loader2 } from 'lucide-vue-next'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useOrderStore } from '../_stores/order.store'
import { orderApi } from '../_services/order.service'
import { isLoggedIn } from '@/lib/auth'
import { placeholderSvg } from '@/lib/utils'
import OrderStatusBadge from './OrderStatusBadge.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()

const orderStore = useOrderStore()
const toast = useToast()

const loggedIn = computed(() => isLoggedIn())
const orders = computed(() => orderStore.orders)

// Cancel order modal state
const cancelModal = ref({
  open: false,
  orderId: null,
  loading: false,
})

// Receipt download loading state (keyed by order ID)
const receiptLoading = ref({})

function canDownloadReceipt(status) {
  return ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status)
}

async function handleDownloadReceipt(orderId) {
  receiptLoading.value[orderId] = true
  try {
    await orderApi.downloadReceipt(orderId)
    toast.success('Receipt downloaded successfully!')
  } catch (error) {
    toast.error(error?.message || 'Failed to download receipt')
  } finally {
    receiptLoading.value[orderId] = false
  }
}

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
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function canCancel(status) {
  return status === 'PENDING'
}

async function handleCancel(orderId) {
  cancelModal.value = { open: true, orderId, loading: false }
}

async function executeCancelOrder() {
  const orderId = cancelModal.value.orderId
  cancelModal.value.loading = true

  try {
    await orderStore.cancelOrder(orderId)
    await orderStore.fetchMyOrders(orderStore.page)
    toast.success('Order has been cancelled successfully.')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message || 'Failed to cancel order')
  } finally {
    cancelModal.value = { open: false, orderId: null, loading: false }
  }
}

function handlePay(orderId) {
  router.push(`/checkout?orderId=${orderId}`)
}

function goToPage(pageNum) {
  orderStore.fetchMyOrders(pageNum)
}

onMounted(() => {
  if (loggedIn.value) {
    orderStore.fetchMyOrders()
  }
})
</script>
