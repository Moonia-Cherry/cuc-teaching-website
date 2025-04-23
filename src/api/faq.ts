import { http } from "@/utils/http";

// type faqTypeRes = {
//   success: boolean;
//   data: Array<FAQtype>;
// };

export interface FAQtype {
  type: string;
  count: number;
}

export interface PostFaqResult {
  code: number;
  data: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  type: string;
}

export const getFaqType = () => {
  return http.request<FAQtype[]>("get", "/api/faq/type");
};

export const postFaq = (data?: FAQ) => {
  return http.request<PostFaqResult>("post", "/api/faq/", { data });
};
