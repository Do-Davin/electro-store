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
        :is="getIcon(c.name)"
        class="category-icon"
      />

      <span>{{ c.name }}</span>
    </div>
  </div>
</template>

<script setup>
import {
  LayoutGrid,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Watch,
  Boxes,
} from 'lucide-vue-next'

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

const iconMap = {
  all: LayoutGrid,
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  accessories: Headphones,
  smartwatch: Watch,
}

const getIcon = (name = '') => {
  const key = name.toLowerCase()
  return iconMap[key] || Boxes
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
