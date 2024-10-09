<template>
  <div class="wrapper-signup">
    <div v-if="currentStep === 1" class="signup-box">
      <h1 class="title">회원가입</h1>
      <h2 class="text">회원정보를 입력해주세요.</h2>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'envelope']" class="input-icon" />
        <input v-model="email" type="text" class="email" required />
        <label>이메일</label>
      </div>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'lock']" class="input-icon" />
        <input v-model="password" type="password" class="password" required />
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
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
        <input v-model="name" type="text" class="name" required />
        <label>이름</label>
      </div>
      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
        <input v-model="nickName" type="text" class="nickName" required />
        <label>닉네임</label>
      </div>
      <div class="input-box">
        <font-awesome-icon
          :icon="['far', 'calendar-check']"
          class="input-icon"
        />
        <input v-model="birthDate" type="text" class="nickName" required />
        <label>생년월일 8자리(숫자만 입력)</label>
      </div>
      <div class="gender-buttons">
        <button
          v-for="button in buttons"
          :key="button.value"
          :class="{ selected: selectedButton === button.value }"
          @click="selectButton(button.value)"
          type="button"
          class="gender-btn"
        >
          {{ button.label }}
        </button>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <div class="submit-btn-box">
        <button @click="showModal" class="submit-btn">메일인증</button>
      </div>
    </div>

    <div v-if="currentStep === 2" class="signup-box">
      <h1 class="title">회원가입</h1>
      <h2 class="text">회원가입을 축하드립니다.</h2>
      <div class="email-box">{{ email }}</div>
      <router-link to="/login" class="submit-btn-box">
        <button @click="showModal" class="submit-btn">로그인 바로가기</button>
      </router-link>
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
      password: '',
      passwordCheck: '',
      name: '',
      nickName: '',
      birthDate: '',
      selectedButton: '', // 선택된 버튼을 저장할 변수
      buttons: [
        { label: '남자', value: 'male' },
        { label: '여자', value: 'female' },
        { label: '선택 안함', value: 'other' },
      ],
      isModalVisible: false,
      error: false,
      errMsg: '',
      currentStep: 1,
    };
  },
  mounted() {
    this.resetInput();
  },
  methods: {
    selectButton(value) {
      this.selectedButton = value; // 선택된 성별 값 저장
    },
    resetInput() {
      this.email = '';
      this.password = '';
      this.passwordCheck = '';
      this.name = '';
      this.nickName = '';
      this.birthDate = '';
      this.selectedButton = '';
      this.isModalVisible = false;
      this.error = false;
      this.errMsg = '';
    },
    returnSuccess() {
      // API에 전송할 데이터 준비
      const signupData = {
        email: this.email,
        password: this.password,
        name: this.name,
        birth: this.formatBirthDate(this.birthDate),
        gender: this.selectedButton,
        authority: 'ROLE_USER', // 고정값
        nickName: this.nickName,
      };

      // API 호출
      axios
        .post('/api/auth/signup', signupData)
        .then((response) => {
          // 회원가입 성공 시 처리
          console.log('회원가입 성공:', response.data);
          // 상태 초기화 및 다음 단계로 이동

          this.currentStep = 2; // 두 번째 단계로 이동
        })
        .catch((error) => {
          // 오류 처리
          console.error('회원가입 중 오류 발생:', error);
          this.errMsg = '회원가입에 실패했습니다. 다시 시도해 주세요.';
          this.error = true;
        });
    },

    async showModal() {
      if (!this.checkFormat()) {
        return;
      }

      // 이메일 유효성 검사 결과를 기다림
      const isEmailValid = await this.checkEmail();
      if (!isEmailValid) {
        return; // 이메일이 유효하지 않으면 모달 표시하지 않음
      }

      // 닉네임 유효성 검사 결과를 기다림
      const isNickNameValid = await this.checkNickName();
      if (!isNickNameValid) {
        return; // 닉네임이 유효하지 않으면 모달 표시하지 않음
      }

      // 모든 검사를 통과한 경우 모달 표시
      this.isModalVisible = true;
    },

    checkFormat() {
      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errMsg = '유효한 이메일 주소를 입력해주세요.';
        this.error = true;
        return false;
      }

      // 비밀번호 포맷 검사
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(this.password)) {
        this.errMsg =
          '비밀번호는 최소 8자리 이상이어야 하며, 문자와 숫자를 포함해야 합니다.';
        this.error = true;
        return false;
      }

      // 비밀번호 확인 검사
      if (this.password !== this.passwordCheck) {
        this.errMsg = '비밀번호가 일치하지 않습니다.';
        this.error = true;
        return false;
      }

      // 이름 유효성 검사 (2글자 이상)
      if (this.name.length < 2) {
        this.errMsg = '이름은 최소 2글자 이상이어야 합니다.';
        this.error = true;
        return false;
      }

      // 닉네임 유효성 검사 (2자 이상 8자 이하, 공백 제외한 허용된 문자만 포함)
      const nickNameRegex = /^[a-zA-Z가-힣0-9]+$/;
      if (this.nickName.length < 2 || this.nickName.length > 8) {
        this.errMsg = '닉네임은 2자 이상 8자 이하이어야 합니다.';
        this.error = true;
        return false;
      }
      if (!nickNameRegex.test(this.nickName)) {
        this.errMsg =
          '닉네임에는 허용되지 않은 문자가 포함되어 있습니다. (영문자, 숫자, 한글만 허용됩니다.)';
        this.error = true;
        return false;
      }

      // 생년월일 유효성 검사 (숫자 8자리)
      const birthDateRegex = /^\d{8}$/;
      if (!birthDateRegex.test(this.birthDate)) {
        this.errMsg = '생년월일은 8자리 숫자만 입력 가능합니다.';
        this.error = true;
        return false;
      }

      // 성별 선택 유효성 검사
      if (!this.selectedButton) {
        this.errMsg = '성별을 선택해주세요.';
        this.error = true;
        return false;
      }

      // 모든 검사를 통과한 경우
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

        if (isValid) {
          return true;
        } else {
          // 이미 사용중인 이메일일 경우
          this.errMsg = '이미 사용중인 이메일입니다.';
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

    async checkNickName() {
      // 닉네임 유효성 검사
      try {
        const response = await axios.get(
          `/api/auth/nickNameCheck/${this.nickName}`
        );

        // 응답에서 이메일 유효성 여부 확인
        const isValid = response.data;

        if (isValid) {
          return true;
        } else {
          // 이미 사용중인 이메일일 경우
          this.errMsg = '이미 사용중인 닉네임입니다.';
          this.error = true;
          return false;
        }
      } catch (error) {
        // 오류 처리
        this.errMsg = '닉네임 확인 중 오류가 발생했습니다.';
        this.error = true;
        return false;
      }
    },
    formatBirthDate(birthDateStr) {
      // 입력된 문자열을 YYYY-MM-DD 형식으로 변환
      const year = birthDateStr.substring(0, 4);
      const month = birthDateStr.substring(4, 6);
      const day = birthDateStr.substring(6, 8);

      // Date 객체 생성
      return new Date(`${year}-${month}-${day}`);
    },
  },
};
</script>

<style scoped src="@/assets/style/account.css"></style>
