<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <Loader2 class="w-10 h-10 text-primary animate-spin" />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
    >
      <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p class="text-red-600 font-medium">{{ error }}</p>
    </div>

    <!-- Brand Detail -->
    <div v-else-if="brand" class="space-y-8">
      <!-- Hero Card -->
      <div
        class="relative bg-white rounded-3xl shadow-md overflow-hidden
               border border-gray-100"
      >
        <!-- Background gradient bar -->
        <div class="h-40 sm:h-52 bg-gradient-to-br from-primary/10 via-blue-50 to-slate-100
                    flex items-center justify-center relative overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5
                      rounded-full -translate-y-1/2 translate-x-1/3" />
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-primary/5
                      rounded-full translate-y-1/2 -translate-x-1/3" />

          <img
            :src="logoSrc"
            :alt="brand.name"
            class="max-h-28 sm:max-h-36 max-w-[70%] object-contain relative z-10
                   drop-shadow-md"
            @error="onLogoError"
          />
        </div>

        <!-- Brand Info -->
        <div class="p-6 sm:p-8">
          <div class="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0b2c5f] mb-1">
                {{ brand.name }}
              </h1>
              <p class="text-sm text-gray-400">
                Added {{ formatDate(brand.createdAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
              <Award class="w-5 h-5 text-primary" />
              <span class="text-sm font-semibold text-primary">Brand</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventor Section -->
      <div
        class="bg-white rounded-3xl shadow-sm border border-gray-100
               overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-amber-500" />
            <h2 class="text-lg font-bold text-[#0b2c5f]">Inventor</h2>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- Inventor Image -->
            <div
              class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br
                     from-gray-100 to-slate-100 overflow-hidden shrink-0
                     shadow-inner ring-4 ring-gray-50"
            >
              <img
                v-if="inventorImageSrc"
                :src="inventorImageSrc"
                :alt="brand.inventorName"
                class="w-full h-full object-cover"
                @error="onInventorError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <UserCircle class="w-16 h-16 text-gray-300" />
              </div>
            </div>

            <!-- Inventor Info -->
            <div class="text-center sm:text-left">
              <p class="text-xl font-bold text-[#0b2c5f] mb-1">
                {{ brand.inventorName }}
              </p>
              <p class="text-sm text-gray-400">
                Founder & Creator of {{ brand.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats (placeholder for future) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Star class="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Status</p>
            <p class="font-bold text-[#0b2c5f]">Active</p>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CalendarDays class="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Since</p>
            <p class="font-bold text-[#0b2c5f]">{{ formatYear(brand.createdAt) }}</p>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-100
                 p-5 flex items-center gap-4"
        >
          <div class="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <Sparkles class="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">Quality</p>
            <p class="font-bold text-[#0b2c5f]">Premium</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div
      v-else
      class="bg-white rounded-2xl shadow-md p-12 text-center"
    >
      <SearchX class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-500 mb-2">Brand not found</h2>
      <p class="text-gray-400 mb-6">The brand you're looking for doesn't exist.</p>
      <RouterLink
        to="/brands"
        class="inline-block px-6 py-3 bg-primary text-white rounded-xl
               font-semibold hover:bg-primary/90 transition-colors"
      >
        Browse All Brands
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Loader2, AlertCircle, Award, Lightbulb, UserCircle,
  Star, CalendarDays, Sparkles, SearchX,
} from 'lucide-vue-next'

const props = defineProps({
  brand: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const logoSrc = computed(() => {
  const url = props.brand?.logoUrl
  if (!url) return '/brands/placeholder.png'
  return url.startsWith('http') ? url : API + url
})

const inventorImageSrc = computed(() => {
  const url = props.brand?.inventorImageUrl
  if (!url) return null
  return url.startsWith('http') ? url : API + url
})

function onLogoError(e) {
  e.target.src = '/brands/placeholder.png'
}

function onInventorError(e) {
  e.target.style.display = 'none'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}
</script>
