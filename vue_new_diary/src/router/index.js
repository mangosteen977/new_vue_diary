import { createRouter, createWebHistory } from "vue-router"
import signInView from '../views/signInView.vue'
import addNewDiaryView from '../views/addNewDiaryView.vue'
const routes = [
    {
        path : '/',
        name : 'signIn-view',
        component : signInView
    },
    {
        path : '/addnewDiary',
        name : 'add-new-diary-view',
        component : addNewDiaryView
    },
]
const router = createRouter({
    history:createWebHistory(),
    routes:routes
});
//라우터 가드
export default router