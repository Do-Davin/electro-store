<template>
  <section class="page">
    <h1 class="title">Users Management</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 class="animate-spin" :size="32" />
      <span>Loading users...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <AlertCircle :size="20" />
      <span>{{ error }}</span>
      <button @click="fetchUsers" class="retry-btn">Retry</button>
    </div>

    <!-- Users Table -->
    <div v-else>
      <div class="summary">
        <span>{{ users.length }} total users</span>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="mini-stat">
          <UserCheck :size="18" />
          <span>{{ adminCount }} Admins</span>
        </div>
        <div class="mini-stat">
          <User :size="18" />
          <span>{{ userCount }} Users</span>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="4" class="empty">No users found</td>
            </tr>
            <tr v-for="u in users" :key="u.id">
              <td class="mono">#{{ u.id.slice(0, 8).toUpperCase() }}</td>
              <td>{{ u.email }}</td>
              <td>
                <span :class="['role-badge', u.role?.toLowerCase()]">
                  {{ u.role }}
                </span>
              </td>
              <td>{{ formatDate(u.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Loader2, AlertCircle, UserCheck, User } from 'lucide-vue-next'
import axios from '@/lib/axios'

const users = ref([])
const loading = ref(true)
const error = ref(null)

const adminCount = computed(() => users.value.filter(u => u.role === 'ADMIN').length)
const userCount = computed(() => users.value.filter(u => u.role === 'USER').length)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const res = await axios.get('/users')
    users.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: white;
}

.title {
  font-size: 26px;
  font-weight: 600;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px 0;
}

.error-state {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f87171;
  padding: 16px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 12px;
}

.retry-btn {
  margin-left: auto;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.18);
}

.summary {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.stats-row {
  display: flex;
  gap: 16px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.table-wrap {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 14px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.45);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

td {
  padding: 12px 14px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.mono {
  font-family: monospace;
  font-weight: 600;
}

.empty {
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.4);
}

.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.role-badge.user {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}
</style>
