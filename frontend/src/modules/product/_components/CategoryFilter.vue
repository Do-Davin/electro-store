<template>
  <select v-model="model" @change="$emit('change', model)">
    <option value="">All Categories</option>
    <option
      v-for="c in categories"
      :key="c.id"
      :value="c.id"
    >
      {{ c.name }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    modelValue: String
  },

  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit("update:modelValue", v)
      }
    }
  }
}
</script>
