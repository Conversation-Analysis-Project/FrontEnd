<template>
  <nav :class="{ active: isMenuOpen }">
    <div class="navbar">
      <font-awesome-icon
        :icon="['fas', 'bars']"
        class="menu-open-icon"
        @click="toggleMenu"
      />

      <span class="logo" @click="refreshPage">Sometime</span>

      <div class="menu">
        <div class="logo-toggle">
          <span class="logo">Sometime</span>
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="menu-close-icon"
            @click="toggleMenu"
          />
        </div>

        <ul class="nav-links">
          <li>
            <a
              @click.prevent="goToRoute('/')"
              :class="{
                'router-link-active': isActiveRoute('/') || category === 'home',
              }"
            >
              서비스 소개
            </a>
          </li>
          <li>
            <a
              @click.prevent="goToRoute('/service')"
              :class="{
                'router-link-active':
                  isActiveRoute('/service') || category === 'service',
              }"
            >
              관계분석
            </a>
          </li>
          <li>
            <a
              @click.prevent="goToRoute('/community')"
              :class="{
                'router-link-active':
                  isActiveRoute('/community') || category === 'community',
              }"
            >
              커뮤니티
            </a>
          </li>
        </ul>
      </div>

      <div class="btn-box">
        <router-link v-if="!isLoggedIn" to="/login">
          <button class="login-btn">
            <span class="login-text"
              ><font-awesome-icon
                :icon="['fas', 'user']"
                class="login"
              />로그인</span
            >
            <font-awesome-icon :icon="['fas', 'user']" class="login-icon" />
          </button>
        </router-link>

        <div v-else @click="isProfileOpen = !isProfileOpen" class="profile-btn">
          <img :src="profileImage" alt="profile-img" class="profile-img" />
          <span class="nickName">{{ nickname }}</span>

          <div v-if="isProfileOpen" class="profile-toggle">
            <div class="user-info">
              {{ nickname }}
            </div>
            <router-link to="/mypage" @click="resetCategory">
              <button>마이페이지</button>
            </router-link>
            <button @click="logout">로그아웃</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DefaultImage from '@/assets/img/Default.png';
import axios from '@/axios';

export default {
  name: 'NavBar',
  data() {
    return {
      DefaultImage,
      isMenuOpen: false,
      isProfileOpen: false,
      category: '', // 현재 카테고리 변수를 추가
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'nickname', 'profileImages']),

    // 프로필 이미지의 첫 번째 URL을 안전하게 가져오는 계산 속성
    profileImage() {
      return this.profileImages && this.profileImages.length > 0
        ? this.profileImages[0]
        : this.DefaultImage; // 기본 이미지로 설정
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getUserInfo();
    }
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.getUserInfo();
      }
    },
    $route: {
      immediate: true,
      handler(to) {
        // 현재 경로에 따라 카테고리를 설정합니다.
        if (to.path === '/') {
          this.category = 'home';
        } else if (to.path === '/service') {
          this.category = 'service';
        } else if (
          to.path.startsWith('/community') ||
          to.path.startsWith('/article') ||
          to.path === '/write-article' ||
          to.path === '/edit-article'
        ) {
          this.category = 'community';
        } else {
          this.category = null; // 카테고리를 기본값으로 초기화
        }
      },
    },
  },
  methods: {
    ...mapActions(['logout']),

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    refreshPage() {
      this.$router.push('/').then(() => {
        window.location.reload();
      });
    },

    async getUserInfo() {
      try {
        const response = await axios.get('/api/myPage/userInfo');
        const userInfo = response.data;

        this.$store.commit('setUser', {
          userId: userInfo.userId,
          email: userInfo.email,
          profileImages: userInfo.profileImages || [], // 기본값으로 빈 배열 사용
          nickname: userInfo.nickName,
          name: userInfo.name,
          birthdate: userInfo.birth,
          gender: userInfo.gender,
        });
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류가 발생했습니다.', error);
      }
    },
    goToRoute(route) {
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
      }
      if (route === '/community') {
        this.$router.push({ path: route, query: { page: 1 } });
      } else {
        if (this.$route.path === route) {
          window.location.reload();
        } else {
          this.$router.push(route);
        }
      }
    },
    resetCategory() {
      this.category = null; // 카테고리를 null로 변경
    },
    async logout() {
      this.resetCategory(); // 로그아웃 시 카테고리 초기화
      await this.$store.dispatch('logout'); // 로그아웃 처리
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
nav {
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  border-bottom: 1px solid #c7c7c7;
  padding: 10px 0;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

nav .navbar {
  position: relative;
  max-width: 1440px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 30px;
}

.navbar .logo {
  font-size: 28px;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
}

.menu-open-icon {
  font-size: 24px;
  padding: 5px;
  cursor: pointer;
  display: none;
}

.menu .logo-toggle {
  display: none;
}

.navbar .nav-links {
  display: flex;
  align-items: center;
}

.nav-links li {
  margin: 0 5px;
}

.nav-links li a {
  position: relative;
  font-size: 20px;
  font-weight: 500;
  padding: 10px;
  color: #555;
}

.nav-links li a.router-link-active {
  font-weight: 800;
  color: #000;
}

.nav-links li a::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(50%);
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: black;
  opacity: 0;
  transition: all 0.4s ease;
}

.nav-links li:hover a::before {
  opacity: 1;
}

.navbar .login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #374151;
  background: #fff;
  /* border: 1px solid #c7c7c7; */
  border: none;
  border-radius: 12px;
  padding: 7px 20px;
  cursor: pointer;
  transition: 0.3s ease;
}

.navbar .login-btn:hover {
  background-color: #ddd;
}

.login {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.login-text {
  display: inline;
}

.login-icon {
  display: none;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: none;
  padding: 5px;
}

.profile-btn .nickName {
  font-size: 16px;
  font-weight: 600;
}

.profile-btn .profile-toggle {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50px;
  width: 160px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #c7c7c7;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.profile-toggle .user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #c7c7c7;
  height: 40px;
}

.profile-toggle button,
.profile-toggle a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  background: #fff;
  transition: 0.2s ease;
}

.profile-toggle button:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
  background: #eee;
}

@media (max-width: 740px) {
  .menu {
    position: fixed;
    height: 100%;
    width: 240px;
    left: -100%;
    top: 0;
    padding: 20px;
    background: #daedff;
    transition: all 0.3s ease;
  }

  nav.active .menu {
    left: 0%;
  }

  .menu .logo-toggle {
    display: block;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
  }

  .menu-open-icon {
    display: block;
  }

  .logo-toggle .menu-close-icon {
    font-size: 22px;
    cursor: pointer;
  }
  .navbar .nav-links {
    flex-direction: column;
    padding-top: 20px;
  }

  .nav-links li a {
    display: block;
    margin-top: 16px;
  }

  .login-text {
    display: none; /* 모바일 뷰에서 텍스트 숨기기 */
  }

  .login-icon {
    display: inline; /* 모바일 뷰에서 아이콘 보이기 */
    font-size: 24px;
    color: #162938;
  }

  .navbar .login-btn {
    font-size: 20px;
    border: none;
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .profile-btn .nickName {
    display: none;
  }

  .profile-btn .profile-toggle {
    width: 160px;
    left: -80px;
    top: 50px;
  }

  .profile-toggle .user-info {
    font-size: 16px;
  }
}
</style>
