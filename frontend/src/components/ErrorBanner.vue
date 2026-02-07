<!--
  ErrorBanner.vue — Reusable inline error banner for contextual errors
  (e.g. payment failures, form errors) that appear within page content.

  Usage:
    <ErrorBanner v-if="error" :message="error" />
    <ErrorBanner v-if="error" title="Payment Error" :message="error" @dismiss="error = null" />
-->
<template>
  <div
    class="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
    role="alert"
  >
    <AlertCircle class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
    <div class="flex-1 min-w-0">
      <p v-if="title" class="font-medium text-red-700">{{ title }}</p>
      <p class="text-sm text-red-600" :class="{ 'mt-0.5': title }">
        {{ message }}
      </p>
    </div>
    <button
      v-if="dismissible"
      @click="$emit('dismiss')"
      class="shrink-0 text-red-400 hover:text-red-600 transition-colors"
      aria-label="Dismiss error"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { AlertCircle, X } from 'lucide-vue-next'

defineProps({
  /** Optional bold heading above the message */
  title: {
    type: String,
    default: '',
  },
  /** Error message text */
  message: {
    type: String,
    required: true,
  },
  /** Show a dismiss (×) button */
  dismissible: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['dismiss'])
</script>
