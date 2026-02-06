<template>
  <div class="result-card success">
    <!-- Success Animation -->
    <div class="success-animation-wrapper">
      <!-- Continuous ripple rings -->
      <div class="ripple-ring ripple-1"></div>
      <div class="ripple-ring ripple-2"></div>
      <div class="ripple-ring ripple-3"></div>

      <!-- Floating particles -->
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
      <div class="particle particle-7"></div>
      <div class="particle particle-8"></div>

      <!-- Sparkles -->
      <div class="sparkle sparkle-1">✦</div>
      <div class="sparkle sparkle-2">✦</div>
      <div class="sparkle sparkle-3">✦</div>
      <div class="sparkle sparkle-4">✦</div>

      <!-- Main success badge -->
      <div class="success-badge">
        <div class="badge-glow"></div>
        <svg class="check-icon" viewBox="0 0 24 24" fill="none">
          <path
            class="check-path"
            d="M4 12.5L9.5 18L20 6"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- Text -->
    <h2 class="success-title">{{ title }}</h2>
    <p class="success-subtitle">{{ subtitle }}</p>

    <!-- Optional details -->
    <div v-if="$slots.details" class="result-details">
      <slot name="details" />
    </div>

    <!-- Optional action -->
    <div v-if="$slots.action" class="action-slot">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Base container */
.result-card {
  text-align: center;
  padding: 40px 20px;
}

/* Animation wrapper */
.success-animation-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ripple rings - modern smooth pulse */
.ripple-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #22c55e;
  opacity: 0;
}

.ripple-1 {
  animation: ripple-expand-initial 1.5s ease-out 0.2s forwards,
             ripple-continuous-smooth 5s ease-in-out 1.7s infinite;
}
.ripple-2 {
  animation: ripple-expand-initial 1.5s ease-out 0.5s forwards,
             ripple-continuous-smooth 5s ease-in-out 2s infinite;
}
.ripple-3 {
  animation: ripple-expand-initial 1.5s ease-out 0.8s forwards,
             ripple-continuous-smooth 5s ease-in-out 2.3s infinite;
}

/* Initial expansion animation - slower and smoother */
@keyframes ripple-expand-initial {
  0% {
    transform: scale(1);
    opacity: 0.5;
    border-width: 2px;
  }
  70% {
    opacity: 0.15;
    border-width: 1px;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

/* Continuous smooth pulse - gradual fade throughout */
@keyframes ripple-continuous-smooth {
  0% {
    transform: scale(1);
    opacity: 0;
    border-width: 2px;
  }
  10% {
    opacity: 0.4;
  }
  30% {
    opacity: 0.25;
    border-width: 1.5px;
  }
  60% {
    opacity: 0.1;
    border-width: 1px;
  }
  85% {
    opacity: 0.03;
    border-width: 0.5px;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

/* Success badge */
.success-badge {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(145deg, #22c55e, #15803d);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0);
  animation: badge-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards,
             badge-float 3s ease-in-out 1s infinite;
  box-shadow: 0 10px 40px rgba(34,197,94,0.4);
}

.badge-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%);
  animation: glow-pulse 2s ease-in-out 1s infinite;
}

/* Initial badge pop */
@keyframes badge-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Continuous subtle float - ultra smooth */
@keyframes badge-float {
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(1.01) translateY(-1.5px); }
  50% { transform: scale(1.02) translateY(-3px); }
  75% { transform: scale(1.01) translateY(-1.5px); }
  100% { transform: scale(1) translateY(0); }
}

/* Glow pulse - ultra smooth */
@keyframes glow-pulse {
  0% { opacity: 1; }
  25% { opacity: 0.85; }
  50% { opacity: 0.7; }
  75% { opacity: 0.85; }
  100% { opacity: 1; }
}

.check-icon {
  width: 44px;
  height: 44px;
  z-index: 1;
}

.check-path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: draw-checkmark 0.5s ease-out 0.6s forwards;
}

@keyframes draw-checkmark {
  to { stroke-dashoffset: 0; }
}

/* Particles - seamless continuous float */
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
}

