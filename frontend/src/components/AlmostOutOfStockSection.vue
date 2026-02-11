<template>
  <div v-if="products.length" class="w-full py-16 bg-[#000000]">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <h2 class="text-3xl font-bold text-primary">Almost Out of Stock</h2>
          <span class="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Flame class="w-3.5 h-3.5" />
            Hurry!
          </span>
        </div>

        <RouterLink to="/products">
          <button class="text-primary font-semibold hover:underline">
            View All →
          </button>
        </RouterLink>
      </div>

      <!-- Loading -->
      <SkeletonLoader v-if="showSkeleton && !error" variant="card" :count="3" />

      <!-- Products Grid (matches other sections) -->
      <div
        v-else
        class="flex gap-15 flex-wrap justify-center"
      >
        <div
          v-for="p in products"
          :key="p.id"
          class="relative"
        >
          <!-- Low Stock Badge -->
          <div
            class="absolute top-6 left-2 z-10 bg-red-500/20 text-red-700
            text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <AlertTriangle class="w-3.5 h-3.5" />
            Only {{ p.stock }} left
          </div>

          <ProductCard :product="p" />
        </div>
      </div>

      <!-- Error -->
      <StateView
        v-if="error"
        variant="error"
        title="Failed to load products"
        :subtitle="error"
        :loading="loading"
        @retry="fetchLowStock"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Flame, AlertTriangle } from 'lucide-vue-next'
import axios from '@/lib/axios'
import ProductCard from '@/modules/product/_components/ProductCard.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'

const LOW_STOCK_THRESHOLD = 5

const loading = ref(false)
const products = ref([])
const error = ref('')

// Minimum 500ms skeleton display
const MIN_SKELETON_MS = 500
const showSkeleton = ref(false)
let skeletonTimer = null

watch(loading, (val) => {
  if (val) {
    clearTimeout(skeletonTimer)
    showSkeleton.value = true
  } else if (showSkeleton.value) {
    skeletonTimer = setTimeout(() => { showSkeleton.value = false }, MIN_SKELETON_MS)
  }
})

onBeforeUnmount(() => clearTimeout(skeletonTimer))

async function fetchLowStock() {
  loading.value = true
  try {
    const res = await axios.get('/products/low-stock', {
      params: { threshold: LOW_STOCK_THRESHOLD, limit: 10 },
    })
    error.value = ''
    products.value = res.data.data || res.data
  } catch (err) {
    error.value = err.message || 'Failed to load low-stock products.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLowStock)
</script>
