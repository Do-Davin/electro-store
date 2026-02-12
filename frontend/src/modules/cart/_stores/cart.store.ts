import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuthPayload } from '@/lib/auth'

export type CartItem = {
  productId: string
  quantity: number
  priceSnapshot: number // price at time of adding to cart (discounted if applicable)
  originalPrice: number // original price before discount
  discountPercent: number // discount percentage (0 if none)
  name: string
  imageUrl?: string
}

function getStorageKey(): string {
  const payload = getAuthPayload()
  const userId = payload?.sub || 'guest'
  return `electro_cart_${userId}`
}

export const useCartStore = defineStore('cart', () => {
  // STATE
  const items = ref<CartItem[]>([])

  // GETTERS
  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    )
  })

  const originalTotal = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + (item.originalPrice ?? item.priceSnapshot) * item.quantity,
      0
    )
  })

  const totalDiscount = computed(() => {
    return originalTotal.value - cartTotal.value
  })

  const isEmpty = computed(() => items.value.length === 0)

  // HELPERS
  function findItemIndex(productId: string): number {
    return items.value.findIndex((item) => item.productId === productId)
  }

  function saveToStorage() {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(items.value))
      // TODO: Notification
      console.log('Cart saved to localStorage')
    } catch (e) {
      // TODO: Notification
      console.warn('Failed to save cart to localStorage:', e)
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(getStorageKey())
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          items.value = parsed
        }
      }
      // TODO: Notification
      console.log('Cart loaded from localStorage:', items.value)
    } catch (e) {
      // TODO: Notification
      console.warn('Failed to load cart from localStorage:', e)
      items.value = []
    }
  }

  // ACTIONS
  function addItem(product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    discountPercent?: number
    imageUrl?: string
  }, quantity: number = 1) {
    if (quantity < 1) return

    const existingIndex = findItemIndex(product.id)

    if (existingIndex >= 0) {
      // Item already in cart, increase quantity
      items.value[existingIndex].quantity += quantity
    } else {
      // Add new item
      items.value.push({
        productId: product.id,
        quantity,
        priceSnapshot: product.price,
        originalPrice: product.originalPrice ?? product.price,
        discountPercent: product.discountPercent ?? 0,
        name: product.name,
        imageUrl: product.imageUrl,
      })
    }

    // TODO: Notification
    console.log(`Added ${quantity} of ${product.name} to cart`)
    saveToStorage()
  }

  function removeItem(productId: string) {
    const index = findItemIndex(productId)
    if (index >= 0) {
      items.value.splice(index, 1)
      // TODO: Notification
      console.log(`Removed product ${productId} from cart`)
      saveToStorage()
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(productId)
      return
    }

    const index = findItemIndex(productId)
    if (index >= 0) {
      items.value[index].quantity = quantity
      saveToStorage()
    }
  }

  function incrementQuantity(productId: string) {
    const index = findItemIndex(productId)
    if (index >= 0) {
      items.value[index].quantity += 1
      saveToStorage()
    }
  }

  function decrementQuantity(productId: string) {
    const index = findItemIndex(productId)
    if (index >= 0) {
      const currentQty = items.value[index].quantity
      if (currentQty <= 1) {
        removeItem(productId)
      } else {
        items.value[index].quantity -= 1
        saveToStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  function getItemQuantity(productId: string): number {
    const item = items.value.find((i) => i.productId === productId)
    return item?.quantity ?? 0
  }

  function isInCart(productId: string): boolean {
    return findItemIndex(productId) >= 0
  }

  // Initialize: load from storage on store creation
  loadFromStorage()

  // ============ RETURN ============
  return {
    // State
    items,

    // Getters
    itemCount,
    cartTotal,
    originalTotal,
    totalDiscount,
    isEmpty,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    loadFromStorage,
  }
})
