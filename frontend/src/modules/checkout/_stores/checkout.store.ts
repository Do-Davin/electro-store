import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Types
export type ShippingInfo = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  notes: string
}

export type ValidationErrors = Partial<Record<keyof ShippingInfo, string>>

const CHECKOUT_STORAGE_KEY = 'electro_checkout_v1'

const defaultShippingInfo: ShippingInfo = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  notes: '',
}

export const useCheckoutStore = defineStore('checkout', () => {
  // ============ STATE ============
  const shippingInfo = ref<ShippingInfo>({ ...defaultShippingInfo })
  const errors = ref<ValidationErrors>({})

  // ============ GETTERS ============
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0 && hasRequiredFields.value
  })

  const hasRequiredFields = computed(() => {
    const s = shippingInfo.value
    return !!(
      s.fullName.trim() &&
      s.email.trim() &&
      s.phone.trim() &&
      s.address.trim() &&
      s.city.trim() &&
      s.postalCode.trim()
    )
  })

  // ============ VALIDATION ============
  function validateField(field: keyof ShippingInfo): string | null {
    const value = shippingInfo.value[field]

    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return null

      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email'
        return null

      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        const phoneRegex = /^[+]?[\d\s\-()]{7,}$/
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
        return null

      case 'address':
        if (!value.trim()) return 'Address is required'
        if (value.trim().length < 5) return 'Please enter a complete address'
        return null

      case 'city':
        if (!value.trim()) return 'City is required'
        return null

      case 'postalCode':
        if (!value.trim()) return 'Postal code is required'
        return null

      default:
        return null
    }
  }

  function validateAll(): boolean {
    const newErrors: ValidationErrors = {}
    const fields: (keyof ShippingInfo)[] = [
      'fullName',
      'email',
      'phone',
      'address',
      'city',
      'postalCode',
    ]

    fields.forEach((field) => {
      const error = validateField(field)
      if (error) {
        newErrors[field] = error
      }
    })

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  function clearFieldError(field: keyof ShippingInfo) {
    if (errors.value[field]) {
      const newErrors = { ...errors.value }
      delete newErrors[field]
      errors.value = newErrors
    }
  }

  // ============ ACTIONS ============
  function updateField(field: keyof ShippingInfo, value: string) {
    shippingInfo.value[field] = value
    clearFieldError(field)
  }

  function setShippingInfo(info: Partial<ShippingInfo>) {
    shippingInfo.value = { ...shippingInfo.value, ...info }
  }

  function reset() {
    shippingInfo.value = { ...defaultShippingInfo }
    errors.value = {}
    localStorage.removeItem(CHECKOUT_STORAGE_KEY)
  }

  function saveToStorage() {
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(shippingInfo.value))
    } catch (e) {
      console.warn('Failed to save checkout info:', e)
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        shippingInfo.value = { ...defaultShippingInfo, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to load checkout info:', e)
    }
  }

  // Initialize
  loadFromStorage()

  // ============ RETURN ============
  return {
    // State
    shippingInfo,
    errors,

    // Getters
    isValid,
    hasRequiredFields,

    // Actions
    updateField,
    setShippingInfo,
    validateField,
    validateAll,
    clearFieldError,
    reset,
    saveToStorage,
    loadFromStorage,
  }
})
