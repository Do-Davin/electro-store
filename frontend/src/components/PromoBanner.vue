<template>
  <div
    v-if="visible"
    class="w-full bg-linear-to-r from-[#003465] to-[#00529b] text-white
    py-2.5 flex items-center justify-center gap-4 text-sm sm:text-base
    font-medium shadow-ms"
  >
    <!-- Left Badge -->
    <span class="bg-white text-[#003465] font-bold px-3 py-1 rounded-full
    text-xs sm:text-sm">
      LIMITED OFFER
    </span>

    <p class="tracking-wide">
      🎉 New Year Sale — <span class="font-bold underline">
      Up to 30% OFF</span> on selected products!
    </p>

    <!-- CTA Button -->
    <RouterLink to="/products">
      <button
        class="hidden sm:block bg-white text-primary font-semibold px-4 py-1
        rounded-lg hover:bg-green-200 transition-transform duration-200 ease-out
        hover:scale-105 active:scale-95"
      >
        Shop Now
      </button>
    </RouterLink>

    <!-- Close Button -->
    <button
      class="absolute right-10 sm:right-8 text-white/80 hover:text-white
      transition"
      @click="visible = false"
    >
      <CircleX class="text-red-500 w-8 h-8 hover:text-red-600 transition-transform
      duration-200 ease-out hover:scale-105 active:scale-95" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CircleX } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const visible = ref(true)
</script>
