<template>
  <div>
    <header>
      <!-- navigation part -->
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/calendar">다이어리</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" aria-current="page" to="/calendar"
                  >Home</router-link
                >
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/list">List</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/list2">List2</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/edit">Write</router-link>
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <router-link class="nav-link" to="/profile"
                  >Profile</router-link
                >
              </li>
              <li class="nav-item" v-if="isLoggedIn" @click="logOut()">
                <div class="nav-link" role="button">로그아웃</div>
              </li>
              <li class="nav-item" v-else @click="goToLoginView()">
                <div class="nav-link" role="button">로그인</div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
  
  <script>
import { mapState, mapActions } from "pinia"; //store사용 준비, state/actions를 사용.
import { useDiaryStore } from "./stores/store.js";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useDiaryStore, ["isLoggedIn"]),
  },
  created() {
    this.checkSessionStorage();
  },
  methods: {
    ...mapActions(useDiaryStore, ["checkSessionStorage"]), //store의 actions 사용 (로그인/회원가입)
    goToLoginView() {
      this.$router.push({
        name: "signIn-view", //로그인 페이지로
      });
    },
    logOut() {
      // 세션스토리지 저장 값 삭제
      console.log(this.isLoggedIn);
      sessionStorage.removeItem("diary_userid");
      // 로그아웃 상태로 설정
      this.isLoggedIn = false;
      // 로그인 페이지로 새로고침
      location.href = "/";
    },
  },
};
</script>
  
  <!-- <script setup>
  import { RouterView } from "vue-router";
  </script> -->
  
  <style></style>
  