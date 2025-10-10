import { http } from "@/utils/http";

// 文档类型
export interface Doc {
  id: string; // 文档唯一 id
  name: string; // 文档标题
  url: string; // 文档可访问 URL
  filename?: string; // 原始文件名，可选
}

export interface DocListResponse {
  code: number;
  data: Doc[];
  message?: string;
}

export const getDocListApi = () => {
  return http.request<DocListResponse>("get", "/api/docs");
};
