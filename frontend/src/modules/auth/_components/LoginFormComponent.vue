<template>
  <div class="login-form">
    <UsernameFieldComponent v-model="email" placeholder="Username" />
    <PasswordFieldComponent v-model="password" placeholder="Password"/>

    <p v-if="error" class="error">{{ error }}</p>

    <AuthButtonComponent
      label="Login"
      :loading="loading"
      loading-text="Logging in..."
      :disabled="!canSubmit"
      @click="onLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import UsernameFieldComponent from './UsernameFieldComponent.vue';
import PasswordFieldComponent from './PasswordFieldComponent.vue';
import AuthButtonComponent from './AuthButtonComponent.vue';
import { http } from '@/lib/http';
import { setAccessToken, getRole } from '@/lib/auth';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const canSubmit = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length >= 6;
});

async function onLogin() {
  error.value = '';
  if (!canSubmit.value) return;

  try {
    loading.value = true;

    const res = await http.post('/auth/login', {
      email: email.value.trim(),
      password: password.value,
    });

    // Backend returns: { access_token: "..." }
    if (!res?.access_token) throw new Error('Missing access_token from server');

    setAccessToken(res.access_token);

    // Redirect based on role
    const role = getRole();
    if (role === 'ADMIN') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  } catch (e) {
    error.value = e?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-form {
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
</style>
