<template>
  <div class="carousel">
    <div class="group">
      <div
        v-for="(item, index) in duplicatedCategories"
        :key="index"
        class="card"
    >
      {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = ['📱', '💻', '🎧', '⌚', '🖥️', '🎮']

// Duplicate for seamless infinite scroll
const duplicatedCategories = [...categories, ...categories]
</script>

<style scoped>
.carousel {
  margin: 100px auto;
  width: 100%;
  overflow: hidden;
  display: flex;
}

.group {
  display: flex;
  width: max-content;
  gap: 1em;
  animation: scroll 20s linear infinite;
  will-change: transform;
}

.card {
  flex: 0 0 auto;
  width: 5em;
  height: 5em;
  background: #f6f6f6;
  font-size: 3rem;
  border-radius: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
