<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex justify-center mt-6">
    <div class="flex items-center gap-2 bg-[#111111] shadow-md px-4 py-2 rounded-xl border border-white/[0.06]">

      <!-- Prev -->
      <button
        class="px-3 py-1 rounded-lg border text-sm font-medium
               hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="page === 1"
        @click="$emit('change', page - 1)"
      >
        <ChevronLeft />
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-2">
        <span
          v-for="p in totalPages"
          :key="p"
          @click="$emit('change', p)"
          class="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer
                 border text-sm font-semibold
                 hover:bg-primary/20 hover:text-primary
                 transition"
          :class="page === p
            ? 'bg-primary text-white border-primary'
            : 'bg-transparent text-gray-300 border-white/10'"
        >
          {{ p }}
        </span>
      </div>

      <!-- Next -->
      <button
        class="px-3 py-1 rounded-lg border text-sm font-medium
               hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="page === totalPages"
        @click="$emit('change', page + 1)"
      >
        <ChevronRight />
      </button>

    </div>
  </div>
</template>

<script setup>
import { ChevronLeft } from 'lucide-vue-next';
import { ChevronRight } from 'lucide-vue-next';
defineProps({
  page: Number,
  totalPages: Number
})
</script>

