<template>
  <div class="wrapper">
    <div class="edit-box">
      <div class="title-box">
        <h1 class="title">이름 변경</h1>
        <h3 class="sub-title">변경하실 이름을 입력해주세요.</h3>
      </div>

      <div class="input-box">
        <input
          type="text"
          placeholder="이름 입력"
          maxlength="8"
          v-model="localName"
          @keyup.enter="updateName"
        />
        <div class="info-box">
          <font-awesome-icon
            :icon="['fas', 'circle-xmark']"
            class="erase-btn"
            @click="clearName"
          />
          <span>{{ localName.length }}/8</span>
        </div>
      </div>
      <div v-if="error" class="warning-area">
        <font-awesome-icon
          :icon="['fas', 'circle-exclamation']"
          class="warn-icon"
        />
        <span>{{ errMsg }}</span>
      </div>
      <button class="submit-btn" @click="updateName">변경</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios';

export default {
  data() {
    return {
      localName: '',
      error: false,
      errMsg: '',
    };
  },
  created() {
    this.localName = this.name;
  },
  computed: {
    ...mapGetters(['name']),
  },
  methods: {
    clearName() {
      this.localName = ''; // 이름 지우기
      this.error = false; // 에러 상태 초기화
      this.errMsg = ''; // 에러 메시지 초기화
    },

    async updateName() {
      this.error = false; // 에러 상태 초기화
      this.errMsg = ''; // 에러 메시지 초기화

      // 이름 변경 요청
      try {
        const response = await axios.post('/api/myPage/changeName', {
          newName: this.localName,
        });

        // 상태 업데이트
        if (response.status === 200) {
          this.$store.commit('setUser', { name: this.localName }); // Vuex 상태 업데이트
          this.clearName(); // 입력 초기화
          alert('이름이 성공적으로 변경되었습니다!'); // 성공 메시지
          this.$router.go(-1); // 이전 페이지로 돌아가기
        }
      } catch (error) {
        console.error('이름 변경 중 오류 발생:', error);
        this.error = true;
        this.errMsg = '이름 변경 중 오류가 발생했습니다.'; // 에러 메시지 설정
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/editInfo.css"></style>
