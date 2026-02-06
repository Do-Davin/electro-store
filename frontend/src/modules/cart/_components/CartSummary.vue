<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <h2 class="text-xl font-bold text-[#0b2c5f] mb-4">Order Summary</h2>

    <!-- Summary Lines -->
    <div class="space-y-3 text-gray-600">
      <div class="flex justify-between">
        <span>Subtotal ({{ itemCount }} items)</span>
        <span class="font-medium text-[#0b2c5f]">${{ subtotal.toFixed(2) }}</span>
      </div>

      <div class="flex justify-between">
        <span>Shipping</span>
        <span class="font-medium text-green-600">Free</span>
      </div>

      <div class="border-t border-gray-200 pt-3">
        <div class="flex justify-between text-lg">
          <span class="font-bold text-[#0b2c5f]">Total</span>
          <span class="font-bold text-[#0b2c5f]">${{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Checkout Button -->
    <button
      :disabled="isEmpty"
      class="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold
      hover:bg-primary/90 transition-colors disabled:opacity-50
      disabled:cursor-not-allowed flex items-center justify-center gap-2"
      @click="onCheckout"
    >
      <CreditCard class="w-5 h-5" />
      Proceed to Checkout
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
import { CreditCard } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({
  subtotal: {
    type: Number,
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
})

const emit = defineEmits(['checkout'])

const onCheckout = () => emit('checkout')
</script>
