<template>
  <section class="category-list">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <LayoutGrid :size="18" />
        </div>
        <div>
          <h1 class="title">Categories</h1>
          <p class="subtitle">Manage your product categories</p>
        </div>
      </div>
      <div class="header-actions">
        <RouterLink to="/dashboard/categories/create" class="btn-add">
          <Plus :size="16" />
          Add Category
        </RouterLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <Loader2 :size="28" class="animate-spin" />
      <span>Loading categories…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box error">
      <AlertCircle :size="28" />
      <span>{{ error }}</span>
      <button class="btn-retry" @click="fetchCategories">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="categories.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <LayoutGrid :size="48" />
        </div>
        <h3 class="empty-title">No categories found</h3>
        <p class="empty-description">
          You haven't created any categories yet. Start by adding your first category to organize your products.
        </p>
        <div class="empty-actions">
          <RouterLink to="/dashboard/categories/create" class="btn-primary">
            <Plus :size="16" />
            Create your first category
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
            <th class="icon-col">Icon</th>
            <th>Name</th>
            <th>Created</th>
            <th>Updated</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cat, i) in categories" :key="cat.id">
            <td class="idx-cell">{{ i + 1 }}</td>
            <td class="icon-cell">
              <component :is="getIcon(cat)" :size="18" />
            </td>
            <td class="name-cell">{{ cat.name }}</td>
            <td class="date-cell">{{ fmtDate(cat.createdAt) }}</td>
            <td class="date-cell">{{ fmtDate(cat.updatedAt) }}</td>
            <td class="actions-cell">
              <RouterLink
                :to="`/dashboard/categories/${cat.id}/edit`"
                class="btn-icon edit"
                title="Edit"
              >
                <Pencil :size="15" />
              </RouterLink>
              <button
                class="btn-icon delete"
                title="Delete"
                @click="confirmDelete(cat)"
              >
                <Trash2 :size="15" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete modal -->
    <ConfirmModal
      :isOpen="deleteModal.open"
      type="danger"
      :title="'Delete ' + (deleteModal.cat?.name || 'Category') + '?'"
      message="This action cannot be undone. The category will be permanently removed."
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
  LayoutGrid, Plus, Loader2, AlertCircle,
  Pencil, Trash2,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useToast } from '@/composables/useToast'
import { getCategoryIcon, ICON_PALETTE } from '@/composables/useCategoryIcon'

const toast = useToast()

// Use persisted iconKey when available, fall back to name-based suggestion
const getIcon = (cat) => {
  if (cat.iconKey) {
    const entry = ICON_PALETTE.find((p) => p.key === cat.iconKey)
    if (entry) return entry.component
  }
  return getCategoryIcon(cat.name)
}

const categories = ref([])
const loading = ref(true)
const error = ref(null)

const deleteModal = ref({ open: false, cat: null, loading: false })

function confirmDelete(cat) {
  deleteModal.value = { open: true, cat, loading: false }
}

async function onDelete() {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/categories/${deleteModal.value.cat.id}`)
    categories.value = categories.value.filter((c) => c.id !== deleteModal.value.cat.id)
    toast.success(`"${deleteModal.value.cat.name}" deleted.`, 'Category Deleted')
    deleteModal.value.open = false
  } catch (err) {
    const msg = err?.response?.data?.message || err.message
    toast.error(Array.isArray(msg) ? msg.join(', ') : msg, 'Delete Failed')
  } finally {
    deleteModal.value.loading = false
  }
}

async function fetchCategories() {
  loading.value = true
  error.value = null
  try {
    const { data } = await axios.get('/categories')
    categories.value = Array.isArray(data) ? data : []
  } catch (err) {
    categories.value = []
    error.value = err?.response?.data?.message || err.message || 'Failed to load categories'
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

onMounted(fetchCategories)
</script>

<style scoped>
.category-list {
  max-width: 900px;
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

/* ── States ── */
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

/* ── Spin ── */
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

.idx-col {
  width: 50px;
}

.idx-cell {
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
}

.icon-col {
  width: 50px;
}

.icon-cell {
  color: #fff3cd;
  text-align: center;
}

.name-cell {
  font-weight: 600;
  color: #fff;
}

.date-cell {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

/* ── Actions ── */
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
