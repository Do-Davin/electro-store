<template>
  <button
    :disabled="disabled || product.stock <= 0"
    class="flex-1 bg-white text-primary py-2.5 px-4 rounded-xl border-2 border-primary
    flex justify-center items-center gap-2
    hover:bg-primary hover:text-white hover:shadow-lg hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200 ease-in-out
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
    disabled:hover:text-primary disabled:hover:scale-100 disabled:hover:shadow-none
    font-medium"
    @click.stop.prevent="handleAddToCart"
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
  if (isInCart.value) return 'Add More'
  return 'Add To Cart'
})

function handleAddToCart() {
  if (props.product.stock <= 0) return

  cart.addItem(
    {
      id: props.product.id,
      name: props.product.name,
      price: props.product.finalPrice ?? props.product.price,
      imageUrl: props.product.imageUrl,
    },
    props.quantity
  )

  emit('added', props.product.id)
}
</script>
