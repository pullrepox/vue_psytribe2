export default [
    {
        path: '/faq',
        name: 'faq',
        component: () => import('@/views/support/faq'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    {
        path: '/feature-suggestions',
        name: 'feature-suggestions',
        component: () => import('@/views/support/feature-suggestions'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    {
        path: '/bug-reports',
        name: 'bug-reports',
        component: () => import('@/views/support/bug-reports'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    {
        path: '/changelog',
        name: 'changelog',
        component: () => import('@/views/support/changelog'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    //
    // {
    //     path: '/donate',
    //     name: 'donate',
    //     component: () => import('@/views/support/donate'),
    //     meta: {
    //         requiresAuth: false,
    //         requiresVerify: true,
    //     }
    // }
]
