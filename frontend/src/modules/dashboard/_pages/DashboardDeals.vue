<template>
  <section class="page">
    <h1 class="title">Deals & Discounts</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 class="animate-spin" :size="32" />
      <span>Loading deals...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <AlertCircle :size="20" />
      <span>{{ error }}</span>
      <button @click="fetchDeals" class="retry-btn">Retry</button>
    </div>

    <!-- Deals Table -->
    <div v-else>
      <div class="summary">
        <span>{{ deals.length }} active deals</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Original Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="deals.length === 0">
              <td colspan="6" class="empty">No deals found — add discounts to products to see them here.</td>
            </tr>
            <tr v-for="d in deals" :key="d.id">
              <td class="product-cell">
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
              </td>
              <td>{{ d.category?.name || '—' }}</td>
              <td class="mono">${{ Number(d.price).toFixed(2) }}</td>
              <td>
                <span class="discount-badge">-{{ d.discountPercent }}%</span>
              </td>
              <td class="mono final-price">${{ Number(d.finalPrice).toFixed(2) }}</td>
              <td>
                <span :class="['stock-tag', d.stock <= 0 ? 'out' : d.stock < 10 ? 'low' : 'ok']">
                  {{ d.stock <= 0 ? 'Out of stock' : d.stock }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, AlertCircle, ImageOff } from 'lucide-vue-next'
import axios from '@/lib/axios'

const deals = ref([])
const loading = ref(true)
const error = ref(null)

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

.final-price {
  color: #4ade80;
}

.empty {
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.4);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
}

.thumb-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
}

.product-name {
  font-weight: 500;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.discount-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.stock-tag {
  font-size: 13px;
  font-weight: 500;
}

.stock-tag.ok {
  color: #4ade80;
}

.stock-tag.low {
  color: #facc15;
}

.stock-tag.out {
  color: #f87171;
}
</style>
