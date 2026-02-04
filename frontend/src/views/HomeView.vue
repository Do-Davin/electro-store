<template>
  <Navbar />
  <HeroSection />
  <PromoBanner />
  <CategoryCarousel />
  <FeaturedProductComponent />
  <BestSellerComponent />
  <BrandsSection />
  <TrustSection />
  <TestimonialsCarousel />
  <PaymentMethodsSection />
  <StatsSection />
  <NewsletterSection />
  <Footer />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getRole } from '@/lib/auth';

import HeroSection from '@/components/HeroSection.vue';
import PromoBanner from '@/components/PromoBanner.vue';
import CategoryCarousel from '@/components/CategoryCarousel.vue';
import Navbar from '@/components/Navbar.vue';
import FeaturedProductComponent from '@/components/FeaturedProductComponent.vue';
import BestSellerComponent from '@/components/BestSellerComponent.vue';
import BrandsSection from '@/components/BrandsSection.vue';
import TrustSection from '@/components/TrustSection.vue';
import TestimonialsCarousel from '@/components/TestimonialsCarousel.vue';
import PaymentMethodsSection from '@/components/PaymentMethodsSection.vue';
import StatsSection from '@/components/StatsSection.vue';
import NewsletterSection from '@/components/NewsletterSection.vue';
import Footer from '@/components/Footer.vue';

const router = useRouter();

onMounted(() => {
  const role = getRole();
  if (role === 'ADMIN') {
    router.replace('dashboard');
  }
});
</script>

<style>

</style>
