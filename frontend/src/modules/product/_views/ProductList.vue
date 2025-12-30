<template>
  <Navbar />
  <div class="nav-bar">
    <h1>All Product</h1>

    <!-- Filter -->
     <div class="filter-wrapper">
      <SearchBar v-model="search" @search="fetchProducts" />
      <!-- <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
        @change="fetchProducts"
      /> -->
      <Select v-model="selectedCategory" @update:modelValue="fetchProducts">
        <SelectTrigger class="w-[200px]">
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

     <div class="view-toggle">
       <button @click="viewMode='list'" id="btn-col">
         <v-icon scale="1.5" name="io-list-sharp"></v-icon>
       </button>

       <button @click="viewMode='grid'" id="btn-col">
         <v-icon scale="1.5" name="bi-grid-1x2-fill"></v-icon>
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
      <div v-else-if="viewMode==='grid'" class="grid">
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
       <div v-else class="list">
        <div
          v-for="p in products"
          :key="p.id"
          class="list-item"
        >
          <img :src="p.imageUrl">
          <div class="info">
            <h3>{{ p.name }}</h3>
            <p>${{ p.price }}</p>
          </div>

          <button class="buy-btn">Buy Now</button>
        </div>
      </div>

    </div>
    <!-- Pagination -->
     <div class="pagination">
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

    // eslint-disable-next-line vue/no-reserved-component-names
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
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
  border: 1px solid #000;
  padding: 30px 80px;
}

.nav-bar {
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

#btn-col {
  background: white;
  border: 1px solid #ddd;
  color: var(--primary);
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

/* LIST VIEW */
.list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.list-item {
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
}

.info h3 {
  margin: 0;
  font-weight: 600;
}

.buy-btn {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
</style>
