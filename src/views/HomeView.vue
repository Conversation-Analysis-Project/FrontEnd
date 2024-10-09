<template>
  <div class="landing-page">
    <!-- 히어로 섹션 -->
    <section class="hero full-screen">
      <div class="hero-content animate-fade-in">
        <h1>Sometime, 관계를 들여다보세요</h1>
        <p>카카오톡 대화분석을 통해 당신의 인간관계를 새롭게 발견하세요</p>
        <button @click="goToService" class="cta-button">
          무료로 시작하기
          <ArrowRight class="icon" />
        </button>
      </div>
      <button
        @click="scrollToFeatures"
        class="scroll-indicator"
        aria-label="주요 기능으로 스크롤"
      >
        <ChevronDown class="scroll-icon" />
      </button>
    </section>

    <!-- 주요 기능 소개 -->
    <section ref="featuresSection" class="features">
      <h2>주요 기능</h2>
      <div class="feature-grid">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card"
        >
          <div class="feature-content">
            <component
              :is="feature.icon"
              :class="['feature-icon', feature.iconColor]"
            />
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 사용 방법 -->
    <section class="how-to-use">
      <h2>사용 방법</h2>
      <div class="steps-grid">
        <div v-for="(step, index) in steps" :key="index" class="step-card">
          <div :class="['step-number', `bg-gray`]">
            <span>{{ index + 1 }}</span>
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <h2>자주 묻는 질문</h2>
      <div class="faq-list">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <button @click="toggleFaq(index)" class="faq-question">
            <span>{{ faq.question }}</span>
            <ChevronDown :class="{ rotate: faq.isOpen }" />
          </button>
          <div v-show="faq.isOpen" class="faq-answer">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-content">
        <h2>지금 바로 시작하세요</h2>
        <p>Sometime와 함께 더 나은 관계를 만들어가세요</p>
        <div class="cta-features">
          <div class="cta-feature">
            <MessageCircle class="cta-icon" />
            <span>대화 분석</span>
          </div>
          <div class="cta-feature">
            <Heart class="cta-icon" />
            <span>관계 개선</span>
          </div>
          <div class="cta-feature">
            <Users class="cta-icon" />
            <span>커뮤니티</span>
          </div>
        </div>
        <button @click="goToService" class="cta-button">무료로 시작하기</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ArrowRight,
  MessageCircle,
  Heart,
  Users,
  ChevronDown,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const featuresSection = ref(null);

const features = [
  {
    icon: MessageCircle,
    iconColor: 'text-pink-500',
    title: '대화 분석',
    description: 'AI가 카카오톡 대화를 분석하여 관계의 특징을 파악합니다.',
  },
  {
    icon: Heart,
    iconColor: 'text-red-500',
    title: '관계 개선 팁',
    description: '분석 결과를 바탕으로 관계 개선을 위한 조언을 제공합니다.',
  },
  {
    icon: Users,
    iconColor: 'text-blue-500',
    title: '커뮤니티',
    description:
      '다른 사용자들과 경험을 공유하고 소통할 수 있는 게시판을 제공합니다.',
  },
];

const steps = [
  {
    color: 'pink',
    title: '회원가입',
    description: '간단한 이메일 인증으로 가입하세요.',
  },
  {
    color: 'blue',
    title: '대화 업로드',
    description: '카카오톡 대화 내용을 업로드하세요.',
  },
  { color: 'green', title: 'AI 분석', description: 'AI가 대화를 분석합니다.' },
  {
    color: 'purple',
    title: '결과 확인',
    description: '분석 결과와 조언을 확인하세요.',
  },
];

const faqs = ref([
  {
    question: '개인정보는 안전한가요?',
    answer:
      '네, 안전합니다. Sometime는 철저한 보안 정책을 통해 사용자의 개인정보를 안전하게 보호합니다. 모든 데이터는 암호화되어 저장되며, AI 활용 비동의 시 분석 후 즉시 삭제됩니다.',
    isOpen: false,
  },
  {
    question: '어떤 종류의 대화를 분석할 수 있나요?',
    answer:
      '카카오톡의 1:1 대화에 대해 분석 가능합니다. 단, 그룹 채팅, 음성메시지나 이미지는 현재 분석 대상에서 제외됩니다.',
    isOpen: false,
  },
  {
    question: '분석 결과의 정확도는 어느 정도인가요?',
    answer:
      'Sometime의 AI는 높은 정확도를 위해 지속적으로 학습되고 있습니다. 실제 관계는 더 복잡하고 다양한 요소에 의해 결정되기에 결과는 참고용으로만 사용해주시기 바랍니다. ',
    isOpen: false,
  },
]);

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen;
};

const goToService = () => {
  router.push('/service');
};

const scrollToFeatures = () => {
  featuresSection.value.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped src="@/assets/style/Home.css"></style>
