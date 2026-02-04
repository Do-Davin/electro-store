<template>
  <Navbar />
  <div class="flex justify-center items-center bg-primary h-screen">
    <ProfileComponent />
    <span class="text-red-500 font-bold">This is the profile view.</span>
  </div>
</template>

<script setup>
import ProfileComponent from '../_components/ProfileComponent.vue';
import Navbar from '@/components/Navbar.vue';
</script>
