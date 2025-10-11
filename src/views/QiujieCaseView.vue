<template>
  <div>
    <!-- 引入问题求解案例网页更新版的index.html内容 -->
    <iframe :src="`${publicPath}问题求解案例网页更新版/index.html`" />
  </div>
</template>

<script>
export default {
  name: "QiujieCaseView",
  data() {
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
