import { http } from "@/utils/http";

// 定义留言类型
export interface Message {
  id: number;
  username: string;
  content: string;
  time?: string;
}

export interface PostMessageResult {
  code: number;
  data: string;
}

export const editMessageApi = (data?: Message) => {
  return http.request<PostMessageResult>("post", "/api/comment/update", {
    data
  });
};

export const deleteMessageApi = (data?: { id: number }) => {
  return http.request<PostMessageResult>("post", "/api/comment/delete", {
    data
  });
};
