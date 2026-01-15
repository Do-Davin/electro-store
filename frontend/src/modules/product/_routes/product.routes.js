export default [
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../_views/ProductList.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('../_views/ProductDetail.vue'),
  }
]
