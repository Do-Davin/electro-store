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

      <!-- Loading (initial only) -->
      <SkeletonLoader v-if="showSkeleton && !error" variant="card" :count="3" />

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
        :loading="loading"
        @retry="fetchProducts"
      />
    </div>
  </div>
</template>

<script setup>
import axios from "@/lib/axios"
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import ProductCard from "./ProductCard.vue"
import SkeletonLoader from "@/components/SkeletonLoader.vue"
import StateView from "@/components/StateView.vue"
import { RouterLink } from "vue-router"

const props = defineProps({
  title: String,
  endpoint: {
    type: String,
    default: "/products",
  },
  params: Object,
  bg: {
    type: String,
    default: "default",
  },
})

const loading = ref(false)
const products = ref([])
const error = ref('')

// Minimum 500ms skeleton display so fast loads don't flash
const MIN_SKELETON_MS = 500
const showSkeleton = ref(false)
let skeletonTimer = null

watch(loading, (val) => {
  if (val) {
    clearTimeout(skeletonTimer)
    showSkeleton.value = true
  } else if (showSkeleton.value) {
    skeletonTimer = setTimeout(() => { showSkeleton.value = false }, MIN_SKELETON_MS)
  }
})

onBeforeUnmount(() => clearTimeout(skeletonTimer))

const sectionClass = props.bg === "gray"
  ? "w-full py-16 bg-[#f8f9fc] dark:bg-[#000000]"
  : "w-full py-16"

async function fetchProducts() {
  loading.value = true
  try {
    const res = await axios.get(props.endpoint, { params: props.params })
    error.value = ''
    products.value = res.data.data || res.data
  } catch (err) {
    error.value = err.message || 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>
