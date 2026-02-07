<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <StateView
      v-if="cart.isEmpty"
      icon="cart"
      title="Your cart is empty"
      subtitle="Looks like you haven't added anything yet."
      action-to="/products"
      action-text="Start Shopping"
    />

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
import StateView from '@/components/StateView.vue'

const cart = useCartStore()
</script>
