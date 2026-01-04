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
        @submit.prevent
      >
        <input
          type="email"
          placeholder="Enter your email"
          class="px-5 py-3 rounded-xl border w-full sm:w-82.5
          focus:outline-none focus:ring-2 focus:ring-primary
          bg-white dark:bg-[#132a4f] dark:text-white"
        />

        <button
          class="bg-primary text-white font-semibold px-6 py-3 rounded-xl
          hover:bg-[#004a9f] transition-transform duration-200
          hover:scale-[1.03] active:scale-95 shadow-md"
        >
          Subscribe
        </button>
      </form>

      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        We care about your privacy. No spam 💙
      </p>
    </div>
  </section>
</template>

<script setup>
// Backend later
</script>
