<template>
  <div
    class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4
    bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
  >
    <!-- Product Image -->
    <div class="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
      <img
        :src="imageSource"
        :alt="item.name"
        class="w-full h-full object-contain"
        @error="onImageError"
      />
    </div>

    <!-- Product Info -->
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-[#0b2c5f] truncate">
        {{ item.name }}
      </h3>
      <p class="text-gray-500 text-sm mt-1">
        Unit price: ${{ item.priceSnapshot.toFixed(2) }}
      </p>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center gap-2">
      <button
        @click="onDecrement"
        class="w-9 h-9 flex items-center justify-center rounded-lg
        bg-gray-100 hover:bg-gray-200 transition-colors text-[#0b2c5f] font-bold"
        aria-label="Decrease quantity"
      >
        <Minus class="w-4 h-4" />
      </button>

      <span class="w-10 text-center font-semibold text-[#0b2c5f]">
        {{ item.quantity }}
      </span>

      <button
        @click="onIncrement"
        class="w-9 h-9 flex items-center justify-center rounded-lg
        bg-primary text-white hover:bg-primary/90 transition-colors font-bold"
        aria-label="Increase quantity"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>

    <!-- Item Total -->
    <div class="text-right min-w-20">
      <p class="text-lg font-bold text-[#0b2c5f]">
        ${{ itemTotal.toFixed(2) }}
      </p>
    </div>

    <!-- Remove Button -->
    <button
      @click="onRemove"
      class="p-2 rounded-lg text-gray-400 hover:text-red-500
      hover:bg-red-50 transition-colors"
      aria-label="Remove item"
    >
      <Trash2 class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Plus, Minus, Trash2 } from 'lucide-vue-next'
import placeholderImg from '@/assets/img/placeholder.png'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['increment', 'decrement', 'remove'])

const API = import.meta.env.VITE_API_URL

const toUrl = (img) => {
  if (!img) return placeholderImg
  return img.startsWith('http') ? img : API + img
}

const imageSource = ref(toUrl(props.item.imageUrl))

const onImageError = () => {
  imageSource.value = placeholderImg
}

const itemTotal = computed(() => {
  return props.item.priceSnapshot * props.item.quantity
})

const onIncrement = () => emit('increment', props.item.productId)
const onDecrement = () => emit('decrement', props.item.productId)
const onRemove = () => emit('remove', props.item.productId)
</script>
