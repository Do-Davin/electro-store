<template>
  <div class="mt-15 mb-15">
    <p class="text-3xl text-primary font-bold ml-10 mb-6">Featured Products</p>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center gap-6 px-10">
      <div v-for="i in 4" :key="i" class="w-60 h-72 bg-gray-200 animate-pulse rounded-xl"></div>
    </div>

    <!-- Products -->
    <div v-else-if="products.length" class="flex gap-15 flex-wrap justify-center">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :title="p.name"
        :price="'$' + p.price"
        :image="p.imageUrl"
        :rating="p.rating || 4"
        :category="p.category"
      />
    </div>

    <!-- Empty -->
    <div v-else class="text-center text-gray-500 py-10">No featured products available.</div>
  </div>
</template>

<script setup>
import ProductCard from '@/modules/product/_components/ProductCard.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(false)

async function fetchFeaturedProducts() {
  try {
    loading.value = true

    const res = await axios.get('/products', {
      params: { featured: true, limit: 3 },
    })

    products.value = res.data.data || res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeaturedProducts()
})
</script>
