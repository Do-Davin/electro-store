<template>
  <section class="w-full py-16 bg-white dark:bg-[#0b2447]">
    <div class="max-w-6xl mx-auto px-6">

      <h2
        class="text-3xl font-bold text-primary text-center mb-6"
        v-aos
      >
        Secure & Convenient Payment Methods
      </h2>

      <p
        class="text-center text-gray-600 dark:text-gray-300 mb-10"
        v-aos
      >
        We support trusted global payment gateways to
        ensure safe and seamless checkout.
      </p>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        <div
          v-for="(item, i) in payments"
          :key="i"
          v-aos
          class="flex flex-col items-center justify-center border rounded-xl p-6
                 bg-white dark:bg-[#132a4f]
                 shadow-md transition-all duration-300 ease-out
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]
                 hover:-translate-y-1 hover:scale-[1.02]
                 hover:border-primary/50 hover:bg-white/90
                 dark:hover:bg-[#1b376d]
                 hover:ring-1 hover:ring-primary/40 hover:ring-offset-2"
        >
          <img
            :src="item.logo"
            class="h-10 object-contain mb-3"
            alt="Payment Method"
          />
          <span class="font-semibold text-gray-800 dark:text-white">
            {{ item.name }}
          </span>
        </div>
      </div>

      <p class="text-center mt-8 text-sm text-gray-500 dark:text-gray-300 flex items-center justify-center gap-2">
        <Lock class="text-primary w-4 h-4" />
        <span>Your payment information is encrypted and protected.</span>
      </p>

    </div>
  </section>
</template>

<script setup>
  import { Lock } from 'lucide-vue-next';
  const payments = [
    { name: "Visa", logo: "/payments/visa.png" },
    { name: "MasterCard", logo: "/payments/mastercard.png" },
    { name: "KhQr", logo: "/payments/khqr.png" },
    { name: "Apple Pay", logo: "/payments/applepay.png" },
  ]
</script>
