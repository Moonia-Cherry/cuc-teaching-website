import { http } from "@/utils/http";

// 视频类型
export interface Video {
  id: string; // 唯一 id（必需）
  title: string; // 显示标题（必需）
  url: string; // 可直接用于 <video src="..."> 的 URL（必需）
  poster: string; // 封面图片 URL 或 base64 字符串（建议由后端在上传后生成并返回；若无可为空字符串）
  filename?: string; // 原始文件名（可选）
}

export interface VideoListResponse {
  code: number;
  data: Video[];
  message?: string;
}

export const getVideoListApi = () => {
  return http.request<VideoListResponse>("get", "/api/video");
};
