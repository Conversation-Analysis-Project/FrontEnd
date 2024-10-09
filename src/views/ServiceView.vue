<template>
  <div class="wrapper">
    <div class="service-box">
      <div class="title-box">
        <h1 class="title">
          대화내용을 업로드하고,<br />
          관계를 분석해보세요
        </h1>
        <h3 class="sub-title">
          대화 속에서 자주 사용하는 단어들이 관계를 말해줍니다. <br />
          어떤 단어를 많이 사용했는지 분석해, 당신과 상대방의 관계를
          파악해보세요. <br />감정, 의도, 그리고 대화의 패턴까지 파헤쳐 더욱
          명확한 관계 진단을 제공합니다.
        </h3>
        <img
          src="@/assets/img/service_design.png"
          alt="디자인이미지"
          class="title-img"
        />
      </div>

      <div class="input-box">
        <div class="select-box">
          <div class="date">
            <h3>
              분석기간 선택<font-awesome-icon
                :icon="['far', 'calendar-check']"
                class="title-icon"
              />
            </h3>
            <div class="date-input-box">
              <div class="date-box">
                <span>시작날짜</span>
                <input
                  type="date"
                  class="startDate"
                  v-model="startDate"
                  required
                />
              </div>

              <span>~</span>
              <div class="date-box">
                <span>종료날짜</span>
                <input type="date" class="endDate" v-model="endDate" required />
              </div>
            </div>
          </div>

          <div class="file-box">
            <h3>
              분석파일 선택<font-awesome-icon
                :icon="['far', 'file-code']"
                class="title-icon"
              />
            </h3>
            <div class="upload-box">
              <div class="file-name">
                <span class="filename-text">{{ fileName }}</span>
                <font-awesome-icon
                  v-if="fileName !== '파일을 선택하세요'"
                  :icon="['fas', 'circle-xmark']"
                  class="del-icon"
                  @click="handleFileRemove"
                />
              </div>
              <label for="file-input" class="custom-upload-button">
                파일 선택
              </label>
              <input
                type="file"
                class="file-input"
                id="file-input"
                ref="fileInput"
                accept=".txt, .csv"
                @change="handleFileChange"
              />
            </div>
            <div class="warn">
              <font-awesome-icon
                :icon="['fas', 'circle-exclamation']"
                class="warn-icon"
              />
              csv, txt 파일만 업로드 가능합니다
            </div>
          </div>
        </div>

        <div class="btn-box">
          <button @click="submitData" class="submit-btn">분석하기</button>
          <div v-if="error" class="errMsg">
            <font-awesome-icon
              :icon="['fas', 'triangle-exclamation']"
              class="err-icon"
            />{{ this.errMsg }}
          </div>
          <div class="policy-box">
            <label>
              <input type="checkbox" class="agree" v-model="consent" />
              대화내용을 AI 학습데이터로 사용하는 것에 동의합니다.
            </label>
            <div class="sub-text">
              동의 시, 대화 내용을 익명화 처리하여 개인 식별이 불가능하게 만든
              후, 해당 데이터를 인공지능 모델의 학습 데이터로 활용할 수
              있습니다. 이 과정에서 대화 제공자의 개인정보는 완전히 보호되며,
              익명화된 데이터는 AI의 성능 향상 및 서비스 개선을 위해 사용됩니다.
            </div>
          </div>
        </div>
      </div>

      <div v-if="result" class="result-box" ref="resultbox">
        <div class="title">
          당신과 상대방의 관계는
          <span class="result"> '{{ result }}' </span> 로 평가됩니다.
        </div>
        <div class="text">
          <div class="relationship-graph">
            <!-- <h2>관계 분석 결과</h2> -->
            <div class="bar-container">
              <div
                v-for="(item, index) in sortedRelationships"
                :key="index"
                class="bar-segment"
                :style="{
                  width: `${item.percentage}%`,
                  backgroundColor: colors[item.type],
                }"
                @mouseover="showTooltip(item, $event)"
                @mouseleave="hideTooltip"
              >
                <span class="bar-label" v-if="item.percentage >= 5">{{
                  item.type
                }}</span>
              </div>
            </div>
            <div class="legend">
              <div
                v-for="item in sortedRelationships"
                :key="item.type"
                class="legend-item"
              >
                <span
                  class="color-box"
                  :style="{ backgroundColor: colors[item.type] }"
                ></span>
                <span>{{ item.type }}: {{ item.percentage.toFixed(1) }}%</span>
              </div>
            </div>
            <div
              v-if="tooltip.show"
              class="tooltip"
              :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
            >
              {{ tooltip.text }}
            </div>
          </div>
          <div class="main">이런 대화는 어떨까요?</div>
          <div class="sub">
            {{ resultComment }}
          </div>
          <div v-if="analysisId && !review" class="eval">
            결과에 대한 의견을 남겨주세요
            <button class="eval-btn" @click="openReviewModal">평가하기</button>
          </div>
        </div>
      </div>

      <div class="explain-box">
        <div class="title">How to use?</div>
        <div class="step-box">
          <div class="step1">
            <div class="text-box">
              1. 분석하고 싶은 대화방을 들어간 뒤, <br />우측 상단의 삼단바를
              눌러주세요.
            </div>
            <div class="img-box"><img src="@/assets/img/step1.png" /></div>
          </div>
          <div class="step2">
            <div class="text-box">
              2. 대화내용 → 대화 내보내기를 통해<br />
              .csv 혹은 .txt 파일로 저장해주세요.
            </div>
            <div class="img-box"><img src="@/assets/img/step2.png" /></div>
          </div>
          <div class="step3">
            <div class="text-box">
              3. 홈페이지에서 분석기간을 선택하고,<br />
              대화내용 파일을 업로드해주세요.
            </div>
            <div class="img-box"><img src="@/assets/img/step3.png" /></div>
          </div>
        </div>
      </div>
    </div>
    <ReviewModal
      v-show="isModalOpen"
      :analysisId="analysisId"
      @submit="submitReview"
      @close="closeReviewModal"
    />
    <LoadingOverlay v-show="isLoading" />
  </div>
