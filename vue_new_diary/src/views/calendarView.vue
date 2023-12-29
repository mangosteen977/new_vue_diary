<template>
  <div>
    <section id="diary_monthly" class="diary_monthly">
      <div class="year_month">
        <div>
          <label class="this_year">{{ this.year }}</label>
          <label class="btn_year">
            <span @click="select_year = 1">↑</span>
            <span @click="select_year = -1">↓</span>
          </label>
        </div>
        <ul>
          <li
            v-for="(mon, i) in arr_months"
            :key="i"
            :id="'mon' + mon"
            @click="select_month = mon"
          >
            {{ mon }}
          </li>
        </ul>
      </div>
      <div class="dayDate">
        <div class="days">
          <label v-for="(d, i) in days" :key="i">{{ d }}</label>
        </div>
        <div class="date">
          <label
            v-for="(da, i) in arr_dates"
            :key="i"
            @click="write_new_diary(da)"
          >
            {{ da[0] }}
            <span v-show="da[4] != null" :class="'diary_' + da[3]">
              <span
                v-show="da[4] != null"
                v-for="(emotion, i) in da[4]"
                :key="i"
                @click="write_diary(emotion.id)"
                :title="emotion.title"
              >
                {{ emotions_arr[emotion.emotion] }}
              </span>
            </span>
          </label>
        </div>
      </div>
    </section>
  </div>
</template>
  
  <script>
