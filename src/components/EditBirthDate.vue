<template>
  <div class="wrapper">
    <div class="edit-box">
      <div class="title-box">
        <h1 class="title">생년월일 변경</h1>
        <h3 class="sub-title">생년월일을 입력해주세요.</h3>
      </div>
      <div class="date-input-box">
        <select class="year" v-model="year" @change="updateDays">
          <option value="" disabled>연도</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}년
          </option>
        </select>
        <select class="month" v-model="month" @change="updateDays">
          <option value="" disabled>월</option>
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}월
          </option>
        </select>
        <select class="day" v-model="day">
          <option value="" disabled>일</option>
          <option v-for="day in days" :key="day" :value="day">
            {{ day }}일
          </option>
        </select>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <button class="submit-btn" @click="updateBirth">변경</button>
      <!-- 버튼에 클릭 이벤트 추가 -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios'; // axios 임포트

export default {
  data() {
    return {
      error: false,
      errMsg: '',
      year: '',
      month: '',
      day: '',
      years: [], // 연도 옵션 배열
      months: [], // 월 옵션 배열
      days: [], // 일 옵션 배열
    };
  },
  created() {
    this.formatBirth(this.birthdate);
    this.generateYears();
    this.generateMonths();
    this.updateDays();
  },
  computed: {
    ...mapGetters(['birthdate']),
  },
  methods: {
    formatBirth(birthdate) {
      if (birthdate) {
        const [year, month, day] = birthdate.split('-');
        this.year = year;
        this.month = parseInt(month, 10); // 정수로 변환
        this.day = parseInt(day, 10); // 정수로 변환
      }
    },
    reverseFormatBirth() {
      return `${this.year}-${this.month.toString().padStart(2, '0')}-${this.day
        .toString()
        .padStart(2, '0')}`; // padStart 수정
    },
    generateYears() {
      const startYear = 1960;
      const endYear = 2014;
      this.years = [];
      for (let year = startYear; year <= endYear; year++) {
        this.years.push(year);
      }
    },
    generateMonths() {
      this.months = [];
      for (let month = 1; month <= 12; month++) {
        this.months.push(month);
      }
    },
    updateDays() {
      // 월과 연도가 선택된 경우에만 일수를 업데이트합니다.
      if (this.year && this.month) {
        const daysInMonth = new Date(this.year, this.month, 0).getDate();
        this.days = [];
        for (let day = 1; day <= daysInMonth; day++) {
          this.days.push(day);
        }
        // 선택한 일이 현재 범위 내에 있지 않으면 초기화
        if (this.day > daysInMonth) {
          this.day = '';
        }
      } else {
        this.days = [];
        this.day = '';
      }
    },
    async updateBirth() {
      this.error = false; // 에러 상태 초기화
      this.errMsg = ''; // 에러 메시지 초기화

      const newBirth = this.reverseFormatBirth(); // 새 생년월일 포맷
      // 생일 변경 요청
      try {
        const response = await axios.post('/api/myPage/changeBirth', {
          newBirth, // API에 전송할 데이터
        });

        // 상태 업데이트
        if (response.status === 200) {
          this.$store.commit('setUser', { birthdate: newBirth }); // 'setUser' 뮤테이션 호출
          // 생일 변경 성공 메시지
          alert('생년월일이 성공적으로 변경되었습니다!');
          this.$router.go(-1); // 이전 페이지로 돌아가기
        }
      } catch (error) {
        console.error('생일 변경 중 오류 발생:', error);
        this.error = true;
        this.errMsg = '생일 변경 중 오류가 발생했습니다.'; // 에러 메시지 설정
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/editInfo.css"></style>
