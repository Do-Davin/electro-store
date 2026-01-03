<template>
  <div class="button-wrap">
    <button class="auth-button">
      {{ label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  }
})
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
  border: 1.6px solid rgba(255,243,205,0.95);
  background: transparent;
  color: #FFF3CD;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  margin-top: 30px;
}
</style>
