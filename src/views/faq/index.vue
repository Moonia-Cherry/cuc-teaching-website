<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import MarkdownIt from "markdown-it";
import Fuse from "fuse.js";
import { Segment, useDefault } from "segmentit";
import { debounce } from "lodash-es";

// 初始化中文分词器
const segment = useDefault(new Segment());

// Markdown 解析器实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// 定义FAQ类型
interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  type: string;
}

const mdContent = ref("");

async function f() {
  try {
    const response = await fetch("/faq/101.md"); // 直接从 public 目录加载
    mdContent.value = await response.text();
    console.log(mdContent.value);
    console.log(typeof mdContent.value);
  } catch (error) {
    console.error("Failed to load Markdown file:", error);
  }
}

onMounted(() => {
  f();
});

// 初始化FAQ列表
const faqs = ref<FAQ[]>([
  {
    id: "1",
    question: "如何注册账号？",
    answer:
      "## 注册步骤\n1. 点击**注册**按钮\n2. 填写表格\n![示意图](/images/register.png)",
    isOpen: false,
    type: "账号相关"
  },
  {
    id: "2",
    question: "忘记密码怎么办？",
    answer:
      "**重置密码步骤**：\n- 访问登录页\n- 点击'忘记密码'\n- 验证邮箱后重置",
    isOpen: false,
    type: "账号相关"
  },
  {
    id: "3",
    question: "如何联系客服？",
    answer: "客服联系方式：\n- 电话：400-123-4567\n- 邮箱：support@example.com",
    isOpen: false,
    type: "客服"
  },
  {
    id: "101",
    question: "Python中关于0.1+0.2!=0.3的解释",
    answer:
      // "![图1](src/assets/faq/101-1.png)\n\n这里涉及到一个知识点，叫做不确定尾数。因为Python在计算前会将我们输入的十进制数字转换为二进制，计算后，然后将二进制的结果又转换为十进制数字显示出来。\n\n![图2](src/assets/faq/101-2.png)\n\n对于小数而言，因为十进制小数与二进制小数之间并不是完全对等转换的，一般来说，一个十进制小数会转换为无限位数的二进制小数，但是呢，因为计算机一般只截取无限位数中前53位，所以造成同一个小数的十进制表示结果与二进制表示结果并不等价。\n\n![图3](src/assets/faq/101-3.png)\n\n<div style='text-align:center;color:gray'>0.1用二进制表示(截取前53位)</div>\n\n经过两次转换就造成了不确定尾数。\n\n下面是0.1,0.2及0.3在内存中25位有效位数的表示，可以看出0.1+0.2!=0.3\n\n![图4](src/assets/faq/101-4.png)\n",
      mdContent.value,
    isOpen: false,
    type: "python"
  }
]);

// 监听faqs更改
watch(mdContent, newValue => {
  const targetFaq = faqs.value.find(faq => faq.id === "101");
  if (targetFaq) {
    targetFaq.answer = newValue;
  }
});

const searchText = ref("");

// 智能分词方法
const smartSplitKeywords = (query: string) => {
  return query
    .split(/\s+/) // 先处理手动分隔
    .flatMap(
      term => segment.doSegment(term, { simple: true }) // 自动分词
    )
    .filter(word => word.length >= 2);
};

