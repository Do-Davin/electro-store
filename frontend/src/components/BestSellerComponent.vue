<template>
  <ProductSection
    title="Best Sellers"
    :params="{ featured: true, page: 2, limit: 3 }"
    bg="gray"
  />
</template>

<script setup>
import ProductSection from '@/modules/product/_components/ProductSection.vue';
</script>
