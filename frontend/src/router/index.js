import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    name: 'HomeView',
    // children: [
    //   {
    //     path: '',
    //     name: 'Home',
    //     component: () => import('@/views/HomeView.vue')
    //   },
    // ],
    // redirect: {
    //   path: '/',
    //   component: () => import('@/views/HomeView.vue'),
    //   name: 'HomeView',
    // },
  },
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
    name: 'DashboardView',
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
