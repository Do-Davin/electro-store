<template>
  <div class="auth-layout">
    <!-- Animated background -->
    <div class="bg-gradient"></div>
    <div class="bg-pattern"></div>

    <!-- Electric elements -->
    <div class="electric-container">
      <svg class="electric-bolt bolt-1" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="url(#gradient1)" stroke-width="1.5" fill="url(#gradient1)" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="electric-bolt bolt-2" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="url(#gradient2)" stroke-width="1.5" fill="url(#gradient2)" opacity="0.25"/>
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="electric-bolt bolt-3" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="url(#gradient3)" stroke-width="1.5" fill="url(#gradient3)" opacity="0.2"/>
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#34d399;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>

      <svg class="electric-bolt bolt-4" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="url(#gradient4)" stroke-width="1.5" fill="url(#gradient4)" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#818cf8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>

      <div class="electric-line line-1"></div>
      <div class="electric-line line-2"></div>
      <div class="electric-line line-3"></div>
      <div class="electric-line line-4"></div>
      <div class="electric-line line-5"></div>
    </div>

    <!-- Main content -->
    <div class="auth-container">
      <div class="auth-card">

        <!-- Header -->
        <div class="auth-header">
          <div class="logo-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <h1 class="auth-title">
            {{ $route.name === 'Register' ? 'Create Account' : 'Welcome Back' }}
          </h1>
          <p class="auth-subtitle">
            {{ $route.name === 'Register'
              ? 'Sign up to get started with your account'
              : 'Sign in to continue to your account' }}
          </p>
        </div>

        <!-- Form content -->
        <div class="form-wrapper">
          <router-view />
        </div>

        <!-- Guest access -->
        <div class="guest-section">
          <div class="divider">
            <span>OR</span>
          </div>
          <RouterLink to="/" class="guest-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Continue as Guest
          </RouterLink>
        </div>

        <!-- Footer toggle -->
        <div class="auth-footer">
          <span class="footer-text">
            {{ $route.name === 'Register'
              ? 'Already have an account?'
              : "Don't have an account?" }}
          </span>
          <RouterLink
            class="footer-link"
            :to="$route.name === 'Register' ? '/auth/login' : '/auth/register'"
          >
            {{ $route.name === 'Register' ? 'Sign In' : 'Sign Up' }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  background: #000000;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%);
  opacity: 0.95;
  z-index: 0;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 50%);
  z-index: 1;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
}

.electric-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
}

.electric-bolt {
  position: absolute;
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.6));
  animation: electricFloat 8s infinite ease-in-out, pulse 2s infinite ease-in-out;
}

.bolt-1 {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
  animation-duration: 10s, 2s;
}

.bolt-2 {
  top: 70%;
  right: 10%;
  animation-delay: 2s;
  animation-duration: 12s, 2.5s;
  width: 100px;
  height: 100px;
}

.bolt-3 {
  bottom: 15%;
  left: 8%;
  animation-delay: 4s;
  animation-duration: 11s, 2.2s;
  width: 90px;
  height: 90px;
}

.bolt-4 {
  top: 35%;
  right: 12%;
  animation-delay: 1s;
  animation-duration: 13s, 2.8s;
  width: 110px;
  height: 110px;
}

.electric-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
  animation: electricLine 3s infinite ease-in-out;
}

.line-1 {
  top: 25%;
  left: 0;
  width: 200px;
  animation-delay: 0s;
  transform: rotate(-15deg);
}

.line-2 {
  top: 55%;
  right: 0;
  width: 250px;
  animation-delay: 1s;
  transform: rotate(20deg);
}

.line-3 {
  top: 80%;
  left: 0;
  width: 180px;
  animation-delay: 2s;
  transform: rotate(10deg);
}

.line-4 {
  top: 15%;
  right: 0;
  width: 220px;
  animation-delay: 1.5s;
  transform: rotate(-25deg);
}

.line-5 {
  top: 45%;
  left: 50%;
  width: 150px;
  animation-delay: 0.5s;
  transform: rotate(45deg) translateX(-50%);
}

@keyframes electricFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(20px, -20px) rotate(5deg);
    opacity: 0.5;
  }
  50% {
    transform: translate(-15px, 15px) rotate(-5deg);
    opacity: 0.25;
  }
  75% {
    transform: translate(15px, 25px) rotate(3deg);
    opacity: 0.4;
  }
}

@keyframes pulse {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 35px rgba(96, 165, 250, 0.9));
  }
}

@keyframes electricLine {
  0% {
    transform: translateX(-100%) rotate(var(--rotation, 0deg));
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(100vw) rotate(var(--rotation, 0deg));
    opacity: 0;
  }
}

.shape {
  position: absolute;
  opacity: 0.15;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4a90e2, #7b68ee);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
  animation-duration: 25s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 20%;
  right: -150px;
  animation-delay: 2s;
  animation-duration: 30s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #f093fb, #4facfe);
  bottom: -80px;
  left: 10%;
  animation-delay: 4s;
  animation-duration: 22s;
}

.shape-4 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  bottom: 15%;
  right: 5%;
  animation-delay: 1s;
  animation-duration: 28s;
}

.shape-5 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #fa709a, #fee140);
  top: 40%;
  left: 5%;
  animation-delay: 3s;
  animation-duration: 20s;
}

.shape-6 {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, #30cfd0, #330867);
  top: 60%;
  right: 15%;
  animation-delay: 5s;
  animation-duration: 26s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

.auth-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: slideUp 0.6s ease-out;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-2px);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
  margin-top: 1.5rem;
}

.logo-circle {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 400;
}

.form-wrapper {
  margin-bottom: 1.5rem;
}

.guest-section {
  margin-bottom: 1.5rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.divider span {
  padding: 0 1rem;
  font-weight: 500;
}

.guest-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guest-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9375rem;
  margin-right: 0.375rem;
}

.footer-link {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.footer-link:hover::after {
  width: 100%;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .logo-circle {
    width: 56px;
    height: 56px;
  }

  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
