import { fetchInterceptors } from "@/lib/utils/fetch";
import { GetMeOutputs } from "@/types/user-types";

export async function getMe(): Promise<GetMeOutputs> {
  return fetchInterceptors({
    url: "/py-api/user/me",
    options: {
      method: "GET",
    },
    isRequiredAccessToken: true,
  });
}
