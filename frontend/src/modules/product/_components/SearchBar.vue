<template>
  <input
    type="text"
    placeholder="Search product..."
    v-model="model"
    @keyup.enter="$emit('search')"
  >
</template>

<script>
export default {
  props: ["modelValue"],

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
