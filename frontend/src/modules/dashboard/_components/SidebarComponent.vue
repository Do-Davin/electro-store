<template>
  <aside class="sidebar">
    <!-- Profile / Logo -->
    <div class="profile">
      <img
        src="/icons/logo.svg"
        alt="Electro Store"
        class="logo-image"
      />
    </div>

    <!-- Nav -->
    <nav class="nav">
      <ul>
        <!-- Dashboard (simple link) -->
        <li>
          <RouterLink
            to="/dashboard"
            class="nav-link"
            exact-active-class="active"
          >
            <LayoutDashboard class="icon" />
            <span class="label">Dashboard</span>
          </RouterLink>
        </li>

        <!-- Product (accordion) -->
        <li class="accordion-item">
          <button
            class="nav-link accordion-toggle"
            :class="{ open: openMenus.product, 'child-active': isProductActive }"
            @click="toggleMenu('product')"
          >
            <Pencil class="icon" />
            <span class="label">Product</span>
            <ChevronDown
              class="chevron"
              :class="{ rotated: openMenus.product }"
              :size="16"
            />
          </button>
          <Transition name="accordion">
            <ul v-show="openMenus.product" class="sub-menu">
              <li>
                <RouterLink
                  to="/dashboard/products/list"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Layers class="icon sub-icon" />
                  <span class="label">All products</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/dashboard/products/create"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Plus class="icon sub-icon" />
                  <span class="label">Create product</span>
                </RouterLink>
              </li>
            </ul>
          </Transition>
        </li>

        <!-- Brand (accordion) -->
        <li class="accordion-item">
          <button
            class="nav-link accordion-toggle"
            :class="{ open: openMenus.brand, 'child-active': isBrandActive }"
            @click="toggleMenu('brand')"
          >
            <Award class="icon" />
            <span class="label">Brand</span>
            <ChevronDown
              class="chevron"
              :class="{ rotated: openMenus.brand }"
              :size="16"
            />
          </button>
          <Transition name="accordion">
            <ul v-show="openMenus.brand" class="sub-menu">
              <li>
                <RouterLink
                  to="/dashboard/brands"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Layers class="icon sub-icon" />
                  <span class="label">All brands</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/dashboard/brands/create"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Plus class="icon sub-icon" />
                  <span class="label">Create brand</span>
                </RouterLink>
              </li>
            </ul>
          </Transition>
        </li>

        <!-- Category (accordion) -->
        <li class="accordion-item">
          <button
            class="nav-link accordion-toggle"
            :class="{ open: openMenus.category, 'child-active': isCategoryActive }"
            @click="toggleMenu('category')"
          >
            <LayoutGrid class="icon" />
            <span class="label">Category</span>
            <ChevronDown
              class="chevron"
              :class="{ rotated: openMenus.category }"
              :size="16"
            />
          </button>
          <Transition name="accordion">
            <ul v-show="openMenus.category" class="sub-menu">
              <li>
                <RouterLink
                  to="/dashboard/categories"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Layers class="icon sub-icon" />
                  <span class="label">All categories</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/dashboard/categories/create"
                  class="nav-link sub"
                  active-class="active"
                >
                  <Plus class="icon sub-icon" />
                  <span class="label">Create category</span>
                </RouterLink>
              </li>
            </ul>
          </Transition>
        </li>

        <!-- Orders -->
        <li>
          <RouterLink
            to="/dashboard/orders"
            class="nav-link"
            active-class="active"
          >
            <ShoppingCart class="icon" />
            <span class="label">Orders</span>
          </RouterLink>
        </li>

        <!-- Users -->
        <li>
          <RouterLink
            to="/dashboard/users"
            class="nav-link"
            active-class="active"
          >
            <Users class="icon" />
            <span class="label">Users</span>
          </RouterLink>
        </li>

        <!-- Deals -->
        <li>
          <RouterLink
            to="/dashboard/deals"
            class="nav-link"
            active-class="active"
          >
            <Tag class="icon" />
            <span class="label">Deals</span>
          </RouterLink>
        </li>

        <!-- Logout -->
        <li class="logout">
          <button class="nav-link" type="button" @click="onLogout">
            <LogOut class="icon" />
            <span class="label">Logout</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="spacer"></div>
  </aside>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  LayoutDashboard, Pencil, ShoppingCart, Tag, LogOut, Users,
  ChevronDown, Award, Layers, Plus, LayoutGrid,
} from 'lucide-vue-next';
import { logout } from '@/lib/auth';
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store';
import { useCartStore } from '@/modules/cart/_stores/cart.store';

const router = useRouter();
const route = useRoute();

// Accordion state
const openMenus = reactive({
  product: false,
  brand: false,
  category: false,
});

// Auto-open when a child route is active
const isProductActive = computed(() => route.path.startsWith('/dashboard/products'));
const isBrandActive = computed(() => route.path.startsWith('/dashboard/brands'));
const isCategoryActive = computed(() => route.path.startsWith('/dashboard/categories'));

// Auto-open on mount if child is active
if (isProductActive.value) openMenus.product = true;
if (isBrandActive.value) openMenus.brand = true;
if (isCategoryActive.value) openMenus.category = true;

function toggleMenu(key) {
  openMenus[key] = !openMenus[key];
}

function onLogout() {
  logout();
  // Reload stores so they switch to guest storage keys
  useWishlistStore().loadFromStorage();
  useCartStore().loadFromStorage();
  router.replace('/auth/login');
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  position: fixed;
  top: 0;
  z-index: 20;
  left: 0;
  height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 28px 14px;
  box-sizing: border-box;
}

.profile {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.logo-image {
  width: 120px;
  height: auto;
  object-fit: contain;
  opacity: 0.95;
  transition: opacity 0.3s ease;
}

.logo-image:hover {
  opacity: 1;
}

.nav {
  /* make the nav area take remaining height and be scrollable */
  flex: 1 1 auto;
  overflow-y: auto;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.15s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
  flex-shrink: 0;
}

.label {
  opacity: 0.95;
}

.nav-link.active {
  background: rgba(173, 214, 241, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* ── Accordion toggle ── */
.accordion-toggle {
  position: relative;
}

.accordion-toggle .chevron {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.35);
  transition: transform 0.25s ease;
}

.accordion-toggle .chevron.rotated {
  transform: rotate(180deg);
}

.accordion-toggle.child-active,
.accordion-toggle.open {
  background: rgba(255, 255, 255, 0.04);
}

/* ── Sub-menu ── */
.sub-menu {
  padding: 2px 0 2px 12px;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.nav-link.sub {
  padding: 9px 14px 9px 32px;
  font-size: 13px;
  border-radius: 6px;
}

.sub-icon {
  width: 16px;
  height: 16px;
}

/* ── Accordion transition ── */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 200px;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Make logout button (icon + text) red while keeping icon size
   consistent with other nav icons. */
.logout .nav-link {
  color: #ef4444;
  font-weight: bold;
}

.logout .icon {
  color: inherit;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.logout {
  margin-top: 8px;
}

.spacer {
  /* keep spacer fixed sized so header/footer remain visible */
  flex: 0 0 auto;
}
</style>
