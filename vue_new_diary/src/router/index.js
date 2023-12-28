import { createRouter, createWebHistory } from "vue-router"
import signInView from '../views/signInView.vue'
import addNewDiaryView from '../views/addNewDiaryView.vue'
import diaryListView from '../views/diaryListView.vue'
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
    {
        path : '/diaryListView',
        name : 'diary-list-view',
        component : diaryListView
    },
]
const router = createRouter({
    history:createWebHistory(),
    routes:routes
});
//라우터 가드
export default router