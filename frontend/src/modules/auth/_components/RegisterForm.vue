<template>
  <div class="register-form">
    <div class="input-group">
      <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <input type="text" placeholder="Username" class="form-input" />
    </div>

    <div class="input-group">
      <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <input type="password" placeholder="Password" class="form-input" />
    </div>

    <div class="input-group">
      <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <input type="password" placeholder="Password again" class="form-input" />
    </div>

    <div class="button-wrap">
      <button class="register-button">Sign Up</button>
    </div>
  </div>
</template>

<style scoped>
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 60px;
}

.input-group {
  position: relative;
  width: 100%;
  margin: 5px;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.9);
  pointer-events: none;
  margin-top: 15px;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem;
  border-radius: 999px;
  border: 1.6px solid rgba(255,243,205,0.95);
  background: rgba(0,0,0,0);
  color: #FFF3CD;
  font-size: 1rem;
  outline: none;
  margin-top: 30px;
}

.form-input::placeholder { color: rgba(255,243,205,0.8); }

.button-wrap { width: 100%; display:flex; justify-content:center; }

.register-button {
  padding: 0.6rem 2.25rem;
  border-radius: 999px;
  border: 1.6px solid rgba(255,243,205,0.95);
  background: transparent;
  color: #FFF3CD;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  margin-top: 30px;
}

@media (max-width: 768px) {
  .form-input { padding-left: 2.6rem; }
}

</style>

<script setup>
</script>
