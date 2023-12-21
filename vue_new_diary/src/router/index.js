import { createRouter, createWebHistory } from "vue-router"
import signInView from '../views/signInView.vue'
const routes = [
    {
        path : '/',
        name : 'signIn-view',
        component : signInView
    },
]
const router = createRouter({
    history:createWebHistory(),
    routes:routes
});
//라우터 가드
export default router