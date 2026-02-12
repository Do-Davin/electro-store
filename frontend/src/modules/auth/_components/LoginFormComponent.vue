<template>
  <div class="login-form">
    <form @submit.prevent="onLogin">
      <UsernameFieldComponent v-model="email" placeholder="Email" />
      <PasswordFieldComponent v-model="password" placeholder="Password"/>

      <div v-if="error" class="message error-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ error }}</span>
      </div>

      <AuthButtonComponent
      label="Sign In"
          :loading="loading"
          loading-text="Signing in..."
          :disabled="!canSubmit"
      />
    </form>
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
import { useWishlistStore } from '@/modules/wishlist/_stores/wishlist.store';
import { useCartStore } from '@/modules/cart/_stores/cart.store';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const canSubmit = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length >= 6;
});

async function onLogin() {
  if (loading.value || !canSubmit.value) return;

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

    // Reload stores so they read from the new user's storage keys
    const wishlist = useWishlistStore();
    const cart = useCartStore();
    wishlist.loadFromStorage();
    cart.loadFromStorage();

    // Fetch live product data for wishlist badge
    wishlist.refreshProducts();

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

.error-message svg {
  flex-shrink: 0;
}
</style>
