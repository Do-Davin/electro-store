<script setup>
import ProductSection from '@/modules/product/_components/ProductSection.vue'
</script>

<template>
  <ProductSection
    title="Featured Products"
    endpoint="/products/featured"
    :params="{ limit: 6 }"
  />
</template>
