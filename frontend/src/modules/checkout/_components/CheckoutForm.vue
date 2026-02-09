<template>
  <div class="bg-[#111111] rounded-2xl shadow-md p-6 border border-white/[0.06]">
    <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
      <MapPin class="w-5 h-5" />
      Shipping Information
    </h2>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Full Name <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            :value="checkout.shippingInfo.fullName"
            @input="handleInput('fullName', $event)"
            @blur="handleBlur('fullName')"
            placeholder="John Doe"
            class="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.fullName ? 'border-red-500' : 'border-white/10'"
          />
        </div>
        <p v-if="checkout.errors.fullName" class="text-red-500 text-sm mt-1">
          {{ checkout.errors.fullName }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="email"
            :value="checkout.shippingInfo.email"
            @input="handleInput('email', $event)"
            @blur="handleBlur('email')"
            placeholder="john@example.com"
            class="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.email ? 'border-red-500' : 'border-white/10'"
          />
        </div>
        <p v-if="checkout.errors.email" class="text-red-500 text-sm mt-1">
          {{ checkout.errors.email }}
        </p>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Phone <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="tel"
            :value="checkout.shippingInfo.phone"
            @input="handleInput('phone', $event)"
            @blur="handleBlur('phone')"
            placeholder="+1 234 567 8900"
            class="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.phone ? 'border-red-500' : 'border-white/10'"
          />
        </div>
        <p v-if="checkout.errors.phone" class="text-red-500 text-sm mt-1">
          {{ checkout.errors.phone }}
        </p>
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Address <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Home class="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <textarea
            :value="checkout.shippingInfo.address"
            @input="handleInput('address', $event)"
            @blur="handleBlur('address')"
            placeholder="123 Main Street, Apt 4B"
            rows="2"
            class="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors resize-none bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.address ? 'border-red-500' : 'border-white/10'"
          />
        </div>
        <p v-if="checkout.errors.address" class="text-red-500 text-sm mt-1">
          {{ checkout.errors.address }}
        </p>
      </div>

      <!-- City & Postal Code Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            City <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            :value="checkout.shippingInfo.city"
            @input="handleInput('city', $event)"
            @blur="handleBlur('city')"
            placeholder="New York"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.city ? 'border-red-500' : 'border-white/10'"
          />
          <p v-if="checkout.errors.city" class="text-red-500 text-sm mt-1">
            {{ checkout.errors.city }}
          </p>
        </div>

        <!-- Postal Code -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            Postal Code <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            :value="checkout.shippingInfo.postalCode"
            @input="handleInput('postalCode', $event)"
            @blur="handleBlur('postalCode')"
            placeholder="10001"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2
            focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
            :class="checkout.errors.postalCode ? 'border-red-500' : 'border-white/10'"
          />
          <p v-if="checkout.errors.postalCode" class="text-red-500 text-sm mt-1">
            {{ checkout.errors.postalCode }}
          </p>
        </div>
      </div>

      <!-- Country (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Country
        </label>
        <input
          type="text"
          :value="checkout.shippingInfo.country"
          @input="handleInput('country', $event)"
          placeholder="United States"
          class="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2
          focus:ring-primary focus:border-primary transition-colors bg-[#0a0a0a] text-white placeholder-gray-500"
        />
      </div>

      <!-- Order Notes (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          Order Notes
        </label>
        <textarea
          :value="checkout.shippingInfo.notes"
          @input="handleInput('notes', $event)"
          placeholder="Any special instructions for delivery..."
          rows="3"
          class="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2
          focus:ring-primary focus:border-primary transition-colors resize-none bg-[#0a0a0a] text-white placeholder-gray-500"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { MapPin, User, Mail, Phone, Home } from 'lucide-vue-next'
import { useCheckoutStore } from '@/modules/checkout/_stores/checkout.store'

const checkout = useCheckoutStore()

const emit = defineEmits(['valid', 'invalid'])

function handleInput(field, event) {
  checkout.updateField(field, event.target.value)
}

function handleBlur(field) {
  const error = checkout.validateField(field)
  if (error) {
    checkout.errors[field] = error
  }
  // Emit validation status
  if (checkout.hasRequiredFields && checkout.validateAll()) {
    emit('valid')
  } else {
    emit('invalid')
  }
}

function onSubmit() {
  // Form submission handled by parent
}
</script>
