<script setup>
import { computed } from 'vue'
import { ShoppingBag } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/modules/cart/_stores/cart.store'
import placeholderImg from '@/assets/img/placeholder.png'

const props = defineProps({
  /** Pass the created order object to show order items from backend instead of cart */
  order: { type: Object, default: null },
})

const cart = useCartStore()
const API = import.meta.env.VITE_API_URL

/**
 * Normalised list of items – reads from the order prop when available,
 * otherwise falls back to the local cart store.
 */
const displayItems = computed(() => {
  if (props.order?.items?.length) {
    return props.order.items.map((item) => ({
      id: item.id || item.product?.id,
      name: item.product?.name ?? 'Product',
      imageUrl: item.product?.imageUrl ?? null,
      quantity: item.quantity,
      price: Number(item.priceAtTime),
    }))
  }

  return cart.items.map((item) => ({
    id: item.productId,
    name: item.name,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    price: item.priceSnapshot,
  }))
})

const totalItemCount = computed(() => displayItems.value.reduce((sum, i) => sum + i.quantity, 0))

const displayTotal = computed(() => {
  if (props.order) return Number(props.order.totalAmount)
  return cart.cartTotal
})

function getImageUrl(img) {
  if (!img) return placeholderImg
  return img.startsWith('http') ? img : API + img
}

function onImageError(event) {
  event.target.src = placeholderImg
}
</script>

<template>
  <div class="bg-[#111111] rounded-2xl shadow-md p-6 border border-white/6">
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <ShoppingBag class="w-5 h-5" />
      Order Review
    </h2>

    <!-- Items List -->
    <div class="space-y-3 max-h-80 overflow-y-auto">
      <div
        v-for="item in displayItems"
        :key="item.id"
        class="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
      >
        <!-- Image -->
        <div class="w-14 h-14 shrink-0 bg-[#0a0a0a] rounded-lg overflow-hidden">
          <img
            :src="getImageUrl(item.imageUrl)"
            :alt="item.name"
            class="w-full h-full object-contain"
            @error="onImageError($event)"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-medium text-white truncate">{{ item.name }}</p>
          <p class="text-sm text-gray-400">{{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
        </div>

        <!-- Item Total -->
        <p class="font-bold text-white">${{ (item.quantity * item.price).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Summary -->
    <div class="border-t border-white/10 mt-4 pt-4 space-y-2">
      <div class="flex justify-between text-gray-400">
        <span>Subtotal ({{ totalItemCount }} items)</span>
        <span>${{ displayTotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-gray-400">
        <span>Shipping</span>
        <span class="text-green-400 font-medium">Free</span>
      </div>
      <div class="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
        <span>Total</span>
        <span>${{ displayTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Edit Cart Link (only show when viewing from cart, not from a placed order) -->
    <RouterLink
      v-if="!order"
      to="/carts"
      class="block text-center mt-4 text-primary hover:underline text-sm font-medium"
    >
      Edit Cart
    </RouterLink>
  </div>
</template>
