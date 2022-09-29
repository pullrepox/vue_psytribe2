export default [
    {
        path: '/my-profile',
        name: 'profile-private',
        component: () => import('@/views/profile/profile-private'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/user/:id',
        name: 'user-profile',
        component: () => import('@/views/profile/user-profile'),
        props: true,
        meta: {
            requiresAuth: false,
            requiresVerify: true
        }
    },
    {
        path: '/artist/:id',
        name: 'artist-profile',
        component: () => import('@/views/profile/artist-profile'),
        props: true,
        meta: {
            requiresAuth: false,
            requiresVerify: true
        }
    },
]

