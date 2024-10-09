import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ServiceView from '@/views/ServiceView.vue';
import CommunityView from '@/views/CommunityView.vue';
import AuthorCommunityView from '@/views/AuthorCommunityView.vue';
import SearchCommunityView from '@/views/SearchCommunityView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import ResetPwdView from '@/views/ResetPwdView.vue';
import MyPageView from '@/views/MyPageView.vue';
import EditUserInfoView from '@/views/EditUserInfoView.vue';
import ArticleView from '@/views/ArticleView.vue';
import WriteArticleView from '@/views/WriteArticleView.vue';
import EditArticleView from '@/views/EditArticleView.vue';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/service',
    name: 'ServiceView',
    component: ServiceView,
  },
  {
    path: '/community',
    name: 'CommunityView',
    component: CommunityView,
  },
  {
    path: '/community/search/:keyword',
    name: 'SearchCommunityView',
    component: SearchCommunityView,
  },
  {
    path: '/community/author/:nickname',
    name: 'AuthorCommunityView',
    component: AuthorCommunityView,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'SignupView',
    component: SignupView,
  },
  {
    path: '/password',
    name: 'ResetPwdView',
    component: ResetPwdView,
  },
  {
    path: '/mypage',
    name: 'MyPageView',
    component: MyPageView,
  },
  {
    path: '/edit',
    name: 'EditUserInfoView',
    component: EditUserInfoView,
  },
  {
    path: '/article/:id',
    name: 'ArticleView',
    component: ArticleView,
  },
  {
    path: '/write-article',
    name: 'WriteArticleView',
    component: WriteArticleView,
  },
  {
    path: '/edit-article',
    name: 'EditArticleView',
    component: EditArticleView,
  },
  // 추가 라우트 설정
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }; // 항상 맨 위로 스크롤
    }
  },
});

export default router;