// 清除Markdown格式
const stripMarkdown = (md: string) => {
  return md
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/`/g, "");
};

// 响应式Fuse实例
const fuse = ref<Fuse<FAQ>>();

watchEffect(() => {
  fuse.value = new Fuse(faqs.value, {
    keys: [
      {
        name: "question",
        weight: 0.7,
        getFn: item => item.question.toLowerCase()
      },
      {
        name: "answer",
        weight: 0.3,
        getFn: item => stripMarkdown(item.answer).toLowerCase()
      }
    ],
    threshold: 1, // 提高容错率
    ignoreLocation: true,
    minMatchCharLength: 2,
    useExtendedSearch: true,
    findAllMatches: true // 查找所有匹配项
    // tokenize: true,
    // matchAllTokens: false
  });
});

// const filteredFaqs = ref([])

// 创建防抖函数
// const debouncedFilter = debounce((query: string) => {
//   if (!query) filteredFaqs.value = faqs.value;
//   const keywords = smartSplitKeywords(query);
//   if (keywords.length === 0) filteredFaqs.value = [];
//   let queryResult = fuse.value?.search(keywords.join("|")).map((item) => item.item);
//   if (queryResult?.length === 0) {
//     filteredFaqs.value = [];
//   }
//   filteredFaqs.value = queryResult;
// }, 500)

// 过滤后的FAQ列表
const filteredFaqs = computed(() => {
  const query = searchText.value.trim();
  if (!query) return faqs.value;

  const keywords = smartSplitKeywords(query);
  console.log("分词", keywords); // 能够检测到
  if (keywords.length === 0) return [];

  // const queryResult = fuse.value?.search({
  //   $or: keywords
  // })

  // console.log(keywords.map(word => ({
  //     $path: ["question", "answer"],
  //     // $val: { $regex: `\\b${word}` } // 使用正则增强边界匹配
  //   })))

  //   return

  // return fuse.value?.search({
  //   $or: keywords.map(word => ({
  //     $path: ["question", "answer"],
  //     // $val: { $regex: `\\b${word}` } // 使用正则增强边界匹配
  //   }))
  // })
  // ?.sort((a, b) => (a.score || 0) - (b.score || 0))
  //  .map(result => result.item) || [];
  console.log("根据拼接分词搜索", fuse.value?.search(keywords.join(" ")));

  // let queryResult = fuse.value?.search(keywords.join(' '))
  console.log(fuse.value?.search(keywords.join(" ")).map(item => item.item));
  console.log(keywords);
  let queryResult = fuse.value
    ?.search(keywords.join("|"))
    .map(item => item.item);
  if (queryResult?.length === 0) {
    return [];
  }
  // console.log(fuse.value?.search(keywords.join(' '))[0].item)
  // console.log(faqs.value[0]) // 比对faqs中的项，发现与上一行一致
  console.log(queryResult);
  return queryResult;
});

// 监听 searchText 变化
// watch(searchText, (newVal) => {
//   const query = newVal.trim()
//   debouncedFilter(query)
// })

// 组件卸载时取消未执行的防抖任务（组合式 API）
// onUnmounted(() => {
//   debouncedFilter.cancel()
// })

// 切换展开状态
const toggleFAQ = (id: string) => {
  const faqToToggle = faqs.value.find(faq => faq.id === id);
  faqToToggle.isOpen = !faqToToggle.isOpen;
};

const renderer = (strToBeRend: string) => {
  console.log("good");
  return md.render(strToBeRend);
};
</script>

<template>
  <div>
    <div class="container">
      <div class="header-container">
        <h1>常见问题</h1>
        <!-- <el-button circle class="add-faq-button" /> -->
      </div>

      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索问题..."
          :prefix-icon="Search"
          clearable
        />
      </div>

      <!-- <div v-if="searchText" class="faq-answer">test</div>
  searchText -->
      <div
        v-for="faq in filteredFaqs"
        :id="faq.id"
        :key="faq.id"
        class="faq-item"
      >
        <div class="faq-question" @click="toggleFAQ(faq.id)">
          <span class="question-title">{{ faq.question }}</span>
          <span class="question-type">{{ faq.type }}</span>
          <span class="toggle-icon">{{ faq.isOpen ? "－" : "＋" }}</span>
        </div>

        <div v-if="faq.isOpen" class="faq-answer">
          <div
            id="markdown-content"
            class="markdown-content"
            v-html="renderer(faq.answer)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
}

// .container h1 {
//   height: 0;
//   padding-bottom: 36px;
//   // margin-bottom: 20px;
//   text-align: center;
//   display: relative;
// }

.header-container {
  margin-bottom: 20px;
  text-align: center;
}

.add-faq-button {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
  width: 30px;
}

.search-container {
  max-width: 400px;
  margin: 0 auto 25px;
}

.faq-item {
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
  }
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  font-weight: 500;
  cursor: pointer;
  background: #f8f9fa;
  border-radius: 4px;

  &:hover {
    background: #e9ecef;
  }

  .question-title {
    flex-grow: 1;
  }
}

.faq-answer {
  padding: 30px;
  background: #fff;
  border-radius: 0 0 4px 4px;
}

.question-type {
  padding-right: 10px;
  color: var(--el-text-color-secondary);
}

#markdown-content {
  line-height: 1.6;

  h1,
  h2,
  h3 {
    margin: 1em 0 0.5em;
  }

  ul,
  ol {
    padding-left: 2em;
    margin: 0.5em 0;
  }

  img {
    // max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }

  strong {
    color: #2c3e50;
  }
}

.toggle-icon {
  font-weight: bold;
  color: #666;
}
</style>
