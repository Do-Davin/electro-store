<template>
  <div>
    <!-- Loading State -->
    <SkeletonLoader
      v-if="orderStore.loading && orders.length === 0"
      variant="list"
      :count="3"
    />

    <!-- Not Logged In -->
    <div
      v-else-if="!loggedIn"
      class="bg-white rounded-2xl shadow-md p-12 text-center"
    >
      <LogIn class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-500 mb-2">Please log in</h2>
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
      @retry="orderStore.fetchMyOrders()"
    />

    <!-- Order List -->
    <div v-else class="space-y-4">
      <!-- Order Cards -->
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <!-- Order Header -->
        <div class="flex flex-wrap justify-between items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Order</p>
              <p class="font-bold text-[#0b2c5f]">#{{ order.id.slice(0, 8).toUpperCase() }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wider">Date</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span :class="statusClass(order.status)">{{ order.status }}</span>
            <p class="text-lg font-bold text-[#0b2c5f]">${{ Number(order.totalAmount).toFixed(2) }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="px-6 py-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
          >
            <!-- Image -->
            <div class="w-14 h-14 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
              <img
                :src="getImageUrl(item.product?.imageUrl)"
                :alt="item.product?.name"
                class="w-full h-full object-contain"
                @error="onImageError($event)"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-[#0b2c5f] truncate">{{ item.product?.name }}</p>
              <p class="text-sm text-gray-400">
                {{ item.quantity }} × ${{ Number(item.priceAtTime).toFixed(2) }}
              </p>
            </div>

            <!-- Item Total -->
            <p class="font-semibold text-[#0b2c5f]">
              ${{ (item.quantity * Number(item.priceAtTime)).toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-100">
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
          class="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span class="text-sm text-gray-500">
          Page {{ orderStore.page }} of {{ orderStore.totalPages }}
        </span>

        <button
          :disabled="orderStore.page >= orderStore.totalPages"
          @click="goToPage(orderStore.page + 1)"
          class="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { LogIn, XCircle, CreditCard } from 'lucide-vue-next'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import { useOrderStore } from '../_stores/order.store'
import { isLoggedIn } from '@/lib/auth'
import placeholderImg from '@/assets/img/placeholder.png'

const router = useRouter()

const orderStore = useOrderStore()

const loggedIn = computed(() => isLoggedIn())
const orders = computed(() => orderStore.orders)

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
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function statusClass(status) {
  const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold'
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
      return `${base} bg-emerald-100 text-emerald-700`
    case 'CANCELLED':
      return `${base} bg-red-100 text-red-700`
    default:
      return `${base} bg-gray-100 text-gray-600`
  }
}

function canCancel(status) {
  return ['PENDING', 'PAID', 'PROCESSING'].includes(status)
}

async function handleCancel(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return

  try {
    await orderStore.cancelOrder(orderId)
    await orderStore.fetchMyOrders(orderStore.page)
  } catch (error) {
    alert(`Failed to cancel: ${error.message}`)
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
