<template>
  <div>
    <!-- 引入Docsify的index.html内容 -->
    <iframe :src="`${publicPath}docs/index.html`" />
  </div>
</template>

<script>
export default {
  name: "DocsView",
  data() {
    console.log(import.meta.env.VITE_PUBLIC_PATH);
    return {
      publicPath: import.meta.env.VITE_PUBLIC_PATH // 读取环境变量
    };
  }
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
