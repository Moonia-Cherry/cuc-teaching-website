import { http } from "@/utils/http";

export interface UploadResult {
  code: number;
  data: string;
}

export const uploadFileApi = (data: FormData) => {
  return http.request<UploadResult>("post", "/api/user/upload", {
    data
  });
};

export const deleteTableApi = (data: { id: string }) => {
  return http.request<UploadResult>("post", "/api/user/delete", {
    data
  });
};

interface ItableData {
  name: string;
  acc: string;
  // pwd: string;
}
interface IAccountResponse {
  code: number;
  data: ItableData[];
  message?: string;
}

export const getAccountInfoApi = () => {
  return http.request<IAccountResponse>("get", "/api/user/account");
};
