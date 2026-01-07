<template>
  <Navbar />

  <div class="h-249 w-full flex justify-center items-center flex-col text-4xl text-white bg-primary">
    This is Order Page!
    <OrderListComponent />
  </div>

  <Footer />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import OrderListComponent from '../_components/OrderListComponent.vue';
import Footer from '@/components/Footer.vue';
</script>
