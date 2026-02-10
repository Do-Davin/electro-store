<template>
  <section class="brand-form">
    <!-- Loading -->
    <div v-if="pageLoading" class="state-box">
      <Loader2 :size="28" class="animate-spin" />
      <span>Loading brand…</span>
    </div>

    <!-- Not found -->
    <div v-else-if="pageError" class="state-box error">
      <AlertCircle :size="28" />
      <span>{{ pageError }}</span>
      <button class="btn-retry" @click="$router.push('/dashboard/brands')">Back to list</button>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" @click="$router.push('/dashboard/brands')">
            <ArrowLeft :size="18" />
          </button>
          <div>
            <h1 class="title">Edit Brand</h1>
            <p class="subtitle">Update "{{ originalName }}"</p>
          </div>
        </div>
        <div class="header-actions">
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

      <!-- Cards -->
      <div class="row-2col">
        <!-- Logo -->
        <div class="card">
          <div class="card-header">
            <ImageIcon :size="18" />
            <h3>Brand Logo</h3>
          </div>
          <div class="image-upload" @click="pickLogo">
            <input ref="logoInput" type="file" accept="image/*" hidden @change="onLogoPick" />
            <div v-if="logoPreview" class="preview">
              <img :src="logoPreview" alt="logo preview" />
              <div class="preview-overlay">
                <Upload :size="20" />
                <span>Change Logo</span>
              </div>
            </div>
            <div v-else class="placeholder">
              <div class="upload-icon-wrap"><Upload :size="28" /></div>
              <span class="upload-title">Upload new logo</span>
              <span class="upload-hint">Click to browse · Max 1 MB</span>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="card">
          <div class="card-header">
            <FileText :size="18" />
            <h3>Brand Information</h3>
          </div>
          <div class="card-body">
            <div class="field">
              <label for="brandName">Brand Name</label>
              <input id="brandName" v-model="form.name" placeholder="e.g. Apple" />
            </div>
            <div class="field">
              <label for="inventorName">Inventor / Founder Name</label>
              <input id="inventorName" v-model="form.inventorName" placeholder="e.g. Steve Jobs" />
            </div>
          </div>
        </div>
      </div>

      <!-- Inventor Image -->
      <div class="card">
        <div class="card-header">
          <User :size="18" />
          <h3>Inventor Photo <span class="optional">(optional)</span></h3>
        </div>
        <div class="image-upload small" @click="pickInventor">
          <input ref="inventorInput" type="file" accept="image/*" hidden @change="onInventorPick" />
          <div v-if="inventorPreview" class="preview">
            <img :src="inventorPreview" class="round" alt="inventor preview" />
            <div class="preview-overlay">
              <Upload :size="18" />
              <span>Change</span>
            </div>
          </div>
          <div v-else class="placeholder">
            <div class="upload-icon-wrap"><Upload :size="24" /></div>
            <span class="upload-title">Upload Inventor Photo</span>
            <span class="upload-hint">Click to browse · JPG, PNG</span>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft, Save, Loader2,
  Upload, ImageIcon, FileText, User, AlertCircle,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useToast } from '@/composables/useToast'

const API = 'http://localhost:3000'
const toUrl = (img) => (img?.startsWith('http') ? img : API + img)

const router = useRouter()
const route = useRoute()
const toast = useToast()

const logoInput = ref(null)
const inventorInput = ref(null)

const pageLoading = ref(true)
const pageError = ref(null)
const submitting = ref(false)
const formError = ref(null)

const originalName = ref('')
const form = ref({ name: '', inventorName: '' })
const logoFile = ref(null)
const inventorFile = ref(null)
const logoPreview = ref(null)
const inventorPreview = ref(null)

function pickLogo() { logoInput.value?.click() }
function pickInventor() { inventorInput.value?.click() }

function onLogoPick(e) {
  const f = e.target.files?.[0]
  if (!f) return
  logoFile.value = f
  logoPreview.value = URL.createObjectURL(f)
}

function onInventorPick(e) {
  const f = e.target.files?.[0]
  if (!f) return
  inventorFile.value = f
  inventorPreview.value = URL.createObjectURL(f)
}

async function loadBrand() {
  pageLoading.value = true
  pageError.value = null
  try {
    const response = await axios.get(`/brands/${route.params.id}`)
    const brand = response.data
    originalName.value = brand.name
    form.value.name = brand.name
    form.value.inventorName = brand.inventorName
    logoPreview.value = brand.logoUrl ? toUrl(brand.logoUrl) : null
    inventorPreview.value = brand.inventorImageUrl ? toUrl(brand.inventorImageUrl) : null
  } catch (err) {
    pageError.value = err?.response?.data?.message || err.message || 'Brand not found'
  } finally {
    pageLoading.value = false
  }
}

async function submit() {
  formError.value = null

  if (!form.value.name.trim()) return (formError.value = 'Brand name is required.')
  if (!form.value.inventorName.trim()) return (formError.value = 'Inventor name is required.')

  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name.trim())
    fd.append('inventorName', form.value.inventorName.trim())
    if (logoFile.value) {
      fd.append('logo', logoFile.value)
    }
    if (inventorFile.value) {
      fd.append('inventorImage', inventorFile.value)
    }

    await axios.patch(`/brands/${route.params.id}`, fd)
    toast.success(`"${form.value.name}" updated.`, 'Brand Updated')
    router.push('/dashboard/brands')
  } catch (err) {
    const msg = err?.response?.data?.message
    formError.value = Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Failed to update brand'
  } finally {
    submitting.value = false
  }
}

onMounted(loadBrand)
</script>

<style scoped>
/* ── Layout ── */
.brand-form {
  max-width: 900px;
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
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.12);
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
  gap: 10px;
}

/* ── Buttons ── */
.btn-submit {
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
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #ffe69c;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* ── State box ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 24px;
  color: rgba(255, 255, 255, 0.5);
}

.state-box.error {
  color: #f87171;
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

/* ── Cards ── */
.row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .row-2col {
    grid-template-columns: 1fr;
  }
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.row-2col .card {
  margin-bottom: 0;
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

.optional {
  color: rgba(255, 255, 255, 0.35);
  font-weight: 400;
  font-size: 12px;
}

/* ── Fields ── */
.field {
  margin-bottom: 16px;
}

.field:last-child {
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
  border-color: rgba(255, 243, 205, 0.5);
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

/* ── Image Upload ── */
.image-upload {
  cursor: pointer;
  margin: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
  overflow: hidden;
  position: relative;
}

.image-upload.small {
  min-height: 140px;
  max-width: 320px;
  margin: 16px 20px;
}

.image-upload:hover {
  border-color: rgba(255, 243, 205, 0.35);
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.35);
  padding: 20px;
}

.upload-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  display: grid;
  place-items: center;
  color: #fff3cd;
}

.upload-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.upload-hint {
  font-size: 12px;
}

.preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  display: block;
}

.preview img.round {
  object-fit: cover;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin: 10px auto;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview:hover .preview-overlay {
  opacity: 1;
}

/* ── Spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
