import { getRole, isLoggedIn } from '@/lib/auth';
import authRoutes from '@/modules/auth/_routes/auth.routes'
import cartRoutes from '@/modules/cart/_routes/cart.routes';
import brandRoutes from '@/modules/brand/_routes/brand.routes';
import checkoutRoutes from '@/modules/checkout/_routes/checkout.routes';
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
  // Register Brand Routes in Root Router
  ...brandRoutes,
  // Register Cart Routes in Root Router
  ...cartRoutes,
  // Register Checkout Routes in Root Router
  ...checkoutRoutes,
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
  scrollBehavior() {
    // Return a promise that resolves after a short delay
    // to ensure the DOM has updated before scrolling
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ top: 0, left: 0, behavior: 'instant' })
      }, 50)
    })
  },
});

// Guards
router.beforeEach((to, from) => {
  // Scroll to top immediately before navigation
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

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
