export default [
    {
        path: '/settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/settings'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            roles: ['ROLE_ADMIN']
        },
        props: true
    },
    {
        path: '/verifications/:status?',
        name: 'verifications',
        component: () => import('@/views/admin/verifications'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            roles: ['ROLE_ADMIN']
        },
        props: true
    },
    {
        path: '/suggestions',
        name: 'suggestions',
        component: () => import('@/views/admin/suggestions'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            roles: ['ROLE_ADMIN']
        },
    },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('@/views/admin/reports'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            roles: ['ROLE_ADMIN']
        },
    },
    {
        path: '/dev-svg-icons',
        name: 'dev-svg-icons',
        component: () => import('@/views/admin/dev-svg-icons'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            roles: ['ROLE_ADMIN']
        },
    }
];

