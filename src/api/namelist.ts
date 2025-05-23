import { http } from "@/utils/http";

export interface UploadResult {
  code: number;
  data: string;
}

export const uploadFileApi = (data: FormData) => {
  return http.request<UploadResult>("post", "/api/comment/update", {
    data
  });
};

export const deleteMessageApi = (data?: { id: number }) => {
  return http.request<UploadResult>("post", "/api/comment/delete", {
    data
  });
};
