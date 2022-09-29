export default [
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/search.vue'),
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    {
        path: '/search-details',
        name: 'searchDetails',
        component: () => import('@/views/search/searchDetails.vue'),
        props: true,
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
];

