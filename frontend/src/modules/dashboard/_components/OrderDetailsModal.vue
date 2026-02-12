<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              <div class="header-icon">
                <ShoppingBag :size="20" />
              </div>
              <div>
                <h2 class="modal-title">Order Details</h2>
                <span class="order-id-badge" v-if="order">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
              </div>
            </div>
            <button class="close-btn" @click="$emit('close')" title="Close">
              <X :size="18" />
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="modal-loading">
            <Loader2 class="spin" :size="28" />
            <span>Loading order details...</span>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="modal-error">
            <AlertCircle :size="18" />
            <span>{{ error }}</span>
          </div>

          <!-- Content -->
          <template v-else-if="order">
            <!-- Order Meta -->
            <div class="order-meta">
              <div class="meta-item">
                <User :size="14" />
                <span class="meta-label">Customer</span>
                <span class="meta-value">{{ order.user?.email ?? '—' }}</span>
              </div>
              <div class="meta-item">
                <Calendar :size="14" />
                <span class="meta-label">Date</span>
                <span class="meta-value">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <Activity :size="14" />
                <span class="meta-label">Status</span>
                <span class="status-badge" :class="statusClass(order.status)">{{ order.status }}</span>
              </div>
            </div>

            <!-- Items Table -->
            <div class="items-section">
              <h3 class="items-title">
                <Package :size="15" />
                Items ({{ order.items?.length ?? 0 }})
              </h3>
              <div class="items-list">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="item-row"
                >
                  <div class="item-image-wrap">
                    <img
                      v-if="item.product?.imageUrl"
                      :src="getImageUrl(item.product.imageUrl)"
                      :alt="item.product?.name ?? 'Product'"
                      class="item-image"
                    />
                    <div v-else class="item-image-placeholder">
                      <Package :size="18" />
                    </div>
                  </div>
                  <div class="item-info">
                    <span class="item-name">{{ item.product?.name ?? 'Unknown Product' }}</span>
                    <span class="item-brand" v-if="item.product?.brand?.name">{{ item.product.brand.name }}</span>
                  </div>
                  <div class="item-qty">
                    <span class="qty-label">Qty</span>
                    <span class="qty-value">{{ item.quantity }}</span>
                  </div>
                  <div class="item-price">
                    <span class="price-label">Price</span>
                    <span class="price-value">${{ Number(item.priceAtTime).toFixed(2) }}</span>
                  </div>
                  <div class="item-subtotal">
                    <span class="subtotal-label">Subtotal</span>
                    <span class="subtotal-value">${{ (item.quantity * Number(item.priceAtTime)).toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Empty -->
                <div v-if="!order.items?.length" class="items-empty">
                  <Package :size="28" />
                  <span>No items in this order</span>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="order-summary">
              <div class="summary-row" v-if="order.shippingAmount > 0">
                <span>Shipping</span>
                <span>${{ Number(order.shippingAmount).toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span class="total-amount">${{ Number(order.totalAmount).toFixed(2) }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  ShoppingBag, X, Loader2, AlertCircle, User,
  Calendar, Activity, Package,
} from 'lucide-vue-next'
import axios from '@/lib/axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  orderId: { type: String, default: null },
  orderData: { type: Object, default: null },
})

defineEmits(['close'])

const order = ref(null)
const loading = ref(false)
const error = ref(null)

function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function statusClass(status) {
  const map = {
    PENDING: 'pending', PAID: 'paid', PROCESSING: 'processing',
    SHIPPED: 'shipped', DELIVERED: 'delivered', COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }
  return map[status] || ''
}

async function fetchOrder(id) {
  loading.value = true
  error.value = null
  order.value = null

  try {
    const res = await axios.get(`/orders/admin/${id}`)
    order.value = res.data
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load order details'
  } finally {
    loading.value = false
  }
}

// When modal opens, use passed data or fetch
watch(
  () => [props.isOpen, props.orderId],
  ([open, id]) => {
    if (open) {
      if (props.orderData) {
        // Use the already-fetched order data from the list
        order.value = props.orderData
        loading.value = false
        error.value = null
      } else if (id) {
        fetchOrder(id)
      }
    }
    if (!open) {
      order.value = null
      error.value = null
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(6px);
}

.modal-container {
  background: #111111;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  animation: scaleIn 0.25s ease;
}

@keyframes scaleIn {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  background: #111111;
  z-index: 2;
  border-radius: 18px 18px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.order-id-badge {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(148, 163, 184, 0.6);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  border-color: rgba(255, 255, 255, 0.15);
}

/* ── Loading / Error ── */
.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 20px;
  color: rgba(148, 163, 184, 0.6);
  font-size: 14px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.modal-error {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 24px;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  color: #fca5a5;
  font-size: 13px;
}

/* ── Order Meta ── */
.order-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 13px;
  color: rgba(148, 163, 184, 0.6);
  flex: 1;
  min-width: 160px;
}

.meta-label {
  color: rgba(148, 163, 184, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.meta-value {
  color: #cbd5e1;
  font-weight: 500;
  margin-left: auto;
}

/* ── Status Badge ── */
.status-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 10px;
  border-radius: 20px;
  margin-left: auto;
}

.status-badge.pending {
  background: rgba(250, 204, 21, 0.12);
  color: #facc15;
}

.status-badge.paid {
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
}

.status-badge.processing {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
}

.status-badge.shipped {
  background: rgba(192, 132, 252, 0.12);
  color: #c084fc;
}

.status-badge.delivered,
.status-badge.completed {
  background: rgba(52, 211, 153, 0.12);
  color: #34d399;
}

.status-badge.cancelled {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
}

/* ── Items Section ── */
.items-section {
  padding: 18px 24px;
}

.items-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 14px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.15s;
}

.item-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.item-image-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(148, 163, 184, 0.3);
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-brand {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.5);
  font-weight: 500;
}

.item-qty,
.item-price,
.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 60px;
}

.qty-label,
.price-label,
.subtotal-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(148, 163, 184, 0.4);
  font-weight: 600;
}

.qty-value {
  font-size: 14px;
  font-weight: 700;
  color: #38bdf8;
}

.price-value {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  font-family: 'SF Mono', 'Consolas', monospace;
}

.subtotal-value {
  font-size: 14px;
  font-weight: 700;
  color: rgb(74, 222, 128);
  font-family: 'SF Mono', 'Consolas', monospace;
}

.items-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  color: rgba(148, 163, 184, 0.3);
  font-size: 13px;
}

/* ── Summary ── */
.order-summary {
  padding: 16px 24px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  color: rgba(148, 163, 184, 0.6);
}

.summary-row.total {
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
}

.total-amount {
  font-size: 18px;
  font-weight: 800;
  color: rgb(74, 222, 128);
  font-family: 'SF Mono', 'Consolas', monospace;
}

/* ── Transition ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .modal-container {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 14px;
  }

  .item-row {
    flex-wrap: wrap;
    gap: 10px;
  }

  .item-qty,
  .item-price,
  .item-subtotal {
    min-width: 50px;
  }

  .order-meta {
    flex-direction: column;
  }
}
</style>
