<!-- eslint-disable vue/multi-word-component-names
<template>
  <div class="pagination">
    <button :disabled="page === 1" @click="$emit('change', page - 1)">
      Prev
    </button>

    <span>{{ page }} / {{ totalPages }}</span>

    <button
      :disabled="page === totalPages"
      @click="$emit('change', page + 1)"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    page: Number,
    totalPages: Number
  }
}
</script> -->

<template>
  <div class="pagination">
    <button :disabled="page === 1" @click="change(page-1)">
      &lt;
    </button>

    <button
      v-for="p in visiblePages"
      :key="p"
      :class="{ active: p === page }"
      @click="change(p)"
    >
      {{ p }}
    </button>

    <button :disabled="page === totalPages" @click="change(page+1)">
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  props: {
    page: Number,
    totalPages: Number,
  },

  computed: {
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.page - 1)
      const end = Math.min(this.totalPages, this.page + 1)

      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    }
  },

  methods: {
    change(p) {
      this.$emit("change", p)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 8px;
}

button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
  background: #fff;
}

button:hover {
  background: #eee;
}

button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.active {
  background: var(--primary);
  color: white;
  border: none;
}
</style>

