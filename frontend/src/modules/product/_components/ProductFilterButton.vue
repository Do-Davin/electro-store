<template>
  <div class="relative">
    <!-- Filter Button -->
    <button
      type="button"
      class="flex items-center gap-2 px-4 h-10 rounded-lg border
             border-primary bg-white text-primary hover:bg-gray-50
             active:scale-[0.98]
             transition cursor-pointer"
      aria-label="Filter products"
      @click="open = !open"
    >
      <SlidersHorizontal class="w-4 h-4" />
      <span class="text-sm font-medium">Filter</span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 mt-2 w-64 bg-white border border-primary rounded-lg shadow p-4 z-50"
    >
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium text-primary">Min Price</label>
          <input
            type="number"
            v-model.number="min"
            class="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-primary">Max Price</label>
          <input
            type="number"
            v-model.number="max"
            class="w-full mt-1 px-3 py-2 border rounded"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            class="px-3 py-1 text-sm border rounded border-red-500 text-red-500
            hover:bg-red-50 active:scale-[0.98] transition"
            @click="reset"
          >
            Reset
          </button>
          <button
            class="px-3 py-1 text-sm bg-primary text-white rounded
            active:scale-[0.98]"
            @click="apply"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SlidersHorizontal } from 'lucide-vue-next'
import { useProductStore } from '../_stores/product.store'

const productStore = useProductStore()

const open = ref(false)

// ✅ PURE JS refs (NO TYPES)
const min = ref(productStore.minPrice)
const max = ref(productStore.maxPrice)

// ✅ Keep UI synced if store changes
watch(
  () => [productStore.minPrice, productStore.maxPrice],
  ([newMin, newMax]) => {
    min.value = newMin
    max.value = newMax
  }
)

function apply() {
  productStore.setPriceRange(min.value, max.value)
  productStore.fetchProducts()
  open.value = false
}

function reset() {
  min.value = null
  max.value = null
  productStore.setPriceRange(null, null)
  productStore.fetchProducts()
  open.value = false
}
</script>
