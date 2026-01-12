<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 p-8
    border-b border-gray-200 dark:border-gray-700 bg-white">
    <!-- Left: Logo -->
    <div
      class="font-bold text-[18px] text-primary items-center"
      @click="onLogoClick"
    >
      &lt;DT /&gt;
    </div>

    <!-- Center: Menu icons -->
     <div v-if="!isAdmin" class="flex gap-7 items-center">
      <RouterLink to="/">
        <Home class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/products">
        <Box class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/categories">
        <List class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/carts">
        <ShoppingCart class="w-6 h-6" />
      </RouterLink>
      <RouterLink to="/orders">
        <ClipboardCheck class="w-6 h-6" />
      </RouterLink>
    </div>

    <!-- Right: Auth Button -->
    <div>
      <!-- Guest -->
      <RouterLink v-if="!loggedIn" to="/auth/login">
        <button
          class="inline-flex justify-center items-center px-6 py-2 rounded-xl
          bg-primary text-white text-sm font-medium
          hover:bg-primary/90
          active:scale-[0.98]"
        >
          Sign In
        </button>
      </RouterLink>

      <!-- Logged in (USER or ADMIN) -->
      <button
        v-else
        @click="onLogout"
        class="inline-flex justify-center items-center px-6 py-2 rounded-xl
               border border-primary text-primary text-sm font-medium
               hover:bg-primary/10
               active:scale-[0.98]"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Home, Box, List, ShoppingCart, ClipboardCheck } from 'lucide-vue-next';
import { getRole, isLoggedIn, logout } from '@/lib/auth';

const router = useRouter();

const loggedIn = computed(() => isLoggedIn());
const isAdmin = computed(() => getRole() === 'ADMIN');

function onLogout() {
  logout();
  router.push('/auth/login');
}

function onLogoClick() {
  if (isAdmin.value) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
}
</script>
