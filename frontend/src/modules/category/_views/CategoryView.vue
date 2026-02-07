<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
      <div class="h-249 w-full flex justify-center items-center flex-col text-4xl text-white bg-primary">
        This is Categories Page!
        <CategoryCardComponent />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import CategoryCardComponent from '../_components/CategoryCardComponent.vue';
</script>
