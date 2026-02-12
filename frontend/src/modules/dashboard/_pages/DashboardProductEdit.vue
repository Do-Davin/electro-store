<template>
  <section class="edit-product">
    <!-- Loading -->
    <div v-if="pageLoading" class="state-box">
      <Loader2 :size="28" class="animate-spin" />
      <p>Loading product…</p>
    </div>

    <!-- Error loading -->
    <div v-else-if="loadError" class="state-box error">
      <AlertCircle :size="28" />
      <p>{{ loadError }}</p>
      <button class="btn-retry" @click="fetchProduct">Retry</button>
    </div>

    <!-- Form -->
    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" @click="$router.push('/dashboard/products/list')">
            <ArrowLeft :size="18" />
          </button>
          <div>
            <h1 class="title">Edit Product</h1>
            <p class="subtitle">Update "{{ originalName }}"</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-clear" type="button" @click="resetForm">
            <RotateCcw :size="16" />
            Reset
          </button>
          <button class="btn-submit" :disabled="submitting" @click="submit">
            <Loader2 v-if="submitting" :size="16" class="animate-spin" />
            <Save v-else :size="16" />
            {{ submitting ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Error Banner -->
      <div v-if="formError" class="error-banner">
        <AlertCircle :size="16" />
        <span>{{ formError }}</span>
        <button class="close-error" @click="formError = null">&times;</button>
      </div>

      <!-- Row 1 : Image + Product Info -->
      <div class="row-2col">
        <!-- Image Upload Card -->
        <div class="card">
          <div class="card-header">
            <ImageIcon :size="18" />
            <h3>Product Image</h3>
          </div>
          <div class="image-upload" @click="triggerFile">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="onFileChange"
            />
            <div v-if="preview" class="preview">
              <img :src="preview" />
              <div class="preview-overlay">
                <Upload :size="20" />
                <span>Change Image</span>
              </div>
            </div>
            <div v-else class="placeholder">
              <div class="upload-icon-wrap">
                <Upload :size="28" />
              </div>
              <span class="upload-title">Upload New Image</span>
              <span class="upload-hint">Click to browse · JPG, PNG, WEBP</span>
            </div>
          </div>
        </div>

        <!-- Product Information Card -->
        <div class="card">
          <div class="card-header">
            <FileText :size="18" />
            <h3>Product Information</h3>
          </div>
          <div class="card-body">
            <div class="field">
              <label>Product Name</label>
              <input v-model="form.name" placeholder="Enter product name" />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea
                v-model="form.description"
                placeholder="Enter product description"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2 : Pricing + Inventory -->
      <div class="row-2col">
        <div class="card">
          <div class="card-header">
            <DollarSign :size="18" />
            <h3>Pricing</h3>
          </div>
          <div class="card-body">
            <div class="field-row">
              <div class="field">
                <label>Actual Price ($)</label>
                <input type="number" v-model.number="form.price" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div class="field">
                <label>Offer Price ($)</label>
                <input type="number" v-model.number="offerPrice" placeholder="0.00" min="0" step="0.01" />
              </div>
            </div>
            <div class="pricing-summary">
              <div class="pricing-row">
                <span class="pricing-label">Discount</span>
                <span class="pricing-value" :class="{ 'has-discount': discountPercent > 0 }">{{ discountPercent }}%</span>
              </div>
              <div v-if="offerPrice && offerPrice < form.price" class="pricing-row">
                <span class="pricing-label">You save</span>
                <span class="pricing-value save">${{ (form.price - offerPrice).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <Package :size="18" />
            <h3>Inventory</h3>
          </div>
          <div class="card-body">
            <div class="field">
              <label>Stock Quantity</label>
              <input type="number" v-model.number="form.stock" placeholder="0" min="0" />
            </div>
            <div class="featured-toggle" @click="form.isFeatured = !form.isFeatured">
              <div class="toggle-star" :class="{ active: form.isFeatured }">
                <Star :size="18" :fill="form.isFeatured ? 'currentColor' : 'none'" />
              </div>
              <div class="toggle-text">
                <span class="toggle-label">Featured Product</span>
                <span class="toggle-hint">{{ form.isFeatured ? 'Shown in Featured section' : 'Not featured' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 3 : Category + Brand -->
      <div class="row-2col">
        <div class="card">
          <div class="card-header">
            <LayoutGrid :size="18" />
            <h3>Category</h3>
          </div>
          <div class="card-body">
            <div class="field">
              <label>Select Category</label>
              <select v-model="form.categoryId">
                <option disabled value="">Select a category</option>
                <option
                  v-for="c in categories"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <Tag :size="18" />
            <h3>Brand</h3>
          </div>
          <div class="card-body">
            <div class="brand-picker">
              <div
                v-for="b in brands"
                :key="b.id"
                class="brand-card"
                :class="{ active: form.brandId === b.id }"
                @click="form.brandId = b.id"
              >
                <img :src="toUrl(b.logoUrl)" draggable="false" />
                <span>{{ b.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 4 : Specifications (full width) -->
      <div class="card">
        <div class="card-header">
          <Settings :size="18" />
          <h3>Specifications</h3>
        </div>
        <div class="card-body">
          <SpecsEditor v-model="form.specs" :allowCustom="true" />
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft, Save, RotateCcw, Loader2, AlertCircle,
  Upload, ImageIcon, DollarSign, Package, FileText,
  LayoutGrid, Tag, Settings, Star,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useProductStore } from '@/modules/product/_stores/product.store'
import SpecsEditor from '../_components/SpecsEditor.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const toast = useToast()

const API = 'http://localhost:3000'
const toUrl = (img) => img?.startsWith('http') ? img : API + img

// Page state
const pageLoading = ref(true)
const loadError = ref(null)
const submitting = ref(false)
const formError = ref(null)
const originalName = ref('')

// File upload
const fileInput = ref(null)
const file = ref(null)
const preview = ref(null)

// Dropdowns
const categories = ref([])
const brands = ref([])

// Form
const form = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  brandId: '',
  stock: 0,
  isFeatured: false,
  specs: {},
})

const offerPrice = ref(0)

const discountPercent = computed(() => {
  if (!offerPrice.value || offerPrice.value >= form.value.price) return 0
  return Math.round(
    ((form.value.price - offerPrice.value) / form.value.price) * 100,
  )
})

// Original data for reset
let originalData = null

function triggerFile() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  file.value = f
  preview.value = URL.createObjectURL(f)
}

function resetForm() {
  if (originalData) {
    populateForm(originalData)
  }
  file.value = null
  formError.value = null
}

function populateForm(data) {
  originalName.value = data.name
  form.value = {
    name: data.name,
    description: data.description || '',
    price: Number(data.price) || 0,
    categoryId: data.category?.id || '',
    brandId: data.brand?.id || '',
    stock: Number(data.stock) || 0,
    isFeatured: !!data.isFeatured,
    specs: data.specs || {},
  }

  // Compute offer price from discount
  const discount = Number(data.discountPercent) || 0
  if (discount > 0 && form.value.price > 0) {
    offerPrice.value = +(form.value.price * (1 - discount / 100)).toFixed(2)
  } else {
    offerPrice.value = 0
  }

  // Set existing image preview
  preview.value = data.imageUrl || null
}

async function fetchProduct() {
  pageLoading.value = true
  loadError.value = null
  try {
    // Fetch product, categories, brands in parallel
    const [productRes, brandsRes] = await Promise.all([
      axios.get(`/products/${route.params.id}`),
      axios.get('/brands'),
    ])
    await productStore.fetchCategories()
    categories.value = productStore.categories.filter((c) => c.id !== 'all')
    brands.value = brandsRes.data

    const data = productRes.data
    originalData = data
    populateForm(data)
  } catch (err) {
    loadError.value = err?.response?.data?.message || err.message || 'Failed to load product'
  } finally {
    pageLoading.value = false
  }
}

async function submit() {
  formError.value = null

  if (!form.value.name) {
    formError.value = 'Product name is required.'
    return
  }
  if (!form.value.categoryId) {
    formError.value = 'Please select a category.'
    return
  }
  if (!form.value.brandId) {
    formError.value = 'Please select a brand.'
    return
  }

  submitting.value = true
  try {
    const fd = new FormData()
    if (file.value) {
      fd.append('image', file.value)
    }
    fd.append('name', form.value.name)
    fd.append('description', form.value.description)
    fd.append('price', String(form.value.price))
    fd.append('discountPercent', String(discountPercent.value))
    fd.append('categoryId', form.value.categoryId)
    fd.append('brandId', form.value.brandId)
    fd.append('stock', String(form.value.stock))
    fd.append('isFeatured', String(form.value.isFeatured))
    fd.append('specs', JSON.stringify(form.value.specs))

    await axios.patch(`/products/${route.params.id}`, fd)
    toast.success(`"${form.value.name}" updated.`, 'Product Updated')

    // Refresh store in background
    try {
      await productStore.fetchProducts()
    } catch { /* silent */ }

    router.push('/dashboard/products/list')
  } catch (err) {
    const msg = err?.response?.data?.message
    formError.value = Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Failed to update product'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.edit-product {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  color: white;
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

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
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
  align-items: center;
}

/* ── Buttons ── */
.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
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
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  color: white;
  box-shadow: 0 4px 14px rgba(61, 169, 255, 0.3);
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.16);
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(16, 185, 129, 0.22);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.12);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* keep the submit icon white */
::v-deep .btn-submit svg {
  color: white !important;
  stroke: currentColor !important;
  fill: none !important;
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
}

.close-error {
  margin-left: auto;
  background: none;
  border: none;
  color: #f87171;
  font-size: 18px;
  cursor: pointer;
}

/* ── Row Layout ── */
.row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
}

/* ── Card ── */
.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s ease;
  width: 100%;
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.14);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.card-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Image Upload ── */
.image-upload {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.12);
  transition: all 0.25s ease;
}

