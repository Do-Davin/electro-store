import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAuthPayload } from '@/lib/auth'
import axios from '@/lib/axios'

function getStorageKey(): string {
  const payload = getAuthPayload()
  const userId = payload?.sub || 'guest'
  return `wishlist_${userId}`
}

export const useWishlistStore = defineStore('wishlist', () => {
  /** Product IDs only — persisted to localStorage */
  const productIds = ref<string[]>([])
  /** Full product objects — fetched live from API, NOT persisted */
  const items = ref<any[]>([])
  const loading = ref(false)

  function loadFromStorage() {
    const stored = localStorage.getItem(getStorageKey())
    if (!stored) {
      productIds.value = []
      items.value = []
      return
    }

    try {
      const parsed = JSON.parse(stored)
      // Support legacy format: array of product objects
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].id) {
        productIds.value = parsed.map((p: any) => p.id)
        items.value = parsed // keep old data as fallback until refresh
      } else if (Array.isArray(parsed)) {
        // New format: array of IDs
        productIds.value = parsed
        items.value = []
      } else {
        productIds.value = []
        items.value = []
      }
    } catch {
      productIds.value = []
      items.value = []
    }
  }

  /** Fetch live product data from the API for all wishlisted IDs */
  async function refreshProducts() {
    if (productIds.value.length === 0) {
      items.value = []
      return
    }

    loading.value = true
    try {
      const results = await Promise.allSettled(
        productIds.value.map((id) => axios.get(`/products/${id}`))
      )

      const freshProducts: any[] = []
      const validIds: string[] = []

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value?.data) {
          freshProducts.push(result.value.data)
          validIds.push(result.value.data.id)
        }
      }

      items.value = freshProducts

      // Remove IDs of products that no longer exist
      if (validIds.length !== productIds.value.length) {
        productIds.value = validIds
      }
    } catch (error) {
      console.warn('Failed to refresh wishlist products:', error)
    } finally {
      loading.value = false
    }
  }

  function toggle(product: any) {
    const index = productIds.value.indexOf(product.id)

    if (index >= 0) {
      productIds.value.splice(index, 1)
      items.value = items.value.filter((p) => p.id !== product.id)
    } else {
      productIds.value.push(product.id)
      // Add the product object for immediate display (will be refreshed on next load)
      items.value.push(product)
    }
  }

  function remove(productId: string) {
    productIds.value = productIds.value.filter((id) => id !== productId)
    items.value = items.value.filter((p) => p.id !== productId)
  }

  function isInWishlist(productId: string) {
    return productIds.value.includes(productId)
  }

  function clearAll() {
    productIds.value = []
    items.value = []
  }

  // Persist only IDs to localStorage
  watch(
    productIds,
    () => {
      localStorage.setItem(getStorageKey(), JSON.stringify(productIds.value))
    },
    { deep: true }
  )

  // Initialize on store creation
  loadFromStorage()
  refreshProducts()

  return {
    items,
    productIds,
    loading,
    toggle,
    remove,
    isInWishlist,
    clearAll,
    loadFromStorage,
    refreshProducts,
  }
})
