<template>
  <section class="w-full py-14 bg-white dark:bg-[#0b2447]">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-primary text-center mb-10">
        Trusted By Top Brands
      </h2>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5
        gap-8 place-items-center"
      >
        <div
          v-for="(brand, i) in brands"
          :key="i"
          class="w-36 grayscale hover:grayscale-0 transition
          duration-300 opacity-80 hover:opacity-100"
        >
          <img :src="brand.logo" :alt="brand.name" class="w-full
          object-contain" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const brands = [
  { name: 'Apple', logo: '/public/brands/apple.png' },
  { name: 'Samsung', logo: '/public/brands/samsung.svg' },
  { name: 'Dell', logo: '/public/brands/dell.png' },
  { name: 'Sony', logo: '/public/brands/sony.png' },
  { name: 'Lenovo', logo: '/public/brands/lenovo.png' },
]
</script>
