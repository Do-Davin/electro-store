<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="fixed top-0 left-0 w-full z-50 flex items-center justify-between
    h-16 p-8 border-b border-gray-200 dark:border-gray-700 bg-white">

    <!-- Left: Logo -->
    <div
      class="font-bold text-[18px] text-primary cursor-pointer"
      @click="onLogoClick"
    >
      &lt;DT /&gt;
    </div>

    <!-- Center: Navigation Icons -->
     <nav v-if="!isAdmin" class="flex gap-7 items-center">

      <!-- Home -->
      <RouterLink to="/">
        <Home class="w-6 h-6" />
      </RouterLink>

      <!-- Product -->
      <RouterLink to="/products">
        <Box class="w-6 h-6" />
      </RouterLink>

      <!-- Categories -->
      <RouterLink to="/categories">
        <LayoutGrid class="w-6 h-6" />
      </RouterLink>

      <!-- Wishlist -->
      <RouterLink to="/wishlist" class="relative">
        <Heart class="w-6 h-6" />
        <span
          v-if="wishlist.items.length > 0"
          class="absolute -top-2 -right-2
        bg-red-500 text-white
          text-[10px] font-bold
          w-5 h-5 flex items-center justify-center
          rounded-full"
        >
          {{ wishlist.items.length }}
        </span>
      </RouterLink>

      <!-- Cart -->
      <RouterLink to="/carts">
        <ShoppingCart class="w-6 h-6" />
      </RouterLink>

      <!-- Orders / Transactions -->
      <RouterLink to="/orders">
        <Receipt class="w-6 h-6" />
      </RouterLink>


      <!-- Profile -->
      <RouterLink to="/">
        <UserCircle class="w-6 h-6" />
      </RouterLink>

    </nav>

    <!-- Right: Auth -->
    <div>
      <!-- Guest -->
      <RouterLink v-if="!loggedIn" to="/auth/login">
        <button
          class="px-6 py-2 rounded-xl
          bg-primary text-white text-sm font-medium
          hover:bg-primary/90 hover:scale-[1.025]
          active:scale-[0.98]"
        >
          Sign In
        </button>
      </RouterLink>

      <!-- Logged in -->
      <button
        v-else
        @click="onLogout"
        class="px-6 py-2 rounded-xl
      bg-red-500 text-white text-sm font-medium
      hover:bg-red-600 hover:scale-[1.025]
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
import { Home, Box, ShoppingCart, Heart, LayoutGrid, Receipt, UserCircle } from 'lucide-vue-next';
import { getRole, isLoggedIn, logout } from '@/lib/auth';
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store';

const router = useRouter();
const wishlist = useWishlistStore();

const loggedIn = computed(() => isLoggedIn());
const isAdmin = computed(() => getRole() === 'ADMIN');

function onLogout() {
  logout();
  router.push('/auth/login');
}

function onLogoClick() {
  router.push(isAdmin.value ? '/dashboard' : '/');
}
</script>
