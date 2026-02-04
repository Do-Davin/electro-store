import { getRole, isLoggedIn } from '@/lib/auth';
import authRoutes from '@/modules/auth/_routes/auth.routes'
import cartRoutes from '@/modules/cart/_routes/cart.routes';
import categoryRoutes from '@/modules/category/_routes/category.routes';
import dashboardRoutes from '@/modules/dashboard/_routes/dashboard.routes';
import dealsRoutes from '@/modules/deal/_router/deals.routes';
import orderRoutes from '@/modules/order/_routes/order.routes';
import productRoutes from '@/modules/product/_routes/product.routes';
import profileRoutes from '@/modules/profile/_routes/profile.routes';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/wishlist',
    component: () => import('@/modules/wishlist/_views/WishlistView.vue')
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
  // Register Profile Routes in Root Router
  ...profileRoutes,
  // Register Order Routes in Root Router
  ...dealsRoutes,
  // Register dashboard Routes in Root Router
  ...dashboardRoutes,
  // Register Profile Routes in Root Router
  ...profileRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guards
router.beforeEach((to) => {
  const loggedIn = isLoggedIn();

  // guest only pages (login/register) -> block if logged in
  if (to.meta?.guestOnly && loggedIn) {
    const role = getRole();
    return role === 'ADMIN' ? '/dashboard' : '/';
  }

  // requires auth pages -> force login
  if (to.meta?.requiresAuth && !loggedIn) {
    return '/auth/login';
  }

  // role protected pages
  if (to.meta?.role) {
    if (!loggedIn) return '/auth/login';

    const role = getRole();
    if (!role || role.toUpperCase() !== to.meta.role.toUpperCase()) {
      // optional: logout if token is invalid/outdated
      // logout();
      return '/';
    }
  }

  return true;
});

export default router;
