<template>
  <section class="dashboard">
    <!-- Header -->
    <h1 class="title">Dashboard</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 class="animate-spin" :size="32" />
      <span>Loading stats...</span>
    </div>

    <!-- Stats Cards -->
    <div v-else class="stats-grid">
      <StatCard :title="'Total Products'" :value="String(stats.totalProducts)">
        <template #icon>
          <Package />
        </template>
      </StatCard>

      <StatCard
        :title="'Total Revenue'"
        :value="'$' + stats.totalRevenue.toFixed(2)"
        variant="revenue"
      >
        <template #icon>
          <DollarSign />
        </template>
      </StatCard>

      <StatCard :title="'Total Orders'" :value="String(stats.totalOrders)">
        <template #icon>
          <ShoppingCart />
        </template>
      </StatCard>

      <StatCard :title="'Total Users'" :value="String(stats.totalUsers)">
        <template #icon>
          <Users />
        </template>
      </StatCard>
    </div>

    <!-- Recent Orders -->
    <div class="chart-card">
      <h3>Recent Orders</h3>

      <div v-if="recentOrders.length === 0" class="chart-placeholder">
        <span>No orders yet</span>
      </div>

      <table v-else class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="mono">#{{ order.id.slice(0, 8).toUpperCase() }}</td>
            <td>{{ order.user?.email ?? '—' }}</td>
            <td>${{ Number(order.totalAmount).toFixed(2) }}</td>
            <td>
              <span :class="['status-badge', statusClass(order.status)]">
                {{ order.status }}
              </span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Package, DollarSign, ShoppingCart, Users, Loader2 } from 'lucide-vue-next'
import StatCard from '../_components/StatCard.vue'
import axios from '@/lib/axios'

const loading = ref(true)

const stats = ref({
  totalProducts: 0,
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0,
})

const recentOrders = ref([])

function statusClass(status) {
  const map = {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }
  return map[status] || ''
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(async () => {
  try {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      axios.get('/products?limit=1'),
      axios.get('/orders?limit=5'),
      axios.get('/users'),
    ])

    // Products total
    stats.value.totalProducts = productsRes.data?.total ?? 0

    // Orders total + revenue
    const ordersMeta = ordersRes.data?.meta ?? ordersRes.data
    stats.value.totalOrders = ordersMeta?.total ?? 0
    recentOrders.value = ordersRes.data?.data ?? []

    // Calculate revenue from all paid orders
    // Fetch all orders for revenue calc
    const allOrdersRes = await axios.get(`/orders?limit=${ordersMeta?.total || 100}`)
    const allOrders = allOrdersRes.data?.data ?? []
    stats.value.totalRevenue = allOrders
      .filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)

    // Users total
    const usersData = usersRes.data
    stats.value.totalUsers = Array.isArray(usersData) ? usersData.length : 0
  } catch (e) {
    console.error('Failed to load dashboard stats:', e)
  } finally {
    loading.value = false
  }
})

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

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
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
  height: 120px;
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

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.orders-table td {
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mono {
  font-family: monospace;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending { background: rgba(250, 204, 21, 0.2); color: #facc15; }
.status-badge.paid { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
.status-badge.processing { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
.status-badge.shipped { background: rgba(192, 132, 252, 0.2); color: #c084fc; }
.status-badge.delivered,
.status-badge.completed { background: rgba(52, 211, 153, 0.2); color: #34d399; }
.status-badge.cancelled { background: rgba(248, 113, 113, 0.2); color: #f87171; }
</style>
