<template>
  <Navbar />

  <!-- Page Header -->
  <div class="bg-primary py-8 pt-24">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-white">Checkout</h1>
      <p class="text-white/70 mt-1">
        {{ clientSecret ? 'Complete your payment' : 'Fill in your shipping details' }}
      </p>

      <!-- Step Indicator -->
      <div class="flex items-center gap-3 mt-4">
        <span
          class="flex items-center gap-1.5 text-sm font-medium"
          :class="clientSecret ? 'text-white/50' : 'text-white'"
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="clientSecret ? 'bg-white/30 text-white/60' : 'bg-white text-primary'"
          >1</span>
          Shipping
        </span>
        <ChevronRight class="w-4 h-4 text-white/40" />
        <span
          class="flex items-center gap-1.5 text-sm font-medium"
          :class="clientSecret ? 'text-white' : 'text-white/50'"
        >
          <span
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            :class="clientSecret ? 'bg-white text-primary' : 'bg-white/30 text-white/60'"
          >2</span>
          Payment
        </span>
      </div>
    </div>
  </div>

  <!-- Checkout Content -->
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Not Logged In Warning -->
      <div
        v-if="!isLoggedIn"
        class="bg-white rounded-2xl shadow-md p-12 text-center"
      >
        <LogIn class="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-500 mb-2">Please log in to checkout</h2>
        <p class="text-gray-400 mb-6">You need to be logged in to place an order.</p>
        <RouterLink
          to="/auth/login"
          class="inline-block px-6 py-3 bg-primary text-white rounded-xl
          font-semibold hover:bg-primary/90 transition-colors"
        >
          Log In
        </RouterLink>
      </div>

      <!-- Loading Existing Order (from Pay Now) -->
      <div
        v-else-if="loadingExistingOrder"
        class="bg-white rounded-2xl shadow-md p-12 text-center"
      >
        <Loader2 class="w-10 h-10 text-primary animate-spin mx-auto" />
        <p class="text-gray-500 mt-4">Loading order...</p>
      </div>

      <!-- Empty Cart Warning (only when not paying an existing order) -->
      <div
        v-else-if="cart.isEmpty && !clientSecret && !route.query.orderId"
        class="bg-white rounded-2xl shadow-md p-12 text-center"
      >
        <ShoppingCart class="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-500 mb-2">Your cart is empty</h2>
        <p class="text-gray-400 mb-6">Add some products before checking out.</p>
        <RouterLink
          to="/products"
          class="inline-block px-6 py-3 bg-primary text-white rounded-xl
          font-semibold hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </RouterLink>
      </div>

      <!-- Main Checkout Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">

          <!-- ===== Shipping Form (before order is created) ===== -->
          <template v-if="!clientSecret">
            <CheckoutForm @valid="isFormValid = true" @invalid="isFormValid = false" />
          </template>

          <!-- ===== Payment Section (after order is created) ===== -->
          <template v-else>
            <!-- Back link -->
            <button
              @click="goBack"
              class="text-gray-500 hover:text-primary text-sm font-medium
              flex items-center gap-1 transition-colors"
            >
              <ArrowLeft class="w-4 h-4" />
              {{ route.query.orderId ? 'Back to Orders' : 'Back to Shipping' }}
            </button>

            <!-- Stripe Payment Element -->
            <StripePaymentForm
              :client-secret="clientSecret"
              :total="orderTotal"
              @success="handlePaymentSuccess"
              @error="handlePaymentError"
            />
          </template>

          <!-- Error Message -->
          <div
            v-if="orderError"
            class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-red-700">
                {{ clientSecret ? 'Payment Error' : 'Order Failed' }}
              </p>
              <p class="text-sm text-red-600">{{ orderError }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-4">
            <!-- Order Review — shows backend order data when available, cart data otherwise -->
            <OrderReview :order="orderStore.currentOrder" />

            <!-- Continue to Payment button (only before payment step) -->
            <template v-if="!clientSecret">
              <button
                :disabled="!canPlaceOrder || isSubmitting"
                @click="handleCreateOrder"
                class="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg
                hover:bg-primary/90 transition-colors disabled:opacity-50
                disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                <CreditCard v-else class="w-5 h-5" />
                {{ isSubmitting ? 'Creating Order...' : 'Continue to Payment' }}
              </button>

              <p class="text-center text-gray-400 text-sm flex items-center justify-center gap-1">
                <Lock class="w-4 h-4" />
                Your information is secure
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import {
  ShoppingCart, Lock, Loader2, AlertCircle, LogIn,
  CreditCard, ArrowLeft, ChevronRight,
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import CheckoutForm from '../_components/CheckoutForm.vue'
import OrderReview from '../_components/OrderReview.vue'
import StripePaymentForm from '../_components/StripePaymentForm.vue'
import { useCartStore } from '@/modules/cart/_stores/cart.store'
import { useCheckoutStore } from '../_stores/checkout.store'
import { useOrderStore } from '@/modules/order/_stores/order.store'
import { isLoggedIn as checkLoggedIn } from '@/lib/auth'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const checkout = useCheckoutStore()
const orderStore = useOrderStore()

const isFormValid = ref(false)
const isSubmitting = ref(false)
const orderError = ref('')
const clientSecret = ref('')
const createdOrderId = ref('')
const loadingExistingOrder = ref(false)

const isLoggedIn = computed(() => checkLoggedIn())

const orderTotal = computed(() => {
  if (orderStore.currentOrder) {
    return Number(orderStore.currentOrder.totalAmount).toFixed(2)
  }
  return cart.cartTotal.toFixed(2)
})

const canPlaceOrder = computed(() => {
  return (
    isLoggedIn.value &&
    !cart.isEmpty &&
    checkout.hasRequiredFields &&
    checkout.validateAll()
  )
})

/**
 * Create the order, then get PaymentIntent clientSecret
 * to transition to the embedded Stripe payment form.
 */
async function handleCreateOrder() {
  if (!checkout.validateAll()) return

  orderError.value = ''
  isSubmitting.value = true

  try {
    checkout.saveToStorage()

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    const order = await orderStore.createOrder(items)
    createdOrderId.value = order.id

    // Clear cart after successful order creation
    cart.clearCart()
    checkout.reset()

    // Get PaymentIntent clientSecret
    const secret = await orderStore.createPaymentIntent(order.id)
    clientSecret.value = secret

    // Scroll to top when transitioning to payment step
    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (error) {
    orderError.value = error.message || 'Failed to create order. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

/** Payment succeeded — verify with Stripe, then redirect to confirmation. */
async function handlePaymentSuccess() {
  try {
    await orderStore.verifyPayment(createdOrderId.value)
  } catch {
    // Verification may fail, but the webhook will catch it
  }
  router.push(`/orders/${createdOrderId.value}/confirmation?payment=success`)
}

/** Payment failed — show error. */
function handlePaymentError(message) {
  orderError.value = message || 'Payment failed. Please try again.'
}

/** Navigate back from the payment view. */
function goBack() {
  if (route.query.orderId) {
    router.push('/orders')
    return
  }
  // Can't go back to shipping after order is created (cart cleared),
  // so go to order history instead
  router.push('/orders')
}

/**
 * On mount — if ?orderId= is present (from "Pay Now" button),
 * load that order and go straight to payment.
 */
onMounted(async () => {
  const existingOrderId = route.query.orderId
  if (!existingOrderId) return

  loadingExistingOrder.value = true
  orderError.value = ''

  try {
    await orderStore.fetchOrderById(existingOrderId)
    createdOrderId.value = existingOrderId

    const secret = await orderStore.createPaymentIntent(existingOrderId)
    clientSecret.value = secret

    // Scroll to top when transitioning to payment step
    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (error) {
    orderError.value = error.message || 'Failed to load order for payment.'
  } finally {
    loadingExistingOrder.value = false
  }
})
</script>
