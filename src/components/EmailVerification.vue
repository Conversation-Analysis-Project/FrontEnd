<template>
  <div class="modal">
    <div class="wrapper">
      <h2 class="title">이메일 인증</h2>

      <div class="text">이메일로 발송된 인증코드를 입력해주세요.</div>

      <div class="input-box">
        <font-awesome-icon :icon="['fas', 'key']" class="key-icon" />
        <input
          v-model="key"
          type="text"
          class="key"
          required
          placeholder="인증코드"
        />
      </div>

      <div class="resend-box">
        인증코드가 오지 않았나요?
        <button @click="sendCode" type="button" class="resend-btn">
          재전송
        </button>
      </div>

      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>

      <button @click="verifyCode" type="button" class="verification-btn">
        인증코드 확인
      </button>
      <button @click="test">test</button>

      <font-awesome-icon
        icon="xmark"
        class="modal-close-icon"
        @click="closeModal"
      />
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      key: '',
      error: false,
      errMsg: '',
    };
  },
  mounted() {
    if (this.email && this.email.trim()) {
      this.sendCode();
    } else {
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      this.closeModal();
    }
  },
  methods: {
    test() {
      this.$emit('verification-success');
    },
    //코드전송
    async sendCode() {
      try {
        const response = await axios.post('/api/auth/mailSend', {
          email: this.email,
        });

        if (response.status === 200) {
          alert('인증코드가 발송되었습니다.');
          this.error = false;
          this.errMsg = '';
          return;
        } else {
          this.errMsg = '인증 코드 발송 중 오류가 발생했습니다.';
          this.error = true;
        }
      } catch (error) {
        this.errMsg = '인증 코드 발송 중 오류가 발생했습니다.';
        this.error = true;
      }
    },

    //코드 검사
    async verifyCode() {
      try {
        const response = await axios.post('/api/auth/mailAuth', {
          email: this.email,
          authNum: this.key,
        });

        if (response.status === 200) {
          // 인증 성공 시 처리
          this.error = false;
          this.errMsg = '';
          this.$emit('verification-success'); // 인증 성공 이벤트 전송
          this.$emit('close');
        } else {
          // 인증 실패 시 처리
          this.errMsg = '인증코드를 확인해주세요';
          this.error = true;
        }
      } catch (error) {
        this.errMsg = '인증코드를 확인해주세요';
        this.error = true;
      }
    },

    //모달 닫기
    closeModal() {
      this.key = '';
      this.error = false;
      this.errMsg = '';
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1000; /* 모달이 다른 콘텐츠 위에 오도록 설정 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 380px;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 20px 30px 30px 30px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -6px 0px inset;
  user-select: none;
}

.title {
  margin-bottom: 20px;
}
.text {
  font-size: 16px;
  font-weight: 400;
}

.input-box {
  position: relative;
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #777;
  margin: 10px 0 4px 0;
  padding-left: 10px;
}

.input-box input {
  width: 100%;
  height: 100%;
  background: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  padding-right: 30px;
}

.input-box .key-icon {
  position: absolute;
  right: 12px;
  top: 16px;
  font-size: 18px;
  color: #333;
}

.warning-area {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 4px;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.warning-area .warn-icon {
  font-size: 20px;
  color: rgb(255, 174, 0);
}

.wrapper .modal-close-icon {
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 24px;
  color: #777777;
  cursor: pointer;
  transition: 0.2s ease;
}

.resend-box {
  font-size: 14px;
}
.resend-box button {
  border: none;
  background: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 4px;
  cursor: pointer;
}

.verification-btn {
  width: 100%;
  margin: 12px 0 0 0;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  background: hsl(209, 63%, 59%);
  padding: 8px 0;
  transition: 0.2s ease;
}
.verification-btn:hover {
  background: hsl(209, 64%, 49%);
}
</style>
