<template>
  <div class="wrapper">
    <div class="edit-box">
      <div class="title-box">
        <h1 class="title">성별 변경</h1>
        <h3 class="sub-title">성별을 선택해 주세요.</h3>
      </div>

      <div class="radio-box">
        <label>
          남성
          <input type="radio" value="male" v-model="localGender" />
        </label>
        <label>
          여성
          <input type="radio" value="female" v-model="localGender" />
        </label>
        <label>
          선택 안함
          <input type="radio" value="other" v-model="localGender" />
        </label>
      </div>

      <button class="submit-btn" @click="updateGender">변경</button>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios'; // axios 임포트

export default {
  data() {
    return {
      localGender: '',
      error: false,
      errMsg: '',
    };
  },
  created() {
    this.localGender = this.gender; // Vuex 상태에서 성별 가져오기
  },
  computed: {
    ...mapGetters(['gender']), // Vuex에서 gender getter 가져오기
  },
  methods: {
    async updateGender() {
      this.error = false; // 에러 상태 초기화
      this.errMsg = ''; // 에러 메시지 초기화

      try {
        // 성별 변경 요청
        const response = await axios.post('/api/myPage/changeGender', {
          newGender: this.localGender, // API에 전송할 데이터
        });

        // 상태 업데이트
        if (response.status === 200) {
          this.$store.commit('setUser', { gender: this.localGender }); // Vuex 상태 업데이트
          alert('성별이 성공적으로 변경되었습니다!');
          this.$router.go(-1); // 이전 페이지로 돌아가기
        }
      } catch (error) {
        console.error('성별 변경 중 오류 발생:', error);
        this.error = true;
        this.errMsg = '성별 변경 중 오류가 발생했습니다.'; // 에러 메시지 설정
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/editInfo.css"></style>
