<template>
  <Navbar />

  <div class="pt-24 px-8 max-w-7xl mx-auto mb-20">
    <h1 class="text-3xl font-bold mb-6">My Wishlist</h1>

    <div v-if="wishlist.items.length === 0"
         class="text-gray-500 text-center py-20">
      Your wishlist is empty
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="product in wishlist.items"
        :key="product.id"
        class="bg-white rounded-2xl p-4 shadow"
      >
        <img
          :src="product.imageUrl"
          class="h-40 w-full object-contain mb-4"
        />

        <p class="font-bold text-lg">{{ product.name }}</p>
        <p class="text-primary font-semibold">
          ${{ Number(product.finalPrice ?? product.price).toFixed(2) }}
        </p>

        <button
          @click="wishlist.remove(product.id)"
          class="mt-4 text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { useWishlistStore } from '../_stores/wishlist.store';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const wishlist = useWishlistStore()
</script>
