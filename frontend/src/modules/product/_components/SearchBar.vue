<template>
  <div class="search-wrapper">
    <Search class="search-icon"  />

    <input
      type="text"
      placeholder="Search products..."
      v-model="model"
      @keyup.enter="$emit('search')"
      class="search-input"
    >
  </div>
</template>


<script>
import { Search } from 'lucide-vue-next';

export default {
  props: ['modelValue'],

  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Search
  },

  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      }
    }
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 280px;
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  outline: none;
  transition: all 0.25s ease;
  background: #111111;
  color: #f0f0f0;
}

.search-input::placeholder {
  color: #6b7280;
}

.search-input:focus {
  border-color: #ff8c42;
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.15);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}
</style>
