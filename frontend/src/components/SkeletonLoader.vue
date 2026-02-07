<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Card skeleton (e.g., product cards, order cards) -->
    <template v-if="variant === 'card'">
      <div class="flex flex-wrap justify-center gap-10">
        <div
          v-for="i in count"
          :key="i"
          class="w-75 bg-white rounded-2xl p-4 shadow-sm"
        >
          <div class="w-full h-48 bg-gray-200 rounded-2xl mb-4" />
          <div class="h-3 bg-gray-200 rounded w-1/3 mb-2" />
          <div class="h-5 bg-gray-200 rounded w-3/4 mb-4" />
          <div class="flex justify-between items-center mb-4">
            <div class="h-5 bg-gray-200 rounded w-1/4" />
            <div class="h-8 bg-gray-200 rounded-full w-16" />
          </div>
          <div class="h-11 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>
    </template>

    <!-- Detail skeleton (e.g., product detail page) -->
    <template v-else-if="variant === 'detail'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div class="bg-white rounded-2xl p-8 shadow-sm">
          <div class="w-full h-80 bg-gray-200 rounded-xl" />
        </div>
        <div class="space-y-6">
          <div>
            <div class="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div class="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div class="flex gap-1">
            <div v-for="i in 5" :key="i" class="w-5 h-5 bg-gray-200 rounded" />
          </div>
          <div class="h-8 bg-gray-200 rounded w-1/3" />
          <div class="h-6 bg-gray-200 rounded-full w-24" />
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/2" />
            <div class="h-4 bg-gray-200 rounded w-2/5" />
          </div>
          <div class="h-12 bg-gray-200 rounded-xl w-full" />
          <div class="space-y-2 pt-2">
            <div class="h-4 bg-gray-200 rounded w-2/3" />
            <div class="h-4 bg-gray-200 rounded w-1/2" />
            <div class="h-4 bg-gray-200 rounded w-3/5" />
          </div>
        </div>
      </div>
    </template>

    <!-- List / rows skeleton (e.g., order history) -->
    <template v-else-if="variant === 'list'">
      <div class="space-y-4">
        <div
          v-for="i in count"
          :key="i"
          class="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div>
                <div class="h-3 bg-gray-200 rounded w-12 mb-1" />
                <div class="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div>
                <div class="h-3 bg-gray-200 rounded w-8 mb-1" />
                <div class="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-6 bg-gray-200 rounded-full w-20" />
              <div class="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
          <div class="px-6 py-4 space-y-3">
            <div v-for="j in 2" :key="j" class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-1/2 mb-1" />
                <div class="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div class="h-5 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Table skeleton -->
    <template v-else-if="variant === 'table'">
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b">
          <div class="flex gap-8">
            <div v-for="i in 4" :key="i" class="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div v-for="i in count" :key="i" class="px-6 py-4 border-b border-gray-50">
          <div class="flex gap-8 items-center">
            <div class="h-4 bg-gray-200 rounded w-24" />
            <div class="h-4 bg-gray-200 rounded w-32" />
            <div class="h-4 bg-gray-200 rounded w-20" />
            <div class="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </template>

    <!-- Section skeleton (for home page sections) -->
    <template v-else-if="variant === 'section'">
      <div class="max-w-6xl mx-auto px-6 py-16">
        <div class="flex items-center justify-between mb-8">
          <div class="h-8 bg-gray-200 rounded w-56" />
          <div class="h-5 bg-gray-200 rounded w-24" />
        </div>
        <div class="flex justify-center gap-6">
          <div v-for="i in count" :key="i" class="w-60 h-72 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </template>

    <!-- Text block skeleton (generic fallback) -->
    <template v-else>
      <div class="space-y-4">
        <div v-for="i in count" :key="i">
          <div class="h-4 bg-gray-200 rounded w-full mb-2" />
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-2" />
          <div class="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Skeleton variant:
   * 'card'    — grid of product-card-shaped skeletons
   * 'detail'  — product detail page layout
   * 'list'    — order/item list rows
   * 'table'   — tabular data
   * 'section' — home page content section
   * 'text'    — generic text block (default)
   */
  variant: {
    type: String,
    default: 'text',
    validator: (v) => ['card', 'detail', 'list', 'table', 'section', 'text'].includes(v),
  },
  /** Number of repeated skeleton items */
  count: {
    type: Number,
    default: 3,
  },
  /** Extra CSS classes for the wrapper */
  containerClass: {
    type: String,
    default: '',
  },
})
</script>
