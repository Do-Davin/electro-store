<!-- eslint-disable vue/multi-word-component-names -->
<!-- <template>
  <div class="pagination">
    <button :disabled="page === 1" @click="$emit('change', page - 1)">
      Prev
    </button>

    <span>{{ page }} / {{ totalPages }}</span>

    <button
      :disabled="page === totalPages"
      @click="$emit('change', page + 1)"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    page: Number,
    totalPages: Number
  }
}
</script> -->
<template>
  <div class="flex justify-center mt-6">
    <div class="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-xl">

      <!-- Prev -->
      <button
        class="px-3 py-1 rounded-lg border text-sm font-medium
               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                 hover:bg-blue-50 hover:text-blue-600
                 transition"
          :class="page === p
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-200'"
        >
          {{ p }}
        </span>
      </div>

      <!-- Next -->
      <button
        class="px-3 py-1 rounded-lg border text-sm font-medium
               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

