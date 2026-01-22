<template>
  <div class="button-wrap">
    <button
      class="auth-button"
      :type="type"
      :disabled="disabled || loading"
      @click="$emit('click')"
    >
      <span v-if="loading" class="spinner"></span>
      <span class="button-text">{{ loading ? loadingText : label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Please wait...' },
});

defineEmits(['click']);
</script>

<style scoped>
.button-wrap {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #003465;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.auth-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 52, 101, 0.1), transparent);
  transition: left 0.5s ease;
}

.auth-button:hover::before {
  left: 100%;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 1);
}

.auth-button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.button-text {
  position: relative;
  z-index: 1;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 52, 101, 0.3);
  border-top-color: #003465;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
