<template>
  <div class="app-container">
    <header class="navbar">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索视频..."
          @input="search"
        />
        <button @click="search">搜索</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="isLoading" class="loading">加载视频中...</div>
      <div v-else-if="filteredList.length === 0" class="empty-state">
        <p v-if="videoList.length === 0">未找到视频文件</p>
        <p v-else>搜索 "{{ searchQuery }}" 无结果</p>
      </div>
      <div v-else class="video-grid">
        <div
          v-for="video in filteredList"
          :key="video.url"
          class="video-card"
          @click="openVideo(video)"
        >
          <div class="video-thumbnail">
            <video
              :src="video.url"
              :poster="video.poster || defaultPoster"
              muted
              preload="metadata"
              @loadedmetadata="capturePoster(video, $event)"
              @error="handleVideoError(video)"
            />
            <span class="duration">{{ formatDuration(video.duration) }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title" :title="video.title">{{ video.title }}</h3>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const videoFiles = [
  "00.计算思维导论.mp4",
  "1-1-1 计算机硬件.mp4",
  "1-1-2 计算机软件.mp4",
  "1-1-3 二进制.mp4",
  "1-1-4 R进制转十进制.mp4",
  "1-2-1 数值的表示.mp4"
];

// 响应式数据
const videoList = ref([]);
const searchQuery = ref("");
const isLoading = ref(true);
const defaultPoster = "https://picsum.photos/400/225?random=100"; // 默认封面

// 页面加载时初始化视频列表
onMounted(() => {
  // 模拟网络请求延迟
  setTimeout(() => {
    videoList.value = videoFiles.map(file => {
      const title = file.replace(/\.[^/.]+$/, "");
      return {
        title,
        url: "./files/videos/" + file,
        duration: 0,
        poster: ""
      };
    });
    isLoading.value = false;
  }, 300);
});

// 格式化视频时长
const formatDuration = seconds => {
  if (!seconds) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

// 生成封面
const capturePoster = (video, event) => {
  const vid = event.target;

  // 确保视频元数据已加载
  if (vid.readyState < vid.METADATA_LOADED) {
    console.warn("视频元数据未加载，等待中...");
    return;
  }

  try {
    video.duration = Math.floor(vid.duration);
    const targetTime = Math.min(5, vid.duration > 1 ? vid.duration - 1 : 0.5); // 避免视频过短
    vid.currentTime = targetTime;

    const onSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = vid.videoWidth || 400;
      canvas.height = vid.videoHeight || 225;
      const ctx = canvas.getContext("2d");

      if (ctx && vid.videoWidth && vid.videoHeight) {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL("image/png");
      } else {
        video.poster = defaultPoster; // 画布创建失败时使用默认封面
      }

      vid.removeEventListener("seeked", onSeeked);
    };

    vid.addEventListener("seeked", onSeeked);
  } catch (error) {
    console.error("封面生成错误", error);
    video.poster = defaultPoster;
  }
};

// 处理视频加载错误
const handleVideoError = video => {
  console.error(`视频加载失败: ${video.title}`, video.url);
  video.poster = defaultPoster;
};

// 搜索过滤
const filteredList = computed(() => {
  if (!searchQuery.value) return videoList.value;
  return videoList.value.filter(v =>
    v.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 搜索逻辑
const search = () => {};

// 点击视频打开播放页
const openVideo = video => {
  const url = `/video-player.html?src=${encodeURIComponent(video.url)}&title=${encodeURIComponent(video.title)}`;
  window.open(url, "_blank");
};
</script>

<style scoped>
/* 页面整体 */
.app-container {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #18191c;
}

/* 顶部导航 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  flex: 1;
  gap: 5px;
}

.search-bar input {
  flex: 1;
  padding: 8px 15px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-bar input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 20%);
}

.search-bar button {
  padding: 0 15px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  background-color: #3b82f6;
  border: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.search-bar button:hover {
  background-color: #2563eb;
}

/* 视频列表网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
}

/* 视频卡片 */
.video-card {
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.video-card:hover {
  box-shadow: 0 12px 24px rgb(0 0 0 / 12%);
  transform: translateY(-8px);
}

/* 视频封面 */
.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  overflow: hidden;
  background-color: #0f172a;
}

.video-thumbnail video,
.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.video-card:hover .video-thumbnail video,
.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

/* 视频时长 */
.duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 3px 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background-color: rgb(0 0 0 / 80%);
  border-radius: 4px;
}

/* 视频标题 */
.video-info {
  padding: 12px 15px 15px;
}

.video-title {
  display: -webkit-box;
  height: 42px;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #1e293b;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 加载状态 */
.loading,
.empty-state {
  padding: 60px 0;
  font-size: 16px;
  color: #64748b;
  text-align: center;
}
</style>
