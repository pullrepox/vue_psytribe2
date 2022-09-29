export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/login'),
        meta: {requiresAuth: false}
    },
    {
        path: '/registration',
        name: 'registration',
        component: () => import('@/views/auth/registration'),
        meta: {requiresAuth: false}
    },
    // forgot password
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/forgot-password'),
        meta: {requiresAuth: false}
    },
    {
        path: '/reset-password/reset/:token',
        name: 'password-recovery',
        component: () => import('@/views/auth/password-recovery'),
        props: true,
        meta: {requiresAuth: false}
    },
    // end forgot password
    {
        path: '/email-verification',
        name: 'email-verification',
        component: () => import('@/views/auth/email-verification'),
        meta: {requiresAuth: false}
    },
    {
        path: '/email-congratulations',
        name: 'email-congratulations',
        component: () => import('@/views/auth/email-congratulations'),
        meta: {requiresAuth: true}
    },
    {
        path: '/profile-basics',
        name: 'profile-basics',
        component: () => import('@/views/auth/profile-basics'),
        meta: {requiresAuth: true}
    },
]
