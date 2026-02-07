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
      <SkeletonLoader v-if="loading" variant="card" :count="3" />

      <!-- Products -->
      <div v-else-if="products.length" class="flex gap-15 flex-wrap justify-center">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
        />
      </div>

      <!-- Empty -->
      <StateView
        v-else-if="!products.length && !error"
        icon="product"
        :title="'No ' + title.toLowerCase() + ' available'"
        subtitle="Check back later for new arrivals."
        action-to="/products"
        action-text="View All Products"
      />

      <!-- Error -->
      <StateView
        v-else-if="error"
        variant="error"
        title="Failed to load products"
        :subtitle="error"
        @retry="fetchProducts"
      />
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { ref, onMounted } from "vue"
import ProductCard from "./ProductCard.vue"
import SkeletonLoader from "@/components/SkeletonLoader.vue"
import StateView from "@/components/StateView.vue"
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
const error = ref('')

const sectionClass = props.bg === "gray"
  ? "w-full py-16 bg-[#f8f9fc] dark:bg-[#0b2447]"
  : "w-full py-16"

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get("/products", { params: props.params })
    products.value = res.data.data || res.data
  } catch (err) {
    error.value = err.message || 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>
