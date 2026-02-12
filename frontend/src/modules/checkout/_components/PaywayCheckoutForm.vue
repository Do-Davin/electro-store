<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  checkoutHtml: { type: String, required: true },
  orderId: { type: String, default: '' },
})

const emit = defineEmits(['success', 'error', 'cancel'])

const iframeRef = ref(null)
const isLoading = ref(true)
const errorMsg = ref('')

let pollTimer = null

function onIframeLoad() {
  isLoading.value = false
}

// PayWay redirects to continue_success_url after payment.
// We listen for that URL in the iframe (or the parent window if popup).
// Since cross-origin iframe navigation can't be read, we rely on
// the frontend polling the verify endpoint after user clicks "I've paid".
function handleVerify() {
  emit('success')
}

function handleCancel() {
  emit('cancel')
}

const isSimulating = ref(false)

async function handleSimulate() {
  if (!props.orderId) return
  isSimulating.value = true
  try {
    const { http } = await import('@/lib/http')
    await http.post(`/payments/payway/simulate/${props.orderId}`)
    emit('success')
  } catch (err) {
    errorMsg.value = err?.message || 'Simulation failed'
  } finally {
    isSimulating.value = false
  }
}

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <div class="bg-[#111111] rounded-2xl shadow-md p-6 border border-white/6">
    <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      PayWay Checkout
    </h2>

    <p v-if="errorMsg" class="mb-4 text-sm text-red-500 flex items-center gap-1">
      <AlertCircle class="w-4 h-4 shrink-0" />
      {{ errorMsg }}
    </p>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-gray-400">Loading PayWay checkout...</span>
    </div>

    <!-- PayWay checkout HTML rendered in iframe via srcdoc -->
    <div class="relative rounded-xl overflow-hidden border border-white/10 bg-white">
      <iframe
        ref="iframeRef"
        :srcdoc="checkoutHtml"
        class="w-full border-0"
        style="height: 720px; overflow: hidden"
        scrolling="no"
        @load="onIframeLoad"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </div>

    <div class="mt-4 space-y-3">
      <button
        @click="handleVerify"
        class="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg
        hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        I've Completed Payment — Verify
      </button>

      <button
        v-if="orderId"
        @click="handleSimulate"
        :disabled="isSimulating"
        class="w-full py-3 rounded-xl bg-amber-600/20 text-amber-400 font-medium border border-amber-500/30
        hover:bg-amber-600/30 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Loader2 v-if="isSimulating" class="w-4 h-4 animate-spin" />
        Simulate Payment (Sandbox Dev Only)
      </button>

      <button
        @click="handleCancel"
        class="w-full py-3 rounded-xl border border-white/10 text-gray-400 font-medium
        hover:text-white hover:border-white/20 transition-colors"
      >
        Cancel
      </button>

      <p class="text-center text-gray-400 text-xs flex items-center justify-center gap-1">
        <ShieldCheck class="w-3.5 h-3.5" />
        Secured by ABA PayWay. Complete payment in the form above, then click verify.
      </p>
    </div>
  </div>
</template>
