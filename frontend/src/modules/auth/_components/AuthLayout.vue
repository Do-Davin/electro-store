<template>
  <div class="auth-layout">
    <div class="welcome-text">Welcome</div>
    <div class="diamond-container">
      <div class="diamond">
        <div class="form-content">
          <slot></slot>
        </div>
      </div>
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
  width: 500px;
  height: 500px;
  transform: rotate(45deg);
  border: 2px solid #FFF3CD;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.form-content {
  transform: rotate(-45deg);
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
