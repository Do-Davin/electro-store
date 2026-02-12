<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

defineProps({
  /** Show skeletons instead of the default slot */
  loading: {
    type: Boolean,
    default: false,
  },
  /** Which skeleton shape to render while loading */
  skeletonVariant: {
    type: String,
    default: 'text',
  },
  /** How many skeleton items to show */
  skeletonCount: {
    type: Number,
    default: 3,
  },
  /** Extra CSS classes passed to SkeletonLoader */
  skeletonClass: {
    type: String,
    default: '',
  },
})
</script>

<!--
  PageLayout.vue — Reusable page wrapper that:
  1. Pushes the footer to the bottom (even when content is short / loading)
  2. Shows a skeleton loader while `loading` is true
  3. Accepts any page content via the default slot

  Usage:
    <PageLayout :loading="isLoading" skeleton-variant="card" :skeleton-count="4">
      <template #header>
        <h1>My Page</h1>
      </template>

      <YourActualContent />
    </PageLayout>
-->
<template>
  <div class="page-layout">
    <Navbar />

    <main class="page-layout__main">
      <!-- Optional header slot (renders above content, always visible) -->
      <slot name="header" />

      <!-- Loading state -->
      <div v-if="loading" class="page-layout__loading">
        <SkeletonLoader
          :variant="skeletonVariant"
          :count="skeletonCount"
          :container-class="skeletonClass"
        />
      </div>

      <!-- Actual content -->
      <div v-else>
        <slot />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-layout__main {
  flex: 1;
}

.page-layout__loading {
  padding: 6rem 1.5rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
