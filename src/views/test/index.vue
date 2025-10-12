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

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Sidebar from "./Sidebar.vue";
import DocViewer from "./DocViewer.vue";

interface Doc {
  id: string;
  name: string;
  url: string;
}

const docList = ref<Doc[]>([]);
const selectedDoc = ref<Doc | null>(null);

onMounted(async () => {
  try {
    // 直接从public/Docfile目录读取文档文件
    // 注意：由于服务器配置了基础URL为/test/，所以需要加上前缀
    const docFiles: Doc[] = [
      { id: "1", name: "实验1-1.docx", url: "/test/Docfile/实验1-1.docx" },
      { id: "2", name: "实验1-2.docx", url: "/test/Docfile/实验1-2.docx" },
      { id: "3", name: "实验2-1.docx", url: "/test/Docfile/实验2-1.docx" },
      { id: "4", name: "实验2-2.docx", url: "/test/Docfile/实验2-2.docx" },
      { id: "5", name: "实验2-3.docx", url: "/test/Docfile/实验2-3.docx" },
      { id: "6", name: "实验3-1.docx", url: "/test/Docfile/实验3-1.docx" },
      { id: "7", name: "实验3-2.docx", url: "/test/Docfile/实验3-2.docx" },
      { id: "8", name: "实验3-3.zip", url: "/test/Docfile/实验3-3.zip" },
      { id: "9", name: "实验4-1.docx", url: "/test/Docfile/实验4-1.docx" },
      { id: "10", name: "实验4-2.zip", url: "/test/Docfile/实验4-2.zip" },
      { id: "11", name: "实验5-1.docx", url: "/test/Docfile/实验5-1.docx" },
      { id: "12", name: "实验5-2.docx", url: "/test/Docfile/实验5-2.docx" }
    ];

    docList.value = docFiles;
    if (docList.value.length > 0) {
      selectedDoc.value = docList.value[0];
    }
  } catch (err) {
    console.error("获取文档列表失败", err);
  }
});

// 切换文档
const selectDoc = doc => {
  selectedDoc.value = doc;
};
</script>

<style scoped>
.layout-root {
  display: flex;
  height: 100%;
}
</style>
