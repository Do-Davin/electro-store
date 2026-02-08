<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="pt-24 max-w-7xl mx-auto px-6 pb-24">
        <h2 class="text-2xl font-semibold mb-10 text-primary">
          Product Details
        </h2>

        <!-- Loading skeleton -->
        <SkeletonLoader v-if="showSkeleton" variant="detail" />

        <!-- Product -->
        <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-14">
          <!-- LEFT: Main Image -->
          <div class="bg-white rounded-2xl p-8 shadow-sm relative">
            <img :src="product.imageUrl" class="max-h-110 mx-auto object-contain" />

            <!-- Wishlist Heart -->
            <button
              @click="wishlist.toggle(product)"
              class="absolute top-5 right-5 w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
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
              <p class="text-sm text-gray-500">
                {{ product.category?.name }}
              </p>
            </div>

            <!-- Rating -->
            <div class="flex gap-1">
              <Star
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= roundedRating ? 'text-primary fill-primary' : 'text-gray-300'"
              />
            </div>

            <!-- Price -->
            <div class="flex items-center gap-4">
              <p class="text-3xl font-bold text-primary">${{ finalPrice }}</p>

              <p v-if="hasDiscount" class="text-lg text-gray-400 line-through">
                ${{ originalPrice }}
              </p>

              <span
                v-if="hasDiscount"
                class="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full"
              >
                -{{ product.discountPercent }}%
              </span>
            </div>

            <!-- Stock Status -->
            <span
              class="inline-block text-sm px-3 py-1 rounded-full font-medium"
              :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
            >
              {{ product.stock > 0 ? 'In stock' : 'Out of stock' }}
            </span>

            <!-- Meta Info -->
            <div class="text-sm text-gray-500 space-y-1">
              <p><strong>Product ID:</strong> {{ product.id }}</p>
              <p><strong>Category:</strong> {{ product.category?.name }}</p>
            </div>

            <!-- Actions -->
            <button
              :disabled="product.stock === 0"
              class="w-full py-3 rounded-xl text-white font-medium transition"
              :class="
                product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:opacity-90'
              "
            >
              Add to cart
            </button>

            <!-- Trust Info -->
            <div class="text-sm text-gray-500 space-y-1 pt-2">
              <p>✔ Free delivery within city</p>
              <p>✔ 7-day return policy</p>
              <p>✔ Official warranty</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="product" class="mt-16 max-w-3xl">
          <h2 class="text-xl font-semibold text-primary mb-3 opacity-80">Description</h2>
          <p class="text-gray-500 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Specs Table -->
        <div v-if="product && hasSpecs" class="mt-12">
          <h2 class="text-xl font-semibold text-primary mb-4 opacity-80">
            Specifications
          </h2>

          <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100
          overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left font-semibold text-gray-700 px-6
                    py-4 w-[40%]">
                      Key
                    </th>
                    <th class="text-left font-semibold text-gray-700
                    px-6 py-4">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in specsRows"
                    :key="row.key"
                    class="border-t border-gray-100"
                  >
                    <td class="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                      {{ row.label }}
                    </td>
                    <td class="px-6 py-4 text-gray-500">
                      {{ row.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="text-xs text-gray-400 mt-3">
            Specs are provided by the seller/manufacturer and may vary by region.
          </p>
        </div>

        <!-- No specs (optional UX) -->
        <div v-else-if="product" class="mt-12">
          <h2 class="text-xl font-semibold text-primary mb-4 opacity-80">
            Specifications
          </h2>
          <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-sm text-gray-500">
            No specifications available for this product yet.
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Star, Heart } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
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

  return Object.entries(specs).map(([key, value]) => ({
    key,
    label: formatSpecLabel(key),
    value: formatSpecValue(value),
  }))
})

onMounted(async () => {
  try {
    const { data } = await axios.get(`/products/${route.params.id}`)
    product.value = data
  } finally {
    loading.value = false
  }
})
</script>
