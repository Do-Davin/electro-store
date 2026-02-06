export default [
  {
    path: '/orders',
    name: 'HistoryView',
    component: () => import('../_views/HistoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id/confirmation',
    name: 'OrderConfirmation',
    component: () => import('../_views/OrderConfirmationView.vue'),
    meta: { requiresAuth: true },
  },
]
