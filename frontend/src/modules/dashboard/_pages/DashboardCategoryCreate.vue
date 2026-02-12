<template>
  <section class="category-form">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="$router.push('/dashboard/categories')">
          <ArrowLeft :size="18" />
        </button>
        <div>
          <h1 class="title">Create Category</h1>
          <p class="subtitle">Add a new product category</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-clear" type="button" @click="resetForm">
          <RotateCcw :size="16" />
          Reset
        </button>
        <button class="btn-submit" :disabled="submitting" @click="submit">
          <Loader2 v-if="submitting" :size="16" class="animate-spin" />
          <Plus v-else :size="16" />
          {{ submitting ? 'Creating…' : 'Create Category' }}
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="formError" class="error-banner">
      <AlertCircle :size="16" />
      <span>{{ formError }}</span>
      <button class="close-error" @click="formError = null">&times;</button>
    </div>

    <!-- Form Card -->
    <div class="card">
      <div class="card-header icon-only">
            <LayoutGrid :size="18" />
            <h3>Category Information</h3>
          </div>
      <div class="card-body">
        <div class="field">
          <label for="catName">Category Name <span class="required">*</span></label>
          <input
            id="catName"
            v-model="form.name"
            placeholder="e.g. Smartphones"
            @keyup.enter="submit"
          />
        </div>
      </div>
    </div>

    <!-- Icon Selector Card -->
    <div class="card icon-card">
      <div class="card-header icon-only">
        <Palette :size="18" />
        <h3>Category Icon</h3>
        <span class="badge-ui">Optional</span>
      </div>
      <div class="card-body">
        <!-- Preview -->
        <div class="icon-preview">
          <div class="preview-circle">
            <component :is="activeIconComponent" :size="32" />
          </div>
          <div class="preview-info">
            <span class="preview-label">{{ activeIconEntry.label }}</span>
            <span class="preview-hint">
              {{ isAutoSuggested ? 'Auto-suggested from name' : 'Manually selected' }}
            </span>
          </div>
        </div>

        <!-- Grid -->
        <p class="picker-label">Choose an icon</p>
        <div class="icon-grid">
          <button
            v-for="ico in ICON_PALETTE"
            :key="ico.key"
            class="icon-btn"
            :class="{ selected: selectedIconKey === ico.key }"
            :title="ico.label"
            type="button"
            @click="pickIcon(ico.key)"
          >
            <component :is="ico.component" :size="20" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Plus, RotateCcw, Loader2,
  LayoutGrid, AlertCircle, Palette,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useToast } from '@/composables/useToast'
import { ICON_PALETTE, FALLBACK_ICON, suggestIconKey } from '@/composables/useCategoryIcon'

const router = useRouter()
const toast = useToast()

const form = ref({ name: '' })
const formError = ref(null)
const submitting = ref(false)

// ── Icon selector (persisted as iconKey) ──
const selectedIconKey = ref(null)          // null = auto-suggest mode
const suggestedKey = computed(() => suggestIconKey(form.value.name))
const isAutoSuggested = computed(() => selectedIconKey.value === null)
const effectiveKey = computed(() => selectedIconKey.value ?? suggestedKey.value)
const activeIconEntry = computed(
  () => ICON_PALETTE.find((p) => p.key === effectiveKey.value) || ICON_PALETTE.at(-1),
)
const activeIconComponent = computed(() => activeIconEntry.value?.component || FALLBACK_ICON)

function pickIcon(key) {
  // Clicking the already-selected icon reverts to auto-suggest
  selectedIconKey.value = key === selectedIconKey.value ? null : key
}

// Reset manual pick when name changes to match a new auto-suggest
watch(() => form.value.name, () => {
  if (selectedIconKey.value && suggestedKey.value !== 'boxes') {
    selectedIconKey.value = null
  }
})

function resetForm() {
  form.value = { name: '' }
  formError.value = null
  selectedIconKey.value = null
}

async function submit() {
  formError.value = null

  if (!form.value.name.trim()) {
    formError.value = 'Category name is required.'
    return
  }

  submitting.value = true
  try {
    await axios.post('/categories', {
      name: form.value.name.trim(),
      iconKey: effectiveKey.value,
    })
    toast.success(`"${form.value.name}" created.`, 'Category Created')
    router.push('/dashboard/categories')
  } catch (err) {
    const msg = err?.response?.data?.message
    formError.value = Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Failed to create category'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.category-form {
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-back {
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

.btn-back:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61, 169, 255, 0.45); 
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: rgba(148, 163, 184, 0.8);
  margin: 2px 0 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* ── Buttons ── */
.btn-clear {
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

.btn-clear:hover {
  transform: translateY(-1px);
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.18);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  box-shadow: 0 4px 14px rgba(61, 169, 255, 0.3);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61, 169, 255, 0.45);
  
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.12);
}

.btn-submit:focus-visible {
  outline: 3px solid rgba(16, 185, 129, 0.18);
  outline-offset: 2px;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Error banner ── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: 10px;
  color: #f87171;
  font-size: 13px;
  margin-bottom: 20px;
}

.close-error {
  margin-left: auto;
  background: none;
  border: none;
  color: #f87171;
  font-size: 18px;
  cursor: pointer;
}

/* ── Card ── */
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.required {
  color: #f87171;
}

/* Make only the header icons blue for specific category headers */
::v-deep .card-header.icon-only svg {
  color: #60a5fa;
  stroke: currentColor;
  fill: none;
}

/* ── Field ── */
.field {
  margin-bottom: 0;
}

.field label {
  display: block;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
}

.field input:focus {
  border-color: rgba(61, 169, 255, 0.5);
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

/* ── Icon Card ── */
.icon-card {
  margin-top: 16px;
}

.badge-ui {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(61, 169, 255, 0.1);
  border: 1px solid rgba(61, 169, 255, 0.2);
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.icon-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.preview-circle {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: rgba(61, 169, 255, 0.08);
  border: 1px solid rgba(61, 169, 255, 0.18);
  display: grid;
  place-items: center;
  color: #60a5fa;
  flex-shrink: 0;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preview-label {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.preview-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.picker-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 10px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
  gap: 6px;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(61, 169, 255, 0.08);
  border: 1px solid rgba(61, 169, 255, 0.18);
  color: #60a5fa;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61, 169, 255, 0.45);
}

.icon-btn.selected {
  background: rgba(61, 169, 255, 0.12);
  border-color: rgba(61, 169, 255, 0.35);
  color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(61, 169, 255, 0.1);
}

/* ── Spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
