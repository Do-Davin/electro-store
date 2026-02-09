<template>
    <Transition name="toast">
      <div v-if="isVisible" :class="['toast-container', `toast-${type}`]" @click="close">
        <div class="toast-content">
          <div class="toast-icon">
            <svg
              v-if="type === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>

            <svg
              v-else-if="type === 'error'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>

            <svg
              v-else-if="type === 'warning'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>

            <svg
              v-else-if="type === 'info'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>

          <div class="toast-text">
            <h4 v-if="title" class="toast-title">{{ title }}</h4>
            <p class="toast-message">{{ message }}</p>
          </div>

          <button class="toast-close" @click.stop="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="toast-progress" :style="{ animationDuration: `${duration}ms` }"></div>
      </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(['close']);

const isVisible = ref(false);
let timeoutId = null;

const close = () => {
  isVisible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  setTimeout(() => {
    emit('close');
  }, 300);
};

onMounted(() => {
  isVisible.value = true;

  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<style>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  min-width: 320px;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9999;
  cursor: pointer;
  pointer-events: auto;
}

/* Stack toasts vertically */
[data-toast-id] {
  pointer-events: none;
}

[data-toast-id]:not(:first-of-type) .toast-container {
  margin-top: 12px;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #111827;
}

.toast-message {
  font-size: 0.875rem;
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.toast-progress {
  height: 4px;
  background: currentColor;
  opacity: 0.3;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Type-specific styles */
.toast-success {
  border-left: 4px solid #10b981;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-success .toast-progress {
  color: #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-error .toast-progress {
  color: #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-warning .toast-progress {
  color: #f59e0b;
}

.toast-info {
  border-left: 4px solid #003465;
}

.toast-info .toast-icon {
  color: #003465;
}

.toast-info .toast-progress {
  color: #003465;
}

/* Transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }
}
</style>
