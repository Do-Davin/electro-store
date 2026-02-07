<template>
  <div class="min-h-screen flex flex-col bg-gray-50/50">
    <Navbar />

    <main class="flex-1 pt-24 pb-16 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Back link -->
        <RouterLink
          to="/brands"
          class="inline-flex items-center gap-2 text-sm text-gray-500
                 hover:text-primary transition-colors mb-6 group"
          v-aos
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all brands
        </RouterLink>

        <BrandDetailComponent
          :brand="brandStore.currentBrand"
          :loading="brandStore.loading"
          :error="brandStore.error"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BrandDetailComponent from '../_components/BrandDetailComponent.vue'
import { useBrandStore } from '../_stores/brand.store'

const route = useRoute()
const brandStore = useBrandStore()

function loadBrand() {
  const id = route.params.id
  if (id) brandStore.fetchBrandById(id)
}

onMounted(loadBrand)

// Re-fetch if the route param changes (e.g. navigating between brands)
watch(() => route.params.id, (newId) => {
  if (newId) loadBrand()
})

onUnmounted(() => {
  brandStore.clearCurrentBrand()
})
</script>
