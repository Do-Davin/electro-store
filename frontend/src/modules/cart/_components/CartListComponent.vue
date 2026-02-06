<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div
      v-if="cart.isEmpty"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <ShoppingCart class="w-20 h-20 text-gray-300 mb-4" />
      <h3 class="text-xl font-bold text-gray-500 mb-2">Your cart is empty</h3>
      <p class="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
      <RouterLink
        to="/products"
        class="px-6 py-3 bg-primary text-white rounded-xl font-semibold
        hover:bg-primary/90 transition-colors"
      >
        Start Shopping
      </RouterLink>
    </div>

    <!-- Cart Items -->
    <template v-else>
      <CartItemCard
        v-for="item in cart.items"
        :key="item.productId"
        :item="item"
        @increment="cart.incrementQuantity"
        @decrement="cart.decrementQuantity"
        @remove="cart.removeItem"
      />
    </template>
  </div>
</template>

<script setup>
import { ShoppingCart } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/modules/cart/_stores/cart.store'
import CartItemCard from './CartItemCard.vue'

const cart = useCartStore()
</script>
