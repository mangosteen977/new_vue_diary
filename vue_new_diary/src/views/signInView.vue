<template>
  <div class="text-center signIn-box">
    <section class="form-signin w-100 m-auto">
      <h1 class="h3 mb-3 fw-normal">로그인</h1>
      <!-- 아이디 -->
      <div class="form-floating">
        <input
          type="text"
          id="floatingInput"
          class="form-control"
          v-model="signInID"
          v-on:keyup.enter="keyEnter()"
          @input="checkID"
        />
        <label for="floatingInput">아이디</label>
      </div>
      <div v-if="!isIDValid && signUP" class="text-danger small">
        아이디는 영문과 숫자로 설정할 수 있으며 5자이상으로 입력해주세요.
      </div>
      <!-- 이름 : 회원가입 시에만 표시 -->
      <div class="form-floating">
        <input
          v-show="signUP"
          type="text"
          class="form-control"
          id="floatingName"
          v-model="signUpName"
          v-on:keyup.enter="keyEnter()"
        />
        <label for="floatingName">이름</label>
      </div>
      <!-- 비밀번호 -->
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="floatingPassword"
          v-model="signInPW"
          v-on:keyup.enter="keyEnter()"
          @input="checkPW"
        />
        <label for="floatingPassword">비밀번호</label>
      </div>
      <div v-if="!isPWValid && signUP" class="text-danger small">
        비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상으로 작성해주세요.
      </div>
      <button
        v-show="!signUP"
        class="w-100 mb-2 btn btn-lg btn-signIn"
        @click="signIn()"
        :disabled="!isIDValid || !isPWValid"
      >
        로그인
      </button>
      <label
        v-show="signUP"
        class="w-100 mb-2 btn btn-lg btn-signUp"
        @click="signUp()"
        :disabled="!isIDValid || !isPWValid"
        >회원가입</label
      >
      <span
        v-show="!signUP"
        class="h6 fw-light text-decoration-underline"
        role="button"
        @click="signUP = true"
        >회원가입</span
      >
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useDiaryStore } from "../stores/store.js";

export default {
  name: "signIn-view",
  data() {
    return {
      signInID: "",
      signInPW: "",
      signUpName: "",
      signUP: false,
      isIDValid: true,
      isPWValid: true,
    };
  },
  computed: {
    ...mapState(useDiaryStore, ["isLoggedIn"]),
  },
  methods: {
    ...mapActions(useDiaryStore, ["signInDiary", "signUpDiary"]),
    keyEnter() {
      this.signUP === true ? this.signUp() : this.signIn();
    },
    //아이디 확인(5자 이상, 영문)
    checkID() {
      this.isIDValid = /^[a-zA-Z\d]{5,}$/.test(this.signInID);
    },
    //비밀번호 확인(영문/숫자/특수문자 포함 8자 이상)
    checkPW() {
      this.isPWValid =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          this.signInPW
        );
    },
    // 로그인
    async signIn() {
      try {
        if (!this.signInID) {
          alert("ID를 입력하세요.");
          document.getElementById("floatingInput").focus();
          return;
        }
        if (!this.signInPW) {
          alert("password를 입력하세요.");
          document.getElementById("floatingPassword").focus();
          return;
        }

        let data = {
          userid: this.signInID,
          pw: this.signInPW,
        };

        let result = await this.signInDiary(data);

        this.signInID = "";
        this.signInPW = "";

        if (result.success) {
          // 로그인 성공
          alert(result.username + "님 안녕하세요.");
          // 세션스토리지에 로그인 정보 저장
          let userData = {
            name: result.username,
            id: result.user_id,
          };
          let jsonUserData = JSON.stringify(userData);
          sessionStorage.setItem("diary_user", jsonUserData);
          // 로그인 상태로 설정
          this.isLoggedIn = true;
          // 로그인 성공 시 리스트 페이지로 이동
          this.$router.push({
            name: "calendar-view",
          });
          // location.href = "/";
        } else {
          // passwordMismatch, userInformationNotFound 실패
          alert("로그인에 실패했습니다. 다시 시도해 주세요.");
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        alert("로그인 요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    },
    // 회원가입
    async signUp() {
      if (!this.signInID) {
        alert("ID를 입력하세요.");
        document.getElementById("floatingInput").focus();
        return;
      }
      if (!this.signUpName) {
        alert("이름을 입력하세요.");
        document.getElementById("floatingName").focus();
        return;
      }
      if (!this.signInPW) {
        alert("password를 입력하세요.");
        document.getElementById("floatingPassword").focus();
        return;
      }

      try {
        let result = await this.signUpDiary({
          userid: this.signInID,
          name: this.signUpName,
          pw: this.signInPW,
        });

        this.signInID = "";
        this.signInPW = "";
        this.signUpName = "";

        if (result) {
          if (result.success) {
            // 회원가입 성공
            alert("회원가입 되었습니다.");
            this.signUP = false; //login 화면 보여주기
          } else {
            // 회원가입 실패
            if (result.message === "alreadyExistsId") {
              // 중복아이디
              alert("이미 존재하는 아이디입니다. 다시 시도해 주세요.");
              console.log("already Exists Id :" + result.message);
            } else {
              alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
            }
          }
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error.error === "databaseConnectionFailed"
        ) {
          // 데이터베이스 연결 실패
          console.error("데이터베이스 연결 실패 : ", error);
          alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } else {
          // 그 외 오류 발생
          console.error("회원가입 중 오류 발생 : ", error);
          alert("회원가입 요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      }
    },
  },
  watch: {
    signInID: "checkID",
    signInPW: "checkPW",
  },
};
</script>
  
  <style>
.signIn-box {
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.form-signin {
  max-width: 330px;
  padding: 15px;
  background-color: #edb6e7b3;
  border-radius: 3%;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-radius: 0;
}

.form-signin input[type="password"] {
  border-radius: 0;
  margin-bottom: 10px;
}

.btn-signUp {
  color: #fff;
  background-color: plum;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: rgb(192, 106, 192);
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: plum;
}

.btn-signIn {
  color: #fff;
  background-color: palevioletred;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: rgb(168, 88, 115);
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: palevioletred;
}
</style>
  