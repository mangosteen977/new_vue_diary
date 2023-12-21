import { defineStore } from "pinia";
import axios from "axios";
export const useDiaryStore = defineStore('diaryData', {
    state: () => ({
      username: "", //로그인 아이디
      userId : null,//로그인 된 아이디 ID
      isLoggedIn: false, //로그인 유무
      select_data: {}, //다이어리 작성 페이지
    }),
    actions: {
      //세선스토리지 로그인 정보 저장 유무 확인
      checkSessionStorage() {
        const userIdFromStorage = sessionStorage.getItem('diary_user');
        console.log(typeof(userIdFromStorage));
        let UserDataJson = JSON.parse(userIdFromStorage);

        if (UserDataJson) {
          // 로그인 상태로 설정
          this.isLoggedIn = true;
          this.username = UserDataJson.name;
          this.userId = UserDataJson.id;
        }
        console.log(this.username, this.userId);
      },
      //php 주소..
      async getData(url, formData) {
        return await axios.post(`http://mangsteen977.dothome.co.kr/ajax/DB_Test/${url}`, formData);
      },
      //db error 공통
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
      //로그인 php
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
      //회원가입 php
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
      //다이어리 내용 저장/수정
      async saveDiaryContent(data) {
        // formdata 형식으로 변환
        const formData = new FormData();
        let checkI = data.id === undefined ? true : false;
        console.log(data.id, checkI, this.username, this.userId);
        formData.append("writerid", this.userId);
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("emotion", data.emotion);
        formData.append("creator", this.username);
        if(data.id != undefined){
          formData.append("id", data.id); // id있을 경우 수정, 없으면 신규 저장
          formData.append("updater", this.username);
        }
        try {
          const response = await this.getData("addNewDiary.php", formData);
          const result = response.data;
          return result;
        } catch (error) {
          this.handleError(error, "Error during saving diary content");
        }
      },
    }
  });