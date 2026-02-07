<!--
  StateView.vue — Reusable component for empty & error states.

  Usage:
    <StateView variant="empty" title="No orders yet" subtitle="Your order history will appear here." action-text="Start Shopping" action-to="/products" />
    <StateView variant="error" title="Something went wrong" :subtitle="errorMessage" @retry="refetch" />
-->
<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-12 text-center"
    :class="{ 'min-h-[60vh] flex flex-col items-center justify-center': fullHeight }"
  >
    <!-- Icon -->
    <div
      class="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
      :class="iconBgClass"
    >
      <component :is="iconComponent" class="w-10 h-10" :class="iconColorClass" />
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold text-gray-600 mb-2">
      {{ title }}
    </h2>

    <!-- Subtitle -->
    <p class="text-gray-400 mb-6 max-w-sm mx-auto">
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
        :disabled="retrying"
        @click="handleRetry"
        class="inline-flex items-center gap-2 px-6 py-3 border border-gray-200
               rounded-xl font-semibold text-gray-600 hover:bg-gray-50
               transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': retrying }" />
        {{ retrying ? 'Retrying...' : 'Try Again' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Heart,
  Search,
  Tag,
  RefreshCw,
} from 'lucide-vue-next'

const props = defineProps({
  /**
   * 'empty'  — no data found (friendly blue/gray tone)
   * 'error'  — API failure (red/amber tone)
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
})

const emit = defineEmits(['retry'])

const retrying = ref(false)

async function handleRetry() {
  retrying.value = true
  try {
    emit('retry')
    // Give the parent time to finish the async operation
    await new Promise((resolve) => setTimeout(resolve, 800))
  } finally {
    retrying.value = false
  }
}

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

const iconBgClass = computed(() =>
  props.variant === 'error' ? 'bg-red-50' : 'bg-gray-100',
)

const iconColorClass = computed(() =>
  props.variant === 'error' ? 'text-red-400' : 'text-gray-300',
)
</script>
