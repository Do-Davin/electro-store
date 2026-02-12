<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { Github, Facebook, Instagram, Linkedin, Phone, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="w-full bg-[#0a0a0a] text-primary border-t border-primary/20">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <!-- Brand Section -->
        <div class="space-y-4">
          <h3 class="logo__title-gradient text-2xl font-bold tracking-tight">ELECTRO-STORE</h3>
          <p class="text-primary/70 text-sm leading-relaxed">
            Your trusted destination for quality electronics and accessories.
            We bring innovation to your doorstep.
          </p>
        </div>

        <!-- Contact Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold tracking-wide">Contact Us</h4>
          <div class="space-y-3">
            <a href="tel:0717117773" class="flex items-center gap-3 text-sm text-primary/80 hover:text-primary transition-colors group">
              <Phone class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>071 711 7773</span>
            </a>
            <a href="tel:0762147429" class="flex items-center gap-3 text-sm text-primary/80 hover:text-primary transition-colors group">
              <Phone class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>076 214 7429</span>
            </a>
            <a href="mailto:dodavin96@gmail.com" class="flex items-center gap-3 text-sm text-primary/80 hover:text-primary transition-colors group">
              <Mail class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>dodavin96@gmail.com</span>
            </a>
            <a href="mailto:sereyvongtat@gmail.com" class="flex items-center gap-3 text-sm text-primary/80 hover:text-primary transition-colors group">
              <Mail class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>sereyvongtat@gmail.com</span>
            </a>
          </div>
        </div>

        <!-- Social Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold tracking-wide">Follow Us</h4>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/Do-Davin"
              class="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all group"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github class="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all group"
              aria-label="Facebook"
            >
              <Facebook class="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all group"
              aria-label="Instagram"
            >
              <Instagram class="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all group"
              aria-label="LinkedIn"
            >
              <Linkedin class="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-primary/20">
        <p class="text-center text-sm text-primary/60 tracking-wide">
          © 2025 ELECTRO-STORE. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.logo__title-gradient {
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b9d 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
