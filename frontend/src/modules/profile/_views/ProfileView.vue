<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1 flex items-start justify-center pt-28 pb-12 px-4">
      <div class="w-full max-w-6xl">
        <BreadcrumbNav :crumbs="[
          { label: 'Home', to: '/' },
          { label: 'Profile', to: '/profile' },
        ]" class="mb-4" />
        <h1 class="text-3xl font-bold text-primary mb-6">My Profile</h1>

        <ProfileComponent />
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import ProfileComponent from '../_components/ProfileComponent.vue'
import Footer from '@/components/Footer.vue'
</script>
