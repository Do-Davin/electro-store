<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

defineProps({
  crumbs: {
    type: Array,
    required: true,
    // Each crumb: { label: string, to: string }
  },
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
    <RouterLink
      v-for="(crumb, i) in crumbs"
      :key="i"
      :to="crumb.to"
      class="flex items-center gap-1.5"
    >
      <!-- Separator (skip first) -->
      <ChevronRight v-if="i > 0" class="w-3.5 h-3.5 text-gray-600 shrink-0" />

      <span
        :class="[
          i === crumbs.length - 1
            ? 'text-primary font-semibold truncate max-w-48'
            : 'hover:text-white transition-colors'
        ]"
      >
        {{ crumb.label }}
      </span>
    </RouterLink>
  </nav>
</template>