.image-upload:hover {
  background: rgba(61, 169, 255, 0.06);
  border-color: rgba(61, 169, 255, 0.35);
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(96,165,250,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  margin-bottom: 4px;
}

.upload-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.upload-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

.preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview img {
  max-height: 190px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 13px;
  font-weight: 500;
}

.image-upload:hover .preview-overlay {
  opacity: 1;
}

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

input,
textarea,
select {
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 14px;
  color: white;
  font-size: 14px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3da9ff;
  background: rgba(61, 169, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(61, 169, 255, 0.1);
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

textarea {
  min-height: 110px;
  resize: vertical;
}

select option {
  background: #0a2744;
  color: white;
}

/* ── Pricing Summary ── */
.pricing-summary {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.pricing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pricing-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.pricing-value {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
}

.pricing-value.has-discount { color: #3da9ff; }
.pricing-value.save { color: #4ade80; }

/* ── Featured Toggle ── */
.featured-toggle {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.featured-toggle:hover {
  background: rgba(250, 204, 21, 0.06);
  border-color: rgba(250, 204, 21, 0.2);
}

.toggle-star {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.toggle-star.active {
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.toggle-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Brand Picker ── */
.brand-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.brand-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.brand-card:hover { background: rgba(255, 255, 255, 0.1); }

.brand-card.active {
  border-color: #3da9ff;
  background: rgba(61, 169, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(61, 169, 255, 0.1);
}

.brand-card img {
  max-width: 48px;
  max-height: 32px;
  object-fit: contain;
}

.brand-card span {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

/* ── Spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .row-2col {
    grid-template-columns: 1fr;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .title {
    font-size: 20px;
  }

  .brand-picker {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>
