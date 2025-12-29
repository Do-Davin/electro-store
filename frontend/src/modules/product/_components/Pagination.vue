<!-- eslint-disable vue/multi-word-component-names -->
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
</script>