const cal_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
import { mapState, mapActions } from "pinia"; //store사용 준비, state/actions를 사용.
import { useDiaryStore } from "../stores/store.js";
import dayjs from "dayjs"; // 날짜 형식 변경을 위해..
let today = new Date();
export default {
  name: "calendar-view",
  data() {
    return {
      year: "",
      month: "",
      arr_dates: [],
      today_date: "",
      today_day: "",
      days: ["Sun", "Mon", "Tue", "Wed", "Tur", "Fri", "Sat"],
      arr_months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      select_month: "",
      select_year: "",
      emotions_arr: ["😎", "🥰", "😶", "😭", "😡"],
    };
  },
  computed: {
    ...mapState(useDiaryStore, ["content_data"]),
  },
  mounted: function () {
    this.get_todays_calendars();
  },
  watch: {
    select_month: function () {
      this.getCalendars_by_selected_month();
    },
    select_year: function () {
      this.getCalendars_by_selected_year();
    },
  },
  methods: {
    ...mapActions(useDiaryStore, [
      "setSelect_data",
      "loadDiarylist",
      "loadDiarylistByContentID",
    ]),
    //평달 윤달 확인
    isLeapYear() {
      return (
        // 연도가 4로 나누어 떨어지고 100으로 나누어 떨어지지 않거나, 400으로 나누어 떨어지면 윤년
        (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0
      );
    },
    //캘린더 배열 구성
    getCalendars() {
      this.arr_dates = [];
      let start_day = new Date(this.year + "-" + this.month + "-01").getDay(); //1일의 요일
      let last_date =
        this.isLeapYear() && this.month === 2 ? 29 : cal_month[this.month - 1]; //해당 월의 마지막 일
      // 윤달 && 2월일 경우 29일이 마지막 일
      let none_date = ["", "", "", ""]; //빈 칸
      for (let i = 0; i < start_day; i++) {
        this.arr_dates.push(none_date);
      }
      for (let i = 0; i < last_date; i++) {
        // 일기 유무 확인 전 해당 월의 배열 만들기
        // [일,요일,날짜,일기유무(T/F),[이모지 배열]]
        let date_day = new Date(
          this.year + "-" + this.month + "-" + i + 1
        ).getDay(); // 해당 일의 요일
        let date_format = dayjs(
          String(this.year + "-" + this.month + "-" + (i + 1))
        ).format("YYYY-MM-DD"); // yyyy-mm-dd
        let check_diary = false; // 일기 유무
        let diary_emotion = []; // [{다이어리 id, 이모션 값, title}]
        // 일기 유무 확인.. 일기 유무 및 id값을 넣기..
        this.content_data.map((val) => {
          if (val.writetime == date_format) {
            check_diary = true;
            diary_emotion.push({
              id: val.id,
              emotion: val.emotion,
              title: val.title,
            });
          }
        });
        if (diary_emotion.length == 0) {
          diary_emotion = null;
        }
        let date = [i + 1, date_day, date_format, check_diary, diary_emotion];
        this.arr_dates.push(date);
      }
      // 캘린더 남는 공간에 빈칸 추가
      const remainingEmptyDays = 42 - this.arr_dates.length;
      const fillCount = remainingEmptyDays >= 7 ? 35 : 42;
      for (let i = this.arr_dates.length; i < fillCount; i++) {
        this.arr_dates.push(["", "", "", ""]);
      }

      //   if (this.arr_dates.length < 42) {
      //     if (42 - this.arr_dates.length >= 7) {
      //       for (let i = this.arr_dates.length; i < 35; i++) {
      //         this.arr_dates.push(none_date);
      //       }
      //     } else {
      //       for (let i = this.arr_dates.length; i < 42; i++) {
      //         this.arr_dates.push(none_date);
      //       }
      //     }
      //   }

      console.log("캘린더arr", this.arr_dates);
    },
    get_todays_calendars() {
      // 오늘 날짜 확인
      this.year = today.getFullYear();
      this.month = today.getMonth() + 1;
      document.getElementById("mon" + this.month).className = "thisMonth"; // 해당 월 표시 classname 추가
      this.today_date = today.getDate();
      this.today_day = this.days[today.getDay()];
      //   console.log(
      //     today,
      //     this.year,
      //     this.month,
      //     this.today_date,
      //     this.today_day
      //   );
      // store에 DB 가져온 뒤 캘린더 배열 만드는 함수 호출
      this.loadDiarylist().then(() => {
        // console.log("mounted__loadDiarylist", this.content_data);
        this.getCalendars();
      });
    },
    getCalendars_by_selected_year() {
      this.year = Number(this.year + this.select_year);
      this.select_year = "";
      this.getCalendars();
    },
    getCalendars_by_selected_month() {
      //event e.target
      document.getElementById("mon" + this.month).classList.remove("thisMonth");
      document.getElementById("mon" + this.select_month).className =
        "thisMonth";
      this.month = this.select_month;
      this.getCalendars();
    },
    //선택 된 일의 일기 신규 작성
    write_new_diary(date) {
      //   console.log(date);
      if (date[2] && !date[3]) {
        // date[2] : 날짜, date[3] : 작성 된 일기 여부
        let selectDay = { writetime: date[2] };
        this.setSelect_data(selectDay);
        this.$router.push({
          name: "add-new-diary-view",
        });
      }
    },
    //선택 된 일기 수정
    write_diary(id) {
      console.log(id);
      this.loadDiarylistByContentID(id); // 선택한 diaryContent의 id값
      this.$router.push({
        name: "add-new-diary-view",
      });
    },
  },
};
</script>
  
  <style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;400;700;900&display=swap");
/* font-family: 'Noto Sans KR', sans-serif; (100, 400, 700, 900) */
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

button,
input[type="button"],
input[type="submit"] {
  cursor: pointer;
}

img {
  width: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 12px;
}
.diary_monthly {
  width: 900px;
  height: auto;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.year_month {
  width: 700px;
  height: auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.year_month > div {
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.this_year {
  width: auto;
  height: auto;
  font-size: 30px;
}
.btn_year {
  width: 15px;
  height: auto;
  margin-left: 10px;
  cursor: pointer;
}
.btn_year > span {
  width: 15px;
  height: 15px;
  display: block;
}
.year_month > ul {
  width: 300px;
  height: 50px;
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  font-size: 9px;
  margin: 0;
  padding: 0;
}
.year_month > ul > li {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
}
.thisMonth {
  font-weight: bold;
  border-radius: 100%;
  background-color: violet;
  /* border: 1px solid violet; */
}
.dayDate {
  width: auto;
  height: auto;
  /* margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      border: 1px solid rgb(13, 0, 255); */
}
.dayDate > div {
  width: 700px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.dayDate > div > label {
  width: 90px;
  height: 40px;
  padding: 5px;
  font-size: 0.8em;
  /* text-align: center;
    line-height: 40px; */
  position: relative;
}
.date > label {
  cursor: pointer;
  background-color: #edb6e7b3;
  margin-top: 10px;
}
.date > label:hover {
  background-color: #d1a1cbb3;
}
.diary_true {
  /* 
      text-decoration-style: wavy;
      font-weight: bold;
      text-decoration-thickness: 2px;
      text-decoration-color: darkmagenta;
      text-decoration-line: underline;
      border-bottom: 1vh solid #db7093a3;
      display: block;
    */
  width: 40px;
  height: 20px;
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 15;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
}
.diary_true:hover {
  overflow: visible;
  width: auto;
  height: auto;
  background-color: #ffffff5b;
  border-bottom: 3px solid plum;
}
.diary_true > span {
  line-height: normal;
  font-size: 1.5em;
}
.diary_true > span:hover {
  font-size: 2em;
}
</style>
  