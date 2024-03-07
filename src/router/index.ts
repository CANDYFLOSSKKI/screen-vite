import {createRouter,createWebHashHistory} from 'vue-router'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: import.meta.env.VITE_BASE_URL,
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('@/view/index.vue'),
        }
    ]
})
