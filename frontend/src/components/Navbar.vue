<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="navbar">
    <!-- Left: Logo -->
    <div class="navbar__logo">
      &lt;DT /&gt;
    </div>

    <!-- Center: Menu icons -->
     <nav class="navbar__menu">
      <RouterLink to="/" class="nav-icon">
        <v-icon scale="1.5" name="hi-solid-home" />
      </RouterLink>
      <RouterLink to="/products" class="nav-icon">
        <v-icon scale="1.5" name="fa-box" />
      </RouterLink>
      <RouterLink to="/categories" class="nav-icon">
        <v-icon scale="1.5" name="fa-clipboard-list" />
      </RouterLink>
      <RouterLink to="/orders" class="nav-icon">
        <v-icon scale="1.5" name="fa-user-tie" />
      </RouterLink>
      <RouterLink to="/cart" class="nav-icon">
        <v-icon scale="1.5" name="fa-shopping-cart" />
      </RouterLink>
     </nav>

     <!-- Right: Auth -->
      <div class="navbar__auth">
        <button class="btn-signin">Sign In</button>
      </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

/* Logo */
.navbar__logo {
  font-weight: 700;
  font-size: 18px;
  color: var(--primary);
}

/* Menu */
.navbar__menu {
  display: flex;
  gap: 28px;
}

.nav-icon {
  font-size: 18px;
  color: #555;
  transition: color 0.2s;
}

.nav-icon:hover {
  color: var(--primary);
}

/* Auth */
.navbar__auth {
  display: flex;
  align-items: center;
}

.btn-signin {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
}

.btn-signin:hover {
  opacity: 0.9;
}
</style>
