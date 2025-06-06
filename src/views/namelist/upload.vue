<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import Papa from "papaparse";
import { uploadFileApi } from "@/api/namelist";
//文件格式
const form = reactive({
  name: "",
  file: ""
});
//文件链
const fileList = ref([]);
//表头要求
const requiredHeaders = [
  "姓名",
  "学号/工号",
  "年级",
  "院系",
  "专业",
  "班级",
  "角色",
  "密码"
];

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});
//刷新成功的消息
const emit = defineEmits(["update:modelValue", "success"]);
// 重置表单
const resetForm = () => {
  form.name = "";
  form.file = "";
  fileList.value = [];
};
// 关闭对话框
const handleClose = () => {
  emit("update:modelValue", false);
};
// 文件上传前的验证
const beforeUpload = file => {
  // 验证文件类型
  const isCSV = file.name.endsWith(".csv") || file.type === "text/csv";
  if (!isCSV) {
    ElMessage.error("只能上传 CSV 文件");
    return false;
  }

  // 验证文件大小
  const isSizeValid = file.size / 1024 / 1024 < 100;
  if (!isSizeValid) {
    ElMessage.error("文件大小不能超过 100MB");
    return false;
  }

  return true;
};

// 表头验证函数
const validateAllFiles = async () => {
  const results = await Promise.all(
    fileList.value.map(file => validateCSVHeaders(file).catch(() => false))
  );
  return results.every(Boolean);
};
// 表头验证函数
const validateCSVHeaders = file => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const content = e.target.result.replace(/^\uFEFF/, "");
        const results = Papa.parse(content, { preview: 1 }); // 只解析第一行
        if (!results.data || results.data.length === 0) {
          resolve(false);
          return;
        }
        const headers = results.data[0]
          .map(h => (h || "").toString().trim()) // 转为字符串并去空格
          .filter(Boolean);

        const isValid = requiredHeaders.every((h, i) => headers[i] == h);
        // const isValid = ture;
        resolve(isValid);
      } catch (error) {
        resolve(false);
      }
    };

    reader.readAsText(file.raw);
  });
};

//提交
const onSubmit = async () => {
  try {
    if (fileList.value.length === 0) {
      return;
    }
    const allValid = await validateAllFiles();
    if (!allValid) {
      ElMessage.error("CSV 表头格式不正确，请使用模板文件");
      fileList.value = [];
      return;
    }
    console.log("1");
    console.log(fileList.value);
    // console.log(fileList.value);
    const formData = new FormData();
    fileList.value.forEach(file => {
      formData.append("file", file.raw);
    });
    console.log("2");
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }
    const loading = ElLoading.service({
      lock: true,
      text: "文件上传中..."
    });
    try {
      const data = await uploadFileApi(formData);
      if (data.code === 200) {
        emit("success", data);
        resetForm();
        handleClose();
      } else {
        ElMessage.error(data.message || "上传失败");
      }
    } finally {
      loading.close();
    }
  } catch (error) {
    ElMessage.error("文件上传失败: " + error.message);
  }
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="上传名单文件"
    width="70%"
    :before-close="handleClose"
  >
    <el-form :model="form" style="max-width: 100%">
      <el-form-item style="margin-top: 10px">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="#"
          drag
          :auto-upload="false"
          multiple
          :before-upload="beforeUpload"
          :show-file-list="true"
          accept=".csv"
        >
          <!-- list-type="picture" -->
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽上传或 <em>点击此处上传</em></div>
          <div class="el-upload__tip">
            要求表头顺序：姓名、学号/工号、年级、院系、专业、班级、角色、密码
          </div>
          <div class="el-upload__tip">
            学号/工号不能重复<br />"角色"内的教师会被当作管理员（写'admin'亦可），学生会被当做普通用户（写'common'亦可）<br />密码需大于等于8位，否则无法登陆
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label-width="20px">
        <el-button type="danger" @click="handleClose()">取消</el-button>
        <div style="width: 5%" />
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.upload-demo {
  width: 100%;
}

.el-upload__tip {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}
</style>
