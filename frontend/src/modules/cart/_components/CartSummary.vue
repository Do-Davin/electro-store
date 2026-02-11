<template>
  <div class="bg-[#111111] rounded-2xl shadow-md p-6 border border-white/[0.06]">
    <h2 class="text-xl font-bold text-white mb-4">Order Summary</h2>

    <!-- Summary Lines -->
    <div class="space-y-3 text-gray-400">
      <div class="flex justify-between">
        <span>Subtotal ({{ itemCount }} items)</span>
        <span class="font-medium text-white">${{ subtotal.toFixed(2) }}</span>
      </div>

      <div class="flex justify-between">
        <span>VAT (10%)</span>
        <span class="font-medium text-white">${{ vat.toFixed(2) }}</span>
      </div>

      <div class="flex justify-between">
        <span>Shipping</span>
        <span v-if="isFreeShipping" class="font-medium text-green-600">Free</span>
        <span v-else class="font-medium text-white">${{ shipping.toFixed(2) }}</span>
      </div>

      <div class="border-t border-white/10 pt-3">
        <div class="flex justify-between text-lg">
          <span class="font-bold text-white">Total</span>
          <span class="font-bold text-white">${{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Free shipping helper -->
      <p v-if="!isFreeShipping" class="text-xs text-gray-500 mt-1">
        Free shipping on orders over $500
      </p>
    </div>

    <!-- Checkout Button -->
    <button
      :disabled="isEmpty || loading"
      class="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold
      hover:bg-primary/90 transition-colors disabled:opacity-50
      disabled:cursor-not-allowed flex items-center justify-center gap-2"
      @click="onCheckout"
    >
      <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
      <CreditCard v-else class="w-5 h-5" />
      {{ loading ? 'Checking Stock...' : 'Proceed to Checkout' }}
    </button>

    <!-- Continue Shopping -->
    <RouterLink
      to="/products"
      class="block text-center mt-4 text-primary hover:underline font-medium"
    >
      Continue Shopping
    </RouterLink>
  </div>
</template>

<script setup>
import { CreditCard, Loader2 } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({
  subtotal: {
    type: Number,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  isFreeShipping: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['checkout'])

const onCheckout = () => emit('checkout')
</script>
