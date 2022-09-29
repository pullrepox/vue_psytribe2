export default [
    {
        path: '/',
        name: 'explore',
        component: () => import('@/views/explore'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        },
    },
    {   // mobile
        path: '/albums-list/:id?', // subgenre
        name: 'albumsList',
        component: () => import('@/views/mobile/main/albumsList'),
        props: true,
        meta: {requiresAuth: false},
    },
    {
        path: '/album/:id/:favourite?',
        name: 'albumDetails',
        component: () => import('@/views/albumDetails'),
        props: true,
        meta: {requiresAuth: false}
    },
    // {
    //     path: '/album/:id/:trackID',
    //     name: 'albumDetails',
    //     component: () => import('../../../views/albumDetails'),
    //     props: true,
    //     meta: {requiresAuth: false}
    // },

    {
        path: '/library',
        name: 'library',
        component: () => import('@/views/library'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        },
        redirect: {name: 'collection'},
        children: [
            {
                path: 'collection',
                name: 'collection',
                component: () => import('@/views/library/collection'),
                meta: {requiresAuth: true},
            },
            {
                path: 'playlist',
                name: 'playlist',
                component: () => import('@/views/library/playlist'),
                meta: {requiresAuth: true},
            },
        ],
    },
    {
        path: '/memberships',
        name: 'memberships',
        component: () => import('../../../views/memberships'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
]
