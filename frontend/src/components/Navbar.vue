<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="navbar fixed top-0 left-0 w-full z-50 flex items-center justify-between
    h-16 p-8 border-b bg-transparent backdrop-blur-sm transition-colors duration-300">

    <!-- Left: Logo -->
    <div
      class="navbar-logo font-bold text-[18px] cursor-pointer transition-colors"
      @click="onLogoClick"
    >
      &lt;DT /&gt;
    </div>

    <!-- Center: Navigation Icons -->
     <nav v-if="!isAdmin" class="navbar-nav flex gap-7 items-center">

      <!-- Home -->
      <RouterLink to="/" class="nav-link transition-colors">
        <Home class="w-6 h-6" />
      </RouterLink>

      <!-- Product -->
      <RouterLink to="/products" class="nav-link transition-colors">
        <Box class="w-6 h-6" />
      </RouterLink>

      <!-- Categories -->
      <RouterLink to="/categories" class="nav-link transition-colors">
        <LayoutGrid class="w-6 h-6" />
      </RouterLink>

      <!-- Wishlist -->
      <RouterLink to="/wishlist" class="nav-link relative transition-colors">
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
      <RouterLink to="/carts" class="nav-link transition-colors">
        <ShoppingCart class="w-6 h-6" />
      </RouterLink>

      <!-- Orders / Transactions -->
      <RouterLink to="/orders" class="nav-link transition-colors">
        <Receipt class="w-6 h-6" />
      </RouterLink>


      <!-- Profile -->
      <RouterLink to="/profile" class="nav-link transition-colors">
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
          active:scale-[0.98] transition-all"
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
        active:scale-[0.98] transition-all"
      >
        Logout
      </button>
    </div>

  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Home, Box, ShoppingCart, Heart, LayoutGrid, Receipt, UserCircle } from 'lucide-vue-next';
import { getRole, isLoggedIn, logout } from '@/lib/auth';
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store';

const router = useRouter();
const route = useRoute();
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

// Check if current page has hero section (only home page)
const hasHeroSection = computed(() => route.path === '/');

// Handle navbar color change
const updateNavbarColor = () => {
  const navbar = document.querySelector('.navbar');

  if (hasHeroSection.value) {
    // Home page: use scroll detection
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar?.classList.add('navbar-light');
      navbar?.classList.remove('navbar-dark');
    } else {
      navbar?.classList.add('navbar-dark');
      navbar?.classList.remove('navbar-light');
    }
  } else {
    // Other pages: always light
    navbar?.classList.add('navbar-light');
    navbar?.classList.remove('navbar-dark');
  }
};

// Watch for route changes
watch(() => route.path, () => {
  updateNavbarColor();
});

onMounted(() => {
  updateNavbarColor();
  window.addEventListener('scroll', updateNavbarColor);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateNavbarColor);
});
</script>

<style scoped>
/* Dark navbar (on hero/black background) */
.navbar-dark {
  border-color: rgba(255, 255, 255, 0.1);
}

.navbar-dark .navbar-logo {
  color: white;
}

.navbar-dark .navbar-nav {
  color: white;
}

.navbar-dark .nav-link {
  color: white;
}

.navbar-dark .nav-link:hover {
  color: #ff8c42;
}

/* Light navbar (on white background) */
.navbar-light {
  border-color: rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
}

.navbar-light .navbar-logo {
  color: #003d7a;
}

.navbar-light .navbar-nav {
  color: #1a1a1a;
}

.navbar-light .nav-link {
  color: #1a1a1a;
}

.navbar-light .nav-link:hover {
  color: var(--color-primary);
}
</style>
