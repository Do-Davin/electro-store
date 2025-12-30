<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 p-8
    border-b border-gray-200 dark:border-gray-700 bg-white">
    <!-- Left: Logo -->
    <div class="font-bold text-[18px] text-primary items-center">
      &lt;DT /&gt;
    </div>

    <!-- Center: Menu icons -->
     <div class="flex gap-7 items-center">
      <RouterLink to="/">
        <Home class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/products">
        <Box class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/categories">
        <List class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/orders">
        <User class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/cart">
        <ShoppingCart class="w-6 h-6" />
      </RouterLink>

      <button
        class="inline-flex justify-center items-center px-6 py-2 rounded-xl
        bg-primary text-white text-sm font-medium
        hover:bg-primary/90
        active:scale-[0.98]"
      >
        Sign In
      </button>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Home, Box, List, User, ShoppingCart } from 'lucide-vue-next';
</script>
