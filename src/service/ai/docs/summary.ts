import { fetchInterceptors } from "@/lib/utils/fetch";

export async function docsSummary(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetchInterceptors({
    url: "/py-api/ai/docs/summary",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
    isRequiredAccessToken: true,
  });
}
