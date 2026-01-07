<template>
  <Navbar />

  <div class="h-249 w-full flex justify-center items-center flex-col text-4xl text-white bg-primary">
    This is Categories Page!
    <CategoryCardComponent />
  </div>

</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import CategoryCardComponent from '../_components/CategoryCardComponent.vue';
</script>
