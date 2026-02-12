<script setup>
const stats = [
  { value: "1200+", label: "Happy Customers" },
  { value: "500+", label: "Products Delivered" },
  { value: "15+", label: "Trusted Brands" },
  { value: "4.9★", label: "Customer Rating" },
]
</script>

<template>
  <section class="w-full py-16 bg-[#f8f9fc] dark:bg-[#000000]">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-primary mb-10">
        Our Store in Numbers
      </h2>

      <div
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8"
      >
        <div
          v-for="(stat, i) in stats"
          :key="i"
          v-aos="{ delay: i * 120 }"
          class="flex flex-col items-center text-center border rounded-xl p-6
          shadow-lg bg-white dark:bg-[#111111]
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:scale-[1.03]
          hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]
          hover:border-primary/60 hover:bg-white/90 dark:hover:bg-[#1a1a1a]
          hover:ring-1 hover:ring-primary/40 hover:ring-offset-2"
        >
          <p class="text-4xl font-extrabold text-primary">
            {{ stat.value }}
          </p>
          <p class="mt-2 text-gray-500 dark:text-gray-300 font-medium">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
