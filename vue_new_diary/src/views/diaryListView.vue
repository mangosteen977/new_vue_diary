<template>
  <div class="list_box">
    <!-- 해당 아이디의 다이어리 리스트 있음(content_data) -->
    <div v-if="content_data && content_data.length > 0">
      <!-- <button @click="getdata()" class="btn btn-sm col-1 btn-profile">
        새로고침
      </button> -->
      <button @click="sortAtoB()" class="btn btn-sm col-1 btn-profile">
        내림차순
      </button>
      <button @click="sortBtoA()" class="btn btn-sm col-1 btn-profile">
        오름차순
      </button>
      <div
        v-for="item in content_data"
        :key="item.id"
        @dblclick="edit_Data(item)"
        class="rounded diary-list-box"
      >
        <div class="diary-list-title">
          <label class="">{{ emotions_arr[item.emotion] }}</label>
          <div class="diary-list-top">
            <label class="">{{ item.writetime }}</label>
            <label class="">{{ item.title }}</label>
          </div>
        </div>
        <div class="diary-list-content">
          <label class="">{{ item.content }}</label>
        </div>
        <div class="diary-list-bottom">
          <button @click="edit_Data(item)" class="btn btn-sm col-1 btn-edit">
            수정
          </button>
          <button @click="del_data(item.id)" class="btn btn-sm col-1 btn-edit">
            삭제
          </button>
        </div>
      </div>
    </div>
    <!-- 해당 아이디의 다이어리 리스트 없음(content_data) -->
    <div v-else class="diary-list-title">
      <p>작성 된 다이어리가 없네요.</p>
    </div>
  </div>
</template>
    
    <script>
import { mapState, mapActions } from "pinia"; //store사용 준비, state/actions를 사용.
import { useDiaryStore } from "../stores/store.js";
export default {
  name: "diary-list-view",
  data() {
    return {
      emotions_arr: ["😎", "🥰", "😶", "😭", "😡"],
      original_contentData: [],
    };
  },
  computed: {
    ...mapState(useDiaryStore, ["content_data"]),
  },
  created() {
    this.loadDiarylist();
  },
  methods: {
    ...mapActions(useDiaryStore, [
      "loadDiarylist",
      "deleteDiaryContent",
      "setSelect_data",
    ]),
    // getdata() {
    //   this.loadDiarylist();
    //   // console.log(this.content_data);
    // },
    sortAtoB() {
      this.content_data.sort(
        (a, b) => new Date(b.writetime) - new Date(a.writetime)
      );
    },
    sortBtoA() {
      this.content_data.sort(
        (a, b) => new Date(a.writetime) - new Date(b.writetime)
      );
    },
    edit_Data(item) {
      this.setSelect_data(item);
      // console.log(this.select_data);
      this.$router.push({
        name: "add-new-diary-view",
      });
    },
    async del_data(itemID) {
      if (confirm("삭제할까요?")) {
        try {
          console.log("삭제 아이디", itemID);
          let result = await this.deleteDiaryContent(itemID);
          if (result) {
            if (result.success) {
              // 삭제 성공
              alert("삭제되었습니다.");
              //다이어리 리스트 재로드
              this.loadDiarylist();
            } else {
              // 삭제 실패
              if (result.message === "DiaryContentNotFound") {
                // 해당 id의 콘텐츠가 존재하지 않음.
                alert("삭제에 실패했습니다. 다시 시도해 주세요.");
                console.log("Not Found Diary Content Id :" + result.message);
              } else {
                alert("삭제에 실패했습니다. 다시 시도해 주세요.");
                console.log("delete failure :" + result.error);
                console.log(typeof result);
                console.log(result);
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
            alert("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
          } else {
            // 그 외 오류 발생
            console.error("삭제 중 오류 발생 : ", error);
            alert("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
          }
        }
      }
    },
  },
};
</script>
    
  <style>
.list_box {
  /*width: 600px;*/
  max-width: 600px;
  height: auto;
  margin: 0 auto;
  margin-top: 50px;
}
.diary-list-box {
  border: 3px solid #edb6e7b3;
  /* background-color: #edb6e7b3; */
  /* padding: 20px; */
  margin-top: 15px;
}
.diary-list-box:hover {
  box-shadow: 6px 6px 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.diary-list-title {
  background-color: #edb6e7b3;
  width: 100%;
  height: auto;
  font-size: 1.3em;
  border-radius: 3px 3px 0px 0px;
  padding: 5px 15px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px;
}
.diary-list-content {
  border-radius: 5px;
  font-size: 1em;
}
.diary-list-content > label {
  width: 100%;
  height: auto;
  min-height: 120px;
  padding: 15px;
  font-size: 1.2em;
  background-color: #ffffffd3;
  border-radius: 5px;
}
.diary-list-top {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
}
.diary-list-top > div > label {
  width: auto;
  height: 30px;
  line-height: 30px;
  font-size: 1.2em;
  margin-right: 10px;
}
.diary-list-bottom {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-end;
}
.btn-profile {
  width: auto;
  border: 1px solid rgb(192, 106, 192);
  border-radius: 3px;
  margin-right: 3px;
  margin-bottom: 10px;
  color: rgb(192, 106, 192);
  /* background-color: violet; */
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: rgb(192, 106, 192);
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: violet;
}
</style>