<template>
  <div class="doc-root h-full flex flex-col">
    <div class="doc-toolbar p-3 border-b">
      <strong>{{ title }}</strong>
    </div>

    <div class="doc-content flex-1 overflow-auto p-4">
      <div v-if="!docLoaded" class="text-gray-500">加载文档中...</div>
      <div v-else>
        <div v-html="htmlContent" />

        <!-- 附件区域 -->
        <div class="attachments mt-6">
          <h3 class="text-lg font-semibold mb-2">附件</h3>
          <div v-if="attachments && attachments.length">
            <ul>
              <li v-for="(att, i) in attachments" :key="i" class="mb-2">
                <a
                  :href="att.url"
                  :download="att.name"
                  target="_blank"
                  class="text-blue-600 underline"
                >
                  {{ att.name }}
                </a>
                <span class="ml-2 text-sm text-gray-500">（点击下载）</span>
                <!-- 可选：提供在线预览链接 -->
                <button
                  v-if="isPreviewable(att.name)"
                  class="ml-3 text-sm"
                  @click="previewAttachment(att)"
                >
                  预览
                </button>
              </li>
            </ul>
          </div>
          <div v-else class="text-gray-500">无附件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import mammoth from "mammoth"; // 或者 mammoth/mammoth.browser

const props = defineProps({
  docFile: String,
  attachments: { type: Array, default: () => [] } // 新增 prop
});

const htmlContent = ref("");
const docLoaded = ref(false);
const title = ref("");

watch(
  () => props.docFile,
  async newFile => {
    if (!newFile) return;
    docLoaded.value = false;
    htmlContent.value = "";
    title.value = newFile.split("/").pop();
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

// 简单预览判断：只预览图片/pdf/text 等
const isPreviewable = name => {
  return /\.(png|jpe?g|gif|bmp|webp|pdf|txt)$/i.test(name);
};

// 预览处理（对 pdf: 打开新标签；图片: 打开新标签；txt: fetch 显示内容）
// 注意：zip 不在此列（zip 需用 JSZip 解压）
const previewAttachment = async att => {
  const name = att.name;
  if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(name)) {
    window.open(att.url, "_blank");
    return;
  }
  if (/\.pdf$/i.test(name)) {
    window.open(att.url, "_blank");
    return;
  }
  if (/\.txt$/i.test(name)) {
    try {
      const r = await fetch(att.url);
      const txt = await r.text();
      const w = window.open("", "_blank");
      w.document.write(`<pre>${escapeHtml(txt)}</pre>`);
    } catch (e) {
      alert("预览失败");
    }
    return;
  }
};

// HTML 转义，防止直接写入原文时 XSS（只用于 demo）
const escapeHtml = s =>
  s.replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]
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

.attachments {
  padding-top: 12px;
  border-top: 1px solid #eee;
}
</style>
