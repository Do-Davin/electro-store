<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header :class="navbarClasses">

    <!-- Left: Logo -->
    <div
      class="navbar-logo font-bold text-lg sm:text-xl
      cursor-pointer transition-colors"
      @click="onLogoClick"
    >
      &lt;DT /&gt;
    </div>

    <!-- Center: Navigation Icons -->
     <nav
      v-if="!isAdmin"
      class="navbar-nav hidden md:flex gap-6 lg:gap-7
      items-center"
    >

      <!-- Home -->
      <RouterLink to="/" class="nav-link transition-all hover:scale-110">
        <Home class="w-5 h-5 lg:w-6 lg:h-6" />
      </RouterLink>

      <!-- Product -->
      <RouterLink to="/products" class="nav-link transition-all hover:scale-110">
        <Box class="w-5 h-5 lg:w-6 lg:h-6" />
      </RouterLink>

      <!-- Brands -->
      <RouterLink to="/brands" class="nav-link transition-all hover:scale-110">
        <Crown class="w-5 h-5 lg:w-6 lg:h-6" />
      </RouterLink>

      <!-- Wishlist -->
      <RouterLink to="/wishlist" class="nav-link relative transition-all hover:scale-110">
        <Heart class="w-5 h-5 lg:w-6 lg:h-6" />
        <span
          v-if="wishlist.items.length > 0"
          class="absolute -top-2 -right-2
        bg-red-500 text-white
          text-[10px] font-bold
          w-5 h-5 flex items-center justify-center
          rounded-full shadow-lg animate-pulse"
        >
          {{ wishlist.items.length }}
        </span>
      </RouterLink>

      <!-- Cart -->
      <RouterLink to="/carts" class="nav-link relative transition-all hover:scale-110">
        <ShoppingCart class="w-5 h-5 lg:w-6 lg:h-6" />
        <span
          v-if="cart.itemCount > 0"
          class="absolute -top-2 -right-2
        bg-primary text-white
          text-[10px] font-bold
          w-5 h-5 flex items-center justify-center
          rounded-full shadow-lg"
        >
          {{ cart.itemCount > 99 ? '99+' : cart.itemCount }}
        </span>
      </RouterLink>

      <!-- Orders / Transactions -->
      <RouterLink to="/orders" class="nav-link transition-all hover:scale-110">
        <Receipt class="w-5 h-5 lg:w-6 lg:h-6" />
      </RouterLink>


      <!-- Profile -->
      <RouterLink to="/profile" class="nav-link transition-all hover:scale-110">
        <UserCircle class="w-5 h-5 lg:w-6 lg:h-6" />
      </RouterLink>

    </nav>

    <!-- Right: Auth -->
    <div class="flex items-center gap-3">
      <div>
        <!-- Guest -->
        <RouterLink v-if="!loggedIn" to="/auth/login">
          <button
            class="px-4 sm:px-6 py-2 rounded-xl
            bg-primary text-white text-xs sm:text-sm font-medium
            hover:bg-primary/90 hover:scale-105
            active:scale-95 transition-all shadow-md"
          >
            Sign In
          </button>
        </RouterLink>

        <!-- Logged in -->
        <button
          v-else
          @click="onLogout"
          class="px-4 sm:px-6 py-2 rounded-xl
          bg-red-500 text-white text-xs sm:text-sm font-medium
          hover:bg-red-600 hover:scale-105
          active:scale-95 transition-all shadow-md"
        >
          Logout
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        v-if="!isAdmin"
        @click="toggleMobileMenu"
        class="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5
        transition-colors touch-manipulation"
        aria-label="Toggle menu"
      >
        <Menu v-if="!isMobileMenuOpen" class="w-6 h-6 navbar-icon" />
        <X v-else class="w-6 h-6 navbar-icon" />
      </button>
    </div>

  </header>

  <!-- Mobile Navigation Menu -->
  <Transition name="slide-fade">
    <nav
      v-if="!isAdmin && isMobileMenuOpen"
      :class="mobileNavClasses"
    >
      <div class="flex flex-col p-4 space-y-1">

        <RouterLink
          to="/"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
        >
          <Home class="w-5 h-5" />
          <span class="font-medium">Home</span>
        </RouterLink>

        <RouterLink
          to="/products"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
        >
          <Box class="w-5 h-5" />
          <span class="font-medium">Products</span>
        </RouterLink>

        <RouterLink
          to="/brands"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
        >
          <Crown class="w-5 h-5" />
          <span class="font-medium">Brands</span>
        </RouterLink>

        <RouterLink
          to="/wishlist"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative active:scale-95"
        >
          <Heart class="w-5 h-5" />
          <span class="font-medium">Wishlist</span>
          <span
            v-if="wishlist.items.length > 0"
            class="ml-auto bg-red-500 text-white
            text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ wishlist.items.length }}
          </span>
        </RouterLink>

        <RouterLink
          to="/carts"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative active:scale-95"
        >
          <ShoppingCart class="w-5 h-5" />
          <span class="font-medium">Cart</span>
          <span
            v-if="cart.itemCount > 0"
            class="ml-auto bg-primary text-white
            text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ cart.itemCount > 99 ? '99+' : cart.itemCount }}
          </span>
        </RouterLink>

        <RouterLink
          to="/orders"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
        >
          <Receipt class="w-5 h-5" />
          <span class="font-medium">Orders</span>
        </RouterLink>

        <RouterLink
          to="/profile"
          @click="closeMobileMenu"
          class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95"
        >
          <UserCircle class="w-5 h-5" />
          <span class="font-medium">Profile</span>
        </RouterLink>

      </div>
    </nav>
  </Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Home, Box, ShoppingCart, Heart, Crown, Receipt, UserCircle, Menu, X } from 'lucide-vue-next';
