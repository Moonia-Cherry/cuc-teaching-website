<!-- components/MarkdownRender.vue -->
<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const props = defineProps({
  content: {
    type: String,
    required: true
  }
});

const renderedContent = computed(() => md.render(props.content));
</script>

<template>
  <div class="markdown-content" v-html="renderedContent" />
</template>

<style>
.markdown-content img {
  max-width: 100%;
  margin: 10px 0;
}
</style>
