import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/lib/axios'

type AnyObj = Record<string, any>

type Product = AnyObj & {
  id: string
  name?: string
  price?: number
  finalPrice?: number
  discountPercent?: number
  stock?: number
  imageUrl?: string
  category?: AnyObj
}

type Category = AnyObj & {
  id: string
  name?: string
  icon?: string
}

type ProductsResponse = {
  data: Product[]
  totalPages?: number
  total?: number
}

const LS_KEYS = {
  products: 'product_cache_v1',
  categories: 'category_cache_v1',
}

export const useProductStore = defineStore('product', () => {
  // State
  const loadingProducts = ref(false)
  const loadingCategories = ref(false)
  const error = ref<string | null>(null)

  const products = ref<Product[]>([])
  const categories = ref<Category[]>([
    { id: 'all', name: 'All', icon: '/icons/all.svg' },
  ])

  const page = ref(1)
  const limit = ref(12)
  const totalPages = ref(1)

  const search = ref('')
  const selectedCategory = ref<string>('all')

  // LocalStorage helpers
  function safeParse<T>(raw: string | null): T | null {
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  function loadCachedProducts() {
    const cached = safeParse<{
      items: Product[]
      totalPages?: number
      savedAt: number
    }>(localStorage.getItem(LS_KEYS.products))

    if (!cached?.items?.length) return

    products.value = cached.items
    if (typeof cached.totalPages === 'number') totalPages.value = cached.totalPages
  }

  function saveCachedProducts(items: Product[], tp: number) {
    localStorage.setItem(
      LS_KEYS.products,
      JSON.stringify({
        items,
        totalPages: tp,
        savedAt: Date.now(),
      })
    )
  }

  function loadCachedCategories() {
    const cached = safeParse<{
      items: Category[]
      savedAt: number
    }>(localStorage.getItem(LS_KEYS.categories))

    if (!cached?.items?.length) return

    // Ensure "All" always exists at top
    categories.value = [
      { id: 'all', name: 'All', icon: '/icons/all.svg' },
      ...cached.items.filter(c => c?.id && c.id !== 'all'),
    ]
  }

  function saveCachedCategories(items: Category[]) {
    // Store only real categories (exclude "all")
    const real = items.filter(c => c?.id && c.id !== 'all')
    localStorage.setItem(
      LS_KEYS.categories,
      JSON.stringify({
        items: real,
        savedAt: Date.now(),
      })
    )
  }

  // Query params builder
  function buildParams() {
    const params: AnyObj = {
      page: page.value,
      limit: limit.value,
    }

    if (search.value?.trim()) params.search = search.value.trim()
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }

    return params
  }

  // Actions
  async function fetchCategories() {
    loadingCategories.value = true
    error.value = null

    try {
      // Load cache first (fast UX)
      loadCachedCategories()

      const res = await axios.get('/categories')
      const apiCategories: Category[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? [])

      categories.value = [
        { id: 'all', name: 'All', icon: '/icons/all.svg' },
        ...apiCategories,
      ]

      saveCachedCategories(categories.value)
    } catch (e: any) {
      // Keep cached categories if backend is off
      error.value = e?.message ?? 'Failed to load categories'
      if (categories.value.length === 0) {
        categories.value = [{ id: 'all', name: 'All', icon: '/icons/all.svg' }]
      }
    } finally {
      loadingCategories.value = false
    }
  }

  async function fetchProducts() {
    loadingProducts.value = true
    error.value = null

    try {
      // Load cache first (fast UX)
      loadCachedProducts()

      const params = buildParams()
      const res = await axios.get('/products', { params })

      // Your current UI expects: res.data.data and res.data.totalPages
      const payload: ProductsResponse = res.data ?? {}
      const list = Array.isArray(payload.data) ? payload.data : (payload as any)?.data?.data ?? []

      const tp =
        typeof payload.totalPages === 'number'
          ? payload.totalPages
          : (res.data?.totalPages ?? 1)

      products.value = list
      totalPages.value = tp || 1

      // Cache the latest successful list
      saveCachedProducts(products.value, totalPages.value)
    } catch (e: any) {
      // Keep cached products if backend is off
      error.value = e?.message ?? 'Failed to load products'
      if (products.value.length === 0) {
        totalPages.value = 1
      }
    } finally {
      loadingProducts.value = false
    }
  }

  // Used by UI controls
  function setSearch(v: string) {
    search.value = v
    page.value = 1
  }

  function setCategory(id: string) {
    selectedCategory.value = id
    page.value = 1
  }

  function setPage(p: number) {
    page.value = p
  }

  // Used by Admin after creating product
  function upsertProduct(product: Product, mode: 'prepend' | 'append' = 'prepend') {
    if (!product?.id) return

    const idx = products.value.findIndex(p => p.id === product.id)
    if (idx >= 0) {
      products.value[idx] = { ...products.value[idx], ...product }
    } else {
      if (mode === 'prepend') products.value.unshift(product)
      else products.value.push(product)
    }

    saveCachedProducts(products.value, totalPages.value)
  }

  // Real-world init (called on page mount)
  async function init() {
    // Load cached first (instant render)
    loadCachedCategories()
    loadCachedProducts()

    // Refresh from backend (your confirmed rule)
    await Promise.all([fetchCategories(), fetchProducts()])
  }

  return {
    // state
    loadingProducts,
    loadingCategories,
    error,

    products,
    categories,

    page,
    limit,
    totalPages,
    search,
    selectedCategory,

    // actions
    init,
    fetchProducts,
    fetchCategories,
    setSearch,
    setCategory,
    setPage,
    upsertProduct,
  }
})
