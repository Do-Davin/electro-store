<template>
  <span :class="badgeClasses">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Reusable read-only badge that visualises an order status.
 *
 * @prop {string} status – one of the OrderStatus values from the backend
 *                         (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED)
 *
 * Usage:
 *   <OrderStatusBadge status="PAID" />
 */

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (v) =>
      ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].includes(v),
  },
})

/** Map each status to its Tailwind colour pair */
const STATUS_CONFIG = {
  PENDING:    { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  label: 'Pending' },
  PAID:       { bg: 'bg-green-500/20',   text: 'text-green-400',   label: 'Paid' },
  PROCESSING: { bg: 'bg-blue-500/20',    text: 'text-blue-400',    label: 'Processing' },
  SHIPPED:    { bg: 'bg-purple-500/20',  text: 'text-purple-400',  label: 'Shipped' },
  DELIVERED:  { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Delivered' },
  COMPLETED:  { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Completed' },
  CANCELLED:  { bg: 'bg-red-500/20',     text: 'text-red-400',     label: 'Cancelled' },
}

const FALLBACK = { bg: 'bg-gray-500/20', text: 'text-gray-400' }

const config = computed(() => STATUS_CONFIG[props.status] ?? FALLBACK)
const label  = computed(() => config.value.label ?? props.status)

const badgeClasses = computed(() => [
  'inline-block px-3 py-1 rounded-full text-xs font-semibold',
  config.value.bg,
  config.value.text,
])
</script>
