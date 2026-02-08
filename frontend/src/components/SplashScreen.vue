<template>
  <Transition name="splash-fade" @after-leave="$emit('done')">
    <div v-if="visible" class="splash-overlay">
      <!-- Animated background particles -->
      <div class="particles">
        <div v-for="i in 40" :key="i" class="particle" :style="particleStyle(i)" />
      </div>

      <!-- Gradient orbs for depth -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />

      <div class="splash-content">
        <!-- Logo container with glow effect -->
        <div class="logo-container">
          <div class="logo-glow-outer" />
          <div class="logo-glow" />
          <img
            src="/logo.svg"
            alt="Electro Store"
            class="splash-logo"
          />
        </div>

        <!-- Modern loading indicator -->
        <div class="loading-section">
          <!-- Circular progress spinner -->
          <div class="spinner-ring">
            <svg viewBox="0 0 50 50" class="spinner-svg">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="3"
                class="spinner-circle"
              />
            </svg>
          </div>

          <!-- Loading text with dots animation -->
          <div class="loading-text">
            Loading<span class="dots">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['done'])

const visible = ref(true)

// Generate random styles for particles
const particleStyle = () => {
  const size = Math.random() * 4 + 2
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}

onMounted(() => {
  // Remove the raw HTML splash from index.html
  const rawSplash = document.getElementById('splash-screen')
  if (rawSplash) rawSplash.remove()

  // Keep Vue splash visible for a short duration, then fade out
  setTimeout(() => {
    visible.value = false
  }, 2000)
})
</script>

<style scoped>
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0d0d1a 0%, #050508 50%, #000000 100%);
  overflow: hidden;
}

/* Animated background particles */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.8;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 200, 0.8) 50%, transparent 100%);
  border-radius: 50%;
  animation: float-particle infinite ease-in-out, twinkle 3s infinite ease-in-out;
  box-shadow:
    0 0 4px rgba(255, 255, 255, 0.8),
    0 0 8px rgba(255, 255, 255, 0.4);
}

@keyframes float-particle {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}

/* Gradient orbs for depth */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: pulse-orb 4s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, transparent 70%);
  top: -10%;
  left: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.1) 0%, transparent 70%);
  bottom: -15%;
  right: -15%;
  animation-delay: 2s;
}

@keyframes pulse-orb {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  z-index: 1;
}

/* Logo container with glow */
.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow-outer {
  position: absolute;
  inset: -100px;
  background: radial-gradient(
    circle,
    rgba(0, 220, 255, 0.4) 0%,
    rgba(0, 180, 255, 0.25) 40%,
    rgba(0, 120, 255, 0.1) 70%,
    transparent 85%
  );
  border-radius: 50%;
  animation: glow-pulse-outer 3s ease-in-out infinite;
  filter: blur(60px);
}

@keyframes glow-pulse-outer {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

.logo-glow {
  position: absolute;
  inset: -60px;
  background: radial-gradient(
    circle,
    rgba(0, 200, 255, 0.6) 0%,
    rgba(0, 150, 255, 0.4) 30%,
    rgba(0, 100, 255, 0.2) 60%,
    transparent 80%
  );
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
  filter: blur(40px);
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.splash-logo {
  width: 280px;
  height: 280px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  animation:
    logo-entrance 1s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    logo-float 3s ease-in-out 1s infinite;
  filter:
    drop-shadow(0 0 60px rgba(0, 200, 255, 0.8))
    drop-shadow(0 0 100px rgba(0, 150, 255, 0.6))
    drop-shadow(0 10px 40px rgba(0, 200, 255, 0.5))
    brightness(1.3)
    contrast(1.1);
}

@keyframes logo-entrance {
  0% {
    opacity: 0;
    transform: scale(0.5) rotateY(-180deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes logo-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-12px) scale(1.02);
  }
}

/* Modern loading section */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Circular spinner */
.spinner-ring {
  width: 50px;
  height: 50px;
  position: relative;
}

.spinner-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  animation: rotate-spinner 2s linear infinite;
}

@keyframes rotate-spinner {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.spinner-circle {
  stroke: #ffffff;
  stroke-linecap: round;
  stroke-dasharray: 125;
  stroke-dashoffset: 125;
  animation: draw-circle 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

@keyframes draw-circle {
  0% {
    stroke-dashoffset: 125;
  }
  50% {
    stroke-dashoffset: 25;
  }
  100% {
    stroke-dashoffset: 125;
  }
}

/* Loading text */
.loading-text {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.dots {
  display: inline-flex;
  margin-left: 2px;
}

.dot {
  animation: dot-bounce 1.4s infinite;
  opacity: 0;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-8px);
  }
}

/* Vue transition for smooth fade-out */
.splash-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .splash-logo {
    width: 200px;
    height: 200px;
  }

  .orb-1,
  .orb-2 {
    width: 300px;
    height: 300px;
  }

  .loading-text {
    font-size: 14px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .splash-logo,
  .particle,
  .orb,
  .logo-glow,
  .spinner-svg {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
