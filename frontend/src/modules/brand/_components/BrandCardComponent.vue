<template>
  <RouterLink
    :to="`/brands/${brand.id}`"
    class="group relative bg-[#111111] rounded-2xl shadow-sm hover:shadow-xl
           transition-all duration-300 overflow-hidden border border-white/[0.06]
           hover:border-primary/20 hover:-translate-y-1"
  >
    <!-- Logo Area -->
    <div class="relative h-44 bg-gradient-to-br from-white/5 to-white/[0.02]
                flex items-center justify-center overflow-hidden">
      <!-- Decorative circle -->
      <div class="absolute -top-8 -right-8 w-32 h-32 bg-primary/10
                  rounded-full group-hover:scale-150 transition-transform duration-500" />

      <!-- Fixed-size white container for uniform appearance -->
      <div class="relative z-10 flex items-center justify-center flex-shrink-0
                  rounded-2xl bg-white/90 shadow-sm group-hover:shadow-md
                  transition-shadow duration-300"
           style="width: 240px; height: 140px; min-width: 240px; min-height: 140px; max-width: 240px; max-height: 140px;">
        <img
          :src="logoSrc"
          :alt="brand.name"
          class="object-contain group-hover:scale-110 transition-transform duration-300"
          style="max-height: 80px; max-width: 200px;"
          @error="onImageError"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-white group-hover:text-primary
                    transition-colors truncate">
          {{ brand.name }}
        </h3>
        <ArrowRight
          class="w-4 h-4 text-gray-500 group-hover:text-primary
                 group-hover:translate-x-1 transition-all duration-300"
        />
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-400">
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
import { placeholderSvg } from '@/lib/utils'

const props = defineProps({
  brand: {
    type: Object,
    required: true,
  },
})

const API = import.meta.env.VITE_API_BASE_URL

const logoSrc = computed(() => {
  const url = props.brand.logoUrl
  if (!url) return placeholderSvg
  return url.startsWith('http') ? url : API + url
})

function onImageError(e) {
  e.target.src = placeholderSvg
}
</script>
