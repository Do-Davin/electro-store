<template>
  <section class="dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <LayoutDashboard  :size="22" />
        </div>
        <div>
          <h1 class="title">Dashboard</h1>
          <p class="subtitle">Overview & quick stats</p>
        </div>
      </div>
      <div class="header-actions">
        <div v-if="!loading" class="last-updated">Last updated: {{ lastUpdatedTime }}</div>
        <button class="refresh-btn" @click="loadDashboard" :disabled="loading">
          <RefreshCw :size="14" :class="{ spin: loading }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 class="animate-spin" :size="32" />
      <span>Loading dashboard data...</span>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <StatCard :title="'Total Products'" :value="String(stats.totalProducts)">
          <template #icon>
            <Package />
          </template>
        </StatCard>

        <StatCard
          :title="'Total Revenue'"
          :value="'$' + stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
          variant="revenue"
        >
          <template #icon>
            <DollarSign />
          </template>
        </StatCard>

        <StatCard :title="'Total Orders'" :value="String(stats.totalOrders)">
          <template #icon>
            <ShoppingCart />
          </template>
        </StatCard>

        <StatCard :title="'Total Users'" :value="String(stats.totalUsers)">
          <template #icon>
            <Users />
          </template>
        </StatCard>
      </div>

      <!-- Daily Report Download -->
      <div class="report-section">
        <div class="section-header">
          <h3><FileText class="section-icon" :size="18" />Daily Sales Report</h3>
        </div>
        <div class="report-content">
          <div class="report-form">
            <label class="report-label">Select Date</label>
            <input
              type="date"
              v-model="reportDate"
              :max="todayStr"
              class="report-date-input"
            />
          </div>
          <button
            class="report-download-btn"
            :disabled="reportLoading || !reportDate"
            @click="handleDownloadReport"
          >
            <Loader2 v-if="reportLoading" :size="16" class="animate-spin" />
            <Download v-else :size="16" />
            <span>{{ reportLoading ? 'Generating...' : 'Download PDF Report' }}</span>
          </button>
        </div>
        <p v-if="reportError" class="report-error">{{ reportError }}</p>
      </div>

      <!-- Orders Analytics Chart -->
      <OrdersChart />

      <!-- Recent Orders Table -->
      <div class="orders-section">
        <div class="section-header">
          <h3><ClipboardList class="section-icon" :size="18" />Recent Orders</h3>
          <span class="order-count">{{ recentOrders.length }} recent</span>
        </div>

        <div v-if="recentOrders.length === 0" class="empty-state">
          <ShoppingCart :size="48" class="empty-icon" />
          <span>No orders yet</span>
          <p>Orders will appear here once customers make purchases</p>
        </div>

        <div v-else class="table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="order-row">
                <td class="mono">#{{ order.id.slice(0, 8).toUpperCase() }}</td>
                <td class="customer-cell">
                  <div class="customer-info">
                    <div class="customer-avatar">
                      {{ getInitials(order.user?.email) }}
                    </div>
                    <span>{{ order.user?.email ?? 'Guest' }}</span>
                  </div>
                </td>
                <td class="amount">${{ Number(order.totalAmount).toFixed(2) }}</td>
                <td>
                  <span :class="['status-badge', statusClass(order.status)]">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="date-cell">{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Package, LayoutDashboard, DollarSign, ShoppingCart, Users, Loader2, RefreshCw, ClipboardList, FileText, Download } from 'lucide-vue-next'
import StatCard from '../_components/StatCard.vue'
import OrdersChart from '../_components/OrdersChart.vue'
import axios from '@/lib/axios'
import { useToast } from '@/composables/useToast'

const loading = ref(true)
const stats = ref({
  totalProducts: 0,
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0,
})

const recentOrders = ref([])
const lastUpdatedTime = computed(() => {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
})

function statusClass(status) {
  const map = {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }
  return map[status] || ''
}

function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getInitials(email) {
  if (!email) return 'G'
  const name = email.split('@')[0]
  return name.slice(0, 2).toUpperCase()
}

const toast = useToast()

// ── Daily Report ──
const todayStr = new Date().toISOString().split('T')[0]
const reportDate = ref(todayStr)
const reportLoading = ref(false)
const reportError = ref('')

async function handleDownloadReport() {
  if (!reportDate.value) return
  reportLoading.value = true
  reportError.value = ''
  try {
    const token = localStorage.getItem('access_token')
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const res = await fetch(
      `${baseUrl}/admin/reports/daily?date=${reportDate.value}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message || `Download failed (${res.status})`)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-report-${reportDate.value}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report downloaded!')
  } catch (e) {
    reportError.value = e.message || 'Failed to generate report'
    toast.error(reportError.value)
  } finally {
    reportLoading.value = false
  }
}

async function loadDashboard() {
  loading.value = true
  try {
    // Fetch all dashboard stats from backend (source of truth)
    const statsRes = await axios.get('/admin/reports/stats')
    const data = statsRes.data

    // Set stats from backend
    stats.value.totalProducts = data.totalProducts ?? 0
    stats.value.totalOrders = data.totalOrders ?? 0
    stats.value.totalRevenue = data.totalRevenue ?? 0
    stats.value.totalUsers = data.totalUsers ?? 0
    recentOrders.value = data.recentOrders ?? []
  } catch (e) {
    console.error('Failed to load dashboard stats:', e)
    toast.error('Failed to load dashboard. Please refresh the page.')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadDashboard())
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: #0a0a0a;
  min-height: 100vh;
}

.dashboard-header {
  display: none;
}

/* Page header (new) */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.subtitle {
  font-size: 14px;
  color: rgba(148, 163, 184, 0.8);
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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

.refresh-btn:hover {
  transform: translateY(-1px);
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.18);
}

.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spin { animation: spin 1s linear infinite; }

.title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.last-updated {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.7);
  padding: 80px 0;
}

.loading-state span {
  font-size: 15px;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Orders Section */
.orders-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

/* icons for analytics and recent orders only */
.section-header .section-icon {
  color: #60a5fa;
  stroke: currentColor;
  display: inline-flex;
  vertical-align: middle;
  margin-right: 8px;
}

.order-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 8px;
}

.empty-state span {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.empty-state p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
}

.orders-table td {
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.order-row {
  transition: background 0.2s ease;
}

.order-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.order-row:last-child td {
  border-bottom: none;
}

.mono {
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  font-weight: 600;
  color: rgb(59, 130, 246);
  font-size: 13px;
}

.customer-cell {
  max-width: 250px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: rgb(59, 130, 246);
  flex-shrink: 0;
}

.amount {
  font-weight: 600;
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  color: rgb(74, 222, 128);
}

.date-cell {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.status-badge.pending {
  background: rgba(234, 179, 8, 0.15);
  color: rgb(250, 204, 21);
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.status-badge.paid {
  background: rgba(34, 197, 94, 0.15);
  color: rgb(74, 222, 128);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.processing {
  background: rgba(59, 130, 246, 0.15);
  color: rgb(96, 165, 250);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge.shipped {
  background: rgba(168, 85, 247, 0.15);
  color: rgb(192, 132, 252);
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.status-badge.delivered,
.status-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  color: rgb(74, 222, 128);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: rgb(248, 113, 113);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Daily Report Section */
.report-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.report-content {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.report-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.5);
}

.report-date-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s;
  color-scheme: dark;
}

.report-date-input:focus {
  border-color: rgba(59, 130, 246, 0.5);
}

.report-download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
}

.report-download-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.report-download-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.report-error {
  margin-top: 10px;
  font-size: 13px;
  color: rgb(248, 113, 113);
}
</style>
