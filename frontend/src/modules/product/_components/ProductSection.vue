<template>
  <div :class="sectionClass">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-primary">{{ title }}</h2>

        <RouterLink to="/products">
          <button class="text-primary font-semibold hover:underline">
            View All →
          </button>
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center gap-6 px-10">
        <div v-for="i in 4" :key="i" class="w-60 h-72 bg-gray-200 animate-pulse rounded-xl"></div>
      </div>

      <!-- Products -->
      <div v-else-if="products.length" class="flex gap-15 flex-wrap justify-center">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
        />
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-500 py-10">
        No {{ title.toLowerCase() }} available.
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"
import ProductCard from "./ProductCard.vue"
import { RouterLink } from "vue-router"

const props = defineProps({
  title: String,
  params: Object,
  bg: {
    type: String,
    default: "default",
  },
})

const loading = ref(false)
const products = ref([])

const sectionClass = props.bg === "gray"
  ? "w-full py-16 bg-[#f8f9fc] dark:bg-[#0b2447]"
  : "w-full py-16"

async function fetchProducts() {
  loading.value = true
  try {
    const res = await axios.get("/products", { params: props.params })
    products.value = res.data.data || res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>
