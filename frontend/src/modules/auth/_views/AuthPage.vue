<template>
  <div class="auth-layout">
    <div class="welcome-text">Welcome</div>
    <div class="diamond-container">
      <div class="diamond">
        <div class="form-content">
          <router-view />
        </div>
      </div>
    </div>

    <div class="signup-below">
      <span>
        {{$route.name === 'Register'
          ? 'Already have an account?'
          : "Don't have an account yet?"}}
      </span>

      <RouterLink
        class="signup-link"
        :to="$route.name === 'Register' ? '/auth/login' : '/auth/register'"
      >
        {{$route.name === 'Register' ? 'Login' : 'Sign Up'}}
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: #003465;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.welcome-text {
  position: absolute;
  top: 4rem;
  left: 5rem;
  font-size: 2.5rem;
  font-weight: 600;
  color: #FFF3CD;
  z-index: 10;
}

.diamond-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.diamond {
  width: 560px;
  height: 560px;
  transform: rotate(45deg);
  border: 2px solid #FFF3CD;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.form-content {
  height: 100%;
  transform: rotate(-45deg);
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.signup-below {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #FFF3CD;
  font-size: 0.95rem;
  z-index: 20;
}

.signup-below .signup-link {
  color: #ffffff;
  text-decoration: underline;
  margin-left: 0.25rem;
}

.signup-below .signup-link:hover {
  color: rgba(230, 210, 160, 0.95);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .welcome-text {
    top: 2rem;
    left: 2rem;
    font-size: 2rem;
  }

  .diamond {
    width: 400px;
    height: 400px;
  }

  .form-content {
    width: 280px;
  }
}

@media (max-width: 480px) {
  .diamond {
    width: 320px;
    height: 320px;
  }

  .form-content {
    width: 240px;
  }
}
</style>
