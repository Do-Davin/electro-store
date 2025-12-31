<template>
  <Navbar />
  <div class="flex justify-between items-center p-5 gap-5 pt-20">
    <h1>All Product</h1>

    <!-- Filter -->
     <div class="flex items-center gap-4">
      <SearchBar v-model="search" @search="fetchProducts" />
      <!-- <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
        @change="fetchProducts"
      /> -->
      <Select v-model="selectedCategory" @update:modelValue="fetchProducts">
        <SelectTrigger class="w-50">
          <SelectValue placeholder="All Categories"/>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>

            <!-- dynamic categories -->
             <SelectItem value="all">
              All
            </SelectItem>

            <SelectItem
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </SelectItem>

          </SelectGroup>
        </SelectContent>
      </Select>
     </div>

     <div class="flex gap-2.5">
       <button @click="viewMode='list'">
         <TextAlignJustify class="w-6 h-8" />
        </button>

        <button @click="viewMode='grid'">
         <LayoutPanelLeft class="w-6 h-8" />
       </button>
     </div>
  </div>
  <div class="container">
     <!-- Product -->
      <div v-if="loading">Loading...</div>

      <div v-else-if="products.length === 0">
        No product found
      </div>

      <!-- GRID VIEW -->
      <!-- grid-cols-3 = grid-template-columns: repeat(3, 1fr); [Don't delete this] -->
      <div v-else-if="viewMode==='grid'" class="grid mt-7.5 gap-6.25 grid-cols-3">
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :title="p.name"
          :price="'$' + p.price"
          :image="p.imageUrl"
          :rating="p.rating || 4"
        />
      </div>

      <!-- LIST VIEW -->
       <div v-else class="flex mt-7.5 flex-col gap-4.5">
        <div
          v-for="p in products"
          :key="p.id"
          class="flex items-center justify-between border border-[#ddd] p-3 rounded-lg"
        >
          <img class="w-21.25 h-21.25 object-cover rounded-md" :src="p.imageUrl">
          <div>
            <h3 class="m-0 font-semibold">{{ p.name }}</h3>
            <p>${{ p.price }}</p>
          </div>

          <button class="buy-btn">Buy Now</button>
        </div>
      </div>

    </div>
    <!-- Pagination -->
     <div class="flex justify-center items-center text-[30px]">
       <Pagination
        :page="page"
        :totalPages="totalPages"
        @change="changePage"
       />
     </div>
</template>

<script>
import axios from 'axios';
// import CategoryFilter from '../_components/CategoryFilter.vue';
import Pagination from '../_components/Pagination.vue';
import ProductCard from '../_components/ProductCard.vue';
import SearchBar from '../_components/SearchBar.vue';
import Navbar from '@/components/Navbar.vue';
import { LayoutPanelLeft, TextAlignJustify } from 'lucide-vue-next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default {
  name: "ProductList",

  components: {
    Navbar,
    ProductCard,
    // CategoryFilter,
    SearchBar,
    Pagination,

    // From tailwindcss
    // eslint-disable-next-line vue/no-reserved-component-names
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    LayoutPanelLeft,
    TextAlignJustify,
  },

  data() {
    return {
      loading: false,
      products: [],
      categories: [],
      page: 1,
      limit: 12,
      totalPages: 1,
      search: "",
      selectedCategory: "",
      viewMode: "grid"
    };
  },

  created() {
    this.fetchCategories()
    this.fetchProducts()
  },

  methods: {
    async fetchProducts() {
      this.loading = true

      const params = {
        page: this.page,
        limit: this.limit,
      }

      if (this.search) params.search = this.search
      // if (this.selectedCategory) params.category = this.selectedCategory
      if (this.selectedCategory && this.selectedCategory !== "all") {
        params.category = this.selectedCategory
      }


      const res = await axios.get("/products", { params })

      this.products = res.data.data
      this.totalPages = res.data.totalPages
      this.loading = false
    },

    async fetchCategories() {
      const res = await axios.get("/categories")
      this.categories = res.data
    },

    changePage(newPage) {
      this.page = newPage
      this.fetchProducts()
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px 20px;
  border: 1px solid #000;
}

/* .nav-bar {
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
  padding-top: calc(var(--spacing) * 20)
} */

/* .filter-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
} */

/* .view-toggle {
  display: flex;
  gap: 10px;
} */

/* .grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
} */

/* LIST VIEW */
/* .list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
} */

/* .list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
}

.list-item img {
  width: 85px;
  height: 85px;
  object-fit: cover;
  border-radius: 6px;
} */

/* .info h3 {
  margin: 0;
  font-weight: 600;
} */

.buy-btn {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
}

/* .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
} */
</style>
