<template>
  <div class="min-h-screen flex flex-col bg-[#000000]">
    <Navbar />

    <main class="flex-1 pt-24 pb-16 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="mb-10 text-center" v-aos>
          <div class="inline-flex items-center gap-2 bg-primary/10 px-4 py-2
                      rounded-full mb-4">
            <Crown class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold text-primary">Our Brands</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Explore Top Brands
          </h1>
          <p class="text-gray-400 max-w-lg mx-auto">
            Discover the world's leading technology brands and the visionaries behind them.
          </p>
        </div>

        <!-- Loading (initial only) -->
        <SkeletonLoader
          v-if="brandStore.loading && brands.length === 0 && !brandStore.error"
          variant="card"
          :count="6"
          container-class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        />

        <!-- Error -->
        <StateView
          v-else-if="brandStore.error"
          variant="error"
          title="Failed to load brands"
          :subtitle="brandStore.error"
          :loading="brandStore.loading"
          @retry="brandStore.fetchBrands()"
        />

        <!-- Empty -->
        <StateView
          v-else-if="brands.length === 0"
          icon="generic"
          title="No brands yet"
          subtitle="Brands will appear here once they're added."
        />

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
import { Crown } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import StateView from '@/components/StateView.vue'
import BrandCardComponent from '../_components/BrandCardComponent.vue'
import { useBrandStore } from '../_stores/brand.store'

const brandStore = useBrandStore()
const brands = computed(() => brandStore.brands)

onMounted(() => {
  brandStore.fetchBrands()
})
</script>
