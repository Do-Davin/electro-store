<template>
  <aside class="sidebar">
    <!-- Profile / Logo -->
    <div class="profile">
      <img
        src="/icons/logo-white.svg"
        alt="Electro Store"
        class="logo-image"
      />
    </div>

    <!-- Nav -->
    <nav class="nav">
      <ul>
        <li>
          <RouterLink
            to="/dashboard"
            class="nav-link"
            active-class="active"
            exact-active-class="active"
          >
            <Home class="icon" />
            <span class="label">Dashboard</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/dashboard/products"
            class="nav-link"
            active-class="active"
          >
            <Package class="icon" />
            <span class="label">Products</span>
          </RouterLink>
        </li>

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
          <!-- If you have a logout route, use RouterLink. Otherwise use a button -->
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
import { useRouter } from 'vue-router';
import { Home, Package, ShoppingCart, Tag, LogOut, Users } from 'lucide-vue-next';
import { logout } from '@/lib/auth';

const router = useRouter();

function onLogout() {
  logout(); // clears access_token & auth_payload
  router.replace('/auth/login') // replace prevent back-navigation
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #0b3f6b;
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

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.06);
}

.icon {
  width: 20px;
  height: 20px;
  color: #fff3cd;
}

.label {
  font-size: 14px;
  opacity: 0.95;
}

.nav-link.active {
  background: rgba(173, 214, 241, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.logout {
  margin-top: 8px;
}

.spacer {
  flex: 1 1 auto;
}
</style>
