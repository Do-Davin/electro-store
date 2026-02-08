<template>
  <SplashScreen v-if="showSplash" @done="showSplash = false" />
  <router-view />
</template>

<script setup>
import { ref } from 'vue'
import SplashScreen from '@/components/SplashScreen.vue'

const showSplash = ref(true)
</script>
