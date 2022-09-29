export default [
    {
        path: '/followers',
        name: 'followers',
        component: () => import('@/views/follows/followers'),
        meta: {requiresAuth: true, requiresVerify: true},
    },
    {
        path: '/followings',
        name: 'followings',
        component: () => import('@/views/follows/followings'),
        meta: {requiresAuth: true, requiresVerify: true},
    },
    {
        path: '/follow-custom-list',
        name: 'customList',
        component: () => import('@/views/follows/customList'),
        meta: {requiresAuth: true, requiresVerify: true},
    },
];