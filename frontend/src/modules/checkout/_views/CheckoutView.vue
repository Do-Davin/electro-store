<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Lock, Loader2, LogIn, CreditCard, ArrowLeft, ChevronRight } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import CheckoutForm from '../_components/CheckoutForm.vue'
import OrderReview from '../_components/OrderReview.vue'
import StripePaymentForm from '../_components/StripePaymentForm.vue'
import PaymentMethodSelector from '../_components/PaymentMethodSelector.vue'
import PaywayCheckoutForm from '../_components/PaywayCheckoutForm.vue'
import { useCartStore } from '@/modules/cart/_stores/cart.store'
import { useCheckoutStore } from '../_stores/checkout.store'
import { useOrderStore } from '@/modules/order/_stores/order.store'
import { isLoggedIn as checkLoggedIn } from '@/lib/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const checkout = useCheckoutStore()
const orderStore = useOrderStore()
const toast = useToast()

const isFormValid = ref(false)
const isSubmitting = ref(false)
const orderError = ref('')
const createdOrderId = ref('')
const loadingExistingOrder = ref(false)

// Payment method selection
const paymentMethod = ref('stripe') // 'stripe' | 'payway'
const paywayCurrency = ref('USD')   // 'USD' | 'KHR'

// Stripe state
const clientSecret = ref('')

// PayWay state
const paywayHtml = ref('')

// Whether we're in "payment step" (order created, showing payment form)
const inPaymentStep = computed(() => !!clientSecret.value || !!paywayHtml.value)

const isLoggedIn = computed(() => checkLoggedIn())

const orderTotal = computed(() => {
  if (orderStore.currentOrder) {
    return Number(orderStore.currentOrder.totalAmount).toFixed(2)
  }
  const original = cart.originalTotal
  const vat = Math.round(original * 0.10 * 100) / 100
  const discount = Math.round(cart.totalDiscount * 1.10 * 100) / 100
  const shipping = cart.cartTotal >= 500 ? 0 : 5
  return (Math.round((original + vat - discount + shipping) * 100) / 100).toFixed(2)
})

const canPlaceOrder = computed(() => {
  return isLoggedIn.value && !cart.isEmpty && checkout.hasRequiredFields && checkout.validateAll()
})

/**
 * Create the order, then initiate the selected payment flow.
 * - Stripe: get PaymentIntent clientSecret → show Stripe Elements
 * - PayWay: get checkout HTML → show iframe
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

    if (paymentMethod.value === 'payway') {
      // PayWay flow — get checkout HTML
      const result = await orderStore.createPaywayTransaction(order.id, paywayCurrency.value)
      paywayHtml.value = result.checkoutHtml
    } else {
      // Stripe flow — get PaymentIntent clientSecret
      const secret = await orderStore.createPaymentIntent(order.id)
      clientSecret.value = secret
    }

    // Scroll to top when transitioning to payment step
    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (error) {
    orderError.value = error.message || 'Failed to create order. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// ── Stripe handlers ──

/** Stripe payment succeeded — verify with backend, then redirect. */
async function handlePaymentSuccess() {
  try {
    await orderStore.verifyPayment(createdOrderId.value)
  } catch {
    toast.warning(
      'Payment verification is still processing. Your order will be updated shortly.',
      'Processing',
    )
  }
  router.push(`/orders/${createdOrderId.value}/confirmation?payment=success`)
}

/** Stripe payment failed — show error. */
function handlePaymentError(message) {
  orderError.value = message || 'Payment failed. Please try again.'
}

// ── PayWay handlers ──

/** User clicked "Verify" after completing PayWay payment in the iframe. */
async function handlePaywayVerify() {
  isSubmitting.value = true
  orderError.value = ''
  try {
    const result = await orderStore.verifyPaywayPayment(createdOrderId.value)
    if (result.status === 'PAID' || result.status === 'approved') {
      router.push(`/orders/${createdOrderId.value}/confirmation?payment=success`)
    } else {
      orderError.value = 'Payment has not been completed yet. Please finish the payment in the PayWay window, then click Verify again.'
    }
  } catch (error) {
    orderError.value = error.message || 'Failed to verify PayWay payment.'
  } finally {
    isSubmitting.value = false
  }
}

/** User cancelled PayWay payment. */
function handlePaywayCancel() {
  paywayHtml.value = ''
  orderError.value = 'Payment was cancelled. You can retry from your order history.'
  router.push('/orders')
}

/** Navigate back from the payment view. */
function goBack() {
  if (route.query.orderId) {
    router.push('/orders')
    return
  }
  router.push('/orders')
}

/**
 * On mount — if ?orderId= is present (from "Pay Now" button),
 * load that order and go straight to payment.
 * Detects paymentProvider so we resume the correct flow.
 */
