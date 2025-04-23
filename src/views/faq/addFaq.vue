<script setup lang="ts">
import { onMounted, ref } from "vue";
import Vditor from "./components/Vditor.vue";
import axios from "axios";
import { Search, Plus, Document, Close } from "@element-plus/icons-vue";
import { FAQ, FAQtype, getFaqType, postFaq } from "@/api/faq";
import { nextTick } from "vue";
import {
  Action,
  ElMessage,
  ElMessageBox,
  FormInstance,
  FormRules
} from "element-plus";
import "vditor/dist/js/icons/ant.js"; // 必须导入，否则生产环境无图标

// 初始化时尝试从 localStorage 读取数据
const initialData = localStorage.getItem("faqData");
const initialFAQ: FAQ = initialData
  ? JSON.parse(initialData)
  : {
      id: "",
      question: "",
      answer: "",
      isOpen: false,
      type: ""
    };

const faqData = ref<FAQ>(initialFAQ);

const clearFaqData = () => {
  faqData.value = {
    id: "",
    question: "",
    answer: "",
    isOpen: false,
    type: ""
  };
};
const text = ref(`
\`\`\`ts
function sayHello(): void {
\tconsole.log("Hello, World!");
}
sayHello();
\`\`\`
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
`);

// 问题类别提示
// const queryTypes = async () => {
//   const response = await axios(`api/faq/type`);
//   const results = response.data;
//   return results;
// };
const faqType = ref<FAQtype[]>(null);

onMounted(async () => {
  faqType.value = await getFaqType();
  // console.log(`faqType:`, faqType);
  // console.log(`response:`, response);
  await nextTick();
});

// 查询问题种类
const queryTypes = (queryString: string, cb: Function) => {
  console.log(`queryTypes called.`);
  console.log(`queryString:`, queryString ? 1 : 2);
  console.log(`faqType.value:`, faqType.value);

  const results = queryString
    ? faqType.value
        .filter(faqTypeItem => faqTypeItem.type.indexOf(queryString) !== -1)
        .map(faqTypeItem => ({ value: faqTypeItem.type }))
    : faqType.value.map(faqTypeItem => ({ value: faqTypeItem.type }));
  cb(results);
};

// const debounce = (fn: Function, delay: number) => {
//   let timer: NodeJS.Timeout = null;
//   return function (...args: any) {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn.apply(this, args), delay);
//   };
// };

// 防抖
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// 去除本地存储，成功添加或清空时调用
const removeLocal = () => {
  localStorage.removeItem("faqData");
};

// 表单总验证
const validate = async (): Promise<boolean> => {
  console.log("start validate");

  const elVal = await elformValidate(formRef.value);
  console.log(elVal);

  if (!elVal) {
    // ElMessage({ type: "error", message: "El校验失败" });
    return false;
  }
  console.log("here");

  if (faqData.value.answer.trim() == "") {
    ElMessage({ type: "error", message: "答案不能为空" });
    return false;
  }

  if (faqData.value.type.trim() == "") {
    ElMessageBox.alert("类别为空，默认为“其它”，确定提交？", "提示", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "确定",
      callback: (action: Action) => {
        if (action === "confirm") {
          return true;
        } else {
          return false;
        }
      }
    });
  } else {
    return true;
  }
};

// 表单对象，用于调用elementplus的表单验证
const formRef = ref<FormInstance>();

const elformValidate = async (
  formEl: FormInstance | undefined
): Promise<boolean> => {
  if (!formEl) return false;
  try {
    await new Promise<boolean>((resolve, reject) => {
      formEl.validate(valid => {
        if (valid) {
          console.log("El校验成功");
          resolve(true);
        } else {
          console.log("El校验失败");
          reject(new Error("El校验失败"));
        }
      });
    });
    return true;
  } catch {
    return false;
  }
};

// element-plus表单部分验证规则
const rules = ref<FormRules<FAQ>>({
  question: [{ required: true, trigger: "change", message: "问题不能为空" }],
  // type: [{ required: true, trigger: "blur" }],
  answer: [{ required: true, trigger: "blur" }]
});

// 提交
const handleSubmit = async () => {
  const valiRes = await validate();
  if (valiRes) {
    submit();
  }
};

const submit = async () => {
  const response = postFaq(faqData.value)
    .then(response => {
      if (response.code == 201) {
        ElMessage({
          message: "提交成功！",
          type: "success"
        });
        clearFaqData();
        formRef.value.resetFields();
        removeLocal();
      } else {
        ElMessage({ type: "error", message: "提交失败: not 201" });
      }
    })
    .catch(() => {
      ElMessage({ type: "error", message: "提交失败" });
    });
};

// 存草稿
const handleSave = () => {
  saveLocal();
  ElMessage({
    message: "保存成功！",
    type: "success"
  });
};
const saveLocal = () => {
  localStorage.setItem("faqData", JSON.stringify(faqData.value));
};

const handleClear = () => {
  ElMessageBox.alert("确定清空？", "提示", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "确定",
    callback: (action: Action) => {
      if (action === "confirm") {
        clearFaqData();
        formRef.value.resetFields();
        removeLocal();
        ElMessage({
          type: "info",
          message: `已清空`
        });
      }
    }
  });
};

const handleClearValidateStatus = () => {
  console.log(`in func handleClearValidateStatus`);
  formRef.value.clearValidate();
};
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium text-center">
            <h1>添加问题</h1>
          </span>
        </div>
      </template>
      <el-form
        ref="formRef"
        label-width="auto"
        :rules="rules"
        :model="faqData"
        :hide-required-asterisk="true"
      >
        <el-row :gutter="10">
          <el-col :md="18" :xs="14" :sm="14">
            <el-form-item label="问题" prop="question">
              <el-input
                v-model="faqData.question"
                placeholder="输入问题"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :md="6" :xs="10" :sm="10">
            <el-form-item label="类别" prop="type">
              <el-autocomplete
                v-model="faqData.type"
                :fetch-suggestions="queryTypes"
                placeholder="选择类别"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <Vditor
        v-model="faqData.answer"
        :options="{
          height: 560, // 高度
          outline: { enable: true, position: 'right' } // 大纲
        }"
      />

      <el-row class="mt-4">
        <el-button type="primary" @click="handleSubmit">
          <template #icon>
            <el-icon>
              <Plus />
            </el-icon>
          </template>
          添加
        </el-button>
        <el-button type="default" @click="handleSave">
          <template #icon>
            <el-icon>
              <Document />
            </el-icon>
          </template>
          存草稿
        </el-button>
        <el-button type="danger" @click="handleClear">
          <template #icon>
            <el-icon>
              <Close />
            </el-icon>
          </template>
          清空
        </el-button>
        <el-button type="info" @click="handleClearValidateStatus">
          <template #icon>
            <el-icon>
              <Close />
            </el-icon>
          </template>
          （开发）移除校验状态
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<!-- <style lang="scss" scoped></style> -->
