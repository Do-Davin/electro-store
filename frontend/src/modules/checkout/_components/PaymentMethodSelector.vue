<script setup>
import { CreditCard } from 'lucide-vue-next'

defineProps({
  modelValue: { type: String, default: 'stripe' },
})

const emit = defineEmits(['update:modelValue'])

function select(method) {
  emit('update:modelValue', method)
}
</script>

<template>
  <div class="bg-[#111111] rounded-2xl shadow-md p-6 border border-white/6">
    <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <CreditCard class="w-5 h-5" />
      Payment Method
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Stripe (Visa/Card) -->
      <button
        @click="select('stripe')"
        class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
        :class="
          modelValue === 'stripe'
            ? 'border-primary bg-primary/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        "
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          :class="modelValue === 'stripe' ? 'bg-primary/20' : 'bg-white/10'"
        >
          💳
        </div>
        <div class="text-left">
          <p class="font-semibold text-white text-sm">Credit / Debit Card</p>
          <p class="text-xs text-gray-400">Visa, Mastercard via Stripe</p>
        </div>
        <div class="ml-auto">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="
              modelValue === 'stripe'
                ? 'border-primary'
                : 'border-white/20'
            "
          >
            <div
              v-if="modelValue === 'stripe'"
              class="w-2.5 h-2.5 rounded-full bg-primary"
            />
          </div>
        </div>
      </button>

      <!-- PayWay (ABA) -->
      <button
        @click="select('payway')"
        class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
        :class="
          modelValue === 'payway'
            ? 'border-primary bg-primary/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        "
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          :class="modelValue === 'payway' ? 'bg-primary/20' : 'bg-white/10'"
        >
          🏦
        </div>
        <div class="text-left">
          <p class="font-semibold text-white text-sm">PayWay (ABA)</p>
          <p class="text-xs text-gray-400">KHQR, ABA PAY, Cards, Wallets</p>
        </div>
        <div class="ml-auto">
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :class="
              modelValue === 'payway'
                ? 'border-primary'
                : 'border-white/20'
            "
          >
            <div
              v-if="modelValue === 'payway'"
              class="w-2.5 h-2.5 rounded-full bg-primary"
            />
          </div>
        </div>
      </button>
    </div>

    <!-- Currency selector for PayWay -->
    <div
      v-if="modelValue === 'payway'"
      class="mt-4 bg-white/5 rounded-xl p-3"
    >
      <p class="text-sm text-gray-400 mb-2">Payment currency</p>
      <div class="flex gap-2">
        <slot name="currency-selector" />
      </div>
    </div>
  </div>
</template>
