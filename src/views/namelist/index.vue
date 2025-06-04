<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Fighting"
});
import UploadDialog from "@/views/namelist/upload.vue";
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import axios, { AxiosResponse } from "axios";
import { deleteTableApi, getAccountInfoApi } from "@/api/namelist";
// import axio from "@/http";
interface ItableData {
  name: string;
  acc: string;
  role: string;
  // pwd: string;
}
interface IAccountResponse {
  code: number;
  data: ItableData[];
  message?: string;
}
const tableData = ref<ItableData[]>([
  {
    name: "测试",
    acc: "begin",
    role: "admin"
    // pwd: "11111"
  }
]);
const total = ref(0); // 数据总数
const pageSize = ref(10); // 每页显示的条数
const currentPage = ref(1); // 当前页数

const uploadDialogVisible = ref(false);

// 获取账户列表方法
const fetchAccountList = async (showNotification: boolean = true) => {
  try {
    const response = await getAccountInfoApi();
    if (response.code === 200) {
      if (showNotification) {
        ElNotification({
          title: "刷新成功",
          message: "账户列表已更新",
          type: "success",
          duration: 1500
        });
      }
      // 清空并更新表格数据
      tableData.value = response.data.map(item => ({
        name: item.name,
        acc: item.acc,
        role: item.role
        // pwd: item.pwd
      }));
    } else {
      handleError(response.message || "未知错误");
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// 统一处理已知错误
const handleError = (message: string) => {
  console.error("账户请求错误:", message);
};

// 统一处理网络错误
const handleNetworkError = (error: unknown) => {
  console.error("网络错误:", error);
  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message || error.message
    : "无法连接服务器";

  ElNotification({
    title: "网络错误",
    message: errorMessage,
    type: "error",
    duration: 3000
  });
};

// 初始化时自动加载数据
onMounted(() => {
  fetchAccountList(false); // 初始加载不显示通知
});

// 处理上传成功
const handleUploadSuccess = (responseData: {
  code: number;
  message?: string;
}) => {
  if (responseData.code === 200) {
    fetchAccountList(); // 上传成功后刷新列表
    ElNotification({
      title: "上传成功",
      message: responseData.message || "数据已更新",
      type: "success",
      duration: 1500
    });
  } else {
    handleError(responseData.message || "上传文件处理失败");
  }
};

//删除！
//发起删除
const deleteRow = (index: number, acc: string) => {
  ElMessageBox.confirm("确认删除？", "删除", {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: "确认",
    cancelButtonText: "取消"
  })
    .then(() => {
      submitDelete(index, acc);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};
//提交删除
const submitDelete = async (index: number, acc: string) => {
  const editRes = await deleteTableApi({
    id: acc
  });

  if (editRes.code == 200) {
    ElMessage.success("删除成功！");
    tableData.value.splice(index, 1);
  } else {
    ElMessage.error(`Error:${editRes.data}`);
  }
};

// 翻页方法
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchAccountList(false); // 获取当前页的数据
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "./files/格式文件.csv";
  link.download = "格式文件.csv";
  link.click();
};
</script>

<template>
  <el-card>
    <el-form>
      <div class="list_header">账户列表</div>
      <el-form-item>
        <el-button @click="uploadDialogVisible = true"> 上传名单 </el-button>
        <el-button @click="fetchAccountList()">刷新列表</el-button>
        <el-button type="primary" @click="downloadFile">下载模板文件</el-button>
      </el-form-item>
    </el-form>
    <UploadDialog
      v-model="uploadDialogVisible"
      @success="handleUploadSuccess"
    />

    <!-- 表格 -->
    <div style="height: calc(100vh - 350px); overflow: auto">
      <el-table :data="tableData" style="width: 100%" height="100%">
        <el-table-column prop="name" label="姓名" width="200" />
        <el-table-column prop="acc" label="账号" width="200" />
        <!-- <el-table-column prop="pwd" label="密码" /> -->
        <el-table-column prop="role" label="身份">
          <template #default="scope">
            <span>{{ scope.row.role === "admin" ? "老师" : "学生" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              link
              type="danger"
              @click="deleteRow(scope.$index, scope.row.acc)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
  </el-card>
</template>

<style scoped>
._img {
  width: 100px;
}

.list_header {
  padding-bottom: 20px;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
  border-bottom: 2px solid #8a8d8f;
}
</style>
