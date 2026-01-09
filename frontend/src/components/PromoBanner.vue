<template>
  <div
    v-if="visible"
    class="relative w-full bg-linear-to-r from-[#003465] to-[#00529b] text-white
    py-3 px-4 flex flex-wrap items-center justify-center gap-3
    font-medium shadow-md"
  >
    <!-- Left Badge -->
    <span class="bg-white text-[#003465] font-bold px-3 py-1 rounded-full
    text-xs sm:text-sm">
      LIMITED OFFER
    </span>

    <p class="tracking-wide text-center sm:text-left">
      🎉 New Year Sale — <span class="font-bold underline">
      Up to 30% OFF</span> on selected products!
    </p>

    <!-- CTA Button -->
    <RouterLink to="/products">
      <button
        class="bg-white text-primary font-semibold px-3 py-1
      rounded-lg hover:bg-green-200 transition-transform
      hover:scale-105 active:scale-95 text-xs sm:text-sm"
      >
        Shop Now
      </button>
    </RouterLink>

    <!-- Close Button -->
    <button
      class="w-8 h-8 grid place-items-center
      rounded-full bg-white/10 backdrop-blur
      hover:bg-white/20 active:bg-white/30
      transition-all duration-200"
      @click="visible = false"
    >
      <X class="w-4 h-4 text-white/80" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const visible = ref(true)
</script>
