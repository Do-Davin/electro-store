<template>
  <div class="result-card cancelled">
    <!-- Cancelled Animation -->
    <div class="cancelled-animation-wrapper">
      <!-- Shockwave rings -->
      <div class="shockwave-ring shockwave-1"></div>
      <div class="shockwave-ring shockwave-2"></div>
      <div class="shockwave-ring shockwave-3"></div>

      <!-- Falling particles (debris) -->
      <div class="debris debris-1"></div>
      <div class="debris debris-2"></div>
      <div class="debris debris-3"></div>
      <div class="debris debris-4"></div>
      <div class="debris debris-5"></div>
      <div class="debris debris-6"></div>
      <div class="debris debris-7"></div>
      <div class="debris debris-8"></div>

      <!-- Warning flashes -->
      <div class="flash flash-1">!</div>
      <div class="flash flash-2">!</div>
      <div class="flash flash-3">!</div>
      <div class="flash flash-4">!</div>

      <!-- Main cancelled badge -->
      <div class="cancelled-badge">
        <div class="badge-glow"></div>
        <svg class="x-icon" viewBox="0 0 24 24" fill="none">
          <path
            class="x-path-1"
            d="M6 6L18 18"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            class="x-path-2"
            d="M18 6L6 18"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- Text -->
    <h2 class="cancelled-title">{{ title }}</h2>
    <p class="cancelled-subtitle">{{ subtitle }}</p>

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
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
/* Base container */
.result-card {
  text-align: center;
  padding: 40px 20px;
}

/* Animation wrapper */
.cancelled-animation-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Shockwave rings — red/salmon tones */
.shockwave-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ef4444;
  opacity: 0;
}

.shockwave-1 {
  animation: shockwave-initial 1.2s ease-out 0.15s forwards,
             shockwave-continuous 5s ease-in-out 1.35s infinite;
}
.shockwave-2 {
  animation: shockwave-initial 1.2s ease-out 0.35s forwards,
             shockwave-continuous 5s ease-in-out 1.55s infinite;
}
.shockwave-3 {
  animation: shockwave-initial 1.2s ease-out 0.55s forwards,
             shockwave-continuous 5s ease-in-out 1.75s infinite;
}

@keyframes shockwave-initial {
  0% {
    transform: scale(1);
    opacity: 0.6;
    border-width: 2.5px;
  }
  70% {
    opacity: 0.12;
    border-width: 1px;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

@keyframes shockwave-continuous {
  0% {
    transform: scale(1);
    opacity: 0;
    border-width: 2px;
  }
  10% {
    opacity: 0.35;
  }
  30% {
    opacity: 0.2;
    border-width: 1.5px;
  }
  60% {
    opacity: 0.08;
    border-width: 1px;
  }
  85% {
    opacity: 0.02;
    border-width: 0.5px;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-width: 0.5px;
  }
}

/* Cancelled badge */
.cancelled-badge {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ef4444, #b91c1c);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0);
  animation: badge-shake-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards,
             badge-tremble 4s ease-in-out 1s infinite;
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.4);
}

.badge-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.35),
    transparent 60%
  );
  animation: glow-pulse-red 2s ease-in-out 1s infinite;
}

