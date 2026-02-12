<script setup>
import { Truck, ShieldCheck, CreditCard, Wrench } from 'lucide-vue-next'

const features = [
  {
    title: 'Fast Delivery',
    desc: 'Quick and reliable shipping to your doorstep.',
    icon: Truck,
  },
  {
    title: '100% Genuine Products',
    desc: 'Only original and verified electronics.',
    icon: ShieldCheck,
  },
  {
    title: 'Secure Payment',
    desc: 'Protected transactions with trusted gateways.',
    icon: CreditCard,
  },
  {
    title: '1-Year Warranty',
    desc: 'We’ve got you covered with warranty support.',
    icon: Wrench,
  },
]
</script>

<template>
  <section class="w-full py-16 bg-[#f8f9fc] dark:bg-[#000000]">
    <div class="max-w-6xl mx-auto px-6">
      <h2
        class="text-3xl font-bold text-center text-primary mb-10"
        v-aos
      >
        Why Buy From Us?
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(item, i) in features"
          :key="i"
          v-aos="{ delay: i * 120 }"
          class="flex flex-col items-center text-center border rounded-xl p-6
          shadow-lg bg-white dark:bg-[#111111]
          transition-all duration-300 ease-out
          hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]
          hover:-translate-y-1 hover:scale-[1.02]
          hover:border-primary/50 hover:bg-white/90 dark:hover:bg-[#1a1a1a]
          hover:ring-1 hover:ring-primary/40 hover:ring-offset-2"
        >
          <component :is="item.icon" class="w-10 h-10 text-primary mb-3" />

          <h3 class="text-lg font-semibold text-primary">
            {{ item.title }}
          </h3>

          <p class="text-gray-500 dark:text-gray-300 text-sm mt-1">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
