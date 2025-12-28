import authRoutes from '@/modules/auth/_routes/auth.routes'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/dashboard',
    name: 'DashboardView',
    component: () => import('@/views/DashboardView.vue'),
  },

  // Inject Auth Module Routes
  ...authRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
