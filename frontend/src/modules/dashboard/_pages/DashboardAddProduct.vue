<template>
  <section class="add-product">
    <h1 class="title">Add New Product</h1>

    <!-- Image Upload -->
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
      </div>

      <div v-else class="placeholder">
        <Upload />
        <span>Upload Product Image</span>
      </div>
    </div>

    <!-- Form -->
    <div class="form">
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

      <div class="row">
        <div class="field">
          <label>Actual Price ($)</label>
          <input type="number" v-model.number="form.price" />
        </div>

        <div class="field">
          <label>Offer Price ($)</label>
          <input type="number" v-model.number="offerPrice" />
        </div>
      </div>

      <!-- Brand Picker -->
      <div class="field">
        <label>Brand</label>

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

      <div class="field">
        <label>Category</label>
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

      <SpecsEditor v-model="form.specs" :allowCustom="false" />

      <div class="action-row">
        <button
          class="submit"
          :disabled="loading"
          @click="submit"
        >
          {{ loading ? 'Adding...' : 'Add Product' }}
        </button>

        <button
          class="clear"
          type="button"
          @click="resetForm"
        >
          Clear Form
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/lib/axios'
import { Upload } from 'lucide-vue-next'
import { useProductStore } from '@/modules/product/_stores/product.store'
import SpecsEditor from '../_components/SpecsEditor.vue'
import { CATEGORY_SPEC_PRESETS } from '@/modules/product/_documents/category-spec-presets'

const CATEGORY_PRESET_MAP = {
  smartphones: 'phone',
  laptops: 'laptop',
  tablets: 'tablet',
  accessories: 'accessories',
  smartwatch: 'smartwatch',
}

const productStore = useProductStore()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const preview = ref(null)
const loading = ref(false)

const categories = ref([])
const brands = ref([])

const API = 'http://localhost:3000'

const toUrl = (img) =>
  img?.startsWith('http') ? img : API + img

const form = ref({
  name: '',
  description: '',
  price: 0,
  discountPercent: 0,
  categoryId: '',
  brandId: '',
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
    specs: {},
  }
  offerPrice.value = 0
  file.value = null
  preview.value = null
}

async function submit() {
  if (!file.value) return alert('Image required')
  if (!form.value.name) return alert('Name required')
  if (!form.value.categoryId) return alert('Category required')
  if (!form.value.brandId) return alert('Brand required')

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
    fd.append('specs', JSON.stringify(form.value.specs))

    const res = await axios.post('/products', fd)

    // backend responses vary. Handle both common shapes.
    const created =
      res.data?.data ??
      res.data?.product ??
      res.data

    // Update store immediately (so user ProductList updates without reload)
    if (created?.id) {
      productStore.upsertProduct(created, 'prepend')
    } else {
      // If backend doesn't return product object, just refresh list
      await productStore.fetchProducts()
    }
    alert('Product added successfully')
    resetForm()
  } catch (e) {
    alert(e?.message ?? 'Failed to add product')
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
  max-width: 560px;
  color: white;
}

.title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 24px;
}

.image-upload {
  height: 160px;
  border-radius: 14px;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 24px;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
}

.preview img {
  max-height: 140px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand-picker {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 10px 4px;
  scroll-snap-type: x mandatory;
}

/* Hide scrollbar (Chrome, Edge, Safari) */
.brand-picker::-webkit-scrollbar {
  height: 6px;
}
.brand-picker::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
}

/* Firefox */
.brand-picker {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}

.brand-card {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  background: rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  scroll-snap-align: start;
}

.brand-card:hover {
  background: rgba(255,255,255,0.14);
}

.brand-card.active {
  border-color: #3da9ff;
  background: rgba(61,169,255,0.25);
}

.brand-card img {
  max-width: 48px;
  max-height: 32px;
  object-fit: contain;
  margin-bottom: 6px;
}

.brand-card span {
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
}

input,
textarea,
select {
  background: rgba(255,255,255,0.08);
  border: none;
  border-radius: 10px;
  padding: 12px;
  color: white;
}

textarea {
  min-height: 100px;
  resize: none;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 16px;
}

.submit {
  height: 48px;
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(61, 169, 255, 0.35);
}

.submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(61, 169, 255, 0.45);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(61, 169, 255, 0.3);
  background: linear-gradient(135deg, #2f8de4, #1976d2);
}

.clear {
  height: 48px;
  background: linear-gradient(135deg, #ff4d4f, #d9363e);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(255, 77, 79, 0.35);
}

.clear:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 77, 79, 0.45);
  background: linear-gradient(135deg, #ff7875, #f5222d);
}

.clear:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}
</style>
