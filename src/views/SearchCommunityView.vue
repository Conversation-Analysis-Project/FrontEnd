<template>
  <div class="wrapper">
    <div class="article-list-box">
      <div class="header">
        <div class="title">검색 결과</div>
        <div class="search-box">
          <font-awesome-icon
            :icon="['fas', 'magnifying-glass']"
            class="search-icon"
            @click="searchArticles"
          />
          <input
            type="search"
            v-model="searchKeyword"
            class="search-content"
            placeholder="검색어를 입력해주세요"
            maxlength="12"
            @keyup.enter="searchArticles"
          />
        </div>
      </div>

      <div class="table">
        <div class="article-category">카테고리</div>
        <div class="article-title">제목</div>
        <div class="article-author">작성자</div>
        <div class="article-date">작성날짜</div>
        <div class="article-like">좋아요</div>
      </div>

      <div class="article-list">
        <div
          v-for="article in articles"
          :key="article.articleId"
          @click="handleArticleClick($event, article.articleId)"
          class="article"
        >
          <div class="article-category">
            {{ formatCategory(article.category) }}
          </div>
          <div class="article-title">
            {{ article.title }}
            <font-awesome-icon
              :icon="['far', 'image']"
              class="img-icon"
              v-show="article.existImg"
            />
            <span v-show="article.commentCnt">[{{ article.commentCnt }}]</span>
          </div>
          <div
            @click.stop="toggleAuthorInfo(article.articleId)"
            class="article-author"
          >
            {{ article.author }}
            <div v-if="article.isAuthorToggle" class="author-info">
              <span @click.stop="navigateToAuthorCommunity(article.author)">
                게시글 보기
              </span>
            </div>
          </div>
          <div class="article-date">{{ article.createdAt }}</div>
          <div class="article-like">{{ article.likes }}</div>
        </div>
      </div>

      <div class="footer">
        <div class="category-box">
          <select class="category" disabled>
            <option value="all">전체</option>
            <option value="free">자유</option>
            <option value="counseling">고민상담</option>
            <option value="question">질문</option>
            <option value="info">정보공유</option>
          </select>
        </div>
        <button @click="navigateToWriteArticle" class="post-btn">
          <font-awesome-icon :icon="['fas', 'pen']" class="pen-icon" />게시글
          작성
        </button>
      </div>

      <div class="pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="navigateToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      articles: [],
      totalPages: 1,
      currentPage: this.$route.query.page ? Number(this.$route.query.page) : 1,
      searchKeyword: this.$route.params.keyword || '',
    };
  },
  created() {
    this.fetchArticles(this.currentPage);
  },
  watch: {
    '$route.query.page': 'fetchArticlesByQuery', // 페이지 쿼리가 변경될 때 호출
    '$route.params.keyword': 'fetchArticlesByQuery', // 검색어가 변경될 때 호출
  },
  methods: {
    async fetchArticles(pageNum) {
      try {
        const apiUrl = `/api/article/search/${pageNum}`;
        const response = await axios.post(apiUrl, {
          keyword: this.searchKeyword,
        });
        this.articles = response.data.articles.map((article) => ({
          ...article,
          isAuthorToggle: false,
        }));
        this.totalPages = response.data.pageNum;
        this.currentPage = pageNum;
      } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
      }
    },
    async fetchArticlesByQuery() {
      const pageNum = this.$route.query.page
        ? Number(this.$route.query.page)
        : 1;
      await this.fetchArticles(pageNum);
    },
    searchArticles() {
      this.$router.push({
        name: 'SearchCommunityView',
        params: { keyword: this.searchKeyword },
        query: { page: 1 }, // 검색 시 기본적으로 1 페이지로 설정
      });
    },
    navigateToPage(page) {
      this.$router.push({
        name: 'SearchCommunityView',
        params: { keyword: this.searchKeyword },
        query: { page }, // 선택한 페이지로 이동
      });
    },
    toggleAuthorInfo(articleId) {
      const article = this.articles.find((a) => a.articleId === articleId);
      article.isAuthorToggle = !article.isAuthorToggle;
    },
    navigateToAuthorCommunity(author) {
      this.$router.push({
        name: 'AuthorCommunityView',
        params: { nickname: author },
        query: { page: this.currentPage }, // 현재 페이지 넘버 포함
      });
    },
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
          return category;
      }
    },
    handleArticleClick(event, articleId) {
      const target = event.target;
      if (!target.closest('.article-author')) {
        this.$router.push({ name: 'ArticleView', params: { id: articleId } });
      }
    },
    navigateToWriteArticle() {
      this.$router.push('/write-article');
    },
  },
};
</script>

<style scoped src="@/assets/style/community.css"></style>
