<script setup lang="ts">
import "vditor/dist/index.css";
import Vditor from "vditor";
import { useDark } from "@pureadmin/utils";
import { useIntervalFn } from "@vueuse/core";
import { onMounted, ref, watch, toRaw, onUnmounted } from "vue";

interface UploadResponse {
  msg: string;
  code: number;
  data: {
    url: string;
  };
}

function withApiPrefix(path: string): string {
  return "/api" + (path.startsWith("/") ? path : "/" + path);
}

const emit = defineEmits([
  "update:modelValue",
  "after",
  "focus",
  "blur",
  "esc",
  "ctrlEnter",
  "select"
]);

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    }
  },
  modelValue: {
    type: String,
    default: ""
  }
});

const { isDark } = useDark();
const editor = ref<Vditor | null>(null);
const markdownRef = ref<HTMLElement | null>(null);

onMounted(() => {
  editor.value = new Vditor(markdownRef.value as HTMLElement, {
    ...props.options,
    value: props.modelValue,
    cache: {
      enable: false
    },
    fullscreen: {
      index: 10000
    },
    upload: {
      url: "/api/upload", // 后端上传图片的接口
      accept: "image/jpeg,image/png,image/gif,image/jpg,image/bmp",
      fieldName: "content", // 表单字段名
      max: 10 * 1024 * 1024, // 限制最大上传大小
      // linkToImgUrl: "/api/fetch-url", // 可选：将图片链接转为 markdown
      // headers: {
      //   Authorization: "Bearer your-token" // 如果需要认证的话
      // },
      multiple: false,
      success: (html, msg) => {
        // msg 是后端返回的内容
        // 你可以自定义插入行为，通常后端返回 { "data": { "url": "http://your.img.url" } }
        const vditorEditor = editor as unknown as Vditor;
        console.log(`img upload: msg`, msg);
        editor.value.insertValue(msg);
      },
      error: msg => {
        alert("图片上传失败: " + msg);
      }
    },
    after() {
      emit("after", toRaw(editor.value));
    },
    input(value: string) {
      emit("update:modelValue", value);
    },
    focus(value: string) {
      emit("focus", value);
    },
    blur(value: string) {
      emit("blur", value);
    },
    esc(value: string) {
      emit("esc", value);
    },
    ctrlEnter(value: string) {
      emit("ctrlEnter", value);
    },
    select(value: string) {
      emit("select", value);
    }
  });
});

watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== editor.value?.getValue()) {
      editor.value?.setValue(newVal);
    }
  }
);

watch(
  () => isDark.value,
  newVal => {
    const { pause } = useIntervalFn(() => {
      if (editor.value.vditor) {
        newVal
          ? editor.value.setTheme("dark", "dark", "rose-pine")
          : editor.value.setTheme("classic", "light", "github");
        pause();
      }
    }, 20);
  }
);

onUnmounted(() => {
  const editorInstance = editor.value;
  if (!editorInstance) return;
  try {
    editorInstance?.destroy?.();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div ref="markdownRef" />
</template>
