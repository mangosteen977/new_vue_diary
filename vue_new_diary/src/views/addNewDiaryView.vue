<template>
  <div class="mb-3 container-lg bg-opacity-25 rounded diary-edit-box">
    <div class="row row-flex-right">
      <!-- <button @click="go_list()" class="btn btn-sm col-1 btn-edit">
        일기 목록
      </button> -->
      <button @click="diary_save()" class="btn btn-sm col-1 btn-edit">
        일기 저장
      </button>
      <!-- <button @click="clear_all()" class="btn btn-sm col-1 btn-edit">
        모든 내용 지우기
      </button>
      <button @click="del_data()" class="btn btn-sm col-1 btn-edit">
        일기 삭제
      </button> -->
    </div>
    <div class="row">
      <div class="col-3">
        <label class="form-label">등록일</label>
        <input
          type="date"
          v-model="select_data.writetime"
          class="form-control"
        />
      </div>
      <div class="col-2">
        <label class="form-label">기분</label>
        <select
          class="form-select form-select-sm"
          aria-label="오늘의 기분 선택"
          v-model="select_data.emotion"
        >
          <!-- <option selected value="">오늘의 기분</option> -->
          <option
            v-for="(item, index) in emotions_arr"
            :key="index"
            :value="index"
          >
            {{ item }}
          </option>
        </select>
      </div>
    </div>
    <div class="row">
      <label class="form-label">제목</label>
      <input v-model="select_data.title" class="form-control" />
    </div>
    <div class="row">
      <label class="form-label">내용</label>
      <textarea
        v-model="select_data.content"
        class="form-control textarea-size"
        rows="20"
      ></textarea>
    </div>
  </div>
</template>
  
  <script>
import { mapState, mapActions } from "pinia"; //store사용 준비, state/actions를 사용.
import { useDiaryStore } from "../stores/store.js";
export default {
  name: "add-new-diary-view",
  data() {
    return {
      emotions_arr: [
        "😎 즐거워",
        "🥰 행복해",
        "😶 그냥그래",
        "😭 너무슬퍼",
        "😡 화가나",
      ],
    };
  },
  computed: {
    ...mapState(useDiaryStore, ["select_data"]),
  },
  mounted() {},
  methods: {
    ...mapActions(useDiaryStore, ["saveDiaryContent"]),
    async diary_save() {
      if (!this.select_data.title) {
        alert("제목을 입력하세요.");
        return;
      }
      if (!this.select_data.content) {
        alert("내용을 입력하세요.");
        return;
      }
      if (this.select_data.emotion === undefined) {
        alert("감정을 선택하세요.");
        return;
      }

      try {
        let result = await this.saveDiaryContent({
          title: this.select_data.title,
          content: this.select_data.content,
          emotion: this.select_data.emotion,
          id: this.select_data.id,
        });

        if (result) {
          console.log(result);
          if (result.success) {
            // 데이터 저장 성공
            if (result.message === "newData") {
              alert("데이터가 성공적으로 저장되었습니다.");
            } else {
              alert("데이터가 성공적으로 수정되었습니다.");
            }
            // 리스트로 이동
            this.$router.push({
              name: "diary-list-view",
            });
          } else {
            // 데이터 저장 실패
            alert("데이터 저장에 실패했습니다. 다시 시도해 주세요.");
          }
        }
      } catch (error) {
        console.error("데이터 저장 중 오류 발생:", error);
        alert("데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    },
  },
};
</script>
  
  <style>
.diary-edit-box {
  background-color: #edb6e7b3;
  margin-top: 50px;
}

.btn-edit {
  width: auto;
  border: 1px solid rgb(192, 106, 192);
  border-radius: 3px;
  margin-right: 3px;
  color: rgb(192, 106, 192);
  /* background-color: violet; */
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: rgb(192, 106, 192);
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: violet;
}

.row-flex-right {
  justify-content: right;
}
</style>
  