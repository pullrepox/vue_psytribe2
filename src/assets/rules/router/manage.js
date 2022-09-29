import uploadVerification from "@/views/manage/upload-verification";

export default [
    {
        path: '/music_upload',
        name: 'musicUpload',
        component: () => import('@/views/manage/upload-music'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/manage_uploaded', // manage uploaded[music]
        name: 'manageUploaded',
        component: () => import('@/views/manage/manageUploaded'),
        meta: {
            requiresAuth: true,
            requiresVerify: true,
        }
    },
    {
        path: '/upload-verification/:artistId',
        name: 'upload-verification',
        component: uploadVerification,
        meta: {
            requiresAuth: true,
            requiresVerify: true,
            // roles: ['ROLE_ADMIN']
        },
        props: true
    },
]
