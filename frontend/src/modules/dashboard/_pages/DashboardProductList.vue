<template>
  <section class="product-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <ShoppingBag :size="18" />
        </div>
        <div>
          <h1 class="title">Products</h1>
          <p class="subtitle">Manage your store products</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <Search :size="15" class="search-icon" />
          <input
            v-model="searchQuery"
            placeholder="Search products…"
            @input="debouncedFetch"
          />
        </div>
        <RouterLink to="/dashboard/products/create" class="btn-add">
          <Plus :size="16" />
          Add Product
        </RouterLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && products.length === 0" class="state-box">
      <Loader2 :size="28" class="animate-spin" />
      <span>Loading products…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box error">
      <AlertCircle :size="28" />
      <span>{{ error }}</span>
      <button class="btn-retry" @click="fetchProducts">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="products.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <ShoppingBag :size="48" />
        </div>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-description">
          {{ searchQuery
            ? 'No products match your search. Try a different keyword.'
            : "You haven't created any products yet. Start by adding your first product."
          }}
        </p>
        <div v-if="!searchQuery" class="empty-actions">
          <RouterLink to="/dashboard/products/create" class="btn-primary">
            <Plus :size="16" />
            Create your first product
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="idx-col">#</th>
            <th class="img-col">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th class="num-col">Price</th>
            <th class="num-col">Discount</th>
            <th class="num-col">Stock</th>
            <th class="feat-col">Featured</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in products" :key="p.id">
            <td class="idx-cell">{{ (currentPage - 1) * pageSize + i + 1 }}</td>
            <td>
              <img
                v-if="p.imageUrl"
                :src="p.imageUrl"
                class="thumb"
                alt="product"
              />
              <div v-else class="thumb placeholder-thumb">
                <ImageIcon :size="16" />
              </div>
            </td>
            <td class="name-cell">{{ p.name }}</td>
            <td class="cat-cell">{{ p.category?.name || '—' }}</td>
            <td class="brand-cell">{{ p.brand?.name || '—' }}</td>
            <td class="num-cell">${{ Number(p.price).toFixed(2) }}</td>
            <td class="num-cell">
              <span v-if="p.discountPercent > 0" class="discount-badge">
                {{ p.discountPercent }}%
              </span>
              <span v-else class="no-discount">—</span>
            </td>
            <td class="num-cell">
              <span :class="{ 'out-of-stock': p.stock === 0 }">{{ p.stock }}</span>
            </td>
            <td class="feat-cell">
              <button
                class="btn-star"
                :class="{ active: p.isFeatured }"
                :title="p.isFeatured ? 'Remove from featured' : 'Mark as featured'"
                @click="toggleFeatured(p)"
              >
                <Star :size="16" :fill="p.isFeatured ? 'currentColor' : 'none'" />
              </button>
            </td>
            <td class="actions-cell">
              <div class="actions-inner">
                <RouterLink
                  :to="`/dashboard/products/${p.id}/edit`"
                  class="btn-icon edit"
                  title="Edit"
                >
                  <Pencil :size="15" />
                </RouterLink>
                <button
                  class="btn-icon delete"
                  title="Delete"
                  @click="confirmDelete(p)"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
          <span class="page-total">({{ totalItems }} products)</span>
        </span>
        <button
          class="page-btn"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Delete modal -->
    <ConfirmModal
      :isOpen="deleteModal.open"
      type="danger"
      :title="'Delete ' + (deleteModal.product?.name || 'Product') + '?'"
      message="This action cannot be undone. The product will be permanently removed."
      confirmText="Delete"
      :loading="deleteModal.loading"
      @confirm="onDelete"
      @cancel="deleteModal.open = false"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ShoppingBag, Plus, Loader2, AlertCircle,
  Pencil, Trash2, Search, ImageIcon,
  ChevronLeft, ChevronRight, Star,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const products = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = 12
const totalPages = ref(1)
const totalItems = ref(0)

// Delete modal
const deleteModal = ref({ open: false, product: null, loading: false })

let debounceTimer = null
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 350)
}

async function fetchProducts() {
  loading.value = true
  error.value = null
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize,
    }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    const { data } = await axios.get('/products', { params })
    products.value = data.data || []
    totalPages.value = data.totalPages || 1
    totalItems.value = data.total || 0
  } catch (err) {
    error.value = err?.response?.data?.message || err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchProducts()
}

