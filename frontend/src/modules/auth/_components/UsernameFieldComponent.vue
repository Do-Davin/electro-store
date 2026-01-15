<template>
  <div class="input-group">
    <svg
      class="input-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="M22 6l-10 7L2 6"></path>

    </svg>

    <input
      :type="type"
      :placeholder="placeholder"
      class="form-input"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      autocomplete="email"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: 'Email' },
});

defineEmits(['update:modelValue']);
</script>

<style>
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
  color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  margin-top: 15px;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem;
  border-radius: 999px;
  border: 1.6px solid rgba(255, 243, 205, 0.95);
  background: rgba(0, 0, 0, 0);
  color: #fff3cd;
  font-size: 1rem;
  outline: none;
  margin-top: 30px;
}

.form-input::placeholder {
  color: rgba(255, 243, 205, 0.8);
}
</style>
