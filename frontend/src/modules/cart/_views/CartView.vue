<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <!-- Page Header -->
      <div class="bg-primary py-8 pt-24">
    <div class="max-w-6xl mx-auto px-4">
      <BreadcrumbNav :crumbs="[
        { label: 'Home', to: '/' },
        { label: 'Cart', to: '/carts' },
      ]" class="mb-3 [&_span]:text-white/70 [&_span:last-child]:text-white [&_svg]:text-white/40" />
      <h1 class="text-3xl font-bold text-white">Shopping Cart</h1>
      <p class="text-white/70 mt-1">{{ cart.itemCount }} items in your cart</p>
    </div>
  </div>

  <!-- Cart Content -->
  <div class="min-h-screen bg-[#000000] py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items (Left) -->
        <div class="lg:col-span-2">
          <CartListComponent />

          <!-- Clear Cart Button -->
          <div v-if="!cart.isEmpty" class="mt-4 flex justify-end">
            <button
              @click="handleClearCart"
              class="text-red-500 hover:text-red-600 font-medium
              flex items-center gap-2 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Order Summary (Right) -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CartSummary
              :subtotal="cart.originalTotal"
              :discount="cartDiscount"
              :vat="cartVat"
              :shipping="cartShipping"
              :is-free-shipping="isFreeShipping"
              :total="cartGrandTotal"
              :item-count="cart.itemCount"
              :is-empty="cart.isEmpty"
              :loading="checkingStock"
              @checkout="handleCheckout"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  </main>

  <Footer />

  <!-- Clear Cart Confirm Modal -->
  <ConfirmModal
    :isOpen="showClearModal"
    type="warning"
    title="Clear Cart"
    message="Are you sure you want to remove all items from your cart?"
    confirmText="Clear Cart"
    cancelText="Keep Items"
    @confirm="executeClearCart"
    @cancel="showClearModal = false"
    @close="showClearModal = false"
  />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import Footer from '@/components/Footer.vue'
import CartListComponent from '../_components/CartListComponent.vue'
import CartSummary from '../_components/CartSummary.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useCartStore } from '../_stores/cart.store'
import { useToast } from '@/composables/useToast'
import axios from '@/lib/axios'

const router = useRouter()
const cart = useCartStore()
const toast = useToast()

const checkingStock = ref(false)

const cartVat = computed(() => {
  return Math.round(cart.originalTotal * 0.10 * 100) / 100
})

const cartDiscount = computed(() => {
  return Math.round(cart.totalDiscount * 1.10 * 100) / 100
})

const cartShipping = computed(() => {
  return cart.cartTotal >= 500 ? 0 : 5
})

const isFreeShipping = computed(() => cartShipping.value === 0)

const cartGrandTotal = computed(() => {
  return Math.round((cart.originalTotal + cartVat.value - cartDiscount.value + cartShipping.value) * 100) / 100
})

const showClearModal = ref(false)

function handleClearCart() {
  showClearModal.value = true
}

function executeClearCart() {
  cart.clearCart()
  showClearModal.value = false
  toast.success('Cart has been cleared.')
}

async function validateStock() {
  checkingStock.value = true

  try {
    // Check stock for each item in cart
    for (const item of cart.items) {
      const { data: product } = await axios.get(`/products/${item.productId}`)

      if (!product) {
        toast.error(`Product "${item.name}" not found`)
        return false
      }

      if (product.stock < item.quantity) {
        toast.error(
          `Insufficient stock for "${item.name}". You want ${item.quantity} but only ${product.stock} available.`,
          'Stock Error'
        )
        return false
      }
    }

    return true
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error?.message || 'Failed to validate stock',
      'Validation Error'
    )
    return false
  } finally {
    checkingStock.value = false
  }
}

async function handleCheckout() {
  // Validate stock before proceeding
  const isValid = await validateStock()
  if (!isValid) return

  router.push('/checkout')
}
</script>
