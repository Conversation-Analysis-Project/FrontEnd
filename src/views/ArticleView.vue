<template>
  <div class="wrapper">
    <div class="article-box">
      <div class="content-box">
        <div class="title-box">
          <div class="category">{{ formatCategory(article.category) }}</div>
          <div class="title">{{ article.title }}</div>
          <div class="info-box">
            <div class="profile-box">
              <div class="profile-img">
                <img
                  :src="
                    article.profileImgs && article.profileImgs[0]
                      ? article.profileImgs[0]
                      : DefaultImage
                  "
                  alt="프로필이미지"
                  @error="
                    handleProfileImageError(
                      $event,
                      article.profileImgs && article.profileImgs[1]
                    )
                  "
                />
              </div>
              <div class="author-date">
                <span class="author">{{ article.nickName }}</span>
                <span class="date">{{ formatDate(article.createAt) }}</span>
              </div>
            </div>
            <div class="article-info-box">
              <span class="url-copy" @click="copyUrl">url 복사</span>
              <div class="article-info">
                <div class="commentNum">
                  <font-awesome-icon
                    :icon="['far', 'comment-dots']"
                    class="comment-icon icon"
                  />댓글
                  {{ article.commentNum }}
                </div>
                <div class="views">조회수 {{ article.hits }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          {{ article.content }}
          <div
            class="img-box"
            v-if="article.imageUrls && article.imageUrls.length > 0"
          >
            <img
              :src="article.imageUrls[0]"
              alt="게시글 이미지"
              class="article-img"
              @error="
                handleImageError(
                  $event,
                  article.imageUrls && article.imageUrls[1]
                )
              "
            />
          </div>
        </div>
        <div class="edit" v-if="userId === article.userId">
          <div @click="updateArticle">수정</div>
          <div @click="delArticle">삭제</div>
        </div>

        <div class="etc">
          <div
            class="author-info"
            @click="goToAuthorArticles(article.nickName)"
          >
            <span class="etc-author">{{ article.nickName }}</span
            >님의 게시글 더보기
            <font-awesome-icon
              :icon="['fas', 'chevron-right']"
              class="arrow-icon"
            />
          </div>
          <div class="etc-article-info">
            <div class="etc-like-box">
              <font-awesome-icon
                :icon="['fas', 'heart']"
                class="like-icon"
                v-if="article.pushLikes"
                @click="unlikeArticle"
              />
              <font-awesome-icon
                :icon="['far', 'heart']"
                class="like-icon"
                v-else
                @click="likeArticle"
              />좋아요
              {{ article.likes }}
            </div>
            <div class="etc-commentNum">
              <font-awesome-icon
                :icon="['far', 'comment-dots']"
                class="comment-icon icon"
              />댓글 {{ article.commentNum }}
            </div>
          </div>
        </div>

        <div class="comment-box">
          <div class="comment-input-box">
            <div class="comment-author">{{ nickname }}</div>
            <textarea
              v-model="newComment"
              class="comment-input"
              placeholder="댓글을 남겨보세요"
            ></textarea>
            <div class="btn-box">
              <button class="submit-btn" @click="submitComment">등록</button>
            </div>
          </div>

          <div
            class="comment-list"
            v-for="comment in comments"
            :key="comment.commentId"
          >
            <img
              :src="
                comment.profileImages && comment.profileImages[0]
                  ? comment.profileImages[0]
                  : DefaultImage
              "
              alt="프로필이미지"
              @error="
                handleProfileImageError(
                  $event,
                  comment.profileImages && comment.profileImages[1]
                )
              "
              class="profile-img"
            />
            <div class="comment-content">
              <div class="author">{{ comment.nickName }}</div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="date">{{ formatDate(comment.createdAt) }}</div>
            </div>
            <button
              v-if="comment.userId === userId"
              class="comment-del-btn"
              @click="deleteComment(comment.commentId)"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '@/axios';
import DefaultImage from '@/assets/img/Default.png';

export default {
  data() {
    return {
      article: {}, // 게시글 데이터를 저장할 객체
      comments: [], // 댓글 데이터를 저장할 배열
      DefaultImage, // 기본 프로필 이미지
      newComment: '', // 댓글 입력값 저장
    };
  },
  computed: {
    ...mapGetters(['nickname', 'userId', 'isLoggedIn']), // Vuex에서 userNickname 가져오기
  },
  async created() {
    const articleId = this.$route.params.id; // URL에서 articleId를 가져옴
    await this.fetchArticleData(articleId); // 게시글 데이터와 댓글 데이터 요청
  },
  methods: {
    // 게시글 및 댓글 데이터 요청 메서드
    async fetchArticleData(articleId) {
      try {
        // 게시글 데이터 요청
        const articleResponse = await axios.get(`/api/article/${articleId}`);
        this.article = articleResponse.data; // 받은 데이터를 저장

        // 댓글 데이터 요청
        const commentsResponse = await axios.get(
          `/api/article/commentInfo/${articleId}`
        );
        this.comments = commentsResponse.data; // 댓글 데이터 저장
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    updateArticle() {
      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴
      this.$router.push({
        path: '/edit-article',
        name: 'EditArticleView',
        query: { articleId }, // articleId를 쿼리로 전달
      });
    },
    async delArticle() {
      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴
      if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        try {
          await axios.post(`/api/article/delete/${articleId}`); // 게시글 삭제 요청
          alert('게시글이 삭제되었습니다.');
          this.$router.push({ name: 'CommunityView', query: { page: 1 } }); // 목록 페이지로 리다이렉트
        } catch (error) {
          console.error('게시글 삭제 중 오류가 발생했습니다:', error);
        }
      }
    },
    // 좋아요 메서드
    async likeArticle() {
      if (!this.isLoggedIn) {
        alert('로그인 후 이용가능한 서비스입니다.'); // 로그인 유도 메시지
        return; // 로그인하지 않은 경우 메서드 종료
      }
      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴
      try {
        await axios.post(`/api/article/${articleId}/like`); // 좋아요 요청
        this.article.likes += 1; // 좋아요 수 증가
        this.article.pushLikes = true; // 좋아요 상태 업데이트
      } catch (error) {
        console.error('좋아요 등록 중 오류가 발생했습니다:', error);
      }
    },
    // 좋아요 취소 메서드
    async unlikeArticle() {
      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴

      try {
        await axios.post(`/api/article/${articleId}/unlike`); // 좋아요 취소 요청
        this.article.likes -= 1; // 좋아요 수 감소
        this.article.pushLikes = false; // 좋아요 상태 업데이트
      } catch (error) {
        console.error('좋아요 취소 중 오류가 발생했습니다:', error);
      }
    },
    goToAuthorArticles(nickName) {
      this.$router.push({
        name: 'AuthorCommunityView',
        params: { nickname: nickName },
        query: { page: 1 }, // 현재 페이지 넘버 포함
      });
    },
    // 날짜 포맷 함수
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString('ko-KR', options);
    },
    // 카테고리 포맷 함수
    formatCategory(category) {
      switch (category) {
        case 'free':
          return '자유';
        case 'question':
          return '질문';
        case 'counseling':
          return '고민상담';
        case 'info':
          return '정보공유';
        default:
          return category; // 알 수 없는 카테고리 기본 처리
      }
    },
    // 댓글 등록 메서드
    async submitComment() {
      if (!this.isLoggedIn) {
        alert('로그인 후 이용가능한 서비스입니다.'); // 로그인 유도 메시지
        return; // 로그인하지 않은 경우 메서드 종료
      }

      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴

      try {
        await axios.post(`/api/article/comment/${articleId}`, {
          content: this.newComment, // 댓글 내용
        });

        this.newComment = ''; // 입력값 초기화
        await this.fetchArticleData(articleId); // 댓글 목록 새로 불러오기
      } catch (error) {
        console.error('댓글 작성 중 오류가 발생했습니다:', error);
      }
    },
    // 댓글 삭제 메서드
    async deleteComment(commentId) {
      const articleId = this.$route.params.id; // URL에서 articleId를 가져옴

      if (confirm('댓글을 삭제하시겠습니까?')) {
        try {
          await axios.post(`/api/article/delete/comment/${commentId}`); // 댓글 삭제 요청

          await this.fetchArticleData(articleId); // 댓글 목록 새로 불러오기
          alert('댓글이 삭제되었습니다.');
        } catch (error) {
          console.error('댓글 삭제 중 오류가 발생했습니다:', error);
        }
      }
    },
    async copyUrl() {
      const url = window.location.href; // 현재 페이지 URL
      try {
        await navigator.clipboard.writeText(url); // URL을 클립보드에 복사
      } catch (error) {
        console.error('URL 복사 중 오류가 발생했습니다:', error);
      }
    },
    handleImageError(event, fallbackUrl) {
      if (fallbackUrl) {
        event.target.src = fallbackUrl;
      } else {
        console.error('이미지 로드 오류 및 대체 URL 없음');
      }
    },
    handleProfileImageError(event, fallbackUrl) {
      if (fallbackUrl) {
        event.target.src = fallbackUrl;
      } else {
        event.target.src = DefaultImage; // 대체 URL 없을 때 기본 이미지 사용
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/article.css"></style>
