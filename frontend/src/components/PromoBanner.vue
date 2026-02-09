<template>
  <Transition name="promo-slide">
    <div v-if="visible" class="promo-banner">
      <div class="promo-banner__inner">
        <!-- Animated background shimmer -->
        <div class="promo-banner__shimmer"></div>

        <div class="promo-banner__content">
          <!-- Spark icon -->
          <span class="promo-banner__icon">
            <Sparkles :size="14" />
          </span>

          <p class="promo-banner__text">
            New Year Sale —
            <span class="promo-banner__highlight">Up to 30% OFF</span>
            on selected products
          </p>

          <RouterLink to="/products" class="promo-banner__cta">
            Shop Now
            <ArrowRight :size="13" />
          </RouterLink>
        </div>

        <!-- Close -->
        <button class="promo-banner__close" @click="visible = false">
          <X :size="14" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { X, Sparkles, ArrowRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const visible = ref(true)
</script>

<style scoped>
.promo-banner {
  width: 100%;
  background: linear-gradient(90deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%);
  border-bottom: 1px solid rgba(255, 140, 66, 0.1);
  position: relative;
  overflow: hidden;
}

.promo-banner__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  position: relative;
}

.promo-banner__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 140, 66, 0.03) 25%,
    rgba(255, 140, 66, 0.06) 50%,
    rgba(255, 140, 66, 0.03) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmerSlide 6s ease-in-out infinite;
}

@keyframes shimmerSlide {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.promo-banner__content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.promo-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8c42;
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.promo-banner__text {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3px;
}

.promo-banner__highlight {
  color: #ff8c42;
  font-weight: 600;
}

.promo-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  padding: 5px 14px;
  border-radius: 100px;
  background: rgba(255, 140, 66, 0.12);
  border: 1px solid rgba(255, 140, 66, 0.2);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.promo-banner__cta:hover {
  background: rgba(255, 140, 66, 0.2);
  border-color: rgba(255, 140, 66, 0.35);
  transform: translateX(2px);
}

.promo-banner__close {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}

.promo-banner__close:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.06);
}

/* Transition */
.promo-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.promo-slide-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
  overflow: hidden;
}

@media (max-width: 640px) {
  .promo-banner__content {
    gap: 8px;
  }

  .promo-banner__text {
    font-size: 11px;
  }

  .promo-banner__cta {
    font-size: 11px;
    padding: 4px 10px;
  }
}
</style>
