<template>
  <section class="dashboard">
    <!-- Header -->
    <h1 class="title">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <StatCard title="Total Products" value="1">
        <template #icon>
          <Package />
        </template>
      </StatCard>

      <StatCard
        title="Total Revenue"
        value="$795.94"
        trend="+28.4%"
        variant="revenue"
      >
        <template #icon>
          <DollarSign />
        </template>
      </StatCard>

      <StatCard title="Total Orders" value="7">
        <template #icon>
          <ShoppingCart />
        </template>
      </StatCard>

      <StatCard title="Total Users" value="4">
        <template #icon>
          <Users />
        </template>
      </StatCard>
    </div>

    <!-- Chart -->
    <div class="chart-card">
      <h3>Orders / Day</h3>

      <!-- Placeholder for chart -->
      <div class="chart-placeholder">
        <span>Graph Chart Coming Soon!</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Package, DollarSign, ShoppingCart, Users } from 'lucide-vue-next';
import StatCard from '../_components/StatCard.vue';
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: #003465;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.chart-card h3 {
  margin-bottom: 16px;
}

.chart-placeholder {
  height: 320px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.08),
    rgba(255,255,255,0.02)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}
</style>
