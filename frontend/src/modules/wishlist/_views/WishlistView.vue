<template>
  <Navbar />

  <div class="pt-24 px-6 max-w-7xl mx-auto mb-24">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl text-primary font-bold">
        My Wishlist
      </h1>

      <button
        v-if="wishlist.items.length > 0"
        @click="wishlist.clearAll()"
        class="text-sm text-red-500 hover:underline
        hover:font-bold hover:text-red-600 transition-all
        duration-300 ease-out"
      >
        Clear all
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="wishlist.items.length === 0"
      class="flex flex-col items-center justify-center text-gray-500 py-32"
    >
      <p class="text-lg font-medium mb-2">Your wishlist is empty</p>
      <p class="text-sm">Save products you love for later</p>
    </div>

    <!-- Wishlist grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <div
        v-for="product in wishlist.items"
        :key="product.id"
        class="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all
        duration-400 ease-out"
      >
        <!-- Image -->
        <div class="h-44 flex items-center justify-center mb-4">
          <img
            :src="product.imageUrl"
            alt=""
            class="max-h-full object-contain group-hover:scale-110 transition-all
            duration-400 ease-out"
          />
        </div>

        <!-- Info -->
        <div class="space-y-1">
          <p class="font-semibold text-lg line-clamp-2">
            {{ product.name }}
          </p>

          <p class="text-primary font-bold text-xl">
            ${{ Number(product.finalPrice ?? product.price).toFixed(2) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-5 flex items-center justify-between gap-3">
          <RouterLink
            :to="`/products/${product.id}`"
            class="text-sm text-gray-500 hover:text-primary
            hover:font-bold underline-offset-4 hover:underline
            transition-all duration-300 ease-out"
          >
            View product
          </RouterLink>

          <button
            @click="wishlist.remove(product.id)"
            class="border border-red-500 text-red-500
            px-4 py-2 rounded-xl
            flex items-center gap-2
          hover:bg-red-50
            active:scale-[0.98]
            transition"
          >
            <Trash2 class="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { useWishlistStore } from '../_stores/wishlist.store';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { Trash2 } from 'lucide-vue-next';

const wishlist = useWishlistStore()
</script>
