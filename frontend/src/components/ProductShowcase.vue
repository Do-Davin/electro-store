<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="showcase">
    <!-- Ambient glow orbs -->
    <div class="showcase__orb showcase__orb--1"></div>
    <div class="showcase__orb showcase__orb--2"></div>
    <div class="showcase__orb showcase__orb--3"></div>

    <!-- Grid lines background -->
    <div class="showcase__grid"></div>

    <div class="showcase__container">
      <!-- Left: Text content -->
      <div class="showcase__text">
        <span class="showcase__badge">
          <span class="showcase__badge-dot"></span>
          New Arrival
        </span>

        <h2 class="showcase__title">
          iPhone Air
          <span class="showcase__title-gradient">Impossibly Thin.</span>
        </h2>

        <p class="showcase__description">
          The thinnest Apple product ever. Featuring the powerful A19 chip,
          a stunning 6.6" display, and an aerospace-grade titanium design
          that redefines what a smartphone can be.
        </p>

        <div class="showcase__features">
          <div class="showcase__feature">
            <div class="showcase__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <span class="showcase__feature-label">A19 Chip</span>
              <span class="showcase__feature-sub">Blazing Performance</span>
            </div>
          </div>
          <div class="showcase__feature">
            <div class="showcase__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
            </div>
            <div>
              <span class="showcase__feature-label">6.6" Display</span>
              <span class="showcase__feature-sub">Super Retina XDR</span>
            </div>
          </div>
          <div class="showcase__feature">
            <div class="showcase__feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <span class="showcase__feature-label">All-Day Battery</span>
              <span class="showcase__feature-sub">Up to 26 Hours</span>
            </div>
          </div>
        </div>

        <div class="showcase__cta">
          <RouterLink to="/products" class="showcase__btn-primary">
            Explore
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <RouterLink to="/products" class="showcase__btn-outline">
            View All Phones
          </RouterLink>
        </div>
      </div>

      <!-- Right: Animated iPhone GIF -->
      <div class="showcase__visual">
        <div class="showcase__glow-ring"></div>
        <div class="showcase__glow-ring showcase__glow-ring--2"></div>

        <div class="showcase__phone-wrapper">
          <div class="showcase__glass-border"></div>
          <img
            src="/products/iphone-air-ani.gif"
            alt="iPhone Air - Animated Preview"
            class="showcase__phone"
            loading="lazy"
          />
        </div>

        <!-- Floating specs -->
        <div class="showcase__floating-tag showcase__floating-tag--top">
          <span>5.5mm thin</span>
        </div>
        <div class="showcase__floating-tag showcase__floating-tag--bottom">
          <span>Titanium</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  position: relative;
  background: #000;
  overflow: hidden;
  padding: 100px 60px;
  min-height: 90vh;
  display: flex;
  align-items: center;
}

/* Ambient glow orbs */
.showcase__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.showcase__orb--1 {
  width: 500px;
  height: 500px;
  background: rgba(255, 140, 66, 0.07);
  top: -100px;
  right: 10%;
  animation: orbFloat1 12s ease-in-out infinite;
}

.showcase__orb--2 {
  width: 400px;
  height: 400px;
  background: rgba(120, 80, 255, 0.06);
  bottom: -80px;
  left: 5%;
  animation: orbFloat2 15s ease-in-out infinite;
}

.showcase__orb--3 {
  width: 300px;
  height: 300px;
  background: rgba(0, 180, 255, 0.05);
  top: 40%;
  left: 45%;
  animation: orbFloat3 10s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 40px) scale(1.1); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.15); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, -25px) scale(0.9); }
}

/* Subtle grid background */
.showcase__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%);
}

/* Container */
.showcase__container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  width: 100%;
  z-index: 1;
  position: relative;
}

/* Text side */
.showcase__text {
  flex: 1;
  max-width: 560px;
}

.showcase__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 100px;
  background: rgba(255, 140, 66, 0.08);
  border: 1px solid rgba(255, 140, 66, 0.15);
  color: #ff8c42;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 28px;
}

