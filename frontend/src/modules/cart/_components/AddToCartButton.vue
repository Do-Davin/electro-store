<template>
  <button
    :disabled="disabled || product.stock <= 0"
    :class="[
      'flex-1 py-2.5 px-4 rounded-xl border-2',
      'flex justify-center items-center gap-2',
      'active:scale-[0.98]',
      'transition-all duration-200 ease-in-out',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none',
      'font-medium',
      isInCart
        ? 'bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] disabled:hover:bg-transparent disabled:hover:text-red-500'
        : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-black hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] disabled:hover:bg-transparent disabled:hover:text-primary'
    ]"
    @click.stop.prevent="handleButtonClick"
  >
    <ShoppingCart class="w-5 h-5" />
    <span>{{ buttonText }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '@/modules/cart/_stores/cart.store'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['added'])

const cart = useCartStore()

const isInCart = computed(() => cart.isInCart(props.product.id))

const buttonText = computed(() => {
  if (props.product.stock <= 0) return 'Out of Stock'
  if (isInCart.value) return 'Remove'
  return 'Add To Cart'
})

function handleButtonClick() {
  if (props.product.stock <= 0) return

  if (isInCart.value) {
    // Remove from cart
    cart.removeItem(props.product.id)
  } else {
    // Add to cart
    cart.addItem(
      {
        id: props.product.id,
        name: props.product.name,
        price: props.product.finalPrice ?? props.product.price,
        originalPrice: Number(props.product.price),
        discountPercent: props.product.discountPercent ?? 0,
        imageUrl: props.product.imageUrl,
      },
      props.quantity
    )
    emit('added', props.product.id)
  }
}
</script>
