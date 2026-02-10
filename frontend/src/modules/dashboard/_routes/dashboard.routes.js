export default [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardLayout.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' },
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: () => import('../_pages/DashboardHome.vue'),
      },
      {
        path: 'products',
        redirect: '/dashboard/products/list',
      },
      {
        path: 'products/list',
        name: 'dashboard-product-list',
        component: () => import('../_pages/DashboardProductList.vue'),
      },
      {
        path: 'products/create',
        name: 'dashboard-product-create',
        component: () => import('../_pages/DashboardAddProduct.vue'),
      },
      {
        path: 'products/:id/edit',
        name: 'dashboard-product-edit',
        component: () => import('../_pages/DashboardProductEdit.vue'),
      },
      {
        path: 'orders',
        name: 'dashboard-orders',
        component: () => import('../_pages/DashboardOrders.vue'),
      },
      {
        path: 'users',
        name: 'dashboard-users',
        component: () => import('../_pages/DashboardUsers.vue'),
      },
      {
        path: 'deals',
        name: 'dashboard-deals',
        component: () => import('../_pages/DashboardDeals.vue'),
      },
      // ── Brand CRUD ──
      {
        path: 'brands',
        name: 'dashboard-brands',
        component: () => import('../_pages/DashboardBrands.vue'),
      },
      {
        path: 'brands/create',
        name: 'dashboard-brand-create',
        component: () => import('../_pages/DashboardBrandCreate.vue'),
      },
      {
        path: 'brands/:id/edit',
        name: 'dashboard-brand-edit',
        component: () => import('../_pages/DashboardBrandEdit.vue'),
      },
      // ── Category CRUD ──
      {
        path: 'categories',
        name: 'dashboard-categories',
        component: () => import('../_pages/DashboardCategories.vue'),
      },
      {
        path: 'categories/create',
        name: 'dashboard-category-create',
        component: () => import('../_pages/DashboardCategoryCreate.vue'),
      },
      {
        path: 'categories/:id/edit',
        name: 'dashboard-category-edit',
        component: () => import('../_pages/DashboardCategoryEdit.vue'),
      },
    ],
  },
];
