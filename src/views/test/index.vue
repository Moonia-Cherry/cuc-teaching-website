<template>
  <div class="layout-root h-screen">
    <!-- 左侧：文档列表 -->
    <div class="w-1/5 h-full">
      <Sidebar
        class="h-full"
        :docs="docList"
        :selectedId="selectedDoc?.id"
        @selectDoc="selectDoc"
      />
    </div>

    <!-- 右侧：文档预览 -->
    <div class="w-4/5 h-full">
      <DocViewer class="h-full" :docFile="selectedDoc?.url" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "./Sidebar.vue";
import DocViewer from "./DocViewer.vue";

// 文档列表
const docList = ref([]);

// 当前选中的文档
const selectedDoc = ref(null);

// 页面加载时初始化文档列表
onMounted(() => {
  const files = [
    "实验1-1.docx",
    "实验1-2.docx",
    "实验2-1.docx",
    "实验2-2.docx",
    "实验2-3.docx",
    "实验3-1.docx",
    "实验3-2.docx",
    "实验3-3.docx",
    "实验4-1.docx",
    "实验4-2.docx",
    "实验5-1.docx",
    "实验5-2.docx"
  ];

  docList.value = files.map((file, idx) => ({
    id: idx,
    name: file.replace(/\.[^/.]+$/, ""), // 去掉扩展名
    url: "./files/test_files/" + file // 文档路径
  }));

  // 默认选中第一个文档
  if (docList.value.length > 0) {
    selectedDoc.value = docList.value[0];
  }
});

// 切换文档
const selectDoc = doc => {
  selectedDoc.value = doc;
};
</script>

<style scoped>
/* 布局：左右两栏 */
.layout-root {
  display: flex;
  height: 100%;
}
</style>
