<template>
  <div class="category-scroll">
    <div
      v-for="c in categories"
      :key="c.id"
      class="category-card"
      :class="{ active: modelValue === c.id }"
      @click="$emit('update:modelValue', c.id)"
    >
      <component
        :is="getIcon(c)"
        class="category-icon
        text-primary
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        hover:scale-[1.05]
        active:translate-y-0
        active:scale-[0.96]"
      />

      <span>{{ c.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { getCategoryIcon, ICON_PALETTE, FALLBACK_ICON } from '@/composables/useCategoryIcon'

defineProps({
  categories: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

// Use persisted iconKey when available, fall back to name-based suggestion
const getIcon = (cat) => {
  if (cat.iconKey) {
    const entry = ICON_PALETTE.find((p) => p.key === cat.iconKey)
    if (entry) return entry.component
  }
  return getCategoryIcon(cat.name)
}
</script>

<style scoped>
.category-scroll {
  display: flex;
  gap: 28px;
  overflow-x: auto;
  padding: 24px 0;
}

.category-card {
  min-width: 110px;
  text-align: center;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.category-icon {
  width: 34px;
  height: 34px;
  margin: auto;
}

.category-card span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
}

.category-card:hover,
.category-card.active {
  opacity: 1;
}

.category-card.active span {
  font-weight: 600;
  color: var(--primary);
}
</style>
