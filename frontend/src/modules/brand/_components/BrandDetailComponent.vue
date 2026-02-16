<template>
  <div>
    <!-- Loading -->
    <SkeletonLoader v-if="loading" variant="detail" :count="1" />

    <!-- Error -->
    <StateView
      v-else-if="error"
      variant="error"
      title="Failed to load brand"
      :subtitle="error"
    />

    <!-- Brand Detail -->
    <div v-else-if="brand" class="space-y-8">
      <!-- Hero Card -->
      <div
        class="relative bg-[#111111] rounded-3xl shadow-md overflow-hidden
               border border-white/[0.06]"
      >
        <!-- Background gradient bar -->
        <div class="h-40 sm:h-52 bg-gradient-to-br from-primary/10 via-primary/5 to-white/[0.02]
                    flex items-center justify-center relative overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10
                      rounded-full -translate-y-1/2 translate-x-1/3" />
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-primary/10
                      rounded-full translate-y-1/2 -translate-x-1/3" />

          <!-- Logo wrapper — light pill so dark logos stay visible -->
          <div class="relative z-10 flex items-center justify-center
                      w-44 h-24 sm:w-52 sm:h-28 rounded-2xl bg-white/90 shadow-md">
            <img
              :src="logoSrc"
              :alt="brand.name"
              class="max-h-16 sm:max-h-20 max-w-[80%] object-contain"
              @error="onLogoError"
            />
          </div>
        </div>

        <!-- Brand Info -->
        <div class="p-6 sm:p-8">
          <div class="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {{ brand.name }}
              </h1>
              <p class="text-sm text-gray-400">
                Added {{ formatDate(brand.createdAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Award class="w-5 h-5 text-primary" />
              <span class="text-sm font-semibold text-primary">Brand</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventor Section -->
      <div
        class="bg-[#111111] rounded-3xl shadow-sm border border-white/[0.06]
               overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-white/[0.06] bg-white/5">
          <div class="flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-amber-400" />
            <h2 class="text-lg font-bold text-white">Inventor</h2>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- Inventor Image -->
            <div
              class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br
                     from-white/10 to-white/5 overflow-hidden shrink-0
                     shadow-inner ring-4 ring-white/5"
            >
              <img
                v-if="inventorImageSrc"
                :src="inventorImageSrc"
                :alt="brand.inventorName"
                class="w-full h-full object-cover"
                @error="onInventorError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <UserCircle class="w-16 h-16 text-gray-300" />
              </div>
            </div>

            <!-- Inventor Info -->
            <div class="text-center sm:text-left">
              <p class="text-xl font-bold text-white mb-1">
                {{ brand.inventorName }}
              </p>
              <p class="text-sm text-gray-400">
                Founder & Creator of {{ brand.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats (placeholder for future) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          class="bg-[#111111] rounded-2xl shadow-sm border border-white/[0.06]
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Star class="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Status</p>
            <p class="font-bold text-white">Active</p>
          </div>
        </div>

        <div
          class="bg-[#111111] rounded-2xl shadow-sm border border-white/[0.06]
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CalendarDays class="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Since</p>
            <p class="font-bold text-white">{{ formatYear(brand.createdAt) }}</p>
          </div>
        </div>

        <div
          class="bg-[#111111] rounded-2xl shadow-sm border border-white/[0.06]
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Quality</p>
            <p class="font-bold text-white">Premium</p>
          </div>
        </div>
      </div>

      <!-- Brand Products -->
      <div>
        <h2 class="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
          Products
        </h2>
        <p class="text-sm text-secondary/60 mb-6">
          More from <span class="text-primary font-medium">{{ brand.name }}</span>
        </p>

        <ProductCardGrid
          :products="brandProducts"
          :loading="productsLoading"
          empty-text="No products found for this brand."
        />
      </div>
    </div>

    <!-- Not found -->
    <div
      v-else
      class="bg-[#111111] rounded-2xl shadow-md p-12 text-center border border-white/[0.06]"
    >
      <SearchX class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-white mb-2">Brand not found</h2>
      <p class="text-gray-400 mb-6">The brand you're looking for doesn't exist.</p>
      <RouterLink
        to="/brands"
        class="inline-block px-6 py-3 bg-primary text-white rounded-xl
               font-semibold hover:bg-primary/90 transition-colors"
      >
        Browse All Brands
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Award, Lightbulb, UserCircle,
  Star, CalendarDays, Sparkles, SearchX,
} from 'lucide-vue-next'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import ProductCardGrid from '@/components/ProductCardGrid.vue'
import { placeholderSvg } from '@/lib/utils'
import axios from '@/lib/axios'

const props = defineProps({
  brand: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

// ------ Brand products ------
const brandProducts = ref([])
const productsLoading = ref(false)

async function loadBrandProducts(brandId) {
  if (!brandId) return
  productsLoading.value = true
  try {
    const { data } = await axios.get('/products', {
      params: { brand: brandId },
    })
    brandProducts.value = data.data ?? data ?? []
  } catch {
    brandProducts.value = []
  } finally {
    productsLoading.value = false
  }
}

watch(
  () => props.brand?.id,
  (id) => { if (id) loadBrandProducts(id) },
  { immediate: true },
)

const API = import.meta.env.VITE_API_BASE_URL

const logoSrc = computed(() => {
  const url = props.brand?.logoUrl
  if (!url) return placeholderSvg
  return url.startsWith('http') ? url : API + url
})

const inventorImageSrc = computed(() => {
  const url = props.brand?.inventorImageUrl
  if (!url) return null
  return url.startsWith('http') ? url : API + url
})

function onLogoError(e) {
  e.target.src = placeholderSvg
}

function onInventorError(e) {
  e.target.style.display = 'none'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}
</script>
