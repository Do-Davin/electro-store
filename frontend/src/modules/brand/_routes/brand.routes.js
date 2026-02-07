export default [
  {
    path: '/brands',
    name: 'BrandsView',
    component: () => import('../_views/BrandsView.vue'),
  },
  {
    path: '/brands/:id',
    name: 'BrandDetailView',
    component: () => import('../_views/BrandDetailView.vue'),
  },
]
