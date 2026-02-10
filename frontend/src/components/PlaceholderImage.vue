<script setup>
defineProps({
  iconSize: { type: [Number, String], default: 48 },
  containerClass: { type: String, default: '' },
})
</script>

<template>
  <div
    class="flex items-center justify-center bg-[#1a1a1a] text-gray-500 rounded-xl select-none"
    :class="containerClass"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Image icon -->
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  </div>
</template>
