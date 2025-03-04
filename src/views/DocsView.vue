<template>
  <div>
    <!-- 引入Docsify的index.html内容 -->
    <iframe src="/docs/index.html" />
  </div>
</template>

<script>
export default {
  name: "DocsView"
};
</script>

<style scoped>
iframe {
  width: 100%;
  height: 100vh;
  overflow: auto;
  border: none;
}
</style>
