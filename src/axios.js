// src/axios.js
import axios from 'axios';
import store from '@/store'; // Vuex 스토어를 임포트합니다.
import { getRefreshToken, setToken } from '@/utils/auth';

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // 환경 변수에서 기본 URL을 가져옵니다.
  timeout: 10000, // 요청 타임아웃 (10초)
});

// 요청 인터셉터: 요청을 보내기 전에 토큰을 헤더에 추가합니다.
instance.interceptors.request.use(
  (config) => {
    // 스토어에서 토큰을 가져옵니다.
    const accessToken = store.getters['isLoggedIn']
      ? store.state.accessToken
      : null;

    if (accessToken) {
      // 토큰이 있는 경우, 헤더에 추가합니다.
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 오류 처리
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      // 401 오류 처리
      if (
        error.response.data &&
        error.response.data.error === 'Token expired'
      ) {
        // 토큰 만료로 인한 오류 처리
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
            const response = await axios.post('/refresh-token', {
              refreshToken: getRefreshToken(),
            });
            const { accessToken, refreshToken } = response.data;

            // 새로운 액세스 토큰과 리프레시 토큰 저장
            setToken(accessToken, true, refreshToken);

            // Vuex 스토어와 Axios 기본 헤더 업데이트
            store.commit('setLoginState', {
              isLoggedIn: true,
              accessToken,
              refreshToken,
              user: store.state.user, // 기존 사용자 정보 유지
            });

            // 새로운 액세스 토큰을 헤더에 추가
            instance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`;

            // 원래 요청을 새로운 액세스 토큰으로 재시도
            return instance(originalRequest);
          } catch (err) {
            // 리프레시 토큰 요청 실패 시 로그아웃 처리
            store.dispatch('logout');
            return Promise.reject(err);
          }
        }
      } else {
        // 권한 부족 등 다른 이유로 인한 401 오류 처리
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
