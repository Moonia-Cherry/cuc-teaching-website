<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue"; // 不导入就卡页面加载
import {
  ElInput,
  ElButton,
  ElCard,
  ElCol,
  ElRow,
  ElDatePicker,
  ElMessage
} from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
// import {Refresh} from "@iconify-json/material-symbols-light"
import { Refresh } from "@element-plus/icons-vue";

// 定义留言类型
interface Message {
  username: string;
  content: string;
  time: string;
}

const messages = ref<Message[]>([
  // {
  //   username:"test",
  //   content:"test content",
  //   time:"2025.1.25 15:38"
  // }
]);

// 存储新的留言内容
const newMessage = ref({
  username: "",
  content: ""
});

// 获取当前时间
const getCurrentTime = (): string => {
  const date = new Date();
  return date.toLocaleString();
};

// 添加留言
const addMessage = async () => {
  if (newMessage.value.username && newMessage.value.content) {
    // messages.value.push({
    //   username: newMessage.value.username,
    //   content: newMessage.value.content,
    //   time: getCurrentTime()
    // })

    try {
      const response = await axios.post("http://localhost:5000/comment/", {
        username: newMessage.value.username,
        content: newMessage.value.content
      });

      if (response.data.code === 200) {
        // ElMessage.success('留言提交成功！');
        fetchComments(false);
        // 清空输入框
        newMessage.value.username = ""; //测试时，可不清空文本框
        newMessage.value.content = "";
        ElMessage.success("留言成功！");
      } else {
        ElMessage.error(response.data.message || "提交失败，服务器返回值非200");
      }
    } catch (error) {
      ElMessage.error("请求失败，请稍后再试(可能为response构建失败)");
      console.error(error);
    }
  } else {
    ElMessage.warning("请填写留言人和留言内容");
  }
};

async function fetchComments(needEcho: boolean = true) {
  try {
    const response = await axios.get("http://localhost:5000/comment/");

    if (response.data.code === 200) {
      // console.log(response.data.data.length) // 获得的评论条数
      if (needEcho) {
        ElMessage.success("刷新成功！");
      }
      messages.value = [];
      // for response response.data.data; // 设置评论数据
      for (let index = 0; index < response.data.data.length; index++) {
        // currentMessage = new Message();
        const currentMessage: Message = {
          username: response.data.data[index].username,
          content: response.data.data[index].content,
          time: response.data.data[index].comment_time
        };
        // console.log(currentMessage);
        messages.value.push(currentMessage);
      }
      // console.log("got here");
      // console.log(messages.value);
    } else {
      console.log("not 200");
      console.error("Error:", response.data.message);
      ElMessage.error("Error:", response.data.message);
    }
  } catch (error) {
    // 错误处理
    console.log("in this");
    ElMessage.error("后端无返回");
    ElMessage.error("Error:", response.data.message);
    console.error("An error occurred while fetching comments:", error);
  }
}

onMounted(() => {
  fetchComments(false);
});
</script>

<template>
  <div class="container">
    <div class="message-body-wrapper">
      <!-- 写留言卡片 -->
      <ElCard class="write-message-card">
        <h2>写留言</h2>
        <!-- <div> -->
        <ElInput
          v-model="newMessage.username"
          placeholder="请输入您的名字"
          style="margin-bottom: 10px"
        />
        <ElInput
          v-model="newMessage.content"
          type="textarea"
          placeholder="请输入您的留言"
          :rows="4"
          style="margin-bottom: 10px"
        />
        <ElButton type="primary" @click="addMessage">提交留言</ElButton>
        <!-- </div> -->
      </ElCard>

      <!-- 留言列表 -->
      <ElCard>
        <div class="message-list-header-wrapper">
          <h2 style="display: inline">留言列表</h2>
          <el-button
            :icon="Refresh"
            style="float: right"
            circle
            @click="fetchComments(true)"
          />
        </div>
        <div>
          <div v-if="messages.length">
            <div
              v-for="(message, index) in messages"
              :key="message.time"
              class="message-card"
            >
              <el-divider v-if="index != 0" />
              <p class="comment_username">
                <strong>{{ message.username }}</strong>
              </p>
              <div style="margin-left: 20px">
                <p class="comment_content">{{ message.content }}</p>
                <p class="comment_time">
                  <em>{{ message.time }}</em>
                </p>
              </div>
            </div>
          </div>
          <p v-else style="color: gray">--这里空空的--</p>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto; // 居中对齐
}

// .message-body-wrapper {
//   width: 100%;
//   max-width: 600px;
// }

// .write-message-card {
//   width: 100%;
//   max-width: 600px;
//   margin: 0 auto;
//   margin-bottom: 20px;
// }

h2 {
  margin-bottom: 15px;
}

div.message-list-header-wrapper {
  margin-bottom: 25px;
}

.el-card {
  padding: 20px;
  margin: 20px;
}

p.comment_time {
  color: gray;
}

// .el-card.write-message-card{
//   padding: 20px;
// }
</style>
