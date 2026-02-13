<template>
  <Transition name="splash-fade" @after-leave="$emit('done')">
    <div v-if="visible" class="splash-overlay">
      <!-- Lightweight background particles -->
      <div class="particles">
        <div v-for="i in 12" :key="i" class="particle" :style="particles[i - 1]" />
      </div>

      <!-- Single subtle orb -->
      <div class="orb" />

      <div class="splash-content">
        <!-- Logo container with shining glow -->
        <div class="logo-container">
          <div class="logo-glow-outer" />
          <div class="logo-glow" />
          <img
            src="/icons/logo.svg"
            alt="Electro Store"
            class="splash-logo"
            width="240"
            height="240"
            fetchpriority="high"
          />
        </div>

        <!-- Minimal loading indicator -->
        <div class="loading-section">
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

// Pre-compute particle styles once (avoid recalculating in template)
const particles = Array.from({ length: 12 }, () => {
  const size = Math.random() * 3 + 1.5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 2 + 1.5}s`,
    animationDelay: `${Math.random() * 1}s`,
  }
})

onMounted(() => {
  // Remove the raw HTML splash from index.html
  const rawSplash = document.getElementById('splash-screen')
  if (rawSplash) rawSplash.remove()

  // Dismiss quickly — 1 second is enough
  setTimeout(() => {
    visible.value = false
  }, 1000)
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
  will-change: opacity, transform;
  contain: layout style;
}

/* Lightweight particles — no box-shadow, single animation */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.6;
  contain: strict;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: float-particle infinite ease-in-out;
  will-change: transform, opacity;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateZ(0);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  85% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-60vh) translateZ(0);
    opacity: 0;
  }
}

/* Single subtle orb — no filter blur, uses opacity only */
.orb {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 140, 66, 0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.2;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  z-index: 1;
}

/* Logo container with shining glow */
.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow-outer {
  position: absolute;
  inset: -80px;
  background: radial-gradient(
    circle,
    rgba(255, 160, 66, 0.35) 0%,
    rgba(255, 140, 42, 0.2) 35%,
    rgba(224, 117, 48, 0.08) 65%,
    transparent 85%
  );
  border-radius: 50%;
  animation: glow-pulse-outer 3s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes glow-pulse-outer {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.9) translateZ(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.12) translateZ(0);
  }
}

.logo-glow {
  position: absolute;
  inset: -50px;
  background: radial-gradient(
    circle,
    rgba(255, 140, 66, 0.55) 0%,
    rgba(255, 120, 42, 0.3) 35%,
    rgba(224, 117, 48, 0.12) 60%,
    transparent 80%
  );
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
  filter: blur(10px);
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.75;
    transform: scale(0.92) translateZ(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.08) translateZ(0);
  }
}

.splash-logo {
  width: 240px;
  height: 240px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  animation: logo-entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  filter:
    drop-shadow(0 0 40px rgba(255, 140, 66, 0.7))
    drop-shadow(0 0 80px rgba(255, 120, 42, 0.4));
  will-change: transform, opacity;
}

@keyframes logo-entrance {
  0% {
    opacity: 0;
    transform: scale(0.7) translateZ(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}

/* Loading section */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Spinner */
.spinner-ring {
  width: 40px;
  height: 40px;
}

.spinner-svg {
  width: 100%;
  height: 100%;
  animation: rotate-spinner 1s linear infinite;
  will-change: transform;
}

@keyframes rotate-spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner-circle {
  stroke: #ffffff;
  stroke-linecap: round;
  stroke-dasharray: 90 35;
  stroke-dashoffset: 0;
}

/* Loading text */
.loading-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
}

.dots {
  display: inline-flex;
  margin-left: 2px;
}

.dot {
  animation: dot-bounce 1.2s infinite;
  opacity: 0;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-bounce {
  0%, 80%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-6px);
  }
}

/* Fast fade-out transition */
.splash-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-fade-leave-to {
  opacity: 0;
}

/* Mobile — smaller logo, fewer resources */
@media (max-width: 768px) {
  .splash-logo {
    width: 160px;
    height: 160px;
  }

  .logo-glow-outer {
    inset: -50px;
  }

  .logo-glow {
    inset: -30px;
  }

  .orb {
    width: 200px;
    height: 200px;
  }

  .loading-text {
    font-size: 12px;
  }

  .spinner-ring {
    width: 32px;
    height: 32px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .splash-logo,
  .particle,
  .logo-glow,
  .logo-glow-outer,
  .spinner-svg,
  .dot {
    animation: none !important;
  }

  .splash-logo {
    opacity: 1;
    transform: none;
  }

  .dot {
    opacity: 1;
  }
}
</style>
