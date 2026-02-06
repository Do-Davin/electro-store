<template>
  <div
    class="w-75 bg-white rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.15)]
    transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
          class="absolute top-2 left-38 text-xs font-bold px-3 py-1 rounded-full"
          :class="product.stock > 0
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'"
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
      <p class="text-gray-500 text-sm mb-1">
        {{ product.category?.name || 'Unknown' }}
      </p>

      <!-- Title -->
      <p class="text-2xl font-bold text-[#0b2c5f] mb-2">
        {{ product.name }}
      </p>
    </RouterLink>

    <!-- Price + Rating Row -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-baseline gap-2">
        <p class="text-xl font-bold text-[#0b2c5f]">
          ${{ Number(product.finalPrice ?? product.price).toFixed(2) }}
        </p>

        <p
          v-if="product.discountPercent > 0"
          class="relative text-red-500 line-through text-sm -top-2"
        >
          ${{ Number(product.price).toFixed(2) }}
        </p>
      </div>

      <span class="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full
            shadow">
        <span class="font-bold">{{ Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : '-' }}</span>
        <span class="text-yellow-500">★</span>
      </span>
    </div>

    <!-- Buy Button + Wishlist -->
    <div class="flex items-center gap-3">
      <AddToCartButton :product="product" />

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
import { ref, watch, computed } from 'vue'
import placeholderImg from '@/assets/img/placeholder.png'
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
  if (!img) return placeholderImg
  return img.startsWith('http') ? img : API + img
}

const currentImage = ref(
  props.product?.imageUrl ? toUrl(props.product.imageUrl) : placeholderImg
)

const onImageError = () => {
  currentImage.value = placeholderImg
}

watch(
  () => props.product?.imageUrl,
  newImage => {
    currentImage.value = newImage ? toUrl(newImage) : placeholderImg
  },
  { immediate: true }
)
</script>

<style scoped>
.product-card {
  margin: 20px;
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
