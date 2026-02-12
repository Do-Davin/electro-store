<template>
  <section class="page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <ShoppingBag :size="22" />
        </div>
        <div>
          <h1 class="title">Orders</h1>
          <p class="subtitle">Manage and track all customer orders</p>
        </div>
      </div>
      <button class="refresh-btn" @click="fetchOrders(page)" :disabled="loading">
        <RefreshCw :size="16" :class="{ 'spin': loading }" />
        <span>Refresh</span>
      </button>
    </div>
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loader-wrapper">
        <Loader2 class="spin" :size="36" />
        <span>Loading orders...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon-wrap">
        <AlertCircle :size="20" />
      </div>
      <div class="error-content">
        <span class="error-title">Failed to load orders</span>
        <span class="error-message">{{ error }}</span>
      </div>
      <button @click="fetchOrders(page)" class="retry-btn">
        <RefreshCw :size="14" />
        Retry
      </button>
    </div>

    <!-- Orders Content -->
    <div v-else class="orders-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <Package :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ total }}</span>
            <span class="stat-label">Total Orders</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon page-icon">
            <FileText :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ orders.length }}</span>
            <span class="stat-label">Showing</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pages-icon">
            <Layers :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ page }} / {{ totalPages }}</span>
            <span class="stat-label">Current Page</span>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="table-title">
            <ClipboardList class="order-list-icon" :size="18" />
            Order List
          </h2>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <div class="th-content">
                    <Hash :size="13" />
                    Order ID
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <User :size="13" />
                    Customer
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Package :size="13" />
                    Items
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <DollarSign :size="13" />
                    Total
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Activity :size="13" />
                    Status
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Calendar :size="13" />
                    Date
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="orders.length === 0">
                <td colspan="7" class="empty">
                  <div class="empty-state">
                    <Inbox :size="40" />
                    <span>No orders found</span>
                  </div>
                </td>
              </tr>
              <tr v-for="order in orders" :key="order.id" class="order-row">
                <td>
                  <span class="order-id">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
                </td>
                <td>
                  <div class="customer-cell">
                    <div class="customer-avatar">
                      <User :size="14" />
                    </div>
                    <span class="customer-email">{{ order.user?.email ?? '—' }}</span>
                  </div>
                </td>
                <td>
                  <span class="items-badge">
                    <ShoppingBag :size="12" />
                    {{ order.items?.length ?? 0 }}
                  </span>
                </td>
                <td>
                  <span class="amount">${{ Number(order.totalAmount).toFixed(2) }}</span>
                </td>
                <td>
                  <select
                    :value="order.status"
                    @change="updateStatus(order.id, $event.target.value)"
                    class="status-select"
                    :class="statusClass(order.status)"
                  >
                    <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                  </select>
                </td>
                <td>
                  <span class="date-cell">{{ formatDate(order.createdAt) }}</span>
                </td>
                <td>
                  <button class="delete-btn" @click="confirmDeleteOrder(order.id)" title="Delete order">
                    <Trash2 :size="15" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <div class="pagination-info">
            Showing page <strong>{{ page }}</strong> of <strong>{{ totalPages }}</strong>
          </div>
          <div class="pagination-controls">
            <button class="page-btn" :disabled="page <= 1" @click="fetchOrders(page - 1)">
              <ChevronLeft :size="16" />
              Previous
            </button>
            <div class="page-numbers">
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-num"
                :class="{ active: p === page }"
                @click="fetchOrders(p)"
              >
                {{ p }}
              </button>
            </div>
            <button class="page-btn" :disabled="page >= totalPages" @click="fetchOrders(page + 1)">
              Next
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      :isOpen="deleteModal.open"
      type="danger"
      title="Delete Order"
      message="Are you sure you want to delete this order? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      :loading="deleteModal.loading"
      @confirm="executeDeleteOrder"
      @cancel="deleteModal = { open: false, orderId: null, loading: false }"
      @close="deleteModal = { open: false, orderId: null, loading: false }"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Loader2, AlertCircle, Trash2, ShoppingBag, RefreshCw,
  Package, FileText, Layers, ClipboardList, Hash, User,
  DollarSign, Activity, Calendar, Inbox, ChevronLeft, ChevronRight,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/ConfirmModal.vue'

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED']

const orders = ref([])
const loading = ref(true)
const error = ref(null)
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)

