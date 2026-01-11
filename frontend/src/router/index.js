import authRoutes from '@/modules/auth/_routes/auth.routes'
import cartRoutes from '@/modules/cart/_routes/cart.routes';
import categoryRoutes from '@/modules/category/_routes/category.routes';
import dashboardRoutes from '@/modules/dashboard/_routes/dashboard.routes';
import dealsRoutes from '@/modules/deal/_router/deals.routes';
import orderRoutes from '@/modules/order/_routes/order.routes';
import productRoutes from '@/modules/product/_routes/product.routes';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },
  // {
  //   path: '/dashboard',
  //   name: 'DashboardView',
  //   component: () => import('@/views/DashboardView.vue'),
  // },

  // Inject Auth Module Routes
  ...authRoutes,
  // Register Product Routes in Root Router
  ...productRoutes,
  // Register Category Routes in Root Router
  ...categoryRoutes,
  // Register Cart Routes in Root Router
  ...cartRoutes,
  // Register Order Routes in Root Router
  ...orderRoutes,
  // Register Order Routes in Root Router
  ...dealsRoutes,
    // Register dashboard Routes in Root Router
  ...dashboardRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