/* Badge enters with a slight shake */
@keyframes badge-shake-in {
  0% {
    transform: scale(0) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(-4deg);
  }
  70% {
    transform: scale(0.95) rotate(3deg);
  }
  85% {
    transform: scale(1.05) rotate(-1deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Continuous subtle tremble */
@keyframes badge-tremble {
  0% {
    transform: scale(1) rotate(0deg);
  }
  15% {
    transform: scale(1.01) rotate(-0.8deg);
  }
  30% {
    transform: scale(1.02) rotate(0.6deg);
  }
  50% {
    transform: scale(1.01) rotate(-0.4deg);
  }
  70% {
    transform: scale(1.02) rotate(0.5deg);
  }
  85% {
    transform: scale(1.01) rotate(-0.3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes glow-pulse-red {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.6;
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.x-icon {
  width: 44px;
  height: 44px;
  z-index: 1;
}

/* Draw X: first stroke */
.x-path-1 {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: draw-x 0.35s ease-out 0.55s forwards;
}

/* Draw X: second stroke (slightly delayed) */
.x-path-2 {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: draw-x 0.35s ease-out 0.75s forwards;
}

@keyframes draw-x {
  to {
    stroke-dashoffset: 0;
  }
}

/* Debris particles — darker, warm tones */
.debris {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
}

.debris-1 {
  width: 8px;
  height: 8px;
  background: #f87171;
  animation: debris-initial 1s ease-out 0.3s forwards,
             debris-float 6s ease-in-out 1.3s infinite;
  --x: -50px;
  --y: -45px;
}
.debris-2 {
  width: 6px;
  height: 6px;
  background: #fbbf24;
  animation: debris-initial 1s ease-out 0.35s forwards,
             debris-float 6.5s ease-in-out 1.35s infinite;
  --x: 55px;
  --y: -40px;
}
.debris-3 {
  width: 10px;
  height: 10px;
  background: #ef4444;
  animation: debris-initial 1s ease-out 0.4s forwards,
             debris-float 7s ease-in-out 1.4s infinite;
  --x: -60px;
  --y: 35px;
}
.debris-4 {
  width: 7px;
  height: 7px;
  background: #f97316;
  animation: debris-initial 1s ease-out 0.45s forwards,
             debris-float 6.3s ease-in-out 1.45s infinite;
  --x: 50px;
  --y: 50px;
}
.debris-5 {
  width: 5px;
  height: 5px;
  background: #dc2626;
  animation: debris-initial 1s ease-out 0.38s forwards,
             debris-float 6.8s ease-in-out 1.38s infinite;
  --x: -25px;
  --y: -60px;
}
.debris-6 {
  width: 8px;
  height: 8px;
  background: #fb923c;
  animation: debris-initial 1s ease-out 0.42s forwards,
             debris-float 7.2s ease-in-out 1.42s infinite;
  --x: 65px;
  --y: 10px;
}
.debris-7 {
  width: 6px;
  height: 6px;
  background: #fca5a5;
  animation: debris-initial 1s ease-out 0.33s forwards,
             debris-float 6.4s ease-in-out 1.33s infinite;
  --x: 30px;
  --y: -55px;
}
.debris-8 {
  width: 9px;
  height: 9px;
  background: #b91c1c;
  animation: debris-initial 1s ease-out 0.48s forwards,
             debris-float 7.5s ease-in-out 1.48s infinite;
  --x: -65px;
  --y: -10px;
}

/* Initial debris burst */
@keyframes debris-initial {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(0);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(1);
  }
}

/* Seamless continuous float */
@keyframes debris-float {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  5% {
    opacity: 0.4;
    transform: translate(calc(var(--x) * 0.1), calc(var(--y) * 0.1)) scale(0.8);
  }
  20% {
    opacity: 0.6;
    transform: translate(calc(var(--x) * 0.35), calc(var(--y) * 0.35)) scale(1);
  }
  40% {
    opacity: 0.45;
    transform: translate(calc(var(--x) * 0.65), calc(var(--y) * 0.65)) scale(0.9);
  }
  60% {
    opacity: 0.25;
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

/* Warning flashes — exclamation marks */
.flash {
  position: absolute;
  font-size: 14px;
  font-weight: 900;
  opacity: 0;
  color: #fbbf24;
}

.flash-1 {
  animation: flash-initial 0.8s ease-out 0.5s forwards,
             flash-blink 4s ease-in-out 1.3s infinite;
  --x: -70px;
  --y: -30px;
}
.flash-2 {
  animation: flash-initial 0.8s ease-out 0.6s forwards,
             flash-blink 4.5s ease-in-out 1.4s infinite;
  --x: 70px;
  --y: -25px;
}
.flash-3 {
  animation: flash-initial 0.8s ease-out 0.55s forwards,
             flash-blink 4.2s ease-in-out 1.35s infinite;
  --x: 60px;
  --y: 45px;
}
.flash-4 {
  animation: flash-initial 0.8s ease-out 0.65s forwards,
             flash-blink 4.8s ease-in-out 1.45s infinite;
  --x: -60px;
  --y: 50px;
}

@keyframes flash-initial {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(calc(var(--x) * 0.8), calc(var(--y) * 0.8)) scale(1.3);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) scale(0.5);
  }
}

@keyframes flash-blink {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
  10% {
    opacity: 0.5;
    transform: translate(calc(var(--x) * 0.6), calc(var(--y) * 0.6)) scale(0.8)
      rotate(15deg);
  }
  30% {
    opacity: 0.9;
    transform: translate(var(--x), var(--y)) scale(1.2) rotate(-10deg);
  }
  50% {
    opacity: 0.6;
    transform: translate(var(--x), var(--y)) scale(1) rotate(5deg);
  }
  70% {
    opacity: 0.3;
    transform: translate(calc(var(--x) * 0.7), calc(var(--y) * 0.7)) scale(0.7)
      rotate(-5deg);
  }
  85% {
    opacity: 0.1;
    transform: translate(calc(var(--x) * 0.3), calc(var(--y) * 0.3)) scale(0.3)
      rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
}

/* Text */
.cancelled-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  animation: text-fade-in 0.5s ease-out 0.8s both;
}

.cancelled-subtitle {
  color: #6b7280;
  margin-bottom: 24px;
  animation: text-fade-in 0.5s ease-out 1s both;
}

@keyframes text-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
