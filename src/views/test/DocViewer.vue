<template>
  <div class="doc-root h-full flex flex-col">
    <div
      v-if="!docLoaded"
      class="text-gray-500 flex items-center justify-center h-full"
    >
      加载文档中...
    </div>
    <div
      v-else-if="isZipFile"
      class="flex flex-col items-center justify-center h-full p-4"
    >
      <div class="text-center">
        <p class="text-lg mb-4">这是一个压缩文件，无法直接预览</p>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          @click="downloadFile"
        >
          下载文件
        </button>
      </div>
    </div>
    <div v-else>
      <div
        v-if="error"
        class="flex items-center justify-center h-full text-red-500"
      >
        {{ error }}
      </div>
      <div v-else class="doc-content flex-1 overflow-auto p-4">
        <div v-html="htmlContent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import mammoth from "mammoth";

const props = defineProps({
  docFile: String
});

const htmlContent = ref("");
const docLoaded = ref(false);
const error = ref("");

// 判断是否为zip文件
const isZipFile = computed(() => {
  return props.docFile?.toLowerCase().endsWith(".zip") || false;
});

// 下载文件
const downloadFile = () => {
  if (!props.docFile) return;
  const link = document.createElement("a");
  link.href = props.docFile;
  // 从URL中提取文件名
  const filename = props.docFile.split("/").pop() || "download";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

watch(
  () => props.docFile,
  async newFile => {
    if (!newFile) {
      htmlContent.value = "";
      error.value = "";
      docLoaded.value = true;
      return;
    }

    // 如果是zip文件，不进行预览处理
    if (isZipFile.value) {
      docLoaded.value = true;
      return;
    }

    docLoaded.value = false;
    htmlContent.value = "";
    error.value = "";

    try {
      const response = await fetch(newFile);

      if (!response.ok) {
        throw new Error(`无法加载文件: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      htmlContent.value = result.value;
      docLoaded.value = true;
    } catch (err) {
      console.error("文档加载失败", err);
      error.value = `文档加载失败: ${err.message || "未知错误"}`;
      docLoaded.value = true;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.doc-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.doc-content {
  flex: 1;
  overflow: auto;
}
</style>
