<template>
  <section class="brand-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <Layers :size="18" />
        </div>
        <div>
          <h1 class="title">Brands</h1>
          <p class="subtitle">Manage your store brands</p>
        </div>
      </div>
      <div class="header-actions">
        <RouterLink to="/dashboard/brands/create" class="btn-add">
          <Plus :size="16" />
          Add Brand
        </RouterLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-box">
      <Loader2 :size="28" class="animate-spin" />
      <span>Loading brands…</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-box error">
      <AlertCircle :size="28" />
      <span>{{ error }}</span>
      <button class="btn-retry" @click="fetchBrands">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !error && brands.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <Layers :size="48" />
        </div>
        <h3 class="empty-title">No brands found</h3>
        <p class="empty-description">
          You haven't created any brands yet. Start by adding your first brand to organize your products.
        </p>
        <div class="empty-actions">
          <RouterLink to="/dashboard/brands/create" class="btn-primary">
            <Plus :size="16" />
            Create your first brand
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Inventor</th>
            <th>Inventor Photo</th>
            <th>Created</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brands" :key="brand.id">
            <td>
              <img
                v-if="brand.logoUrl"
                :src="toUrl(brand.logoUrl)"
                class="thumb"
                alt="logo"
              />
              <div v-else class="thumb placeholder-thumb">
                <ImageIcon :size="16" />
              </div>
            </td>
            <td class="name-cell">{{ brand.name }}</td>
            <td>{{ brand.inventorName }}</td>
            <td>
              <img
                v-if="brand.inventorImageUrl"
                :src="toUrl(brand.inventorImageUrl)"
                class="thumb round"
                alt="inventor"
              />
              <span v-else class="no-image">—</span>
            </td>
            <td class="date-cell">{{ fmtDate(brand.createdAt) }}</td>
            <td class="actions-cell">
              <RouterLink
                :to="`/dashboard/brands/${brand.id}/edit`"
                class="btn-icon edit"
                title="Edit"
              >
                <Pencil :size="15" />
              </RouterLink>
              <button
                class="btn-icon delete"
                title="Delete"
                @click="confirmDelete(brand)"
              >
                <Trash2 :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <ConfirmModal
      :isOpen="deleteModal.open"
      type="danger"
      :title="'Delete ' + (deleteModal.brand?.name || 'Brand') + '?'"
      message="This action cannot be undone. The brand and its logo will be permanently removed."
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
  Layers, Plus, Loader2, AlertCircle,
  Pencil, Trash2, ImageIcon,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'

const API = 'http://localhost:3000'
const toUrl = (img) => (img?.startsWith('http') ? img : API + img)

const toast = useToast()

const brands = ref([])
const loading = ref(true)
const error = ref(null)

// --- Delete modal ---
const deleteModal = ref({ open: false, brand: null, loading: false })

function confirmDelete(brand) {
  deleteModal.value = { open: true, brand, loading: false }
}

async function onDelete() {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/brands/${deleteModal.value.brand.id}`)
    brands.value = brands.value.filter((b) => b.id !== deleteModal.value.brand.id)
    toast.success(`"${deleteModal.value.brand.name}" deleted.`, 'Brand Deleted')
    deleteModal.value.open = false
  } catch (err) {
    const msg = err?.response?.data?.message || err.message
    toast.error(msg, 'Delete Failed')
  } finally {
    deleteModal.value.loading = false
  }
}

// --- Fetch ---
async function fetchBrands() {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('/brands')
    const result = response.data
    // Ensure we always have an array
    brands.value = Array.isArray(result) ? result : []
  } catch (err) {
    console.error('Failed to fetch brands:', err)
    brands.value = [] // Reset to empty array on error
    error.value = err?.response?.data?.message || err.message || 'Failed to load brands'
  } finally {
    loading.value = false
  }
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

onMounted(fetchBrands)
</script>

<style scoped>
/* ── Layout ── */
.brand-list {
  max-width: 1100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  display: grid;
  place-items: center;
  color: #fff3cd;
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

/* ── Buttons ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #fff3cd;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #ffe69c;
}

.btn-add.small {
  padding: 8px 14px;
  font-size: 12px;
}

.btn-retry {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.btn-retry:hover {
  background: rgba(255, 255, 255, 0.14);
}

/* ── State boxes ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 24px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.state-box.error {
  color: #f87171;
}

/* ── Enhanced Empty State ── */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px;
}

.empty-content {
  text-align: center;
  max-width: 420px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  display: grid;
  place-items: center;
  color: rgba(255, 243, 205, 0.6);
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 12px;
}

.empty-description {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 28px;
}

.empty-actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #fff3cd;
  color: #0a0a0a;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 243, 205, 0.15);
}

.btn-primary:hover {
  background: #ffe69c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 243, 205, 0.25);
}

/* ── spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ── Table ── */
.table-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

tbody td {
  padding: 12px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.name-cell {
  font-weight: 600;
  color: #fff;
}

.date-cell {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.no-image {
  color: rgba(255, 255, 255, 0.25);
}

/* Thumbs */
.thumb {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  background: white;
}

.thumb.round {
  border-radius: 50%;
  object-fit: cover;
}

.placeholder-thumb {
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.25);
}

/* Actions */
.actions-col {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
}

.btn-icon.edit {
  background: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
}

.btn-icon.edit:hover {
  background: rgba(96, 165, 250, 0.22);
}

.btn-icon.delete {
  background: rgba(248, 113, 113, 0.12);
  color: #f87171;
}

.btn-icon.delete:hover {
  background: rgba(248, 113, 113, 0.22);
}
</style>
