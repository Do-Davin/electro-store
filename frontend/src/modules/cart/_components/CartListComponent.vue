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
        @remove="openRemoveModal"
      />
    </template>

    <!-- Remove Item Confirm Modal -->
    <ConfirmModal
      :is-open="modal.isOpen"
      type="danger"
      title="Remove Item"
      message="Are you sure you want to remove this item from your cart?"
      confirm-text="Remove"
      cancel-text="Cancel"
      :loading="modal.loading"
      @confirm="handleRemoveConfirm"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useCartStore } from '@/modules/cart/_stores/cart.store'
import CartItemCard from './CartItemCard.vue'
import StateView from '@/components/StateView.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const cart = useCartStore()

// Modal state
const modal = reactive({
  isOpen: false,
  loading: false,
  productId: null
})

// Open remove confirmation modal
const openRemoveModal = (productId) => {
  modal.isOpen = true
  modal.productId = productId
}

// Handle remove confirmation
const handleRemoveConfirm = async () => {
  modal.loading = true

  try {
    if (modal.productId) {
      await cart.removeItem(modal.productId)
    }
  } finally {
    modal.loading = false
    closeModal()
  }
}

// Close modal
const closeModal = () => {
  modal.isOpen = false
  modal.productId = null
}
</script>
