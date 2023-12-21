import { defineStore } from "pinia";
import axios from "axios";
export const useDiaryStore = defineStore('diaryData', {
    state: () => ({
      username: "",
      isLoggedIn: false,
    }),
    actions: {
      //세선스토리지 로그인 정보 저장 유무 확인
      checkSessionStorage() {
        const userIdFromStorage = sessionStorage.getItem('diary_userid');
        console.log(userIdFromStorage);
        
        if (userIdFromStorage) {
          // 로그인 상태로 설정
          this.isLoggedIn = true;
          this.username = userIdFromStorage;
        }
      },
      // 로그인 php
      async signInDiary(data) {
        try {
          //formdata 형식으로 변환
          const formData = new FormData();
          formData.append("userid", data.userid);
          formData.append("pw", data.pw);
  
          const response = await this.getData("signIn.php", formData);
          const result = response.data;
          console.log(result);

          return result;
        } catch (error) {
          this.handleError(error, "Error during sign in");
        }
      },
      // 회원가입 php
      async signUpDiary(data) {
        //formdata 형식으로 변환
        const formData = new FormData();
        formData.append("userid", data.userid);
        formData.append("name", data.name);
        formData.append("pw", data.pw);
  
        try {
          const response = await this.getData("signUp.php", formData);
          const result = response.data;
          return result;
        } catch (error) {
          this.handleError(error, "Error during sign up");
        }
      },
      async getData(url, formData) {
        return await axios.post(`http://mangsteen977.dothome.co.kr/ajax/DB_Test/${url}`, formData);
      },
      handleError(error, defaultMessage) {
        if (typeof error === "object" && error.error === "databaseConnectionFailed") {
          //db연결 실패 에러
          console.error("Database Connection Failed:", error);
          throw new Error("Database connection failed");
        } else {
          //그 외 실패 에러
          console.error(defaultMessage, error);
          throw new Error(`${defaultMessage} failed`);
        }
      },
    },
  });