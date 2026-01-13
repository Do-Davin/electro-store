import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<any[]>([])

  // Load from localStorage
  const stored = localStorage.getItem('wishlist')
  if (stored) {
    items.value = JSON.parse(stored)
  }

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

  watch(
    items,
    () => {
      localStorage.setItem('wishlist', JSON.stringify(items.value))
    },
    { deep: true }
  )

  return {
    items,
    toggle,
    remove,
    isInWishlist
  }
})
