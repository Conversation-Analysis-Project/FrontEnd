<template>
  <div class="wrapper">
    <div class="login-box">
      <h1 class="title">로그인</h1>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
        <input
          v-model="email"
          type="text"
          class="email"
          required
          @keyup.enter="submitLogin"
        />
        <label>이메일</label>
      </div>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
        <input
          v-model="password"
          type="password"
          class="password"
          required
          @keyup.enter="submitLogin"
        />
        <label>비밀번호</label>
      </div>
      <div class="bottom-box">
        <label>
          <input type="checkbox" class="checkbox" v-model="keepLoggedIn" />
          로그인 상태 유지
        </label>
        <router-link to="/password">비밀번호를 잊으셨나요?</router-link>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>

      <div class="login-btn-box">
        <button
          class="login-btn"
          @click="submitLogin"
          @keyup.enter="submitLogin"
        >
          로그인
        </button>
      </div>
      <div class="footer-box">
        <span>계정이 없으신가요?</span>
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from '@/axios';
import DefaultImg from '@/assets/img/Default.png';

export default {
  data() {
    return {
      email: '',
      password: '',
      keepLoggedIn: false,
      error: false,
      errMsg: '',
      DefaultImg,
    };
  },
  methods: {
    ...mapActions(['login']),
    // 이메일 양식을 체크하는 함수
    checkFormat() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = true;
        this.errMsg = '유효한 이메일 주소를 입력해주세요.';
        return false; // 유효하지 않음
      }
      return true; // 유효함
    },

    // 로그인 요청을 보내는 함수
    async submitLogin() {
      if (this.checkFormat()) {
        // 이메일 양식이 올바르면 로그인 요청 실행
        await this.handleLogin();
      }
    },

    async handleLogin() {
      try {
        const response = await axios.post('/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        const { accessToken, refreshToken } = response.data;

        // Vuex 상태 업데이트
        this.login({
          keepLoggedIn: this.keepLoggedIn,
          accessToken,
          refreshToken,
        });

        // 로그인 후 리다이렉션 (홈 페이지로 이동)
        this.$router.push('/');
      } catch (error) {
        this.error = true;
        this.errMsg = '이메일과 비밀번호를 확인해주세요.';
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/account.css"></style>
