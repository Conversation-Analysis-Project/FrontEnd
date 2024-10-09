<template>
  <div class="wrapper">
    <div class="mypage-box">
      <div class="title-box">
        <h1 class="title">계정 정보</h1>
        <h3 class="sub-title">로그인, 프로필 정보를 확인하고 관리합니다.</h3>
      </div>
      <div class="account-info">
        <h3>로그인 정보</h3>
        <div class="email-box info-box">
          <div class="email">이메일</div>
          <div class="email-text text">{{ user.email }}</div>
        </div>
        <div @click="navigateToPwd" class="pwd-box info-box">
          <div class="pwd">비밀번호</div>
          <div class="pwd-text text">********</div>
        </div>
      </div>
      <div class="user-info">
        <h3>프로필 정보</h3>
        <div class="profile-img-box info-box">
          <div class="profile">
            <div class="title">프로필 사진</div>
            <div class="sub-title">
              프로필 사진은 커뮤니티 서비스에 활용됩니다.
            </div>
          </div>
          <div class="img-box">
            <font-awesome-icon
              @click="triggerFileUpload"
              :icon="['fas', 'pen']"
              class="pen-icon"
            />
            <input
              type="file"
              ref="fileInput"
              @change="uploadProfileImage"
              style="display: none"
            />
            <img :src="validProfileImage" class="profile-img" />
          </div>
        </div>
        <div @click="navigateToEdit('nickname')" class="nickname-box info-box">
          <div class="nickname">닉네임</div>
          <div class="nickname-text text">
            {{ user.nickname }}
          </div>
        </div>
        <div @click="navigateToEdit('name')" class="name-box info-box">
          <div class="name">이름</div>
          <div class="name-text text">
            {{ user.name }}
          </div>
        </div>
        <div @click="navigateToEdit('birthdate')" class="birth-box info-box">
          <div class="birth">생년월일</div>
          <div class="birth-text text">
            {{ user.birthdate }}
          </div>
        </div>
        <div @click="navigateToEdit('gender')" class="gender-box info-box">
          <div class="gender">성별</div>
          <div class="gender-text text">
            {{ this.formatGender(user.gender) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios'; // Axios 인스턴스 가져오기
import DefaultImage from '@/assets/img/Default.png';

export default {
  data() {
    return {
      DefaultImage,
    };
  },
  computed: {
    ...mapGetters(['user']), // Vuex에서 유저 정보 가져오기
    validProfileImage() {
      const { profileImages } = this.user;
      // profileImages가 배열인지 확인
      if (Array.isArray(profileImages)) {
        // 첫 번째 URL이 존재하면 반환
        if (profileImages[0]) {
          return profileImages[0];
        }
        // 두 번째 URL이 존재하면 반환
        if (profileImages[1]) {
          return profileImages[1];
        }
      }
      // 모든 URL이 없을 경우 기본 이미지 반환
      return this.DefaultImage;
    },
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get('/api/myPage/userInfo');
        console.log(response.data); // 응답 데이터 확인
        const userInfo = response.data;

        // Vuex 상태 업데이트
        this.$store.commit('setUser', {
          email: userInfo.email,
          profileImages: userInfo.profileImages || [], // 기본값 설정 (빈 배열)
          nickname: userInfo.nickName,
          name: userInfo.name,
          birthdate: userInfo.birth,
          gender: userInfo.gender,
        });
      } catch (error) {
        console.error('사용자 정보 가져오기 중 오류가 발생했습니다:', error);
      }
    },
    // 파일 선택 창 열기
    triggerFileUpload() {
      this.$refs.fileInput.click(); // 숨겨진 input을 클릭
    },
    // 파일 업로드
    async uploadProfileImage(event) {
      const file = event.target.files[0]; // 사용자가 선택한 파일
      if (!file) return; // 파일이 없으면 종료

      const formData = new FormData();
      formData.append('image', file); // formData에 파일 추가

      try {
        // Axios 인스턴스를 사용하여 파일을 서버로 전송
        const response = await axios.post('/api/myPage/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송 시 필요
          },
        });

        // 업로드 성공 시, 새 이미지 URL로 중앙 상태 업데이트
        if (response.data) {
          const imageUrl = response.data; // URL이 문자열로 반환된 경우
          console.log(imageUrl);
          this.$store.commit('setUser', {
            profileImages: [imageUrl], // 새로운 이미지 URL 저장
          });
          alert('프로필 이미지가 성공적으로 변경되었습니다!');

          // 사용자 정보를 다시 불러와서 상태 업데이트
          this.fetchUserInfo();
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 중 오류가 발생했습니다:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    },
    // 비밀번호 변경 페이지로 이동
    navigateToPwd() {
      this.$router.push('/password');
    },
    // 프로필 정보 수정 페이지로 이동
    navigateToEdit(category) {
      this.$router.push({
        path: '/edit',
        query: {
          category: category,
        },
      });
    },
    // 성별 포맷팅
    formatGender(gender) {
      switch (gender) {
        case 'male':
          return '남성';
        case 'female':
          return '여성';
        default:
          return '선택안함';
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/mypage.css"></style>
