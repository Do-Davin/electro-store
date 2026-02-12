<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Heart,
  Search,
  Tag,
  RefreshCw,
  Loader2,
} from 'lucide-vue-next'

const props = defineProps({
  /**
   * 'empty'  — no data found (friendly blue/gray tone)
   * 'error'  — API failure (red tone)
   */
  variant: {
    type: String,
    default: 'empty',
    validator: (v) => ['empty', 'error'].includes(v),
  },
  /** Heading text */
  title: {
    type: String,
    default: 'Nothing here yet',
  },
  /** Description text */
  subtitle: {
    type: String,
    default: '',
  },
  /**
   * Icon preset — picks a contextual icon automatically:
   * 'order', 'cart', 'wishlist', 'product', 'deal', 'search', 'generic'
   */
  icon: {
    type: String,
    default: 'generic',
  },
  /** Router-link destination for the primary CTA */
  actionTo: {
    type: String,
    default: '',
  },
  /** CTA button label */
  actionText: {
    type: String,
    default: 'Browse Products',
  },
  /** Optional icon component for the CTA button */
  actionIcon: {
    type: [Object, null],
    default: null,
  },
  /** Fill viewport height to prevent footer jump */
  fullHeight: {
    type: Boolean,
    default: true,
  },
  /** Pass the parent's loading state — shows an overlay instead of jumping to skeleton */
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['retry'])

// ── Minimum-duration loading overlay ──
// Keeps the overlay visible for at least 1s so fast retries feel smooth
const MIN_LOADING_MS = 500
const showOverlay = ref(false)
let hideTimer = null

watch(
  () => props.loading,
  (isLoading) => {
    if (isLoading) {
      // Show immediately, clear any pending hide
      clearTimeout(hideTimer)
      showOverlay.value = true
    } else if (showOverlay.value) {
      // Loading finished — wait for the remaining minimum duration
      hideTimer = setTimeout(() => {
        showOverlay.value = false
      }, MIN_LOADING_MS)
    }
  },
)

onBeforeUnmount(() => clearTimeout(hideTimer))

const iconMap = {
  order: Package,
  cart: ShoppingCart,
  wishlist: Heart,
  product: Search,
  deal: Tag,
  search: Search,
  generic: Package,
}

const iconComponent = computed(() => {
  if (props.variant === 'error') return AlertTriangle
  return iconMap[props.icon] || Package
})

// ── Variant-driven classes ──

const containerClass = computed(() =>
  props.variant === 'error'
    ? 'bg-red-500/10 border border-red-500/20'
    : 'bg-[#111111] border border-white/[0.06]',
)

const iconBgClass = computed(() =>
  props.variant === 'error' ? 'bg-red-500/15' : 'bg-white/10',
)

const iconColorClass = computed(() =>
  props.variant === 'error' ? 'text-red-400' : 'text-gray-500',
)

const titleClass = computed(() =>
  props.variant === 'error' ? 'text-red-400' : 'text-white',
)

const subtitleClass = computed(() =>
  props.variant === 'error' ? 'text-red-400/80' : 'text-gray-400',
)

const retryBtnClass = computed(() =>
  'bg-red-500 text-white hover:bg-red-600',
)
</script>

<!--
  StateView.vue — Reusable component for empty & error states.

  Usage:
    <StateView variant="empty" title="No orders yet" subtitle="Your order history will appear here." action-text="Start Shopping" action-to="/products" />
    <StateView variant="error" title="Something went wrong" :subtitle="errorMessage" :loading="store.loading" @retry="refetch" />
-->
<template>
  <div
    class="rounded-2xl p-12 text-center relative overflow-hidden"
    :class="[
      containerClass,
      { 'min-h-[60vh] flex flex-col items-center justify-center': fullHeight },
    ]"
  >
    <!-- Loading overlay (shown during retry so we don't jump to skeleton) -->
    <Transition name="fade">
      <div
        v-if="showOverlay"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/70
               backdrop-blur-[2px] rounded-2xl"
      >
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>
    </Transition>

    <!-- Icon -->
    <div
      class="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
      :class="iconBgClass"
    >
      <component :is="iconComponent" class="w-10 h-10" :class="iconColorClass" />
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-2" :class="titleClass">
      {{ title }}
    </h2>

    <!-- Subtitle -->
    <p class="mb-6 max-w-sm mx-auto" :class="subtitleClass">
      {{ subtitle }}
    </p>

    <!-- Action: link or retry button -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <RouterLink
        v-if="actionTo"
        :to="actionTo"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white
               rounded-xl font-semibold hover:bg-primary/90 transition-colors"
      >
        <component v-if="actionIcon" :is="actionIcon" class="w-5 h-5" />
        {{ actionText }}
      </RouterLink>

      <button
        v-if="variant === 'error'"
        :disabled="showOverlay"
        @click="$emit('retry')"
        class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium
               rounded-xl transition-colors disabled:opacity-60 disabled:cursor-wait"
        :class="retryBtnClass"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': showOverlay }" />
        {{ showOverlay ? 'Retrying...' : 'Try Again' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
