<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Fighting"
});
import UploadDialog from "@/views/namelist/upload.vue";
import { ref, reactive, onMounted } from "vue";
import { ElNotification } from "element-plus";
// import axio from "@/http";

const tableData = ref([]);
onMounted(async () => {
  // let { data } = await axio.get(""); //放返回的路径
  // tableData.value = data.data;
});

const uploadDialogVisible = ref(false);

// 处理上传成功
const handleUploadSuccess = responseData => {
  console.log("上传成功", responseData);
  ElNotification({
    title: "上传成功",
    type: "success",
    duration: 1000
  });
};
</script>
<script setup></script>
<template>
  <el-card>
    <el-form>
      <div class="list_header">账户列表</div>
      <el-form-item>
        <el-button @click="uploadDialogVisible = true"> 上传名单 </el-button>
        <el-button @click="null"> 修改名单 </el-button>
      </el-form-item>
    </el-form>
    <UploadDialog
      v-model="uploadDialogVisible"
      @success="handleUploadSuccess"
    />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="文件名称" />
      <el-table-column prop="path" label="内容">
        <template #default="{ row }">
          <img class="_img" :src="row.path" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
._img {
  width: 100px;
}
.list_header {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  padding-bottom: 20px;
  border-bottom: 2px solid #8a8d8f;
  margin-bottom: 10px;
}
</style>