function confirmDelete(product) {
  deleteModal.value = { open: true, product, loading: false }
}

async function onDelete() {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/products/${deleteModal.value.product.id}`)
    toast.success(`"${deleteModal.value.product.name}" deleted.`, 'Product Deleted')
    deleteModal.value.open = false
    fetchProducts()
  } catch (err) {
    const msg = err?.response?.data?.message || err.message
    toast.error(Array.isArray(msg) ? msg.join(', ') : msg, 'Delete Failed')
  } finally {
    deleteModal.value.loading = false
  }
}

async function toggleFeatured(product) {
  const newVal = !product.isFeatured
  try {
    const fd = new FormData()
    fd.append('isFeatured', String(newVal))
    await axios.patch(`/products/${product.id}`, fd)
    product.isFeatured = newVal
    toast.success(
      newVal ? `"${product.name}" marked as featured.` : `"${product.name}" removed from featured.`,
      'Updated',
    )
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update featured status', 'Error')
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.18);
  display: grid;
  place-items: center;
  color: #60a5fa;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ── Search ── */
.search-box {
  position: relative;
}

.search-box .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
}

.search-box input {
  padding: 9px 14px 9px 34px;
  background: rgba(255, 255, 255, 0.06);
  /* border color changed to match Add Product blue (only the border) */
  border: 1px solid rgba(61, 169, 255, 0.18);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  width: 200px;
  outline: none;
  transition: border 0.2s;
}

.search-box input:focus {
  border-color: rgba(61, 169, 255, 0.35);
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

/* ── Add button ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  box-shadow: 0 4px 14px rgba(61, 169, 255, 0.3);
  border: 1px solid rgba(255, 243, 205, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61, 169, 255, 0.45);
}

/* ── States ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.state-box.error { color: #f87171; }

.btn-retry {
  margin-top: 6px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.btn-retry:hover { background: rgba(255, 255, 255, 0.1); }

/* ── Empty ── */
.empty-state {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 243, 205, 0.06);
  border: 1px solid rgba(255, 243, 205, 0.12);
  display: grid;
  place-items: center;
  color: rgba(255, 243, 205, 0.5);
  margin: 0 auto 20px;
}

.empty-title {
  color: #fff;
  font-size: 18px;
  margin: 0 0 8px;
}

.empty-description {
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px;
}

.empty-actions { margin-top: 8px; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(255, 243, 205, 0.12);
  border: 1px solid rgba(255, 243, 205, 0.2);
  border-radius: 8px;
  color: #fff3cd;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-primary:hover { background: rgba(255, 243, 205, 0.2); }

/* ── Table ── */
.table-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
}

tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

/* Column widths */
.idx-col { width: 40px; }
.img-col { width: 56px; }
.num-col { width: 80px; text-align: right; }
.actions-col { width: 90px; text-align: right; }
.feat-col { width: 70px; text-align: center; }

.idx-cell {
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
}

.name-cell {
  font-weight: 600;
  color: #fff;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cat-cell, .brand-cell {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.num-cell {
  text-align: right;
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 13px;
}

.discount-badge {
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.no-discount {
  color: rgba(255, 255, 255, 0.25);
}

.out-of-stock {
  color: #f87171;
  font-weight: 600;
}

/* ── Featured star ── */
.feat-cell {
  text-align: center;
}

.btn-star {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.25);
  transition: all 0.2s ease;
}

.btn-star:hover {
  background: rgba(250, 204, 21, 0.12);
  color: #facc15;
}

.btn-star.active {
  color: #facc15;
  background: rgba(250, 204, 21, 0.12);
}

/* ── Thumbnail ── */
.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.placeholder-thumb {
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.25);
}

/* ── Action buttons ── */
.actions-cell {
  text-align: right;
}

.actions-inner {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
}

.btn-icon.edit {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
}

.btn-icon.edit:hover {
  background: rgba(96, 165, 250, 0.2);
}

.btn-icon.delete {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
}

.btn-icon.delete:hover {
  background: rgba(248, 113, 113, 0.2);
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.page-total {
  color: rgba(255, 255, 255, 0.35);
}

/* ── Spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
