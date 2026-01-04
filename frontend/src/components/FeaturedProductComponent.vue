<template>
  <ProductSection
    title="Featured Products"
    :params="{ featured: true, limit: 3 }"
  />
</template>

<script setup>
import ProductSection from '@/modules/product/_components/ProductSection.vue'
</script>