const toast = useToast()

// Delete confirmation modal state
const deleteModal = ref({
  open: false,
  orderId: null,
  loading: false,
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function statusClass(status) {
  const map = {
    PENDING: 'pending', PAID: 'paid', PROCESSING: 'processing',
    SHIPPED: 'shipped', DELIVERED: 'delivered', COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }
  return map[status] || ''
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

async function fetchOrders(p = 1) {
  loading.value = true
  error.value = null

  try {
    const res = await axios.get(`/orders?page=${p}&limit=10`)
    orders.value = res.data?.data ?? []
    const meta = res.data?.meta ?? {}
    page.value = meta.page ?? p
    total.value = meta.total ?? 0
    totalPages.value = meta.totalPages ?? 1
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

async function updateStatus(orderId, newStatus) {
  try {
    await axios.patch(`/orders/${orderId}/status`, { status: newStatus })
    // Update locally
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = newStatus
    toast.success(`Order status updated to ${newStatus}.`)
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Failed to update status')
    // Revert UI by re-fetching
    await fetchOrders(page.value)
  }
}

function confirmDeleteOrder(orderId) {
  deleteModal.value = { open: true, orderId, loading: false }
}

async function executeDeleteOrder() {
  const orderId = deleteModal.value.orderId
  deleteModal.value.loading = true

  try {
    await axios.delete(`/orders/${orderId}`)
    orders.value = orders.value.filter(o => o.id !== orderId)
    total.value--
    toast.success('Order deleted successfully.')
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Failed to delete order')
  } finally {
    deleteModal.value = { open: false, orderId: null, loading: false }
  }
}

onMounted(() => fetchOrders())
</script>

<style scoped>
/* ── Base ── */
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: #f1f5f9;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.18);
}

/* Order List header icon only */
.order-list-icon {
  color: #60a5fa;
  stroke: currentColor;
}

.title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.8);
  margin: 2px 0 0;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.18);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: rgba(148, 163, 184, 0.7);
  font-size: 14px;
}

/* ── Spin animation ── */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Error ── */
.error-state {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 14px;
}

.error-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.error-title {
  font-size: 14px;
  font-weight: 600;
  color: #fca5a5;
}

.error-message {
  font-size: 13px;
  color: rgba(252, 165, 165, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 9px;
  color: #fca5a5;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
}

/* ── Stats Row ── */
.orders-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.page-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.pages-icon {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 12px;
  color: rgba(148, 163, 184, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

/* ── Table Card ── */
.table-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(255, 255, 255, 0.02);
}

th {
  text-align: left;
  padding: 13px 18px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

td {
  padding: 14px 18px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  white-space: nowrap;
}

.order-row {
  transition: background 0.15s ease;
}

.order-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.order-row:last-child td {
  border-bottom: none;
}

/* ── Cells ── */
.order-id {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  flex-shrink: 0;
}

.customer-email {
  color: #cbd5e1;
  font-size: 13px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.items-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #38bdf8;
}

.amount {
  font-weight: 600;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  color: rgb(74, 222, 128);
}

.date-cell {
  color: rgba(148, 163, 184, 0.7);
  font-size: 13px;
}

/* ── Empty State ── */
.empty {
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: rgba(148, 163, 184, 0.35);
  font-size: 14px;
}

/* ── Status Select ── */
.status-select {
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid transparent;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.2s ease;
  appearance: auto;
}

.status-select.pending {
  background: rgba(250, 204, 21, 0.1);
  border-color: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.status-select.paid {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.status-select.processing {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.status-select.shipped {
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.2);
  color: #c084fc;
}

.status-select.delivered,
.status-select.completed {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.2);
  color: #34d399;
}

.status-select.cancelled {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.2);
  color: #f87171;
}

.status-select option {
  background: #0f172a;
  color: #e2e8f0;
}

/* ── Delete Button ── */
.delete-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(148, 163, 184, 0.5);
  cursor: pointer;
  border-radius: 9px;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

/* ── Pagination ── */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  gap: 14px;
}

.pagination-info {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.5);
}

.pagination-info strong {
  color: #cbd5e1;
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  color: #f1f5f9;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-num {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(148, 163, 184, 0.6);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-num:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
}

.page-num.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  font-weight: 700;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    align-items: center;
  }

  .page-numbers {
    display: none;
  }
}
</style>