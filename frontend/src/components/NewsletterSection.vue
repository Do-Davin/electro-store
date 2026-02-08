<template>
  <section class="w-full py-16 bg-white dark:bg-[#0b2447]">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-primary mb-4">
        Stay Updated
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mb-8 text-sm sm:text-base leading-relaxed">
        Subscribe to get the latest product updates, exclusive deals, and special offers.
      </p>

      <form
        class="flex flex-col sm:flex-row gap-4 justify-center"
        @submit.prevent="handleSubmit"
      >
        <input
          type="email"
          placeholder="Enter your email"
          v-model.trim="email"
          :disabled="isLoading"
          class="px-5 py-3 rounded-xl border w-full sm:w-82.5
          focus:outline-none focus:ring-2 focus:ring-primary
          bg-white dark:bg-[#132a4f] dark:text-white"
        />

        <button
          type="submit"
          :disabled="isLoading"
          class="bg-primary text-white font-semibold px-6 py-3 rounded-xl
          hover:bg-[#004a9f] transition-transform duration-200
          hover:scale-[1.03] active:scale-95 shadow-md"
        >
          {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </form>

      <!-- Fixed height message container to prevent layout shift -->
      <div class="mt-4 min-h-6">
        <p
          v-show="successMessage"
          class="text-sm text-green-600 dark:text-green-400"
        >
          {{ successMessage }}
        </p>
        <p
          v-show="errorMessage"
          class="text-sm text-red-600 dark:text-red-400"
        >
          {{ errorMessage }}
        </p>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        We care about your privacy. No spam 💙
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { http } from '@/lib/http.js';

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!email.value) {
    errorMessage.value = 'Please enter your email.';
    return;
  }

  isLoading.value = true;
  try {
    const res = await http.post('/newsletter', { email: email.value });
    successMessage.value = res?.message || 'Subscribed successfully.';
    email.value = '';
  } catch (error) {
    errorMessage.value = error?.message || 'Subscription failed.';
  } finally {
    isLoading.value = false;
  }
};
</script>
