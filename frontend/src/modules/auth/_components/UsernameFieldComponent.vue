<template>
  <div class="input-group">
    <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    <input
      :type="type"
      :placeholder="placeholder"
      class="form-input"
    />
  </div>
</template>

<script setup>
defineProps({
  type: { default: 'text' },
  placeholder: String
})
</script>

<style>
.input-group {
  position: relative;
  width: 100%;
  margin: 5px;
  /* margin: 8px 0; */
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
  /* margin-top: 15px; */
}

.form-input::placeholder { color: rgba(255,243,205,0.8); }
</style>