onMounted(async () => {
  const existingOrderId = route.query.orderId

  // Clear stale order data if not resuming payment for an existing order
  if (!existingOrderId) {
    orderStore.clearCurrentOrder()
    return
  }

  loadingExistingOrder.value = true
  orderError.value = ''

  try {
    await orderStore.fetchOrderById(existingOrderId)
    createdOrderId.value = existingOrderId

    const order = orderStore.currentOrder
    const provider = order?.paymentProvider || 'stripe'
    paymentMethod.value = provider

    if (provider === 'payway') {
      // Re-create PayWay transaction to get a fresh checkout page
      const result = await orderStore.createPaywayTransaction(existingOrderId, paywayCurrency.value)
      paywayHtml.value = result.checkoutHtml
    } else {
      const secret = await orderStore.createPaymentIntent(existingOrderId)
      clientSecret.value = secret
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (error) {
    orderError.value = error.message || 'Failed to load order for payment.'
  } finally {
    loadingExistingOrder.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <!-- Page Header -->
      <div class="bg-primary py-8 pt-24">
        <div class="max-w-6xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-white">Checkout</h1>
          <p class="text-white/70 mt-1">
            {{ inPaymentStep ? 'Complete your payment' : 'Fill in your shipping details' }}
          </p>

          <!-- Step Indicator -->
          <div class="flex items-center gap-3 mt-4">
            <span
              class="flex items-center gap-1.5 text-sm font-medium"
              :class="inPaymentStep ? 'text-white/50' : 'text-white'"
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                :class="inPaymentStep ? 'bg-white/30 text-white/60' : 'bg-white text-primary'"
                >1</span
              >
              Shipping
            </span>
            <ChevronRight class="w-4 h-4 text-white/40" />
            <span
              class="flex items-center gap-1.5 text-sm font-medium"
              :class="inPaymentStep ? 'text-white' : 'text-white/50'"
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                :class="inPaymentStep ? 'bg-white text-primary' : 'bg-white/30 text-white/60'"
                >2</span
              >
              Payment
            </span>
          </div>
        </div>
      </div>

      <!-- Checkout Content -->
      <div class="min-h-screen bg-[#000000] py-8">
        <div class="max-w-6xl mx-auto px-4">
          <!-- Not Logged In Warning -->
          <div
            v-if="!isLoggedIn"
            class="bg-[#111111] rounded-2xl shadow-md p-12 text-center border border-white/6"
          >
            <LogIn class="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-white mb-2">Please log in to checkout</h2>
            <p class="text-gray-400 mb-6">You need to be logged in to place an order.</p>
            <RouterLink
              to="/auth/login"
              class="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Log In
            </RouterLink>
          </div>

          <!-- Loading Existing Order (from Pay Now) -->
          <div v-else-if="loadingExistingOrder || isSubmitting">
            <SkeletonLoader variant="list" :count="1" />
          </div>

          <!-- Empty Cart Warning (only when not in payment step and not resuming) -->
          <StateView
            v-else-if="cart.isEmpty && !inPaymentStep && !route.query.orderId"
            icon="cart"
            title="Your cart is empty"
            subtitle="Add some products before checking out."
            action-to="/products"
            action-text="Browse Products"
          />

          <!-- Main Checkout Grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6">
              <!-- ===== Shipping Form + Payment Method (before order is created) ===== -->
              <template v-if="!inPaymentStep">
                <CheckoutForm @valid="isFormValid = true" @invalid="isFormValid = false" />

                <!-- Payment Method Selector -->
                <PaymentMethodSelector v-model="paymentMethod">
                  <!-- Currency selector for PayWay -->
                  <template #currency-selector>
                    <button
                      v-for="cur in ['USD', 'KHR']"
                      :key="cur"
                      @click="paywayCurrency = cur"
                      class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      :class="
                        paywayCurrency === cur
                          ? 'bg-primary text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      "
                    >
                      {{ cur }}
                    </button>
                  </template>
                </PaymentMethodSelector>
              </template>

              <!-- ===== Payment Section (after order is created) ===== -->
              <template v-else>
                <!-- Back link -->
                <button
                  @click="goBack"
                  class="text-gray-400 hover:text-primary text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft class="w-4 h-4" />
                  {{ route.query.orderId ? 'Back to Orders' : 'Back to Shipping' }}
                </button>

                <!-- Stripe Payment Element -->
                <StripePaymentForm
                  v-if="clientSecret"
                  :client-secret="clientSecret"
                  :total="orderTotal"
                  @success="handlePaymentSuccess"
                  @error="handlePaymentError"
                />

                <!-- PayWay Checkout Form -->
                <PaywayCheckoutForm
                  v-else-if="paywayHtml"
                  :checkout-html="paywayHtml"
                  :order-id="createdOrderId"
                  @success="handlePaywayVerify"
                  @cancel="handlePaywayCancel"
                />
              </template>

              <!-- Error Message -->
              <ErrorBanner
                v-if="orderError"
                :title="inPaymentStep ? 'Payment Error' : 'Order Failed'"
                :message="orderError"
              />
            </div>

            <!-- Right Column: Order Summary -->
            <div class="lg:col-span-1">
              <div class="sticky top-24 space-y-4">
                <!-- Order Review — shows backend order data when available, cart data otherwise -->
                <OrderReview :order="createdOrderId ? orderStore.currentOrder : null" />

                <!-- Continue to Payment button (only before payment step) -->
                <template v-if="!inPaymentStep">
                  <button
                    :disabled="!canPlaceOrder || isSubmitting"
                    @click="handleCreateOrder"
                    class="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                    <CreditCard v-else class="w-5 h-5" />
                    {{ isSubmitting ? 'Creating Order...' : 'Continue to Payment' }}
                  </button>

                  <p
                    class="text-center text-gray-400 text-sm flex items-center justify-center gap-1"
                  >
                    <Lock class="w-4 h-4" />
                    Your information is secure
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
