import { createStore } from 'vuex';
import { getToken, getRefreshToken, setToken, removeToken } from '@/utils/auth';
import axios from 'axios';
import router from '@/router';
import DefaultImage from '@/assets/img/Default.png';

const store = createStore({
  state: {
    isLoggedIn: !!getToken(),
    user: {
      userId: '',
      email: '',
      name: '',
      nickname: '',
      birthdate: '',
      gender: '',
      profileImages: [], // 프로필 이미지 URL 배열
    },
    accessToken: getToken(),
    refreshToken: getRefreshToken(),
  },

  mutations: {
    setLoginState(state, { isLoggedIn, accessToken, refreshToken, user }) {
      state.isLoggedIn = isLoggedIn;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;

      if (accessToken) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    setUser(state, user) {
      // user 정보를 병합하고 profileImages도 업데이트
      state.user = { ...state.user, ...user }; // 기존 user와 새로운 user 병합
    },
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = {
        userId: '',
        email: '',
        name: '',
        nickname: '',
        birthdate: '',
        gender: '',
        profileImages: [], // 초기화 시 빈 배열로 설정
      };
      removeToken();
      delete axios.defaults.headers.common['Authorization'];
    },
  },

  actions: {
    login({ commit }, { keepLoggedIn, accessToken, refreshToken }) {
      setToken(accessToken, keepLoggedIn, refreshToken);
      commit('setLoginState', {
        isLoggedIn: true,
        accessToken,
        refreshToken,
        user: {}, // user 초기화 (login 후 getUserInfo로 업데이트)
      });
    },

    logout({ commit }) {
      commit('logout');
      router.push('/');
    },
  },

  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
    userId: (state) => state.user.userId,
    email: (state) => state.user.email,
    name: (state) => state.user.name,
    nickname: (state) => state.user.nickname,
    birthdate: (state) => state.user.birthdate,
    gender: (state) => state.user.gender,
    profileImages: (state) => state.user.profileImages, // 여러 프로필 이미지 반환
    profileImage: (state) => {
      // 첫 번째 프로필 이미지가 존재하면 반환, 그렇지 않으면 기본 이미지 반환
      return state.user.profileImages.length > 0
        ? state.user.profileImages[0]
        : DefaultImage;
    },
  },
});

export default store;
