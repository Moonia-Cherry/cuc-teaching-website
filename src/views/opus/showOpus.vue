<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// const rootLink = "./src/assets/opus/"; // 随情况更改
const rootLink = "http://101.200.63.31:8080/stuWorks/2024/";
const crawl = true;

// 处理年份参数
const displayedYear = computed(() => {
  return route.params.year || new Date().getFullYear(); // 默认当前年份
});

console.log(displayedYear.value);

// {{ id }}.image/图片 {{ id }}.png

interface Work {
  id: number;
  picPath: string;
  title: string;
  author: string;
  cover: number | string | null; // 数字：引用内部文章；字符串：封面路径；空：内容第一张图
}

// const arr = JSON.parse(fetch('html/opus/2024/data.json'))
// console.log(fetch('html/opus/2024/data.json'));
const works = ref<Work[]>();

onMounted(async () => {
  try {
    const response = await fetch(`html/opus/${displayedYear.value}/data.json`);
    if (response.ok) {
      const data = await response.json();
      works.value = data;
    } else {
      console.error("Failed to fetch data:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const goBack = () => {
  router.back(); // 返回上级页面
};
</script>

<template>
  <div class="works-showcase">
    <ElButton id="return-button" class="shadow" round @click="goBack"
      >返回
    </ElButton>
    <h2 class="showcase-title">{{ displayedYear }}年优秀作品展示</h2>
    <ElRow :gutter="20" class="showcase-row">
      <ElCol
        v-for="(work, index) in works"
        :key="index"
        :xs="24"
        :sm="12"
        :lg="8"
        :xl="6"
      >
        <!-- <router-link :to="{ path: 'display', query: { id: work.id } }"> -->
        <a :href="`html/opus/${displayedYear}/${work.id}.html`" target="_blank">
          <ElCard class="work-card">
            <!-- 图片区域 -->
            <div class="image-container">
              <!-- 开发阶段使用占位符 -->
              <div v-if="!work.picPath" class="image-placeholder">
                <span>图片占位符</span>
              </div>
              <!-- :src="'./src/assets/opus/' + work.picPath" -->
              <img
                v-else
                :src="rootLink + work.picPath"
                class="work-image"
                alt="作品图片"
              />
            </div>

            <!-- 分割线 -->
            <ElDivider class="custom-divider" />

            <!-- 文字信息 -->
            <div class="text-content">
              <p class="work-title">{{ work.title }}</p>
              <p class="work-author">{{ work.author }}</p>
            </div>
          </ElCard>
        </a>
        <!-- </router-link> -->
      </ElCol>
    </ElRow>
  </div>
</template>

<style lang="scss" scoped>
#return-button {
  left: 30px;
}

.works-showcase {
  padding: 20px;
}

.showcase-title {
  margin: 1.5rem 0;
  text-align: center;
}

.showcase-row {
  margin-top: 20px;
}

.work-card {
  position: relative;
  height: 0;
  padding-bottom: 133%; // 保持3:4的宽高比 (4/3=1.333)
  margin: 20px 10px;
  border-radius: 25px;

  // 卡片内容容器
  :deep(.el-card__body) {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 30px;
  }
}

.work-card:hover {
  transform: scale(1.05);
}

.image-container {
  position: relative;
  flex: 0 0 75%; // 固定75%高度
  overflow: hidden;
  // background: #f0f2f5; // 默认背景色
  border-radius: 4px;

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #909399;
  }

  .work-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.custom-divider {
  margin: 12px 0;
}

.text-content {
  flex: 1; // 占据剩余25%空间
  padding: 0 8px;

  .work-title {
    margin-bottom: 6px;
    font-size: 1.1rem;
    color: var(--el-text-color-primary);
  }

  .work-author {
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);
  }
}

@media (width <= 768px) {
  .text-content {
    flex: 1; // 占据剩余25%空间
    padding: 0 8px;

    .work-title {
      margin-bottom: 6px;
      font-size: 4vw;
      color: var(--el-text-color-primary);
    }

    .work-author {
      font-size: 3vw;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
