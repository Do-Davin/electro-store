export default [
  {
    path: '/auth',
    redirect: '/auth/login',
    meta: { guestOnly: true },
    component: () => import('../_views/AuthPage.vue'),

    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../_components/LoginFormComponent.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../_components/RegisterFormComponent.vue')
      },
      // {
      //   path: 'forgot-password',
      //   name: 'ForgotPassword',
      //   component: () => import('../_views/ForgotPasswordPage.vue')
      // },
      // {
      //   path: 'reset-password',
      //   name: 'ResetPassword',
      //   component: () => import('../_views/ResetPasswordPage.vue')
      // }
    ]
  }
];
