<template>
  <RouterLink
    :to="`/brands/${brand.id}`"
    class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl
           transition-all duration-300 overflow-hidden border border-gray-100
           hover:border-primary/20 hover:-translate-y-1"
  >
    <!-- Logo Area -->
    <div class="relative h-44 bg-gradient-to-br from-gray-50 to-slate-100
                flex items-center justify-center p-8 overflow-hidden">
      <!-- Decorative circle -->
      <div class="absolute -top-8 -right-8 w-32 h-32 bg-primary/5
                  rounded-full group-hover:scale-150 transition-transform duration-500" />

      <img
        :src="logoSrc"
        :alt="brand.name"
        class="max-h-24 max-w-[80%] object-contain relative z-10
               group-hover:scale-110 transition-transform duration-300
               drop-shadow-sm"
        @error="onImageError"
      />
    </div>

    <!-- Info -->
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-[#0b2c5f] group-hover:text-primary
                    transition-colors truncate">
          {{ brand.name }}
        </h3>
        <ArrowRight
          class="w-4 h-4 text-gray-300 group-hover:text-primary
                 group-hover:translate-x-1 transition-all duration-300"
        />
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-500">
        <UserCircle class="w-4 h-4 shrink-0" />
        <span class="truncate">{{ brand.inventorName }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, UserCircle } from 'lucide-vue-next'

const props = defineProps({
  brand: {
    type: Object,
    required: true,
  },
})

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const logoSrc = computed(() => {
  const url = props.brand.logoUrl
  if (!url) return '/brands/placeholder.png'
  return url.startsWith('http') ? url : API + url
})

function onImageError(e) {
  e.target.src = '/brands/placeholder.png'
}
</script>
