<template>
  <div class="register-form">
    <UsernameFieldComponent v-model="email" placeholder="Email" />
    <PasswordFieldComponent v-model="password" placeholder="Password"/>
    <PasswordFieldComponent v-model="confirmPassword" placeholder="Confirm Password"/>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <AuthButtonComponent
      label="Sign Up"
      :loading="loading"
      loading-text="Creating..."
      :disabled="!canSubmit"
      @click="onRegister"
    />
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

<style>
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 60px;
}

.error {
  margin-top: 8px;
  color: #ffb4b4;
  font-size: 0.95rem;
}

.success {
  margin-top: 8px;
  color: #7dffb4;
  font-size: 0.95rem;
}
</style>
