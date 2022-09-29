export default [
    {
        path: '/settings/privacy',
        name: 'privacy',
        component: () => import('@/views/settings/privacy.vue'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/settings/notifications',
        name: 'notifications',
        component: () => import('@/views/settings/notifications.vue'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        },
    },
    {
        path: '/settings/wallet',
        name: 'wallet',
        component: () => import('@/views/settings/wallet.vue'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/settings/security',
        name: 'security',
        component: () => import('@/views/settings/security.vue'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/settings/membership',
        name: 'membership',
        component: () => import('@/views/settings/membership.vue'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
]
