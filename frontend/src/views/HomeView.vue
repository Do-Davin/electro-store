<template>
  <HeroSection />
  <CategoryCarousel />

  <div class="product-list">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      v-bind="product"
    />
  </div>
</template>

<script lang="ts">
import CategoryCarousel from '@/components/CategoryCarousel.vue';
import HeroSection from '@/components/HeroSection.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    HeroSection,
    CategoryCarousel,
    ProductCard,
  },

  setup() {
    const products = ref([
      {
        id: 1,
        title: 'iPhone 17 Pro Max',
        price: '$1499.99',
        image: '/src/assets/iphone17promax.png',
        rating: 4,
      },
      {
        id: 2,
        title: 'MacBook Pro M4',
        price: '$2499.99',
        image: '/src/assets/macbook.png',
        rating: 5,
      },
    ])

    return { products }
  },
})
</script>

<style>
.product-list {
  display: flex;
  gap: 20px
}
</style>
