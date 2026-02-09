<template>
  <section class="page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <Users :size="22" />
        </div>
        <div>
          <h1 class="title">Users</h1>
          <p class="subtitle">Manage all registered accounts</p>
        </div>
      </div>
      <button class="refresh-btn" @click="fetchUsers" :disabled="loading">
        <RefreshCw :size="16" :class="{ spin: loading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="loader-wrapper">
        <Loader2 class="spin" :size="36" />
        <span>Loading users...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon-wrap">
        <AlertCircle :size="20" />
      </div>
      <div class="error-content">
        <span class="error-title">Failed to load users</span>
        <span class="error-message">{{ error }}</span>
      </div>
      <button @click="fetchUsers" class="retry-btn">
        <RefreshCw :size="14" />
        Retry
      </button>
    </div>

    <!-- Users Content -->
    <div v-else class="users-content">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <Users :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ users.length }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon admin-icon">
            <ShieldCheck :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ adminCount }}</span>
            <span class="stat-label">Admins</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon user-icon">
            <User :size="18" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ userCount }}</span>
            <span class="stat-label">Regular Users</span>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="table-title">
            <ClipboardList class="table-title-icon" :size="18" />
            User List
          </h2>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <div class="th-content">
                    <Hash :size="13" />
                    User ID
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Mail :size="13" />
                    Email
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Shield :size="13" />
                    Role
                  </div>
                </th>
                <th>
                  <div class="th-content">
                    <Calendar :size="13" />
                    Joined
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="4" class="empty">
                  <div class="empty-state">
                    <Inbox :size="40" />
                    <span>No users found</span>
                  </div>
                </td>
              </tr>
              <tr v-for="u in users" :key="u.id" class="user-row">
                <td>
                  <span class="user-id">#{{ u.id.slice(0, 8).toUpperCase() }}</span>
                </td>
                <td>
                  <div class="email-cell">
                    <div class="email-avatar">
                      <User :size="14" />
                    </div>
                    <span class="email-text">{{ u.email }}</span>
                  </div>
                </td>
                <td>
                  <span :class="['role-badge', u.role?.toLowerCase()]">
                    <ShieldCheck v-if="u.role === 'ADMIN'" :size="12" />
                    <User v-else :size="12" />
                    {{ u.role }}
                  </span>
                </td>
                <td>
                  <span class="date-cell">{{ formatDate(u.createdAt) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Loader2, AlertCircle, User, Users, ShieldCheck, Shield,
  RefreshCw, ClipboardList, Hash, Mail, Calendar, Inbox,
} from 'lucide-vue-next'
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
/* ── Base ── */
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: #f1f5f9;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
}

.title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(148, 163, 184, 0.8);
  margin: 2px 0 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  color: #f1f5f9;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: rgba(148, 163, 184, 0.7);
  font-size: 14px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Error ── */
.error-state {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 14px;
}

.error-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  flex-shrink: 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.error-title {
  font-size: 14px;
  font-weight: 600;
  color: #fca5a5;
}

.error-message {
  font-size: 13px;
  color: rgba(252, 165, 165, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 9px;
  color: #fca5a5;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
}

/* ── Stats Row ── */
.users-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.admin-icon {
  background: rgba(250, 204, 21, 0.12);
  color: #facc15;
}

.user-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 12px;
  color: rgba(148, 163, 184, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

/* ── Table Card ── */
.table-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.table-header {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.table-title-icon {
  color: #60a5fa;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(255, 255, 255, 0.02);
}

th {
  text-align: left;
  padding: 13px 18px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

td {
  padding: 14px 18px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  white-space: nowrap;
}

.user-row {
  transition: background 0.15s ease;
}

.user-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.user-row:last-child td {
  border-bottom: none;
}

/* ── Cells ── */
.user-id {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
}

.email-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.email-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  flex-shrink: 0;
}

.email-text {
  color: #cbd5e1;
  font-size: 13px;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-cell {
  color: rgba(148, 163, 184, 0.7);
  font-size: 13px;
}

/* ── Role Badge ── */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid transparent;
}

.role-badge.admin {
  background: rgba(250, 204, 21, 0.1);
  border-color: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.role-badge.user {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

/* ── Empty State ── */
.empty {
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: rgba(148, 163, 184, 0.35);
  font-size: 14px;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
