<template>
  <div class="w-75 bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.15)]
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <!-- Image Box -->
    <div
      class="relative w-full h-48 bg-white rounded-2xl flex items-center justify-center overflow-hidden mb-4"
    >
      <span
        class="absolute top-1 left-45 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-lg"
      >
        INSTOCK
      </span>

      <img
        :src="currentImage"
        :alt="title"
        class="w-full h-full object-contain"
        draggable="false"
        @error="onImageError"
      />
    </div>

    <!-- Category -->
    <p class="text-gray-500 text-sm mb-1">
      {{ category?.name || 'Unknown' }}
    </p>

    <!-- Title -->
    <p class="text-2xl font-bold text-[#0b2c5f] mb-2">
      {{ title }}
    </p>

    <!-- Price + Rating Row -->
    <div class="flex justify-between items-center mb-4">
      <p class=" text-xl font-bold text-[#0b2c5f]">{{ price }}</p>

      <span class="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full shadow">
        <span class="font-bold">{{ rating }}</span>
        <span class="text-yellow-500">★</span>
      </span>
    </div>

    <!-- Buy Button + Wishlist -->
    <div class="flex items-center gap-3">
      <button
        class="flex-1 bg-primary text-white py-2 rounded-xl flex justify-center items-center gap-2"
      >
        <ShoppingCart /> Buy Now
      </button>

      <button
        class="w-11 h-11 border border-gray-200 bg-white
              rounded-xl flex items-center justify-center
              shadow-[0_4px_10px_rgba(0,0,0,0.04)]
              hover:border-gray-300 hover:shadow-md transition"
        @click="toggleFavorite"
      >
        <Heart :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-700'" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import placeholderImg from '@/assets/img/placeholder.png'
import { ShoppingCart } from 'lucide-vue-next';
import { Heart } from 'lucide-vue-next';

const API = 'http://localhost:3000'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    required: true,
  },
  category: {
    type: Object,
    default: () => ({ name: '' }),
  },
})

const toUrl = (img) => {
  if (!img) return placeholderImg
  return img.startsWith('http') ? img : API + img
}

const currentImage = ref(toUrl(props.image))
const isPlaceholder = ref(!props.image)

const onImageError = () => {
  currentImage.value = placeholderImg
  isPlaceholder.value = true
}

watch(
  () => props.image,
  (newImage) => {
    currentImage.value = toUrl(newImage)
    isPlaceholder.value = !newImage
  },
  {
    immediate: true,
  },
)

const isFavorite = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}
</script>

<style scoped>
/* .card {
  display: flex;
  flex-direction: row;
} */

.product-card {
  margin: 20px;
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* .image-wrapper {
  width: 100%;
  height: 200px;
  background: #f6f6f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  overflow: hidden;
} */

.image-wrapper img {
  width: 100%;
  height: 100%;
}

.product-image:not(.placeholder) {
  object-fit: contain;
}

.product-image.placeholder {
  object-fit: cover;
}

h3 {
  font-size: 26px;
  font-weight: 700;
  color: #0b2c5f;
  margin-bottom: 10px;
}

.price {
  font-size: 22px;
  font-weight: 700;
  color: #0b2c5f;
  margin-bottom: 10px;
}

.rating {
  font-size: 24px;
  letter-spacing: 4px;
}

.rating span {
  color: #dcdcdc;
}

.rating span.active {
  color: #0b2c5f;
}
</style>
