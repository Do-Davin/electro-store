<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="pt-24 max-w-7xl mx-auto px-6 pb-24">
        <h2 class="text-2xl font-semibold mb-10 text-primary">
          Product Details
        </h2>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-32 text-gray-500">Loading product...</div>

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
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Star, Heart } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from '@/lib/axios'
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store'

const route = useRoute()
const wishlist = useWishlistStore()

const product = ref(null)
const loading = ref(true)

/* Rating */
const roundedRating = computed(() => Math.round(Number(product.value?.rating ?? 0)))

/* Prices */
const finalPrice = computed(() => Number(product.value?.finalPrice ?? 0).toFixed(2))

const originalPrice = computed(() => Number(product.value?.price ?? 0).toFixed(2))

const hasDiscount = computed(() => product.value?.discountPercent > 0)

/* Wishlist */
const isWishlisted = computed(() => product.value && wishlist.isInWishlist(product.value.id))

onMounted(async () => {
  try {
    const { data } = await axios.get(`/products/${route.params.id}`)
    product.value = data
  } finally {
    loading.value = false
  }
})
</script>
