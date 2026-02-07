<template>
  <div class="min-h-screen flex flex-col bg-gray-50/50">
    <Navbar />

    <main class="flex-1 pt-24 pb-16 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="mb-10 text-center" v-aos>
          <div class="inline-flex items-center gap-2 bg-primary/5 px-4 py-2
                      rounded-full mb-4">
            <Crown class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold text-primary">Our Brands</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-[#0b2c5f] mb-3">
            Explore Top Brands
          </h1>
          <p class="text-gray-500 max-w-lg mx-auto">
            Discover the world's leading technology brands and the visionaries behind them.
          </p>
        </div>

        <!-- Loading -->
        <div v-if="brandStore.loading && brands.length === 0" class="text-center py-16">
          <Loader2 class="w-10 h-10 text-primary animate-spin mx-auto" />
          <p class="text-gray-400 mt-4">Loading brands...</p>
        </div>

        <!-- Error -->
        <div
          v-else-if="brandStore.error"
          class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto"
        >
          <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p class="text-red-600 font-medium">{{ brandStore.error }}</p>
          <button
            @click="brandStore.fetchBrands()"
            class="mt-4 px-5 py-2 bg-red-500 text-white rounded-xl text-sm
                   font-medium hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Empty -->
        <div
          v-else-if="brands.length === 0"
          class="bg-white rounded-2xl shadow-md p-12 text-center max-w-md mx-auto"
        >
          <Bookmark class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 class="text-xl font-bold text-gray-500 mb-2">No brands yet</h2>
          <p class="text-gray-400">Brands will appear here once they're added.</p>
        </div>

        <!-- Brands Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <BrandCardComponent
            v-for="(brand, i) in brands"
            :key="brand.id"
            :brand="brand"
            v-aos="{ delay: i * 80 }"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Loader2, AlertCircle, Crown, Bookmark } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BrandCardComponent from '../_components/BrandCardComponent.vue'
import { useBrandStore } from '../_stores/brand.store'

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brands)

onMounted(() => {
  brandStore.fetchBrands()
})
</script>
