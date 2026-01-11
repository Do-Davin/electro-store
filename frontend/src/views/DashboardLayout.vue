<template>
  <div class="dashboard-layout">
    <SidebarComponent />

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SidebarComponent from '@/modules/dashboard/_components/SidebarComponent.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #003465;
}

.content {
  flex: 1;
  padding: 24px;
  background: transparent;
}
</style>
