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

      <!-- Cards -->
      <div class="row-2col">
        <!-- Logo Upload -->
        <div class="card">
          <div class="card-header">
            <ImageIcon :size="18" />
            <h3>Brand Logo <span class="required">*</span></h3>
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
              <span class="upload-title">Upload Brand Logo</span>
              <span class="upload-hint">Click to browse · JPG, PNG, WEBP · Max 1 MB</span>
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
              <label for="brandName">Brand Name <span class="required">*</span></label>
              <input id="brandName" v-model="form.name" placeholder="e.g. Apple" />
            </div>
            <div class="field">
              <label for="inventorName">Inventor / Founder Name <span class="required">*</span></label>
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
              <span>Change Photo</span>
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
  ArrowLeft, Save, Loader2, RotateCcw,
  Upload, ImageIcon, FileText, User, AlertCircle,
} from 'lucide-vue-next'
import axios from '@/lib/axios'
import { useToast } from '@/composables/useToast'

const API = 'https://electro-store-backend-p7dc.onrender.com'
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
const originalInventorName = ref('')
const originalLogo = ref(null)
const originalInventorImage = ref(null)
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
    originalInventorName.value = brand.inventorName || ''
    form.value.name = brand.name
    form.value.inventorName = brand.inventorName
    originalLogo.value = brand.logoUrl ? toUrl(brand.logoUrl) : null
    originalInventorImage.value = brand.inventorImageUrl ? toUrl(brand.inventorImageUrl) : null
    logoPreview.value = originalLogo.value
    inventorPreview.value = originalInventorImage.value
  } catch (err) {
    pageError.value = err?.response?.data?.message || err.message || 'Brand not found'
  } finally {
    pageLoading.value = false
  }
}

function resetForm() {
  form.value.name = originalName.value
  form.value.inventorName = originalInventorName.value
  formError.value = null
  logoFile.value = null
  inventorFile.value = null
  logoPreview.value = originalLogo.value
  inventorPreview.value = originalInventorImage.value
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
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

/* Apply blue accent color to icons on this page (like Brand Create) */
::v-deep svg {
  color: #60a5fa;
  stroke: currentColor;
  fill: none;
}

/* Clear / reset button - match Category Create styles */
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

/* keep clear/reset button icon color as the button text (don't apply blue accent) */
::v-deep .btn-clear svg {
  color: inherit !important;
  stroke: currentColor !important;
  fill: none !important;
}

/* ── Buttons ── */
.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3da9ff, #1e88e5);
  color: white;
  box-shadow: 0 4px 14px rgba(61, 169, 255, 0.3);
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(61, 169, 255, 0.45);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(16,185,129,0.12);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ensure the save icon stays white */
::v-deep .btn-submit svg {
  color: white !important;
  stroke: currentColor !important;
  fill: none !important;
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
  font-size: 15px;
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
  border-color: rgba(61, 169, 255, 0.35);
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
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
  overflow: hidden;
  position: relative;
}

.image-upload.small {
  min-height: 180px;
  width: 98%;
  box-sizing: border-box;
  margin: 16px;
  padding: 8px 16px;
}

.image-upload:hover {
  border-color: rgba(61, 169, 255, 0.35);
  background: rgba(7, 24, 33, 0.12);
  transform: translateY(-1px);
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.35);
  padding: 20px;
}

/* Dark rounded square variant (match screenshot) */
.placeholder .upload-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(10,34,47,0.95);
  display: grid;
  place-items: center;
  color: #60a5fa;
  box-shadow: 0 10px 30px rgba(61,169,255,0.06);
  transition: all 0.18s ease;
}

/* Hover keeps a slightly stronger lift/glow */
.placeholder .upload-icon-wrap:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(61,169,255,0.09);
}

/* Keep smaller upload variants consistent */
.image-upload.small .upload-icon-wrap {
  width: 48px;
  height: 48px;
}

.upload-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 6px;
}

.upload-hint {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  margin-top: 4px;
}

.preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
}

.preview img {
  max-width: 100%;
  max-height: 160px;
  width: auto;
  height: auto;
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
