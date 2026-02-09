<template>
  <div class="specs-editor">
    <h3 class="title">Specifications</h3>

    <div v-if="rows.length === 0" class="empty">
      Select a category to generate specs
    </div>

    <div v-else class="rows">
      <div
        v-for="(row, index) in rows"
        :key="row.key"
        class="spec-row"
      >
        <input
          class="key"
          :value="formatKey(row.key)"
          disabled
        />

        <input
          class="value"
          v-model="rows[index].value"
          placeholder="Enter value"
        />

        <button class="remove" @click="remove(index)">×</button>
      </div>
    </div>

    <button
      v-if="allowCustom"
      class="add"
      @click="add"
    >
      + Add Spec
    </button>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  allowCustom: {
    type: Boolean,
    default: false, // hide + Add Spec by default
  },
})

const emit = defineEmits(['update:modelValue'])

const rows = ref([])
let internalUpdate = false

watch(
  () => props.modelValue,
  (v) => {
    // Build what the new rows would be
    const incoming = Object.entries(v || {}).map(([key, value]) => ({
      key,
      value: String(value ?? ''),
    }))

    // Only update rows if data actually changed (prevents loop)
    const current = rows.value
    const isSame =
      incoming.length === current.length &&
      incoming.every((r, i) => r.key === current[i]?.key && r.value === current[i]?.value)

    if (!isSame) {
      internalUpdate = true
      rows.value = incoming
    }
  },
  { immediate: true }
)

watch(
  rows,
  () => {
    if (internalUpdate) {
      internalUpdate = false
      return
    }
    const obj = {}
    rows.value.forEach((r) => {
      if (r.key) obj[r.key] = r.value
    })
    emit('update:modelValue', obj)
  },
  { deep: true }
)

function add() {
  rows.value.push({ key: 'custom_spec', value: '' })
}

function remove(i) {
  rows.value.splice(i, 1)
}

function formatKey(k) {
  return String(k).replace(/_/g, ' ')
}
</script>

<style scoped>
.specs-editor {
  margin-top: 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  padding: 16px;
}

.title {
  font-weight: 600;
  margin-bottom: 12px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-row {
  display: grid;
  grid-template-columns: 1fr 2fr 36px;
  gap: 10px;
}

.key,
.value {
  padding: 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: white;
}

.key {
  opacity: 0.7;
}

.remove {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
}

.add {
  margin-top: 12px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: white;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.empty {
  opacity: 0.6;
  font-size: 14px;
}
</style>
