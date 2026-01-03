export default [
  {
    path: '/auth',
    redirect: '/auth/login',
    meta: { guestOnly: true },
    component: () => import('../_components/AuthLayout.vue'),

    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../_views/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../_views/RegisterPage.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('../_views/ForgotPasswordPage.vue')
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('../_views/ResetPasswordPage.vue')
      }
    ]
  }
];
