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
  display: flex !important;
  flex-direction: row !important;
  min-height: 100vh;
  background: #0a0a0a;
}

.content {
  flex: 1;
  padding: 24px;
  min-height: auto !important;
  overflow-y: auto;
  background: transparent;
  /* account for fixed sidebar width so content isn't hidden underneath */
  margin-left: 240px;
}

@media (max-width: 900px) {
  .content {
    margin-left: 0;
  }
}
</style>
