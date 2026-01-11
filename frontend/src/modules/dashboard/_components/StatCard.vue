<template>
  <div class="card" :class="variant">
    <div class="content">
      <p class="label">{{ title }}</p>

      <div class="value-row">
        <p class="value">{{ value }}</p>

        <span v-if="trend" class="badge">
          {{ trend }}
        </span>
      </div>
    </div>

    <div class="icon-wrap">
      <slot name="icon" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  trend: String,
  variant: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.card {
  min-height: 128px;
  border-radius: 18px;
  padding: 22px 24px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 65%;
}

.label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.65);
}

.value-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.value {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.4px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(74, 222, 128, 0.18);
  color: #4ade80;
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrap :deep(svg) {
  width: 24px;
  height: 24px;
  opacity: 0.95;
}

.card.revenue {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.06)
  );
}
</style>
