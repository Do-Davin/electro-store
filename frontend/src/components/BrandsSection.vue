<template>
  <section class="w-full py-14 bg-white dark:bg-[#0b2447]">
    <div class="max-w-6xl mx-auto px-6">
      <h2
        class="text-3xl font-bold text-primary text-center mb-10"
        v-aos
      >
        Trusted By Top Brands
      </h2>

      <!-- Error State -->
      <StateView
        v-if="brandStore.error"
        variant="error"
        title="Failed to load brands"
        :subtitle="brandStore.error"
        :loading="brandStore.loading"
        @retry="handleRetry"
      />

      <!-- Loading -->
      <div v-else-if="brandStore.loading && brands.length === 0" class="flex justify-center py-8">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <!-- Brand logos from real API -->
      <div
        v-else
        class="flex justify-center items-center flex-wrap gap-20"
      >
        <RouterLink
          v-for="(brand, i) in brands"
          :key="brand.id"
          :to="`/brands/${brand.id}`"
          v-aos="{ delay: i * 120 }"
          class="w-36 grayscale hover:grayscale-0 transition
          duration-300 opacity-80
          hover:scale-[1.025]
          hover:opacity-100"
        >
          <img
            :src="getLogoUrl(brand.logoUrl)"
            :alt="brand.name"
            class="w-full object-contain"
            @error="onImageError($event)"
          />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { useBrandStore } from '@/modules/brand/_stores/brand.store'
import StateView from './StateView.vue'

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brands)

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function getLogoUrl(url) {
  if (!url) return '/brands/placeholder.png'
  return url.startsWith('http') ? url : API + url
}

function onImageError(e) {
  e.target.src = '/brands/placeholder.png'
}

function handleRetry() {
  brandStore.fetchBrands()
}

onMounted(() => {
  // Reuse existing data if already fetched, otherwise fetch
  if (brandStore.brands.length === 0) {
    brandStore.fetchBrands()
  }
})
</script>
