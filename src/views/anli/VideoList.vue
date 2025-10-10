<template>
  <div class="app-container">
    <header class="navbar">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索视频..."
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">搜索</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="isLoading" class="loading">加载视频中...</div>
      <div v-else-if="displayList.length === 0" class="empty-state">
        <p v-if="videoList.length === 0">未找到视频文件</p>
        <p v-else>搜索 "{{ searchKeyword }}" 无结果</p>
      </div>
      <div v-else class="video-grid">
        <div
          v-for="video in displayList"
          :key="video.id"
          class="video-card"
          @click="openVideo(video)"
        >
          <div class="video-thumbnail">
            <video
              crossorigin="anonymous"
              :src="video.url"
              :poster="video.poster || defaultPoster"
              muted
              preload="metadata"
              @loadedmetadata="capturePoster(video, $event)"
              @error="handleVideoError(video)"
            />
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
import { getVideoListApi } from "@/api/videos";

// 响应式数据
const videoList = ref([]);
const searchQuery = ref("");
const searchKeyword = ref("");
const isLoading = ref(true);
const defaultPoster = "https://picsum.photos/400/225?random=100";

// 页面加载时从后端获取视频列表
const fetchVideos = async (search = "") => {
  isLoading.value = true;
  try {
    const res = await getVideoListApi();
    if (res && res.code === 0 && Array.isArray(res.data)) {
      // 保证每个 item 有必要字段
      videoList.value = res.data.map(v => ({
        id: v.id ?? "",
        title:
          v.title ??
          (v.filename ? v.filename.replace(/\.[^/.]+$/, "") : "untitled"),
        url: v.url, // 后端返回可直接访问的 url
        poster: v.poster ?? ""
      }));
    } else {
      console.warn("getVideoListApi 返回结构异常或 code 非 0", res);
      videoList.value = [];
    }
  } catch (err) {
    console.error("获取视频列表失败", err);
    videoList.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchVideos();
});

// 生成封面
const capturePoster = (video, event) => {
  if (video.poster && video.poster !== defaultPoster) return;
  const vid = event.target;

  // 确保视频元数据已加载
  if (vid.readyState < vid.HAVE_METADATA) {
    console.warn("视频元数据未加载，等待中...");
    return;
  }

  try {
    const targetTime = Math.min(5, vid.duration > 1 ? vid.duration - 1 : 0.5);
    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = vid.videoWidth || 400;
        canvas.height = vid.videoHeight || 225;
        const ctx = canvas.getContext("2d");

        if (ctx && vid.videoWidth && vid.videoHeight) {
          ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
          video.poster = canvas.toDataURL("image/png");
        } else {
          video.poster = defaultPoster;
        }
      } catch (e) {
        console.error("capturePoster 内部错误", e);
        video.poster = defaultPoster;
      } finally {
        vid.removeEventListener("seeked", onSeeked);
      }
    };

    vid.addEventListener("seeked", onSeeked);
    vid.currentTime = targetTime;
  } catch (error) {
    console.error("封面生成错误", error);
    video.poster = defaultPoster;
  }
};

// 处理视频加载错误
const handleVideoError = video => {
  console.error(`视频加载失败: ${video.title}`, video.url);
};

// 搜索处理函数
const handleSearch = () => {
  searchKeyword.value = searchQuery.value.trim();
};

// 显示列表
const displayList = computed(() => {
  if (!searchKeyword.value) {
    return videoList.value;
  }

  const query = searchKeyword.value.toLowerCase();
  return videoList.value.filter(v => v.title?.toLowerCase().includes(query));
});

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