import { getRole, isLoggedIn, logout } from '@/lib/auth';
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store';
import { useCartStore } from '@/modules/cart/_stores/cart.store';

const router = useRouter();
const route = useRoute();
const wishlist = useWishlistStore();
const cart = useCartStore();

const loggedIn = computed(() => isLoggedIn());
const isAdmin = computed(() => getRole() === 'ADMIN');
const isMobileMenuOpen = ref(false);
const scrollY = ref(0);

// Computed classes that react to scroll position
const navbarClasses = computed(() => {
  const isScrolled = scrollY.value > 50;
  const isDark = hasHeroSection.value && !isScrolled;

  return [
    'navbar',
    'fixed top-0 left-0 w-full z-50 flex items-center',
    'justify-between h-16 px-4 lg:px-8 border-b bg-transparent',
    'backdrop-blur-sm transition-colors duration-300',
    isDark ? 'navbar-dark' : 'navbar-light'
  ];
});

const mobileNavClasses = computed(() => {
  const isScrolled = scrollY.value > 50;
  const isDark = hasHeroSection.value && !isScrolled;

  return [
    'mobile-nav',
    'fixed top-16 left-0 w-full z-40 md:hidden',
    'border-b backdrop-blur-md shadow-lg',
    isDark ? 'navbar-dark' : 'navbar-light'
  ];
});

function onLogout() {
  logout();
  closeMobileMenu();
  router.push('/auth/login');
}

function onLogoClick() {
  closeMobileMenu();
  router.push(isAdmin.value ? '/dashboard' : '/');
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

// Check if current page has hero section (only home page)
const hasHeroSection = computed(() => route.path === '/');

// Handle navbar color change on scroll (only for home page)
const updateNavbarColor = () => {
  scrollY.value = window.scrollY;
};

// Watch for route changes
watch(() => route.path, () => {
  closeMobileMenu();
  scrollY.value = window.scrollY;
});

onMounted(() => {
  scrollY.value = window.scrollY;
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

.navbar-dark .nav-link,
.navbar-dark .navbar-icon {
  color: white;
}

.navbar-dark .nav-link:hover {
  color: #ff8c42;
}

.navbar-dark .mobile-nav-link {
  color: white;
}

.navbar-dark .mobile-nav-link:hover,
.navbar-dark .mobile-nav-link:active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff8c42;
}

.navbar-dark .mobile-nav-link.router-link-active {
  background-color: rgba(255, 140, 66, 0.2);
  color: #ff8c42;
}

/* Light navbar (on white background) */
.navbar-light {
  border-color: rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
}

.navbar-light .navbar-logo {
  color: #003d7a;
}

.navbar-light .navbar-nav {
  color: #1a1a1a;
}

.navbar-light .nav-link,
.navbar-light .navbar-icon {
  color: #1a1a1a;
}

.navbar-light .nav-link:hover {
  color: var(--color-primary);
}

.navbar-light .mobile-nav-link {
  color: #1a1a1a;
}

.navbar-light .mobile-nav-link:hover,
.navbar-light .mobile-nav-link:active {
  background-color: rgba(0, 61, 122, 0.05);
  color: var(--color-primary);
}

.navbar-light .mobile-nav-link.router-link-active {
  background-color: rgba(0, 61, 122, 0.1);
  color: var(--color-primary);
}

/* Mobile Navigation */
.mobile-nav {
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Active link indicator for desktop */
.nav-link.router-link-active {
  position: relative;
}

.navbar-dark .nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #ff8c42;
  border-radius: 50%;
}

.navbar-light .nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: 50%;
}
</style>
