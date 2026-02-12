<script setup>
import { ref, onMounted } from 'vue';

const categories = [
  { name: 'Controller', img: '/category/controller.png' },
  { name: 'Phone', img: '/category/phone.webp', scale: 1.55 },
  { name: 'Laptop', img: '/category/laptop.png', scale: 1.15 },
  { name: 'Headphones', img: '/category/headphones.png', scale: 1.95 },
  { name: 'Watch', img: '/category/watch.png', scale: 1.15 },
  { name: 'Monitor', img: '/category/monitor.png' },
];

const track = ref(null);

// Duplicate cards multiple times for seamless infinite scroll
onMounted(() => {
  if (track.value) {
    const cards = [...track.value.children];

    // Duplicate cards 5 times for extra smooth loop on mobile
    for (let i = 0; i < 5; i++) {
      cards.forEach(card => {
        track.value.appendChild(card.cloneNode(true));
      });
    }
  }
});
</script>

<template>
  <div class="carousel">
    <div ref="track" class="group">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="card"
      >
        <img
          :src="item.img"
          :alt="item.name"
          class="card-img"
          draggable="false"
          :style="{
            transform: item.scale ? `scale(${item.scale})` : 'scale(1)',
            '--base-scale': item.scale || 1
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel {
  margin: 100px auto;
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
}

.carousel::before,
.carousel::after {
  content: "";
  position: absolute;
  top: 0;
  width: 150px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.carousel::before {
  left: 0;
  background: linear-gradient(90deg,
              #000000 0%,
              rgba(0, 0, 0, 0) 100%);
}

.carousel::after {
  right: 0;
  background: linear-gradient(90deg,
              rgba(0, 0, 0, 0) 0%,
              #000000 100%);
}

.group {
  display: flex;
  width: max-content;
  gap: 1em;
  animation: scroll 20s linear infinite;
  will-change: transform;
}

.group:hover {
  animation-play-state: paused;
}

.card {
  flex: 0 0 auto;
  width: 5em;
  height: 5em;
  background: #111111;
  font-size: 3rem;
  border-radius: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.card:hover {
  background: #1a1a1a;
}

.card-img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  transition: transform 0.3s ease;
  --base-scale: 1;
}

.card:hover .card-img {
  transform: scale(calc(var(--base-scale) * 1.15)) !important;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 6));
  }
}
</style>
