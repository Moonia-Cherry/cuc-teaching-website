<template>
  <div class="opus-container">
    <!-- 头图预留位置 -->
    <div class="header-image">
      <!-- 这里可以放置您的头图 -->
      <img src="/src/assets/opus/topbanner.jpg" alt="头图" />
      <div class="image-placeholder" />
    </div>

    <!-- 主要内容区域 -->
    <div class="content">
      <h1 class="title">欢迎来到作品展示平台</h1>

      <!-- 年份选择 -->
      <!-- <div class="year-selector">
        <el-select v-model="selectedYear" placeholder="请选择展示年份" size="large" style="width: 240px">
          <el-option v-for="year in yearOptions" :key="year" :label="`${year}年`" :value="year" />
        </el-select>
      </div> -->

      <div class="year-selector-card-container">
        <ElRow :gutter="40" justify="center" class="year-selector-showcase-row">
          <ElCol
            v-for="year in yearOptions"
            :key="year"
            :xs="24"
            :sm="8"
            :lg="8"
            :xl="6"
          >
            <router-link :to="{ path: `${year}` }">
              <el-card class="year-selector-card"> {{ year }} </el-card>
            </router-link>
          </ElCol>
        </ElRow>
      </div>

      <!-- 上传按钮 -->
      <!-- wip:日后完善 -->
      <!-- <div class="upload-section">
        <el-upload action="#" :show-file-list="false" :on-change="handleUpload">
          <el-button type="primary" size="large">
            <el-icon class="el-icon--left">
              <Upload />
            </el-icon>
            上传作品
          </el-button>
        </el-upload>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { hasPerms } from "@/utils/auth";
import { ref } from "vue";
import {
  ElSelect,
  ElOption,
  ElButton,
  ElUpload,
  ElIcon,
  ElRow,
  ElCol
} from "element-plus";
import { Upload } from "@element-plus/icons-vue";

// 年份选项（生成最近5年）
const currentYear = new Date().getFullYear();
// const yearOptions = ref(Array.from({ length: 5 }, (_, i) => currentYear - i));

const yearOptions = ref(Array.from({ length: 2 }, (_, i) => 2024 - i));
console.log(yearOptions.value);
// 选中的年份
const selectedYear = ref(currentYear);
</script>

<style scoped>
.opus-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  /* height: 300px; */

  /* background-color: #e4e7ed; */
  margin-bottom: 40px;
}

.year-selector-card-container {
  max-width: 500px;
  margin: 0 auto;
}

.year-selector-card {
  margin-bottom: 25px;
  border-radius: 25px;
}

.image-placeholder {
  font-size: 24px;
  color: #909399;
}

.content {
  width: 80%;
  max-width: 1200px;
  text-align: center;
}

.title {
  margin-bottom: 40px;
  font-size: 2.5rem;
  color: #303133;
}

.year-selector {
  margin-bottom: 30px;
}

.upload-section {
  margin-top: 30px;
}

@media (width <= 768px) {
  .title {
    font-size: 6vw;
  }

  .year-selector-card-container {
    max-width: 300px;
    margin: 0 auto;
  }

  /* .header-image {
    height: 200px;
  } */
}
</style>
