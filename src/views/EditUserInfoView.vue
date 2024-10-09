<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<script>
import EditName from '@/components/EditName.vue';
import EditNickName from '@/components/EditNickName.vue';
import EditGender from '@/components/EditGender.vue';
import EditBirthDate from '@/components/EditBirthDate.vue';

export default {
  components: {
    EditName,
    EditNickName,
    EditGender,
    EditBirthDate,
  },
  computed: {
    currentComponent() {
      // 현재 라우트의 쿼리 파라미터에서 category 값을 가져온다.
      const category = this.$route.query.category;
      // category 값에 따라 렌더링할 컴포넌트를 결정한다.
      switch (category) {
        case 'nickname':
          return 'EditNickName';
        case 'name':
          return 'EditName';
        case 'gender':
          return 'EditGender';
        case 'birthdate':
          return 'EditBirthDate';
        default: {
          alert('오류가 발생했습니다.');
          this.$router.go(-1);
          return null;
        }
      }
    },
  },
};
</script>
