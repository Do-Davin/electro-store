<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <h2 class="text-lg font-bold text-[#0b2c5f] mb-4 flex items-center gap-2">
      <CreditCard class="w-5 h-5" />
      Payment Details
    </h2>

    <!-- Stripe Elements Mount Point -->
    <div
      ref="paymentElementRef"
      class="min-h-[120px] border border-gray-200 rounded-xl p-4 bg-gray-50
      focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
      transition-all"
    />

    <!-- Card Errors -->
    <p v-if="cardError" class="mt-3 text-sm text-red-500 flex items-center gap-1">
      <AlertCircle class="w-4 h-4 shrink-0" />
      {{ cardError }}
    </p>

    <!-- Pay Button -->
    <button
      :disabled="!isReady || isProcessing"
      @click="handlePay"
      class="w-full mt-6 py-4 rounded-xl bg-primary text-white font-bold text-lg
      hover:bg-primary/90 transition-colors disabled:opacity-50
      disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
      <Lock v-else class="w-5 h-5" />
      {{ isProcessing ? 'Processing...' : `Pay $${total}` }}
    </button>

    <p class="mt-3 text-center text-gray-400 text-xs flex items-center justify-center gap-1">
      <ShieldCheck class="w-3.5 h-3.5" />
      Secured by Stripe. We never see your card details.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  clientSecret: { type: String, required: true },
  total: { type: String, required: true },
})

const emit = defineEmits(['success', 'error'])

const paymentElementRef = ref(null)
const cardError = ref('')
const isReady = ref(false)
const isProcessing = ref(false)

let stripe = null
let elements = null
let paymentElement = null

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

onMounted(async () => {
  if (!STRIPE_PK) {
    cardError.value = 'Stripe publishable key not configured'
    return
  }

  stripe = await loadStripe(STRIPE_PK)
  if (!stripe) {
    cardError.value = 'Failed to load Stripe'
    return
  }

  mountElements()
})

function mountElements() {
  if (!stripe || !props.clientSecret) return

  // Clean up previous instance
  if (paymentElement) {
    paymentElement.unmount()
    paymentElement = null
  }

  elements = stripe.elements({
    clientSecret: props.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0b2c5f',
        borderRadius: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
  })

  paymentElement = elements.create('payment', {
    layout: 'tabs',
  })

  paymentElement.mount(paymentElementRef.value)

  paymentElement.on('ready', () => {
    isReady.value = true
  })

  paymentElement.on('change', (event) => {
    cardError.value = event.error?.message || ''
  })
}

// Re-mount if clientSecret changes (e.g. retry)
watch(() => props.clientSecret, (newSecret) => {
  if (newSecret && stripe) {
    mountElements()
  }
})

async function handlePay() {
  if (!stripe || !elements) return

  isProcessing.value = true
  cardError.value = ''

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.href, // fallback, shouldn't redirect
    },
    redirect: 'if_required', // Stay on page — only redirect for 3D Secure
  })

  if (error) {
    cardError.value = error.message || 'Payment failed'
    isProcessing.value = false
    emit('error', error.message)
  } else {
    // Payment succeeded (or is processing)
    emit('success')
  }
}

onBeforeUnmount(() => {
  if (paymentElement) {
    paymentElement.unmount()
  }
})
</script>
