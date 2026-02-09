<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="w-full bg-[#0a0a0a] text-primary py-12">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Follow Us -->
      <div>
        <p class="mb-4 text-lg font-semibold">Follow Us On</p>

        <div class="flex items-center gap-6 text-2xl">
          <a href="https://github.com/Do-Davin" class="hover:text-gray-300 transition" target="_blank" rel="noopener noreferrer">
            <Github />
          </a>
          <a href="#" class="hover:text-gray-300 transition">
            <Facebook />
          </a>
          <a href="#" class="hover:text-gray-300 transition">
            <Instagram />
          </a>
          <a href="#" class="hover:text-gray-300 transition">
            <Linkedin />
          </a>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-primary my-8" />

      <!-- Contact Us -->
      <div>
        <p class="mb-4 text-lg font-semibold">Contact Us</p>

        <div class="flex flex-wrap items-center gap-8 text-sm">
          <div class="flex items-center gap-2">
            <Phone />
            <span>071 711 7773</span>
          </div>

          <div class="flex items-center gap-2">
            <Phone />
            <span>076 214 7429</span>
          </div>

          <div class="flex items-center gap-2">
            <Mail />
            <span>dodavin96@gmail.com</span>
          </div>

          <div class="flex items-center gap-2">
            <Mail />
            <span>sereyvongtat@gmail.com</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-primary my-8" />

      <!-- Copyright -->
      <p class="text-center text-sm tracking-wide">
        COPYRIGHT 2025 © ELECTRO-STORE | All Rights Reserved
      </p>
    </div>
  </footer>
</template>

<script setup>
import { Github } from 'lucide-vue-next'
import { Facebook } from 'lucide-vue-next'
import { Instagram } from 'lucide-vue-next'
import { Linkedin } from 'lucide-vue-next'
import { Phone } from 'lucide-vue-next'
import { Mail } from 'lucide-vue-next'
</script>