.showcase__badge-dot {
  width: 6px;
  height: 6px;
  background: #ff8c42;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.showcase__title {
  font-size: 54px;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.showcase__title-gradient {
  display: block;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b9d 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.showcase__description {
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 36px;
  max-width: 480px;
}

/* Features */
.showcase__features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.showcase__feature {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.showcase__feature:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 140, 66, 0.15);
  transform: translateX(6px);
}

.showcase__feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 140, 66, 0.12), rgba(255, 107, 157, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff8c42;
  flex-shrink: 0;
}

.showcase__feature-label {
  display: block;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.showcase__feature-sub {
  display: block;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  margin-top: 2px;
}

/* CTAs */
.showcase__cta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.showcase__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(255, 140, 66, 0.25);
  position: relative;
  overflow: hidden;
}

.showcase__btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.5s;
}

.showcase__btn-primary:hover::before {
  left: 100%;
}

.showcase__btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 140, 66, 0.35);
}

.showcase__btn-primary:active {
  transform: translateY(0) scale(0.97);
}

.showcase__btn-outline {
  padding: 15px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  background: transparent;
}

.showcase__btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

/* Visual / GIF side */
.showcase__visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 500px;
}

.showcase__glow-ring {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  border: 1px solid rgba(255, 140, 66, 0.08);
  animation: ringPulse 4s ease-in-out infinite;
}

.showcase__glow-ring--2 {
  width: 550px;
  height: 550px;
  border-color: rgba(192, 132, 252, 0.05);
  animation-delay: 2s;
  animation-duration: 5s;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.4; }
}

.showcase__phone-wrapper {
  position: relative;
  animation: phoneFloat 6s ease-in-out infinite;
}

.showcase__phone {
  max-width: 580px;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
}

/* Orange glass border */
.showcase__glass-border {
  position: absolute;
  inset: -2px;
  border-radius: 22px;
  border: 1.5px solid rgba(255, 140, 66, 0.5);
  box-shadow:
    0 0 20px rgba(255, 140, 66, 0.15),
    0 0 50px rgba(255, 140, 66, 0.07);
  z-index: 2;
  pointer-events: none;
}

/* Floating tags */
.showcase__floating-tag {
  position: absolute;
  z-index: 3;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
  animation: tagFloat 5s ease-in-out infinite;
}

.showcase__floating-tag--top {
  top: 10%;
  right: 5%;
  background: rgba(255, 140, 66, 0.12);
  border: 1px solid rgba(255, 140, 66, 0.2);
  color: #ff8c42;
  animation-delay: 0s;
}

.showcase__floating-tag--bottom {
  bottom: 15%;
  left: 8%;
  background: rgba(192, 132, 252, 0.1);
  border: 1px solid rgba(192, 132, 252, 0.2);
  color: #c084fc;
  animation-delay: 2.5s;
}

@keyframes tagFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(1deg); }
  75% { transform: translateY(6px) rotate(-1deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .showcase {
    padding: 80px 40px;
  }

  .showcase__container {
    gap: 50px;
  }

  .showcase__title {
    font-size: 42px;
  }

  .showcase__phone {
    max-width: 460px;
  }
}

@media (max-width: 768px) {
  .showcase {
    padding: 70px 24px;
    min-height: auto;
  }

  .showcase__container {
    flex-direction: column-reverse;
    text-align: center;
    gap: 40px;
  }

  .showcase__text {
    max-width: 100%;
  }

  .showcase__title {
    font-size: 36px;
  }

  .showcase__description {
    max-width: 100%;
  }

  .showcase__features {
    align-items: center;
  }

  .showcase__feature {
    width: 100%;
    max-width: 360px;
  }

  .showcase__cta {
    justify-content: center;
    flex-wrap: wrap;
  }

  .showcase__visual {
    min-height: 350px;
  }

  .showcase__phone {
    max-width: 380px;
  }

  .showcase__glow-ring {
    width: 280px;
    height: 280px;
  }

  .showcase__glow-ring--2 {
    width: 380px;
    height: 380px;
  }

  .showcase__floating-tag--top {
    right: 0;
  }

  .showcase__floating-tag--bottom {
    left: 0;
  }
}

@media (max-width: 480px) {
  .showcase__title {
    font-size: 28px;
  }

  .showcase__btn-primary,
  .showcase__btn-outline {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .showcase__phone {
    max-width: 300px;
  }
}
</style>
