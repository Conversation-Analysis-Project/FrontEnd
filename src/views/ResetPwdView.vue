<template>
  <div class="wrapper">
    <div v-if="currentStep === 1" class="pwd-box">
      <h1 class="title">비밀번호 변경</h1>
      <h2 class="text">가입할 때 사용한 이메일을 입력해주세요.</h2>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
        <input v-model="email" type="text" class="email" required />
        <label>이메일</label>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <div class="submit-btn-box">
        <button @click="showModal" class="submit-btn">인증메일 전송</button>
      </div>
    </div>

    <div v-if="currentStep === 2" class="pwd-box">
      <h1 class="title">비밀번호 변경</h1>
      <h2 class="text">새롭게 사용할 비밀번호를 입력해주세요.</h2>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
        <input
          v-model="newPassword"
          type="password"
          class="password"
          required
        />
        <label>비밀번호</label>
      </div>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
        <input
          v-model="passwordCheck"
          type="password"
          class="password"
          required
        />
        <label>비밀번호 확인</label>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <div class="submit-btn-box">
        <button @click="changePassword" class="submit-btn">
          비밀번호 변경
        </button>
      </div>
    </div>

    <emailModal
      v-if="isModalVisible"
      :email="email"
      @close="isModalVisible = false"
      @verification-success="returnSuccess"
    />
  </div>
</template>

<script>
import axios from '@/axios';
import emailModal from '@/components/EmailVerification.vue';

export default {
  components: {
    emailModal,
  },
  data() {
    return {
      email: '',
      newPassword: '',
      passwordCheck: '',
      isModalVisible: false,
      error: false,
      errMsg: '',
      currentStep: 1,
    };
  },
  methods: {
    checkEmailFormat() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = true;
        this.errMsg = '유효한 이메일 주소를 입력해주세요.';
        return false; // 유효하지 않음
      }
      this.error = false; // 에러 상태 초기화
      this.errMsg = '';
      return true;
    },

    checkPasswordFormat() {
      // 비밀번호 포맷 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      // 비밀번호와 비밀번호 확인 입력값을 가져옴
      // 비밀번호가 8자리 이상인지 검사
      if (!passwordRegex.test(this.newPassword)) {
        this.errMsg =
          '비밀번호는 최소 8자리 이상이어야 하며, 문자와 숫자를 포함해야 합니다.';
        this.error = true;
        return false; // 비밀번호 형식이 유효하지 않음
      }
      // 두 비밀번호가 일치하는지 검사
      if (this.newPassword !== this.passwordCheck) {
        this.errMsg = '비밀번호가 일치하지 않습니다.';
        this.error = true;
        return false; // 비밀번호 일치하지 않음
      }
      // 에러 상태 초기화
      this.error = false;
      this.errMsg = '';
      return true;
    },

    async checkEmail() {
      // 이메일 유효성 검사
      try {
        const response = await axios.get(`/api/auth/emailCheck/${this.email}`);

        // 응답에서 이메일 유효성 여부 확인
        const isValid = response.data;

        if (!isValid) {
          return true;
        } else {
          // 이미 사용중인 이메일일 경우
          this.errMsg = '존재하지 않는 이메일 입니다.';
          this.error = true;
          return false;
        }
      } catch (error) {
        // 오류 처리
        this.errMsg = '이메일 확인 중 오류가 발생했습니다.';
        this.error = true;
        return false;
      }
    },

    async showModal() {
      if (!this.checkEmailFormat()) {
        return;
      }

      // 이메일 유효성 검사 결과를 기다림
      const isEmailValid = await this.checkEmail();
      if (!isEmailValid) {
        return; // 이메일이 유효하지 않으면 모달 표시하지 않음
      }

      // 모든 검사를 통과한 경우 모달 표시
      this.isModalVisible = true;
    },

    async changePassword() {
      if (!this.checkPasswordFormat()) {
        return;
      }

      try {
        const response = await axios.post('/api/auth/resetPassword', {
          email: this.email,
          newPassword: this.newPassword,
        });

        if (response.status === 200) {
          alert('비밀번호가 성공적으로 변경되었습니다.');

          this.email = '';
          this.newPassword = '';
          this.passwordCheck = '';
          this.error = false;
          this.errMsg = '';
          this.currentStep = 1;

          this.$router.push('/'); // Redirect to the main page
        } else {
          alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    returnSuccess() {
      this.isModalVisible = false;
      this.currentStep = 2;
    },
  },
};
</script>

<style scoped src="@/assets/style/account.css"></style>