</template>

<script>
import axios from '@/axios';
import ReviewModal from '@/components/ReviewModal.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
export default {
  components: {
    ReviewModal,
    LoadingOverlay,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      file: null,
      fileName: '파일을 선택하세요',
      consent: false,
      error: false,
      errMsg: '',
      analysisId: null,
      result: null,
      resultScore: {},
      resultComment: '',
      review: null,
      isModalOpen: false,

      relationships: {
        썸: 0,
        연애: 0,
        친구: 0,
        비즈니스: 0,
      },
      colors: {
        썸: '#FF9999',
        친구: '#66B2FF',
        비즈니스: '#99CC99',
        연애: '#FF66B2',
      },
      tooltip: {
        show: false,
        text: '',
        x: 0,
        y: 0,
      },
      isLoading: false,
    };
  },
  computed: {
    totalValue() {
      return Object.values(this.relationships).reduce(
        (sum, value) => sum + value,
        0
      );
    },
    sortedRelationships() {
      return Object.entries(this.relationships)
        .map(([type, value]) => ({
          type,
          value,
          percentage: (value / this.totalValue) * 100,
        }))
        .sort((a, b) => b.percentage - a.percentage);
    },
  },
  watch: {
    analysisId(newVal) {
      // analysisId가 변경될 때마다 세션 스토리지에서 관련 값들을 업데이트
      if (newVal) {
        this.result = sessionStorage.getItem('closestRelation');
        this.resultComment = sessionStorage.getItem('resultComment');
        this.resultScore =
          JSON.parse(sessionStorage.getItem('resultScores')) || {};
        this.review = sessionStorage.getItem('review') === 'true'; // 문자열을 불리언으로 변환
      }
    },
  },
  methods: {
    showTooltip(item, event) {
      this.tooltip.show = true;
      this.tooltip.text = `${item.type}: ${item.percentage.toFixed(1)}%`;
      this.tooltip.x = event.clientX + 10;
      this.tooltip.y = event.clientY + 10;
    },
    hideTooltip() {
      this.tooltip.show = false;
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.fileName = file.name;
      }
    },
    handleFileRemove() {
      this.fileName = '파일을 선택하세요';
      this.file = null;
      this.$refs.fileInput.value = '';
    },
    validateDates() {
      const today = new Date().toISOString().split('T')[0];
      if (!this.startDate || !this.endDate) {
        this.error = true;
        this.errMsg = '분석기간을 선택해주세요';
        return false;
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.error = true;
        this.errMsg = '시작날짜가 종료날짜보다 늦을 수 없습니다.';
        return false;
      }
      if (new Date(this.endDate) > new Date(today)) {
        this.error = true;
        this.errMsg = '종료날짜는 오늘 날짜를 넘어갈 수 없습니다.';
        return false;
      }
      return true;
    },
    validateFile() {
      if (!this.file) {
        this.error = true;
        this.errMsg = '분석파일을 선택해주세요';
        return false;
      }
      const validExtensions = ['.csv', '.txt'];
      const fileExtension = this.file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(`.${fileExtension}`)) {
        this.error = true;
        this.errMsg = 'csv 또는 txt 파일만 업로드 가능합니다';
        return false;
      }
      return true;
    },
    async submitData() {
      // 특정 세션 스토리지 항목 초기화
      sessionStorage.removeItem('analysisId');
      sessionStorage.removeItem('closestRelation');
      sessionStorage.removeItem('resultScores');
      sessionStorage.removeItem('review');

      if (!this.validateDates() || !this.validateFile()) {
        return;
      }

      this.error = false;
      this.errMsg = '';

      const formData = new FormData();
      formData.append('start_date', this.startDate);
      formData.append('end_date', this.endDate);
      formData.append('file', this.file);
      formData.append('consent', this.consent);

      this.isLoading = true; // 요청 시작 시 로딩 상태 설정

      try {
        const response = await axios.post('/api/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            accept: 'application/json',
          },
        });
        console.log(response.data);
        const { analysis_id, result } = response.data;
        this.analysisId = analysis_id;
        this.result = result.closest_relation; // 가장 가까운 관계 저장
        this.resultScore = result.final_scores; // final_scores 저장
        this.resultComment = result.chatgpt_summary;

        this.relationships = { ...result.final_scores };

        sessionStorage // 세션 스토리지에 분석 결과 저장
          .setItem('analysisId', analysis_id);
        sessionStorage.setItem('closestRelation', result.closest_relation);
        sessionStorage.setItem(
          'resultScores',
          JSON.stringify(this.resultScore)
        );
        sessionStorage.setItem('resultComment', this.resultComment);
        sessionStorage.setItem('review', false);

        this.$nextTick(() => {
          const resultBox = this.$refs.resultbox;
          if (resultBox) {
            const offsetTop =
              resultBox.getBoundingClientRect().top + window.pageYOffset;
            const adjustedPosition = offsetTop - 100;

            window.scrollTo({
              top: adjustedPosition,
              behavior: 'smooth',
            });
          }
        });
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        this.error = true;
        this.errMsg = '파일 업로드에 실패했습니다. 다시 시도해주세요.';
      } finally {
        this.isLoading = false; // 요청 완료 후 로딩 상태 해제
      }
    },
    openReviewModal() {
      this.isModalOpen = true; // 모달 열기
    },
    closeReviewModal() {
      this.isModalOpen = false; // 모달 닫기
    },
    submitReview() {
      this.review = true;
      sessionStorage.setItem('review', true);
    },
  },
  mounted() {
    // 페이지 로드 시 세션 스토리지에 저장된 값 불러오기
    this.analysisId = sessionStorage.getItem('analysisId');
    this.result = sessionStorage.getItem('closestRelation');
    this.resultComment = sessionStorage.getItem('resultComment');
    const storedScores =
      JSON.parse(sessionStorage.getItem('resultScores')) || {};
    this.resultScore = storedScores;
    this.relationships = { ...storedScores };
    this.review = sessionStorage.getItem('review') === 'true';
  },
};
</script>

<style scoped src="@/assets/style/service.css"></style>
