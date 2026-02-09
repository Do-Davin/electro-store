<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <!-- Page Header -->
      <div class="bg-primary py-8 pt-24">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-white">Shopping Cart</h1>
      <p class="text-white/70 mt-1">{{ cart.itemCount }} items in your cart</p>
    </div>
  </div>

  <!-- Cart Content -->
  <div class="min-h-screen bg-gray-50 py-8">
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
              :subtotal="cart.cartTotal"
              :total="cart.cartTotal"
              :item-count="cart.itemCount"
              :is-empty="cart.isEmpty"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import CartListComponent from '../_components/CartListComponent.vue'
import CartSummary from '../_components/CartSummary.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useCartStore } from '../_stores/cart.store'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const cart = useCartStore()
const toast = useToast()

const showClearModal = ref(false)

function handleClearCart() {
  showClearModal.value = true
}

function executeClearCart() {
  cart.clearCart()
  showClearModal.value = false
  toast.success('Cart has been cleared.')
}

function handleCheckout() {
  router.push('/checkout')
}
</script>