.particle-1 {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  animation: particle-initial 1s ease-out 0.3s forwards, particle-float-seamless 6s ease-in-out 1.3s infinite;
  --x:-50px;
  --y:-45px;
}
.particle-2 {
  width: 6px;
  height: 6px;
  background: #8b5cf6;
  animation: particle-initial 1s ease-out 0.35s forwards, particle-float-seamless 6.5s ease-in-out 1.35s infinite;
  --x:55px;
  --y:-40px;
}
.particle-3 {
  width: 10px;
  height: 10px;
  background: #ec4899;
  animation: particle-initial 1s ease-out 0.4s forwards, particle-float-seamless 7s ease-in-out 1.4s infinite;
  --x:-60px;
  --y:35px;
}
.particle-4 {
  width: 7px;
  height: 7px;
  background: #3b82f6;
  animation: particle-initial 1s ease-out 0.45s forwards, particle-float-seamless 6.3s ease-in-out 1.45s infinite;
  --x:50px;
  --y:50px;
}
.particle-5 {
  width: 5px;
  height: 5px;
  background: #22c55e;
  animation: particle-initial 1s ease-out 0.38s forwards, particle-float-seamless 6.8s ease-in-out 1.38s infinite;
  --x:-25px;
  --y:-60px;
}
.particle-6 {
  width: 8px;
  height: 8px;
  background: #f97316;
  animation: particle-initial 1s ease-out 0.42s forwards, particle-float-seamless 7.2s ease-in-out 1.42s infinite;
  --x:65px;
  --y:10px;
}
.particle-7 {
  width: 6px;
  height: 6px;
  background: #06b6d4;
  animation: particle-initial 1s ease-out 0.33s forwards, particle-float-seamless 6.4s ease-in-out 1.33s infinite;
  --x:30px;
  --y:-55px;
}
.particle-8 {
  width: 9px;
  height: 9px;
  background: #a855f7;
  animation: particle-initial 1s ease-out 0.48s forwards, particle-float-seamless 7.5s ease-in-out 1.48s infinite;
  --x:-65px;
  --y:-10px;
}

/* Initial particle burst */
@keyframes particle-initial {
  0% { opacity: 1; transform: translate(0,0) scale(0); }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(1); }
}

/* Seamless continuous float - fade to 0 before reset */
@keyframes particle-float-seamless {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  5% {
    opacity: 0.4;
    transform: translate(calc(var(--x) * 0.1), calc(var(--y) * 0.1)) scale(0.8);
  }
  20% {
    opacity: 0.7;
    transform: translate(calc(var(--x) * 0.35), calc(var(--y) * 0.35)) scale(1);
  }
  40% {
    opacity: 0.5;
    transform: translate(calc(var(--x) * 0.65), calc(var(--y) * 0.65)) scale(0.9);
  }
  60% {
    opacity: 0.3;
    transform: translate(calc(var(--x) * 0.85), calc(var(--y) * 0.85)) scale(0.7);
  }
  75% {
    opacity: 0.1;
    transform: translate(var(--x), var(--y)) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
}

/* Sparkles - seamless continuous twinkle */
.sparkle {
  position: absolute;
  font-size: 16px;
  opacity: 0;
  color: #fbbf24;
}

.sparkle-1 { animation: sparkle-initial 0.8s ease-out 0.5s forwards, sparkle-twinkle-seamless 4s ease-in-out 1.3s infinite; --x:-70px; --y:-30px; }
.sparkle-2 { animation: sparkle-initial 0.8s ease-out 0.6s forwards, sparkle-twinkle-seamless 4.5s ease-in-out 1.4s infinite; --x:70px; --y:-25px; }
.sparkle-3 { animation: sparkle-initial 0.8s ease-out 0.55s forwards, sparkle-twinkle-seamless 4.2s ease-in-out 1.35s infinite; --x:60px; --y:45px; }
.sparkle-4 { animation: sparkle-initial 0.8s ease-out 0.65s forwards, sparkle-twinkle-seamless 4.8s ease-in-out 1.45s infinite; --x:-60px; --y:50px; }

/* Initial sparkle burst */
@keyframes sparkle-initial {
  0% { opacity: 0; transform: translate(0,0) scale(0); }
  50% { opacity: 1; transform: translate(calc(var(--x)*0.8), calc(var(--y)*0.8)) scale(1.3); }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.5); }
}

/* Seamless continuous twinkle - complete fade before reset */
@keyframes sparkle-twinkle-seamless {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
  10% {
    opacity: 0.5;
    transform: translate(calc(var(--x) * 0.6), calc(var(--y) * 0.6)) scale(0.8) rotate(45deg);
  }
  30% {
    opacity: 0.9;
    transform: translate(var(--x), var(--y)) scale(1.2) rotate(90deg);
  }
  50% {
    opacity: 0.7;
    transform: translate(var(--x), var(--y)) scale(1) rotate(135deg);
  }
  70% {
    opacity: 0.4;
    transform: translate(calc(var(--x) * 0.7), calc(var(--y) * 0.7)) scale(0.7) rotate(180deg);
  }
  85% {
    opacity: 0.1;
    transform: translate(calc(var(--x) * 0.3), calc(var(--y) * 0.3)) scale(0.3) rotate(225deg);
  }
  100% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
}

/* Text */
.success-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  animation: text-fade-in 0.5s ease-out 0.8s both;
}

.success-subtitle {
  color: #6b7280;
  margin-bottom: 24px;
  animation: text-fade-in 0.5s ease-out 1s both;
}

@keyframes text-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slots */
.result-details {
  margin-bottom: 24px;
  animation: text-fade-in 0.5s ease-out 1.2s both;
}

.action-slot {
  display: flex;
  justify-content: center;
  animation: text-fade-in 0.5s ease-out 1.4s both;
}
</style>
