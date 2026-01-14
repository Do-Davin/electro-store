```vue
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

      <button
        class="submit"
        :disabled="loading"
        @click="submit"
      >
        {{ loading ? 'Adding...' : 'Add Product' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/lib/axios'
import { Upload } from 'lucide-vue-next'

const fileInput = ref(null)
const file = ref(null)
const preview = ref(null)
const loading = ref(false)

const categories = ref([])

const form = ref({
  name: '',
  description: '',
  price: 0,
  discountPercent: 0,
  categoryId: '',
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
  const f = e.target.files[0]
  if (!f) return

  file.value = f
  preview.value = URL.createObjectURL(f)
}

async function submit() {
  if (!file.value) return alert('Image required')
  if (!form.value.name) return alert('Name required')
  if (!form.value.categoryId) return alert('Category required')

  loading.value = true

  const fd = new FormData()
  fd.append('image', file.value)
  fd.append('name', form.value.name)
  fd.append('description', form.value.description)
  fd.append('price', form.value.price)
  fd.append('discountPercent', discountPercent.value)
  fd.append('categoryId', form.value.categoryId)

  await axios.post('/products', fd)

  loading.value = false
  alert('Product added successfully')
}

onMounted(async () => {
  const res = await axios.get('/categories')
  categories.value = res.data
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

.submit {
  margin-top: 12px;
  background: #3da9ff;
  color: white;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
}
</style>
```
