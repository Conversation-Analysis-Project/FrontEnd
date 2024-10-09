import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// FontAwesome 관련 import
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// FontAwesome 아이콘 라이브러리 설정
library.add(fas, far, fab);

// Vue 앱 생성
const app = createApp(App);

// FontAwesome 컴포넌트 등록
app.component('font-awesome-icon', FontAwesomeIcon);

// 플러그인 사용
app.use(router);
app.use(store);

// 앱 마운트
app.mount('#app');
