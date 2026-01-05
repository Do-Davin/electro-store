<template>
  <div class="dashboard-layout">
    <Sidebarcomponent />
    <main class="content">
      <h1>Dashboard View</h1>
      <!-- Dashboard content goes here -->
    </main>
  </div>
</template>

<script setup>
import Sidebarcomponent from '@/modules/dashboard/_components/SidebarComponent.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.content {
  flex: 1 1 auto;
  padding: 32px;
}
h1 {
  color: #0f3b5a;
}
</style>