<template>
  <div class="w-full min-h-screen flex flex-col bg-[#f8f9fc] dark:bg-[#0b2447]">

    <Navbar />

    <main class="flex-1">

    <section class="max-w-6xl mx-auto px-6 py-16 mt-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-primary">Exclusive Deals & Discounts</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-3">
          Save more with limited-time offers on your favorite products.
        </p>
      </div>

      <!-- Banner -->
      <div
        class="bg-linear-to-r from-orange-500 to-orange-600
               text-white rounded-2xl p-6 flex justify-between
               items-center mb-12 shadow-lg"
      >
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Flame class="w-7 h-7 text-white stroke-[2.5]" />
            Hot Deals of The Day
          </h2>
          <p class="opacity-90">
            Don’t miss out—these offers expire soon!
          </p>
        </div>

        <button class="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition">
          <RouterLink to="/products">
            Shop Now
          </RouterLink>
        </button>
      </div>

      <!-- Loading -->
      <SkeletonLoader
        v-if="loading"
        variant="card"
        :count="3"
      />

      <!-- Empty -->
      <StateView
        v-else-if="deals.length === 0 && !error"
        icon="deal"
        title="No deals available"
        subtitle="Check back soon for exclusive offers and discounts."
        action-to="/products"
        action-text="Browse Products"
      />

      <!-- Error -->
      <StateView
        v-else-if="error"
        variant="error"
        title="Failed to load deals"
        :subtitle="error"
        @retry="fetchDeals"
      />

      <!-- Deals Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <ProductCard
          v-for="p in deals"
          :key="p.id"
          :product="p"
        />
      </div>
    </section>

    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import ProductCard from "@/modules/product/_components/ProductCard.vue";
import Footer from "@/components/Footer.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import StateView from "@/components/StateView.vue";
import { Flame } from 'lucide-vue-next';
import { onMounted, ref } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";

const deals = ref([]);
const loading = ref(true)
const error = ref('')

async function fetchDeals() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get("/products/deals");
    deals.value = res.data;
  } catch (err) {
    error.value = err.message || 'Failed to load deals.'
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDeals);
</script>
