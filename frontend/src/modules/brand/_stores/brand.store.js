import { defineStore } from 'pinia'
import { ref } from 'vue'
import { brandApi } from '../_services/brand.service'

export const useBrandStore = defineStore('brand', () => {
  // ============ STATE ============
  const brands = ref([])
  const currentBrand = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ============ ACTIONS ============
  async function fetchBrands() {
    loading.value = true

    try {
      brands.value = await brandApi.getAll()
      error.value = null
    } catch (e) {
      error.value = e.message || 'Failed to fetch brands'
    } finally {
      loading.value = false
    }
  }

  async function fetchBrandById(id) {
    loading.value = true

    try {
      currentBrand.value = await brandApi.getById(id)
      error.value = null
    } catch (e) {
      error.value = e.message || 'Failed to fetch brand'
    } finally {
      loading.value = false
    }
  }

  function clearCurrentBrand() {
    currentBrand.value = null
    error.value = null
  }

  return {
    brands,
    currentBrand,
    loading,
    error,
    fetchBrands,
    fetchBrandById,
    clearCurrentBrand,
  }
})
