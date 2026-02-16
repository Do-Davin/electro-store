<template>
  <!-- Loading -->
  <div v-if="loading" class="flex items-center justify-center py-12">
    <Loader2 class="w-6 h-6 animate-spin text-primary" />
  </div>

  <!-- Empty -->
  <div
    v-else-if="products.length === 0"
    class="bg-[#111111] border border-white/6 rounded-2xl p-6 text-sm text-secondary/60 text-center"
  >
    {{ emptyText }}
  </div>

  <!-- Product grid -->
  <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
    <RouterLink
      v-for="item in products"
      :key="item.id"
      :to="`/products/${item.id}`"
      class="group bg-[#111111] rounded-2xl border border-white/6 overflow-hidden
             hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <!-- Image -->
      <div class="aspect-square bg-white p-4 overflow-hidden">
        <img
          :src="resolveImage(item.imageUrl)"
          :alt="item.name"
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          @error="onImgError"
        />
      </div>

      <!-- Info -->
      <div class="p-4 space-y-2">
        <p class="text-sm font-semibold text-primary truncate">{{ item.name }}</p>
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-primary">
            ${{ Number(item.finalPrice).toFixed(2) }}
          </span>
          <span
            v-if="item.discountPercent > 0"
            class="text-xs text-secondary/50 line-through"
          >
            ${{ Number(item.price).toFixed(2) }}
          </span>
        </div>
        <div class="flex gap-0.5">
          <Star
            v-for="i in 5"
            :key="i"
            class="w-3.5 h-3.5"
            :class="i <= Math.round(Number(item.rating ?? 0))
              ? 'text-primary fill-primary'
              : 'text-secondary/20'"
          />
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Star, Loader2 } from 'lucide-vue-next'
import { placeholderSvg } from '@/lib/utils'

defineProps({
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'No products found.' },
})

const API = import.meta.env.VITE_API_BASE_URL

function resolveImage(url) {
  if (!url) return placeholderSvg
  return url.startsWith('http') ? url : API + url
}

function onImgError(e) {
  e.target.src = placeholderSvg
}
</script>
