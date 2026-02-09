<template>
  <section class="page">
    <h1 class="title">Orders Management</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 class="animate-spin" :size="32" />
      <span>Loading orders...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <AlertCircle :size="20" />
      <span>{{ error }}</span>
      <button @click="fetchOrders(page)" class="retry-btn">Retry</button>
    </div>

    <!-- Orders Table -->
    <div v-else>
      <!-- Summary -->
      <div class="summary">
        <span>{{ total }} total orders</span>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="7" class="empty">No orders found</td>
            </tr>
            <tr v-for="order in orders" :key="order.id">
              <td class="mono">#{{ order.id.slice(0, 8).toUpperCase() }}</td>
              <td>{{ order.user?.email ?? '—' }}</td>
              <td>{{ order.items?.length ?? 0 }}</td>
              <td class="amount">${{ Number(order.totalAmount).toFixed(2) }}</td>
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
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <button class="delete-btn" @click="confirmDeleteOrder(order.id)">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="page <= 1" @click="fetchOrders(page - 1)">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button :disabled="page >= totalPages" @click="fetchOrders(page + 1)">Next</button>
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
import { ref, onMounted } from 'vue'
import { Loader2, AlertCircle, Trash2 } from 'lucide-vue-next'
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
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: white;
}

.title {
  font-size: 26px;
  font-weight: 600;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px 0;
}

.error-state {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f87171;
  padding: 16px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 12px;
}

.retry-btn {
  margin-left: auto;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.summary {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.table-wrap {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

td {
  padding: 12px 14px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.mono {
  font-family: monospace;
  font-weight: 600;
}

.amount {
  font-weight: 600;
}

.empty {
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.4);
}

.status-select {
  padding: 4px 8px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

.status-select.pending { background: rgba(250, 204, 21, 0.2); color: #facc15; }
.status-select.paid { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
.status-select.processing { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
.status-select.shipped { background: rgba(192, 132, 252, 0.2); color: #c084fc; }
.status-select.delivered,
.status-select.completed { background: rgba(52, 211, 153, 0.2); color: #34d399; }
.status-select.cancelled { background: rgba(248, 113, 113, 0.2); color: #f87171; }

.status-select option {
  background: #0b3f6b;
  color: white;
}

.delete-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}

.delete-btn:hover {
  color: #f87171;
  background: rgba(248, 113, 113, 0.15);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
}

.pagination button {
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
}

.pagination span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
