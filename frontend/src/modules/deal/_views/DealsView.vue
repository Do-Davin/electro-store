<template>
  <div class="w-full min-h-screen bg-[#f8f9fc] dark:bg-[#0b2447]">

    <Navbar />

    <section class="max-w-6xl mx-auto px-6 py-16 mt-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-primary">Exclusive Deals & Discounts</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-3">
          Save more with limited-time offers on your favorite products.
        </p>
      </div>

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
          Shop Now
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div
          v-for="(item, i) in deals"
          :key="i"
          class="border rounded-xl bg-white dark:bg-[#132a4f]
                 shadow-lg p-5 transition duration-300
                 hover:-translate-y-1 hover:shadow-2xl
                 hover:border-primary cursor-pointer group"
        >
          <div class="relative">
            <img
              :src="item.image"
              class="w-full h-48 object-cover rounded-lg"
            />

            <span
              class="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm"
            >
              -{{ item.discount }}%
            </span>
          </div>

          <h3 class="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            {{ item.name }}
          </h3>

          <div class="flex items-center gap-2 mt-2">
            <span class="text-xl font-bold text-primary">
              ${{ item.salePrice }}
            </span>

            <span class="line-through text-gray-500">
              ${{ item.originalPrice }}
            </span>
          </div>

          <button
            class="btn-primary w-full mt-4 group-hover:scale-[1.02] transition"
          >
            Grab Deal
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { Flame } from 'lucide-vue-next';

const deals = [
  {
    name: "iPhone 16 Pro Max",
    image: "/products/iphone.png",
    discount: 25,
    salePrice: 1299,
    originalPrice: 1699,
  },
  {
    name: "MacBook Pro M3",
    image: "/products/macbook.jpg",
    discount: 18,
    salePrice: 1899,
    originalPrice: 2299,
  },
  {
    name: "Sony WH-1000XM5",
    image: "/products/headphone.jpg",
    discount: 30,
    salePrice: 279,
    originalPrice: 399,
  },
];
</script>
