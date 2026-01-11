<template>
  <div class="button-wrap">
    <button
      class="auth-button"
      :type="type"
      :disabled="disabled || loading"
      @click="$emit('click')"
    >
      <span v-if="!loading">{{ label }}</span>
      <span v-else>{{ loadingText }}</span>
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

<style>
.button-wrap {
  width: 100%;
  display:flex;
  justify-content:center;
}

.auth-button {
  padding: 0.6rem 2.25rem;
  border-radius: 999px;
  border: 1.6px solid rgba(255, 243, 205, 0.95);
  background: transparent;
  color: #fff3cd;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  margin-top: 30px;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.auth-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
