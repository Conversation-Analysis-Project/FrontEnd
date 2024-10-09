<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">리뷰 작성</h2>

      <div class="rating">
        <button
          v-for="star in 5"
          :key="star"
          @click="setRating(star)"
          @mouseover="hoverRating = star"
          @mouseleave="hoverRating = 0"
          :class="['star', { active: star <= (hoverRating || rating) }]"
        >
          ★
        </button>
      </div>

      <textarea
        v-model="review"
        class="review-input"
        placeholder="여기에 리뷰를 작성해주세요..."
      ></textarea>

      <div class="button-group">
        <button @click="cancel" class="btn btn-cancel">취소</button>
        <button @click="submit" class="btn btn-submit">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  props: {
    analysisId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rating: 5,
      hoverRating: 0,
      review: '',
    };
  },
  methods: {
    resetModal() {
      this.rating = 5;
      this.review = '';
    },
    setRating(star) {
      this.rating = star;
    },
    cancel() {
      this.resetModal();
      this.$emit('close');
    },
    submit() {
      const reviewData = {
        analysis_id: this.analysisId, // 분석 ID
        score: this.rating, // 평점
        comment: this.review, // 리뷰
      };

      axios
        .post('/api/rate/', reviewData)
        .then((response) => {
          console.log('리뷰 제출 성공:', response.data);
          alert('평가가 제출되었습니다.');
          this.resetModal(); // 모달 초기화
          this.$emit('submit');
          this.$emit('close'); // 모달 닫기
        })
        .catch((error) => {
          console.error('리뷰 제출 실패:', error);
        });
    },
  },
};
</script>

<style scoped src="@/assets/style/review.css"></style>
