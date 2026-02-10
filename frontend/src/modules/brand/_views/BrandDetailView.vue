<template>
  <div class="min-h-screen flex flex-col bg-[#000000]">
    <Navbar />

    <main class="flex-1 pt-24 pb-16 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <BreadcrumbNav :crumbs="[
          { label: 'Home', to: '/' },
          { label: 'Brands', to: '/brands' },
          { label: brandStore.currentBrand?.name ?? 'Brand', to: `/brands/${route.params.id}` },
        ]" class="mb-6" />

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
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
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
