<template>
  <Navbar />

  <div class="container pt-20">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">All Products</h1>
      <SearchBar v-model="search" />
    </div>

      <!-- Category Cards -->
      <div class="flex justify-center items-center">
        <CategoryScroller
          v-model="selectedCategory"
          :categories="categories"
        />
      </div>

      <!-- Products -->
      <div class="relative mt-8">
        <div
          v-if="loading"
          class="absolute inset-0 bg-white/70 flex items-center justify-center z-10"
        >
          Loading...
        </div>

        <div v-if="products.length === 0 && !loading">
          <img
            :src="notFoundImg"
            alt="Not found"
            class="mx-auto w-220 max-w-[85vw]"
          >
        </div>

        <div
          v-if="products.length > 0"
          class="flex justify-center items-center flex-wrap gap-10"
        >
          <ProductCard
            v-for="p in products"
            :key="p.id"
            :product="p"
          />
        </div>
      </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <Pagination
        :page="page"
        :totalPages="totalPages"
        @change="changePage"
      />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'

import Navbar from '@/components/Navbar.vue'
import SearchBar from '../_components/SearchBar.vue'
import CategoryScroller from '../_components/CategoryScroller.vue'
import ProductCard from '../_components/ProductCard.vue'
import Pagination from '../_components/Pagination.vue'
import Footer from '@/components/Footer.vue'
import notFoundImg from '@/assets/empty/not-found-404.svg'

const loading = ref(false)
const products = ref([])
const categories = ref([])

const page = ref(1)
const limit = ref(12)
const totalPages = ref(1)

const search = ref('')
const selectedCategory = ref('all')

const fetchProducts = async () => {
  loading.value = true

  const params = {
    page: page.value,
    limit: limit.value,
  }

  if (search.value) params.search = search.value
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }

  const res = await axios.get('/products', { params })

  products.value = res.data.data
  totalPages.value = res.data.totalPages
  loading.value = false
}

const fetchCategories = async () => {
  const res = await axios.get('/categories')
  categories.value = [
    { id: 'all', name: 'All', icon: '/icons/all.svg' },
    ...res.data,
  ]
}

const changePage = (p) => {
  page.value = p
  fetchProducts()
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

let searchTimeout = null

watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchProducts()
  }, 400)
})

watch(selectedCategory, () => {
  page.value = 1
  fetchProducts()
})
</script>

<style scoped>
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
