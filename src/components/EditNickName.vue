<template>
  <div class="wrapper">
    <div class="edit-box">
      <div class="title-box">
        <h1 class="title">닉네임 변경</h1>
        <h3 class="sub-title">사용하실 닉네임을 입력해주세요.</h3>
      </div>

      <div class="input-box">
        <input
          type="text"
          placeholder="닉네임 입력"
          maxlength="8"
          v-model="localNickName"
          @keyup.enter="updateNickName"
        />
        <div class="info-box">
          <font-awesome-icon
            :icon="['fas', 'circle-xmark']"
            class="erase-btn"
            @click="clearNickName"
          />
          <span>{{ localNickName.length }}/8</span>
        </div>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <button
        class="submit-btn"
        @click="updateNickName"
        :disabled="localNickName.length === 0"
      >
        변경
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios';

export default {
  data() {
    return {
      localNickName: '',
      error: false,
      errMsg: '',
    };
  },
  mounted() {
    this.localNickName = this.nickname; // Vuex에서 닉네임 가져오기
  },
  computed: {
    ...mapGetters(['nickname']),
  },
  methods: {
    clearNickName() {
      this.localNickName = ''; // 닉네임 지우기
      this.resetError(); // 에러 상태 초기화
    },

    resetError() {
      this.error = false; // 에러 상태 초기화
      this.errMsg = ''; // 에러 메시지 초기화
    },

    async checkNickNameAvailability() {
      try {
        const response = await axios.get(
          `/api/auth/nickNameCheck/${this.localNickName}`
        );
        return response.data; // 사용 가능 여부 반환
      } catch (error) {
        console.error('닉네임 체크 중 오류 발생:', error);
        this.error = true;
        this.errMsg = '닉네임 체크 중 오류가 발생했습니다.';
        return false; // 에러 발생 시 사용 불가로 간주
      }
    },

    async updateNickName() {
      this.resetError(); // 에러 상태 초기화

      // 동기적으로 닉네임 체크
      const isAvailable = await this.checkNickNameAvailability();
      if (!isAvailable) {
        this.error = true;
        this.errMsg = '이미 사용 중인 닉네임입니다.'; // 닉네임 사용 불가 메시지
        return; // 닉네임 변경 요청을 하지 않음
      }

      // 닉네임 변경 요청
      try {
        const response = await axios.post('/api/myPage/changeNickName', {
          newNickName: this.localNickName,
        });

        // 상태 업데이트
        if (response.status === 200) {
          this.$store.commit('setUser', { nickname: this.localNickName }); // Vuex 상태 업데이트
          this.clearNickName(); // 입력 초기화
          alert('닉네임이 성공적으로 변경되었습니다!'); // 성공 메시지
          this.$router.go(-1); // 이전 페이지로 돌아가기
        }
      } catch (error) {
        console.error('닉네임 변경 중 오류 발생:', error);
        this.error = true;
        this.errMsg = '닉네임 변경 중 오류가 발생했습니다.'; // 에러 메시지 설정
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/editInfo.css"></style>
