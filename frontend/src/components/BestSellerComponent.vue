<template>
  <ProductSection
    title="Best Sellers"
    endpoint="/products/bestsellers"
    :params="{ limit: 6 }"
    bg="gray"
  />
</template>

<script setup>
import ProductSection from '@/modules/product/_components/ProductSection.vue';
</script>
