<template>
  <div class="doc-root h-full flex flex-col">
    <div class="doc-content flex-1 overflow-auto p-4">
      <div v-if="!docLoaded" class="text-gray-500">加载文档中...</div>
      <div v-else>
        <div v-html="htmlContent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import mammoth from "mammoth";

const props = defineProps({
  docFile: String
});

const htmlContent = ref("");
const docLoaded = ref(false);

watch(
  () => props.docFile,
  async newFile => {
    if (!newFile) return;
    docLoaded.value = false;
    htmlContent.value = "";
    try {
      const response = await fetch(newFile);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      htmlContent.value = result.value;
      docLoaded.value = true;
    } catch (err) {
      console.error("文档加载失败", err);
      htmlContent.value = "<p style='color:red;'>文档加载失败</p>";
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
