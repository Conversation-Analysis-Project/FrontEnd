// utils/auth.js
export function setToken(token, keepLoggedIn, refreshToken) {
  if (keepLoggedIn) {
    // 로그인 상태 유지 체크됨 -> 로컬 스토리지에 저장
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    // 로그인 상태 유지 체크 안됨 -> 세션 스토리지에 저장
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
}

export function getToken() {
  // 먼저 로컬 스토리지에서 토큰을 확인
  const localToken = localStorage.getItem('accessToken');
  if (localToken) return localToken;

  // 로컬 스토리지에서 토큰을 찾지 못한 경우, 세션 스토리지에서 확인
  return sessionStorage.getItem('accessToken');
}

export function getRefreshToken() {
  // 먼저 로컬 스토리지에서 refreshToken을 확인
  const localRefreshToken = localStorage.getItem('refreshToken');
  if (localRefreshToken) return localRefreshToken;

  // 로컬 스토리지에서 refreshToken을 찾지 못한 경우, 세션 스토리지에서 확인
  return sessionStorage.getItem('refreshToken');
}

export function removeToken() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}
