<template>
  <section class="add-product">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <Plus :size="18" />
        </div>
        <div>
          <h1 class="title">Add New Product</h1>
          <p class="subtitle">Fill in the details below to add a new product to your store</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-clear" type="button" @click="resetForm">
          <RotateCcw class="reset-icon" :size="16" />
          Reset
        </button>
        <button class="btn-submit" :disabled="loading" @click="submit">
          <Loader2 v-if="loading" :size="16" class="animate-spin" />
          <Plus v-else class="submit-icon" :size="16" />
          {{ loading ? 'Adding...' : 'Add Product' }}
        </button>
      </div>
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
            <span class="upload-title">Upload Product Image</span>
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
        <SpecsEditor v-model="form.specs" :allowCustom="false" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/lib/axios'
import { Upload, RotateCcw, Plus, Loader2, ImageIcon, DollarSign, Package, FileText, LayoutGrid, Tag, Settings } from 'lucide-vue-next'
import { useProductStore } from '@/modules/product/_stores/product.store'
import SpecsEditor from '../_components/SpecsEditor.vue'
import { useToast } from '@/composables/useToast'
import { CATEGORY_SPEC_PRESETS } from '@/modules/product/_documents/category-spec-presets'

const CATEGORY_PRESET_MAP = {
  smartphones: 'phone',
  laptops: 'laptop',
  tablets: 'tablet',
  accessories: 'accessories',
  smartwatch: 'smartwatch',
}

const productStore = useProductStore()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const preview = ref(null)
const loading = ref(false)

const categories = ref([])
const brands = ref([])

const API = 'http://localhost:3000'
// const API = import.meta.env.VITE_API_URL

const toUrl = (img) =>
  img?.startsWith('http') ? img : API + img

const form = ref({
  name: '',
  description: '',
  price: 0,
  discountPercent: 0,
  categoryId: '',
  brandId: '',
  stock: 0,
  specs: {},
})

const offerPrice = ref(0)

const discountPercent = computed(() => {
  if (!offerPrice.value || offerPrice.value >= form.value.price) return 0
  return Math.round(
    ((form.value.price - offerPrice.value) / form.value.price) * 100
  )
})

function triggerFile() {
  fileInput.value.click()
}

function onFileChange(e) {
  const f = e.target.files?.[0]
  if (!f) return

  file.value = f
  preview.value = URL.createObjectURL(f)
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    price: 0,
    discountPercent: 0,
    categoryId: '',
    brandId: '',
    stock: 0,
    specs: {},
  }
  offerPrice.value = 0
  file.value = null
  preview.value = null
}

async function submit() {
  if (!file.value) return toast.warning('Please upload a product image.', 'Image Required')
  if (!form.value.name) return toast.warning('Please enter a product name.', 'Name Required')
  if (!form.value.categoryId) return toast.warning('Please select a category.', 'Category Required')
  if (!form.value.brandId) return toast.warning('Please select a brand.', 'Brand Required')

  loading.value = true

  try {
    const fd = new FormData()
    fd.append('image', file.value)
    fd.append('name', form.value.name)
    fd.append('description', form.value.description)
    fd.append('price', String(form.value.price))
    fd.append('discountPercent', String(discountPercent.value))
    fd.append('categoryId', form.value.categoryId)
    fd.append('brandId', form.value.brandId)
    fd.append('stock', String(form.value.stock))
    fd.append('specs', JSON.stringify(form.value.specs))

    const res = await axios.post('/products', fd)

    // backend responses vary. Handle both common shapes.
    const created =
      res.data?.data ??
      res.data?.product ??
      res.data

    // Show success toast immediately (before store ops that might throw)
    toast.success('Product has been added successfully.', 'Success')
    resetForm()

    // Update store in background — don't let store errors hide the toast
    try {
      if (created?.id) {
        productStore.upsertProduct(created, 'prepend')
      } else {
        await productStore.fetchProducts()
      }
    } catch {
      // Store sync failed silently — product was still created
    }
  } catch (e) {
    toast.error(e?.response?.data?.message || e?.message || 'Failed to add product')
  } finally {
    loading.value = false
  }
}

watch(
  () => form.value.categoryId,
  (id) => {
    const category = categories.value.find(c => c.id === id)
    if (!category) return

    const normalized = category.name.toLowerCase().replace(/\s+/g, '')
    const presetKey = CATEGORY_PRESET_MAP[normalized]

    if (presetKey && CATEGORY_SPEC_PRESETS[presetKey]) {
      form.value.specs = structuredClone(CATEGORY_SPEC_PRESETS[presetKey])
    } else {
      form.value.specs = {}
    }
  }
)

// onMounted(async () => {
//   // Use store categories first (fast), then refresh if needed
//   if (productStore.categories?.length > 0) {
//     categories.value = productStore.categories.filter(c => c.id !== 'all')
//   }

//   try {
//     // Refresh categories (if backend is off, store will keep cached)
//     await productStore.fetchCategories()
//     categories.value = productStore.categories.filter(c => c.id !== 'all')
//   } catch {
//     // ignore - categories may already exist from cache
//   }
// })

onMounted(async () => {
  await Promise.all([
    productStore.fetchCategories(),
    axios.get('/brands').then(r => (brands.value = r.data)),
  ])

  categories.value = productStore.categories.filter(c => c.id !== 'all')
})
</script>

<style scoped>
.add-product {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100vh;
  width: 100%;
  color: white;
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
  gap: 12px;
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

/* Apply blue accent color to all lucide icons on this page */
::v-deep svg {
  color: #60a5fa;
  stroke: currentColor;
  fill: none;
}

/* keep reset button icon color as the button text (don't apply blue accent) */
.reset-icon {
  color: inherit !important;
  stroke: currentColor !important;
  fill: none !important;
}

/* keep the Add Product button plus icon white */
::v-deep .btn-submit .submit-icon {
  color: white !important;
  stroke: currentColor !important;
  fill: none !important;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-submit,
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
}

.btn-submit {
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  color: white;
  box-shadow: 0 4px 14px rgba(61, 169, 255, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(61, 169, 255, 0.45);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-clear {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-clear:hover {
  background: rgba(255, 77, 79, 0.15);
  color: #ff7875;
  border-color: rgba(255, 77, 79, 0.3);
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

.pricing-value.has-discount {
  color: #3da9ff;
}

.pricing-value.save {
  color: #4ade80;
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

.brand-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

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

/* ── Spin animation ── */
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
    font-size: 24px;
  }

  .brand-picker {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>
