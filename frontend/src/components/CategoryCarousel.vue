<template>
  <div class="carousel-container">
    <div class="fade fade-left" />
    <div class="fade fade-right" />

    <div
      ref="viewport"
      class="carousel-viewport"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div
        ref="track"
        class="carousel-track"
        :style="{ transform: `translateX(${-offset}px)` }"
      >
        <div
          v-for="(item, i) in categories"
          :key="'a' + i"
          class="item"
        >
          <component :is="item.icon" class="icon" />
        </div>

        <div
          v-for="(item, i) in categories"
          :key="'b' + i"
          class="item"
          aria-hidden="true"
        >
          <component :is="item.icon" class="icon" />
        </div>

        <div
          v-for="(item, i) in categories"
          :key="'c' + i"
          class="item"
          aria-hidden="true"
        >
          <component :is="item.icon" class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Monitor,
  Gamepad2,
} from 'lucide-vue-next'

const categories = [
  { icon: Smartphone },
  { icon: Laptop },
  { icon: Headphones },
  { icon: Watch },
  { icon: Monitor },
  { icon: Gamepad2 },
]

const viewport = ref(null)
const track = ref(null)
const offset = ref(0)

let raf = null
let last = 0
let loopWidth = 0

const SPEED = 60
const isHovered = ref(false)

const animate = (t) => {
  if (!last) last = t
  const dt = (t - last) / 1000
  last = t

  const currentSpeed = isHovered.value ? SPEED * 0.3 : SPEED
  offset.value += currentSpeed * dt

  if (offset.value >= loopWidth) {
    offset.value = offset.value - loopWidth
  }

  raf = requestAnimationFrame(animate)
}

onMounted(async () => {
  await nextTick()

  const items = track.value.querySelectorAll('.item')
  const itemsPerSet = categories.length

  if (items.length > 0) {
    const firstItem = items[0]
    const lastItemOfFirstSet = items[itemsPerSet - 1]
    const gap = parseFloat(getComputedStyle(track.value).gap) || 16

    loopWidth = lastItemOfFirstSet.offsetLeft - firstItem.offsetLeft + lastItemOfFirstSet.offsetWidth + gap
  }

  raf = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (raf) {
    cancelAnimationFrame(raf)
  }
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  margin: 80px auto;
}

.carousel-viewport {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  gap: 1rem;
  width: max-content;
  will-change: transform;
}

.item {
  flex: 0 0 auto;
  width: 5rem;
  height: 5rem;
  background: #f6f6f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 2.4rem;
  height: 2.4rem;
  color: #111;
}

.fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 150px;
  pointer-events: none;
  z-index: 10;
}

.fade-left {
  left: 0;
  background: linear-gradient(
    to right,
    #ffffff 0%,
    #ffffff 20%,
    rgba(255, 255, 255, 0.8) 40%,
    rgba(255, 255, 255, 0.4) 70%,
    rgba(255, 255, 255, 0) 100%
  );
}

.fade-right {
  right: 0;
  background: linear-gradient(
    to left,
    #ffffff 0%,
    #ffffff 20%,
    rgba(255, 255, 255, 0.8) 40%,
    rgba(255, 255, 255, 0.4) 70%,
    rgba(255, 255, 255, 0) 100%
  );
}

@media (max-width: 768px) {
  .carousel-viewport {
    max-width: 100%;
    padding: 0 20px;
  }

  .fade {
    width: 100px;
  }

  .item {
    width: 4rem;
    height: 4rem;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }
}

@media (max-width: 480px) {
  .carousel-viewport {
    padding: 0 10px;
  }

  .fade {
    width: 60px;
  }

  .item {
    width: 3.5rem;
    height: 3.5rem;
  }

  .icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .carousel-track {
    gap: 0.75rem;
  }
}
</style>
