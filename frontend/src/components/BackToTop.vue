<template>
  <button
    v-show="visible"
    @click="scrollToTop"
    class="back-top-btn"
  >
    ↑
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ff8c42;
  color: white;
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4);
  z-index: 999;
  transition: all 0.2s ease;
}

.back-top-btn:hover {
  transform: translateY(-3px);
}

.back-top-btn:active {
  transform: scale(0.95);
}
</style>
