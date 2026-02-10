<template>
  <div
    class="w-75 bg-[#111111] rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)]
    transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,140,66,0.15)] hover:-translate-y-1
    border-3 border-primary
  hover:border-orange-400 hover:shadow-[0_12px_40px_rgba(255,140,66,0.15)]"
  >
    <!-- Clickale Area -->
    <RouterLink
      :to="`/products/${product.id}`"
      class="block"
    >
      <!-- Image Box -->
      <div
        class="relative w-full h-48 bg-white rounded-2xl flex items-center
        justify-center overflow-hidden mb-4"
      >
        <!-- Stock -->
        <span
          class="absolute top-2 right-2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
          :class="product.stock > 0
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'"
        >
          {{ product.stock > 0 ? 'INSTOCK' : 'OUT OF STOCK' }}
        </span>

        <img
          :src="currentImage"
          :alt="product.name"
          class="w-full h-full object-contain"
          draggable="false"
          @error="onImageError"
        />
      </div>

      <!-- Category -->
      <p class="text-gray-400 text-sm mb-1">
        {{ product.category?.name || 'Unknown' }}
      </p>

      <!-- Title -->
      <p class="text-2xl font-bold text-white mb-2">
        {{ product.name }}
      </p>
    </RouterLink>

    <!-- Price + Rating Row -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-baseline gap-2">
        <p class="text-xl font-bold text-white">
          ${{ Number(product.finalPrice ?? product.price).toFixed(2) }}
        </p>

        <p
          v-if="product.discountPercent > 0"
          class="relative text-red-500 line-through text-sm -top-2"
        >
          ${{ Number(product.price).toFixed(2) }}
        </p>
      </div>

      <span class="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full
            shadow text-gray-200">
        <span class="font-bold">{{ Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : '-' }}</span>
        <span class="text-yellow-500">★</span>
      </span>
    </div>

    <!-- Buy Button + Wishlist -->
    <div class="flex items-center gap-3">
      <AddToCartButton :product="product" />

      <button
        class="w-11 h-11 border border-white/10 bg-[#1a1a1a]
              rounded-xl flex items-center justify-center
              shadow-[0_4px_10px_rgba(0,0,0,0.2)]
              hover:border-white/20 hover:shadow-md transition"
        @click="toggleFavorite"
      >
        <Heart :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { placeholderSvg } from '@/lib/utils'
import { Heart } from 'lucide-vue-next'
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store'
import AddToCartButton from '@/modules/cart/_components/AddToCartButton.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const wishlist = useWishlistStore()

const isFavorite = computed(() =>
  wishlist.isInWishlist(props.product.id)
)

function toggleFavorite() {
  wishlist.toggle(props.product)
}

const API = import.meta.env.VITE_API_URL

const toUrl = (img) => {
  if (!img) return placeholderSvg
  return img.startsWith('http') ? img : API + img
}

const currentImage = ref(
  props.product?.imageUrl ? toUrl(props.product.imageUrl) : placeholderSvg
)

const onImageError = () => {
  currentImage.value = placeholderSvg
}

watch(
  () => props.product?.imageUrl,
  newImage => {
    currentImage.value = newImage ? toUrl(newImage) : placeholderSvg
  },
  { immediate: true }
)
</script>

<style scoped>
.product-card {
  margin: 20px;
  width: 280px;
  background: #111111;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

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
  color: #ffffff;
  margin-bottom: 10px;
}

.price {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
}

.rating {
  font-size: 24px;
  letter-spacing: 4px;
}

.rating span {
  color: #444444;
}

.rating span.active {
  color: #ff8c42;
}
</style>
