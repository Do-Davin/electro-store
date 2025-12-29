<template>
  <section class="container">
    <h1>All Product</h1>

    <!-- Filter -->
     <div class="filter-wrapper">
      <SearchBar v-model="search" @search="fetchProducts" />

      <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
        @change="fetchProducts"
      />
     </div>

     <!-- Product -->
      <div v-if="loading">Loading...</div>

      <div v-else-if="products.length === 0">
        No product found
      </div>

      <div class="grid" v-else>
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :title="p.name"
          :price="'$' + p.price"
          :image="p.imageUrl || ''"
          :rating="p.rating || 4"
        />
      </div>

      <!-- Pagination -->
       <Pagination
        :page="page"
        :totalPages="totalPages"
        @change="changePage"
       />
  </section>
</template>

<script>
import axios from 'axios';
import CategoryFilter from '../_components/CategoryFilter.vue';
import Pagination from '../_components/Pagination.vue';
import ProductCard from '../_components/ProductCard.vue';
import SearchBar from '../_components/SearchBar.vue';

export default {
  name: "ProductList",

  components: {
    ProductCard,
    CategoryFilter,
    SearchBar,
    Pagination
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
      if (this.selectedCategory) params.category = this.selectedCategory

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
  padding: 30px 80px;
}

.grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.filter-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
