import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAuthPayload } from '@/lib/auth'

function getStorageKey(): string {
  const payload = getAuthPayload()
  const userId = payload?.sub || 'guest'
  return `wishlist_${userId}`
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<any[]>([])

  function loadFromStorage() {
    const stored = localStorage.getItem(getStorageKey())
    items.value = stored ? JSON.parse(stored) : []
  }

  // Load on store creation
  loadFromStorage()

  function toggle(product: any) {
    const index = items.value.findIndex(p => p.id === product.id)

    if (index >= 0) {
      items.value.splice(index, 1)
    } else {
      items.value.push(product)
    }
  }

  function remove(productId: string) {
    items.value = items.value.filter(p => p.id !== productId)
  }

  function isInWishlist(productId: string) {
    return items.value.some(p => p.id === productId)
  }

  function clearAll() {
    items.value = []
  }

  watch(
    items,
    () => {
      localStorage.setItem(getStorageKey(), JSON.stringify(items.value))
    },
    { deep: true }
  )

  return {
    items,
    toggle,
    remove,
    isInWishlist,
    clearAll,
    loadFromStorage
  }
})
