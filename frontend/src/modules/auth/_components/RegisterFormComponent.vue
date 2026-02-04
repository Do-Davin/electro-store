<template>
  <div class="register-form">
    <form @submit.prevent="onRegister">
      <UsernameFieldComponent v-model="email" placeholder="Email" />
      <PasswordFieldComponent v-model="password" placeholder="Password"/>
      <PasswordFieldComponent v-model="confirmPassword" placeholder="Confirm Password"/>

      <div v-if="error" class="message error-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ error }}</span>
      </div>

      <div v-if="success" class="message success-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ success }}</span>
      </div>

      <AuthButtonComponent
        label="Create Account"
        :loading="loading"
        loading-text="Creating account..."
        :disabled="!canSubmit"
      />
    </form>
  </div>
</template>

<script setup>
import UsernameFieldComponent from './UsernameFieldComponent.vue';
import PasswordFieldComponent from './PasswordFieldComponent.vue';
import AuthButtonComponent from './AuthButtonComponent.vue';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { http } from '@/lib/http';

const router = useRouter();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const canSubmit = computed(() => {
  return (
    email.value.trim().length > 0 &&
    password.value.trim().length >= 6 &&
    confirmPassword.value.trim().length >= 6
  );
});

async function onRegister() {
  if (loading.value || !canSubmit.value) return;
  error.value = '';
  success.value = '';

  if (!canSubmit.value) return;

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    loading.value = true;

    // role is optional; backend defaults to USER
    await http.post('/auth/register', {
      email: email.value.trim(),
      password: password.value,
    });

    success.value = 'Account created. Redirecting to login...';

    setTimeout(() => {
      router.push('/auth/login');
    }, 600);
  } catch (e) {
    error.value = e?.message || 'Register failed';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  background: rgba(254, 178, 178, 0.25);
  color: #ffffff;
  border: 1px solid rgba(254, 178, 178, 0.4);
}

.success-message {
  background: rgba(154, 230, 180, 0.25);
  color: #ffffff;
  border: 1px solid rgba(154, 230, 180, 0.4);
}

.message svg {
  flex-shrink: 0;
}
</style>
