import { createRouter, createWebHistory } from "vue-router"
import signInView from '../views/signInView.vue'
import addNewDiaryView from '../views/addNewDiaryView.vue'
import diaryListView from '../views/diaryListView.vue'
import calendarView from '../views/calendarView.vue'
//store
import { useDiaryStore } from '../stores/store.js';
// 각 페이지 이동 사이 로그인 확인
async function confirm_login(to, from, next){
    const diaryStore = useDiaryStore();
    //from : 현재 라우터 페이지, to : 클릭한 라우터 페이지, next : 이동할 라우터 페이지
    await diaryStore.checkSessionStorage();
    // isLoggedIn 상태 확인
    if (diaryStore.isLoggedIn) {
        next();
    } else {
        alert("로그인이 필요합니다.");
        next('/');
    }
}
const routes = [
    {
        path : '/',
        name : 'signIn-view',
        component : signInView
    },
    {
        path : '/addnewDiary',
        name : 'add-new-diary-view',
        beforeEnter:[confirm_login],
        component : addNewDiaryView
    },
    {
        path : '/diaryListView',
        name : 'diary-list-view',
        beforeEnter:[confirm_login],
        component : diaryListView
    },
    {
        path : '/calendarView',
        name : 'calendar-view',
        beforeEnter:[confirm_login],
        component : calendarView
    }
]
const router = createRouter({
    history:createWebHistory(),
    routes:routes
});
//라우터 가드
export default router