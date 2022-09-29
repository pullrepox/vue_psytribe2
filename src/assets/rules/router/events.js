const eventDetails = () => import('@/views/event/eventDetails');
const createEvent = () => import('@/views/event/createEvent');
const front = () => import('@/views/event/front');

export default [
    {
        path: '/event/:id',
        name: 'eventDetails',
        component: eventDetails,
        props: true,
        meta: {
            requiresAuth: false,
            requiresVerify: true,
        }
    },
    {
        path: '/create-event',
        name: 'createEvent',
        component: createEvent,
        props: false,
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/front',
        name: 'front',
        component: front,
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    }
]
