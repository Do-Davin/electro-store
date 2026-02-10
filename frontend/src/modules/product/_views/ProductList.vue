<template>
  <div class="page-layout">
    <Navbar />

    <main class="page-layout__main">
      <div class="container pt-20">
        <BreadcrumbNav :crumbs="[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
        ]" class="mb-4" />

        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-primary">All Products</h1>
          <SearchBar v-model="searchLocal" />
          <ProductFilterButton />
        </div>

        <!-- Category Cards -->
        <div class="flex justify-center items-center">
          <CategoryScroller
            v-model="selectedCategoryLocal"
            :categories="productStore.categories"
          />
        </div>

        <!-- Initial loading skeleton -->
        <div v-if="showSkeleton" class="mt-8">
          <SkeletonLoader variant="card" :count="6" />
        </div>

        <!-- Products (after initial load) -->
        <template v-else>
          <div class="relative mt-8 min-h-150">
            <div
              v-if="productStore.products.length === 0 && !productStore.loadingProducts"
              class="absolute inset-0 flex items-center justify-center"
            >
              <img
                :src="notFoundImg"
                alt="Not found"
                class="mx-auto w-220 max-w-[85vw]"
              >
            </div>

            <div
              v-show="productStore.products.length > 0"
              class="flex justify-center items-center flex-wrap gap-10
              transition-opacity duration-200"
              :class="{ 'opacity-60': productStore.loadingProducts }"
            >
              <div
                class="flex justify-center items-center flex-wrap gap-10
                      transition-opacity duration-200"
                :class="{ 'opacity-60': productStore.loadingProducts }"
              >
                <ProductCard
                  v-for="p in productStore.products"
                  :key="p.id"
                  :product="p"
                />
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center mt-12">
            <Pagination
              :page="productStore.page"
              :totalPages="productStore.totalPages"
              @change="changePage"
            />
          </div>
        </template>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'

import Navbar from '@/components/Navbar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import SearchBar from '../_components/SearchBar.vue'
import CategoryScroller from '../_components/CategoryScroller.vue'
import ProductCard from '../_components/ProductCard.vue'
import Pagination from '../_components/Pagination.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import notFoundImg from '@/assets/empty/not-found-404.svg'
import ProductFilterButton from '../_components/ProductFilterButton.vue'
import { MIN_SKELETON_MS } from '../_constants/ui'

import { useProductStore } from '../_stores/product.store'

const productStore = useProductStore()

const initialLoading = ref(true)

const showSkeleton = ref(true)
let skeletonTimer = null

watch(initialLoading, (val) => {
  if (val) {
    clearTimeout(skeletonTimer)
    showSkeleton.value = true
  } else if (showSkeleton.value) {
    skeletonTimer = setTimeout(() => { showSkeleton.value = false }, MIN_SKELETON_MS)
  }
})

onBeforeUnmount(() => clearTimeout(skeletonTimer))

// Local v-models (keeps UI components unchanged)
const searchLocal = ref(productStore.search)
const selectedCategoryLocal = ref(productStore.selectedCategory)

onMounted(async () => {
  await productStore.init()

  searchLocal.value = productStore.search
  selectedCategoryLocal.value = productStore.selectedCategory
  initialLoading.value = false
})

const changePage = async (p) => {
  productStore.setPage(p)
  await productStore.fetchProducts()
}

// Debounced search
let searchTimeout = null
watch(searchLocal, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    productStore.setSearch(searchLocal.value)
    await productStore.fetchProducts()
  }, 400)
})

// Category change
watch(selectedCategoryLocal, async () => {
  productStore.setCategory(selectedCategoryLocal.value)
  await productStore.fetchProducts()
})
</script>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-layout__main {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 70px auto;
  padding: 30px 20px;
}

.buy-btn {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
}
</style>
