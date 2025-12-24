<template>
  <!-- <HomeView /> -->
  <div class="container">
    <h1 style="font-size: 1.5rem; color: red;">DEBUG: </h1>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/dashboard">Dashboard</RouterLink>
  </div>
  <router-view/>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
// import HomeView from './views/HomeView.vue';
</script>

<style>
.container {
  min-width: 200px;
  min-height: 100px;
  margin: 20px;
  display: flex;
  font-size: 1.5rem;
  justify-content:center;
  align-items: center;
  border: 2px solid red;
}
</style>
