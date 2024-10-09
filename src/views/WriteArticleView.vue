<template>
  <div class="wrapper">
    <div class="article-box">
      <div class="header">게시글 작성</div>
      <div class="content-box">
        <div class="title-box">
          <select class="category" v-model="category">
            <option selected disabled hidden value="">
              카테고리를 선택해주세요
            </option>
            <option value="free">자유</option>
            <option value="counseling">고민상담</option>
            <option value="question">질문</option>
            <option value="info">정보공유</option>
          </select>
          <input
            type="text"
            v-model="title"
            class="title"
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div class="post-box">
          <textarea
            class="content"
            v-model="content"
            :placeholder="placeholderText"
          ></textarea>
          <div class="upload-box">
            <label for="file-upload" class="custom-file-upload">
              <font-awesome-icon :icon="['far', 'image']" class="upload-icon" />
              <span>{{ fileName || '이미지 파일 첨부하기' }}</span>
            </label>
            <input type="file" id="file-upload" @change="handleFileUpload" />
            <font-awesome-icon
              v-if="fileName"
              :icon="['fas', 'circle-xmark']"
              class="remove-icon"
              @click="clearFile"
            />
          </div>
        </div>
      </div>
      <div class="btn-box">
        <button class="submit-btn" @click="submitArticle">작성</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'; // axios 인스턴스 불러오기

export default {
  data() {
    return {
      category: '',
      title: '',
      content: '',
      file: null, // 파일 저장 변수
      fileName: '',
      placeholderText: `내용을 입력해주세요\n\n광고 및 음란성 게시글, 기타 위법자료 등을 게시할 경우 게시물은 경고 없이 삭제 될 수 있습니다`,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file; // 파일 저장
        this.fileName = file.name; // 파일 이름 업데이트
      } else {
        this.file = null;
        this.fileName = ''; // 파일이 없을 경우 빈 값으로 초기화
      }
    },
    clearFile() {
      this.file = null;
      this.fileName = ''; // 파일 이름 초기화
      document.getElementById('file-upload').value = ''; // input 값을 초기화
    },
    async submitArticle() {
      // 필수 항목 검증
      if (!this.category || !this.title || !this.content) {
        alert('카테고리, 제목, 내용을 모두 입력해주세요.');
        return;
      }

      const articleWriteRequest = {
        title: this.title,
        content: this.content,
        category: this.category,
      };

      const formData = new FormData();
      formData.append(
        'articleWriteRequest',
        new Blob([JSON.stringify(articleWriteRequest)], {
          type: 'application/json',
        })
      );

      if (this.file) {
        formData.append('images', this.file); // 파일이 있을 경우 추가
      }

      try {
        const response = await axios.post('/api/article/write', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          const articleId = response.data; // 서버로부터 articleId 추출
          alert('게시글이 성공적으로 작성되었습니다.');
          this.$router.push(`/article/${articleId}`); // 작성 완료 후 해당 게시글 페이지로 이동
        } else {
          alert('게시글 작성에 실패했습니다.');
        }
      } catch (error) {
        console.error('게시글 작성 중 오류가 발생했습니다:', error);
        alert('게시글 작성 중 오류가 발생했습니다.');
      }
    },
  },
};
</script>

<style scoped src="@/assets/style/editArticle.css"></style>
