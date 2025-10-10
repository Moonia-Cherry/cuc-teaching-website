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
import { getDocListApi, Doc } from "@/api/docs";

const docList = ref<Doc[]>([]);
const selectedDoc = ref<Doc | null>(null);

onMounted(async () => {
  try {
    const res = await getDocListApi();
    if (res.code === 0 || res.code === 200) {
      docList.value = res.data;
      if (docList.value.length > 0) {
        selectedDoc.value = docList.value[0];
      }
    } else {
      console.error(res.message || "获取文档列表失败");
    }
  } catch (err) {
    console.error("请求文档列表失败", err);
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
