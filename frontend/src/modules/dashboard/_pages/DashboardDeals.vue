<template>
  <section class="page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <Percent :size="22" />
        </div>
        <div>
          <h1 class="title">Deals & Discounts</h1>
          <p class="subtitle">View products with active promotions</p>
        </div>
      </div>
      <button class="refresh-btn" @click="fetchDeals" :disabled="loading">
        <RefreshCw :size="16" :class="{ spin: loading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loader-wrapper">
        <Loader2 class="spin" :size="36" />
        <span>Loading deals...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon-wrap">
        <AlertCircle :size="20" />
      </div>
      <div class="error-content">
        <span class="error-title">Failed to load deals</span>
        <span class="error-message">{{ error }}</span>
      </div>
      <button @click="fetchDeals" class="retry-btn">
        <RefreshCw :size="14" />
        Retry
      </button>
    </div>

    <!-- Deals Content -->
    <div v-else class="deals-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <Tag :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ deals.length }}</span>
            <span class="stat-label">Active Deals</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stock-icon">
            <PackageCheck :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ inStockCount }}</span>
            <span class="stat-label">In Stock</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon low-icon">
            <AlertTriangle :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ lowStockCount }}</span>
            <span class="stat-label">Low / Out</span>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="table-title">
            <ClipboardList class="table-title-icon" :size="18" />
            Deal List
          </h2>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <div class="th-content">
                    <ShoppingBag :size="13" />
                    Product
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Layers :size="13" />
                    Category
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <DollarSign :size="13" />
                    Original
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Percent :size="13" />
                    Discount
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <BadgeDollarSign :size="13" />
                    Final Price
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Package :size="13" />
                    Stock
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="deals.length === 0">
                <td colspan="6" class="empty">
                  <div class="empty-state">
                    <Inbox :size="40" />
                    <span>No deals found — add discounts to products to see them here.</span>
                  </div>
                </td>
              </tr>
              <tr v-for="d in deals" :key="d.id" class="deal-row">
                <td>
                  <div class="product-cell">
                    <img
                      v-if="d.imageUrl"
                      :src="d.imageUrl"
                      :alt="d.name"
                      class="thumb"
                    />
                    <div v-else class="thumb-placeholder">
                      <ImageOff :size="16" />
                    </div>
                    <span class="product-name">{{ d.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ d.category?.name || '—' }}</span>
                </td>
                <td>
                  <span class="original-price">${{ Number(d.price).toFixed(2) }}</span>
                </td>
                <td>
                  <span class="discount-badge">
                    <ArrowDown :size="12" />
                    {{ d.discountPercent }}%
                  </span>
                </td>
                <td>
                  <span class="final-price">${{ Number(d.finalPrice).toFixed(2) }}</span>
                </td>
                <td>
                  <span :class="['stock-tag', d.stock <= 0 ? 'out' : d.stock < 10 ? 'low' : 'ok']">
                    <CircleDot :size="10" />
                    {{ d.stock <= 0 ? 'Out of stock' : d.stock }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Loader2, AlertCircle, ImageOff, Percent, RefreshCw, Tag,
  PackageCheck, AlertTriangle, ClipboardList, ShoppingBag,
  Layers, DollarSign, BadgeDollarSign, Package, Inbox,
  ArrowDown, CircleDot,
} from 'lucide-vue-next'
import axios from '@/lib/axios'

const deals = ref([])
const loading = ref(true)
const error = ref(null)

const inStockCount = computed(() => deals.value.filter(d => d.stock > 0).length)
const lowStockCount = computed(() => deals.value.filter(d => d.stock <= 0 || d.stock < 10).length)

async function fetchDeals() {
  loading.value = true
  error.value = null

  try {
    const res = await axios.get('/products/deals')
    deals.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load deals'
  } finally {
    loading.value = false
  }
}

onMounted(fetchDeals)
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
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
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
.deals-content {
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

.stock-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.low-icon {
  background: rgba(250, 204, 21, 0.12);
  color: #facc15;
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

.table-title-icon {
  color: #60a5fa;
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

.deal-row {
  transition: background 0.15s ease;
}

.deal-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.deal-row:last-child td {
  border-bottom: none;
}

/* ── Product Cell ── */
.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumb {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.thumb-placeholder {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(148, 163, 184, 0.35);
}

.product-name {
  font-weight: 500;
  color: #e2e8f0;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Category ── */
.category-badge {
  font-size: 13px;
  color: #94a3b8;
}

/* ── Price Cells ── */
.original-price {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.7);
  text-decoration: line-through;
  text-decoration-color: rgba(148, 163, 184, 0.3);
}

.final-price {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #34d399;
}

/* ── Discount Badge ── */
.discount-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(251, 146, 60, 0.1);
  border: 1px solid rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

/* ── Stock Tag ── */
.stock-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
}

.stock-tag.ok {
  background: rgba(74, 222, 128, 0.08);
  border-color: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.stock-tag.low {
  background: rgba(250, 204, 21, 0.08);
  border-color: rgba(250, 204, 21, 0.15);
  color: #facc15;
}

.stock-tag.out {
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.15);
  color: #f87171;
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
  text-align: center;
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
}
</style>
