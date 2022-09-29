export default [
    {
        path: '/logged-out',
        name: 'logged-out', component: () => import('@/views/after-actions/logged-out.vue'),
        meta: {requiresAuth: false}
    },
    {
        path: '/password-changed',
        name: 'password-changed', component: () => import('@/views/after-actions/password-changed.vue'),
        meta: {requiresAuth: false}
    },
    {
        path: '/under-construction',
        name: 'underConstruction', component: () => import('@/views/after-actions/underConstruction'),
        meta: {requiresAuth: false}
    },
    {
        path: '/verification-request-submitted',
        name: 'verification-request-submitted', component: () => import('@/views/after-actions/verificationRequestSubmitted'),
        meta: {requiresAuth: false}
    },
    {path: '/404', name: '404', component: () => import('@/views/404.vue')},
    {path: '*', redirect: '/404'}
]
