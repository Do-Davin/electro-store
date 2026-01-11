export default [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('../_pages/DashboardHome.vue'),
      },
      {
        path: 'products',
        name: 'dashboard-products',
        component: () => import('../_pages/DashboardProducts.vue')
      },
      {
        path: 'orders',
        name: 'dashboard-orders',
        component: () => import('../_pages/DashboardOrders.vue')
      },
      {
        path: 'users',
        name: 'dashboard-users',
        component: () => import('../_pages/DashboardUsers.vue')
      },
      {
        path: 'deals',
        name: 'dashboard-deals',
        component: () => import('../_pages/DashboardDeals.vue')
      },
    ],
  },
];
