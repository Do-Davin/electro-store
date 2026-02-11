<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="pt-24 max-w-7xl mx-auto px-6 pb-24">
        <BreadcrumbNav :crumbs="[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: product?.name ?? 'Product Details', to: `/products/${route.params.id}` },
        ]" class="mb-6" />

        <h2 class="text-2xl font-semibold mb-10 text-primary">
          Product Details
        </h2>

        <!-- Loading skeleton -->
        <SkeletonLoader v-if="showSkeleton" variant="detail" />

        <!-- Product -->
        <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-14">
          <!-- LEFT: Main Image -->
          <div class="bg-white rounded-2xl p-8 shadow-sm relative border border-white/6">
            <img :src="product.imageUrl" class="max-h-110 mx-auto object-contain" />

            <!-- Wishlist Heart -->
            <button
              @click="wishlist.toggle(product)"
              class="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#1a1a1a] shadow flex items-center justify-center hover:scale-105 transition"
            >
              <Heart
                class="w-6 h-6"
                :class="isWishlisted ? 'text-primary fill-primary' : 'text-gray-400'"
              />
            </button>
          </div>

          <!-- RIGHT: Info -->
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <h1 class="text-3xl font-bold text-primary">
                {{ product.name }}
              </h1>
              <p class="text-sm text-secondary mt-1">
                {{ product.category?.name }}
              </p>
            </div>

            <!-- Rating -->
            <div class="flex gap-1">
              <Star
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= roundedRating ? 'text-primary fill-primary' : 'text-secondary/30'"
              />
            </div>

            <!-- Price -->
            <div class="flex items-center gap-4">
              <p class="text-3xl font-bold text-primary">${{ finalPrice }}</p>

              <p v-if="hasDiscount" class="text-lg text-secondary/60 line-through">
                ${{ originalPrice }}
              </p>

              <span
                v-if="hasDiscount"
                class="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-medium"
              >
                -{{ product.discountPercent }}%
              </span>
            </div>

            <!-- Stock Status -->
            <span
              class="inline-block text-sm px-3 py-1 rounded-full font-medium"
              :class="product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
            >
              {{ product.stock > 0 ? 'In stock' : 'Out of stock' }}
            </span>

            <!-- Meta Info -->
            <div class="text-sm text-secondary/70 space-y-1">
              <p><strong class="text-secondary">Product ID:</strong> {{ product.id }}</p>
              <p><strong class="text-secondary">Category:</strong> {{ product.category?.name }}</p>
            </div>

            <!-- Actions -->
            <AddToCartButton :product="product" class="w-full" />

            <!-- Trust Info -->
            <div class="text-sm text-secondary/80 space-y-1 pt-2">
              <p><span class="text-primary">✔</span> Free delivery within city</p>
              <p><span class="text-primary">✔</span> 7-day return policy</p>
              <p><span class="text-primary">✔</span> Official warranty</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="product" class="mt-16 max-w-3xl">
          <h2 class="text-xl font-semibold text-primary mb-3">Description</h2>
          <p class="text-secondary/70 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Specs Table -->
        <div v-if="product && hasSpecs" class="mt-12">
          <h2 class="text-xl font-semibold text-primary mb-4">
            Specifications
          </h2>

          <div
          class="bg-[#111111] rounded-2xl shadow-sm border border-white/6
          overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-primary/10">
                  <tr>
                    <th class="text-left font-semibold text-primary px-6
                    py-4 w-[40%]">
                      Key
                    </th>
                    <th class="text-left font-semibold text-primary
                    px-6 py-4">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in specsRows"
                    :key="row.key"
                    class="border-t border-white/6 hover:bg-primary/5 transition-colors"
                  >
                    <td class="px-6 py-4 text-secondary font-medium whitespace-nowrap">
                      {{ row.label }}
                    </td>
                    <td class="px-6 py-4 text-secondary/70">
                      {{ row.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="text-xs text-secondary/60 mt-3">
            Specs are provided by the seller/manufacturer and may vary by region.
          </p>
        </div>

        <!-- No specs (optional UX) -->
        <div v-else-if="product" class="mt-12">
          <h2 class="text-xl font-semibold text-primary mb-4">
            Specifications
          </h2>
          <div class="bg-[#111111] border border-white/6 rounded-2xl p-6 text-sm text-secondary/60">
            No specifications available for this product yet.
          </div>
        </div>

        <!-- Similar Products (same brand) -->
        <div v-if="product && product.brand" class="mt-16">
          <h2 class="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
            Similar Products
          </h2>
          <p class="text-sm text-secondary/60 mb-6">
            More from <span class="text-primary font-medium">{{ product.brand.name }}</span>
          </p>

          <!-- Loading -->
          <div v-if="similarLoading" class="flex items-center justify-center py-12">
            <Loader2 class="w-6 h-6 animate-spin text-primary" />
          </div>

          <!-- No results -->
          <div
            v-else-if="similarProducts.length === 0"
            class="bg-[#111111] border border-white/6 rounded-2xl p-6 text-sm text-secondary/60 text-center"
          >
            No other products found from this brand.
          </div>

          <!-- Product grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <RouterLink
              v-for="item in similarProducts"
              :key="item.id"
              :to="`/products/${item.id}`"
              class="group bg-[#111111] rounded-2xl border border-white/6 overflow-hidden
              hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <!-- Image -->
              <div class="aspect-square bg-white p-4 overflow-hidden">
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <!-- Info -->
              <div class="p-4 space-y-2">
                <p class="text-sm font-semibold text-primary truncate">{{ item.name }}</p>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-primary">${{ Number(item.finalPrice).toFixed(2) }}</span>
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
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Star, Heart, Loader2 } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import AddToCartButton from '@/modules/cart/_components/AddToCartButton.vue'
import axios from '@/lib/axios'
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store'
import { MIN_SKELETON_MS } from '../_constants/ui'

const route = useRoute()
const wishlist = useWishlistStore()

const product = ref(null)
const loading = ref(true)

const showSkeleton = ref(true)
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

// Rating
const roundedRating = computed(() => Math.round(Number(product.value?.rating ?? 0)))

// Prices
const finalPrice = computed(() => Number(product.value?.finalPrice ?? 0).toFixed(2))

const originalPrice = computed(() => Number(product.value?.price ?? 0).toFixed(2))

const hasDiscount = computed(() => product.value?.discountPercent > 0)

// Wishlist
const isWishlisted = computed(() => product.value && wishlist.isInWishlist(product.value.id))

// Similar Products (same brand)
const similarProducts = ref([])
const similarLoading = ref(false)

async function loadSimilarProducts() {
  const brand = product.value?.brand
  if (!brand?.id) return
  similarLoading.value = true
  try {
    const { data } = await axios.get('/products', {
      params: { brand: brand.id, limit: 4 },
    })
    // Exclude the current product
    similarProducts.value = (data.data ?? []).filter(
      (p) => p.id !== product.value.id,
    )
  } catch {
    similarProducts.value = []
  } finally {
    similarLoading.value = false
  }
}

// Specs
const hasSpecs = computed(() => {
  const specs = product.value?.specs
  return specs && typeof specs === 'object' && !Array.isArray(specs) && Object.keys(specs).length > 0
})

function formatSpecLabel(key) {
  // resolution -> Resolution, screen_size -> Screen Size, cpu-model -> Cpu Model
  return String(key)
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatSpecValue(value) {
  if (value === null || value === undefined) return '-'
  if (Array.isArray(value)) return value.map(formatSpecValue).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const specsRows = computed(() => {
  const specs = product.value?.specs
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return []

  return Object.entries(specs)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([key, value]) => ({
      key,
      label: formatSpecLabel(key),
      value: formatSpecValue(value),
    }))
})

onMounted(async () => {
  try {
    const { data } = await axios.get(`/products/${route.params.id}`)
    product.value = data
    loadSimilarProducts()
  } finally {
    loading.value = false
  }
})

// Re-load when navigating between product pages
watch(() => route.params.id, async (newId) => {
  if (!newId) return
  loading.value = true
  showSkeleton.value = true
  similarProducts.value = []
  try {
    const { data } = await axios.get(`/products/${newId}`)
    product.value = data
    loadSimilarProducts()
  } finally {
    loading.value = false
  }
})
</script>
