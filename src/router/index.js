import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/c-oj/home"
        },
        {
            path: "/c-oj/home",
            name: "home",
            component: () => import("@/views/Home.vue"),
            children: [
                {
                    path: 'question',
                    name: 'question',
                    component: () => import('@/views/Question.vue')
                },
                {
                    path: 'exam',
                    name: 'exam',
                    component: () => import('@/views/Exam.vue')
                },
            ]
        },
        {
            path: "/c-oj/login",
            name: "login",
            component: () => import("@/views/Login.vue")
        },
    ]
})


export default router

