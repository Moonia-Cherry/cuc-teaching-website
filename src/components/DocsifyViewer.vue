<template>
  <div ref="docsifyContainer" class="docsify-container">
    <!-- <div class="select-group">
      <select v-model="selectedDoc" @change="changeDoc(selectedDoc)">
        <option v-for="(doc, index) in availableDocs" :key="index" :value="doc">
          {{ doc }}
        </option>
      </select>
    </div> -->
    <iframe
      :src="docsifyUrl"
      :style="{ width: '100%', height: '100%' }"
      frameborder="0"
      scrolling="yes"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

// 定义可用的文件名数组
const availableDocs = ref(["README.md", "example.md"]);
// 定义当前选中的文件名
const selectedDoc = ref("README.md");
// 生成 Docsify 的 URL
const docsifyUrl = ref(`/docs/index.html?file=${selectedDoc.value}`);

// 用于存储父容器引用
const docsifyContainer = ref(null);

// 改变加载的 Markdown 文件
const changeDoc = docName => {
  selectedDoc.value = docName;
  docsifyUrl.value = `/docs/index.html?file=${selectedDoc.value}`;
};

// 监听 selectedDoc 的变化，自动更新 docsifyUrl
watch(selectedDoc, newVal => {
  docsifyUrl.value = `/docs/index.html?file=${newVal}`;
});

// 获取父容器尺寸并设置 iframe 尺寸
const setIframeSize = () => {
  if (docsifyContainer.value) {
    // 这里可以添加更复杂的尺寸计算逻辑，目前简单设置为 100% 填充
  }
};

onMounted(() => {
  setIframeSize();
  window.addEventListener("resize", setIframeSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", setIframeSize);
});
</script>

<style scoped>
.docsify-container {
  position: fixed;
  top: 12%;
  right: 10px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 87%;
  height: calc(100% - 12%);
  padding: 0;
  margin: 0;
  overflow: auto;
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
}

.select-group {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background-color: #f5f5f5;
}

.docsify-container iframe {
  flex: 1;
  width: 95%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
}
</style>
