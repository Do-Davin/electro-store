<template>
  <button
    type="button"
    class="flex items-center gap-2 px-4 h-10 rounded-lg border
    border-gray-300 bg-white text-primary hover:bg-gray-50
    transition cursor-pointer"
    aria-label="Filter products"
  >
    <SlidersHorizontal class="w-4 h-4" />
    <span class="text-sm font-medium">Filter</span>
  </button>
</template>

<script setup>
import { SlidersHorizontal } from 'lucide-vue-next'
</script>
