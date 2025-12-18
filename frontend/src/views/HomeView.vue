<template>
  <HeroSection />
  <CategoryCarousel />

  <ProductCard
    title="iPhone 17 Pro Max"
    price="$1499.99"
    image="/src/assets/iphone17promax.png"
    :rating="4"
  />
</template>

<script setup lang="ts">
import CategoryCarousel from '@/components/CategoryCarousel.vue';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/product/ProductCard.vue';
</script>
