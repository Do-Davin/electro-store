<template>
  <section
    class="hero"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- Angkor Wat SVG Background (Corrected Proportions) -->
    <img
      src="/angkor-wat.png"
      alt="Angkor Wat"
      class="angkor-wat-bg angkor-orange"
    />

    <div class="hero__content">
      <span class="hero__tag">Hurry up only fews left!</span>

      <h1 class="hero__title">
        <span class="hero__typing-box">
          <TextType
            :text="[
              'Next-Level Smartphone\nExperience',
              'Discover iPhone 17 Pro Max\nToday!'
            ]"
            :typingSpeed="70"
            :pauseDuration="1200"
            :showCursor="true"
            cursorCharacter="|"
            className="hero__typing"
          />
        </span>
      </h1>

      <div class="hero__actions">
        <RouterLink
          to="/products"
          class="btn-primary"
          draggable="false"
        >
          Shop Now
        </RouterLink>

        <RouterLink
          to="/deals"
          class="btn-link"
          draggable="false"
        >
          Explore Deals →
        </RouterLink>
      </div>
    </div>

    <div class="hero__image">
      <img src="/iphone.png" alt="iPhone">
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import TextType from './TextType.vue';
// const backgroundImage = '/hero-bg.avif'
const backgroundImage = ''
</script>

<style scoped>
.hero {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 100px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  background: #000;
  overflow: hidden;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 140, 66, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 140, 66, 0.05) 0%, transparent 50%);
  pointer-events: none;
  animation: pulseGlow 8s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Angkor Wat SVG Background */
.angkor-wat-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.angkor-orange {
  opacity: 0.18;
  filter:
    invert(60%)
    sepia(90%)
    saturate(800%)
    hue-rotate(340deg)
    brightness(95%)
    contrast(95%);
}

.temple-path {
  fill: none;
  stroke: #ff8c42;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawTemple 3s ease-out forwards;
}

@keyframes drawTemple {
  to {
    stroke-dashoffset: 0;
  }
}

/* Stagger the animation for different paths */
.temple-path:nth-child(1) { animation-delay: 0s; }
.temple-path:nth-child(2) { animation-delay: 0.1s; }
.temple-path:nth-child(3) { animation-delay: 0.2s; }
.temple-path:nth-child(4) { animation-delay: 0.3s; }
.temple-path:nth-child(5) { animation-delay: 0.4s; }
.temple-path:nth-child(6) { animation-delay: 0.5s; }
.temple-path:nth-child(7) { animation-delay: 0.6s; }
.temple-path:nth-child(8) { animation-delay: 0.7s; }
.temple-path:nth-child(9) { animation-delay: 0.8s; }
.temple-path:nth-child(10) { animation-delay: 0.9s; }
.temple-path:nth-child(11) { animation-delay: 1s; }
.temple-path:nth-child(12) { animation-delay: 1.1s; }
.temple-path:nth-child(13) { animation-delay: 1.2s; }
.temple-path:nth-child(14) { animation-delay: 1.3s; }

/* Left */
.hero__content {
  max-width: 55%;
  animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  z-index: 1;
  position: relative;
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-60px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero__tag {
  color: #ff8c42;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 16px;
  display: inline-block;
  padding: 10px 20px;
  background: rgba(255, 140, 66, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 140, 66, 0.2);
  animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__title {
  margin: 24px 0 36px;
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  position: relative;
  min-height: calc(1.2em * 2);
  height: auto;
  overflow: hidden;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Action */
.hero__actions {
  display: flex;
  align-items: center;
  gap: 24px;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
  opacity: 0;
}

.btn-primary {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 18px rgba(255, 140, 66, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 28px rgba(255, 140, 66, 0.4);
}

.btn-primary:active {
  transform: translateY(0) scale(0.97);
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.btn-link {
  color: white;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.btn-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff8c42;
  transition: width 0.3s ease;
}

.btn-link:hover::after {
  width: 100%;
}

.btn-link:hover {
  color: #ff8c42;
}

/* Right image */
.hero__image {
  animation: floatIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
  z-index: 1;
  position: relative;
}

@keyframes floatIn {
  0% {
    opacity: 0;
    transform: translateX(60px) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

.hero__image img {
  max-width: 420px;
  /* Change scale here */
  transform: scale(1.6);
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
}

@keyframes float {
  0%, 100% {
    /* Change scale here */
    transform: scale(1.6) translateY(0);
  }
  50% {
    /* Change scale here */
    transform: scale(1.6) translateY(-20px);
  }
}

.hero-typing-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
}

.hero__typing {
  transform: translateZ(0);
  will-change: contents;
  white-space: pre-line;
}

.hero__typing span {
  display: block;
  overflow: hidden;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column-reverse;
    justify-content: center;
    text-align: center;
    padding: 60px 24px;
    gap: 40px;
  }

  .angkor-wat-bg {
    width: 100%;
    height: 50%;
    opacity: 0.1;
  }

  .hero__content {
    max-width: 100%;
  }

  .hero__title {
    font-size: 32px;
    line-height: 1.3;
    margin: 16px 0 24px;
    min-height: calc(1.3em * 2);
  }

  .hero__actions {
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .hero__image img {
    max-width: 260px;
    transform: scale(1);
  }

  @keyframes float {
    0%, 100% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1) translateY(-15px);
    }
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: 26px;
  }

  .btn-primary {
    width: 100%;
    text-align: center;
  }

  .btn-link {
    width: 100%;
    text-align: center;
  }
}
</style>
