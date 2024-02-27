import { fetchInterceptors } from "@/lib/utils/fetch";
import { ProfileSchema, profileSchema } from "@/lib/validation/profileSchema";
import { GetMeOutputs, UpdateUserOutputs } from "@/types/user-types";

export async function getMe(): Promise<GetMeOutputs> {
  return fetchInterceptors({
    url: "/py-api/user/me",
    options: {
      method: "GET",
    },
    isRequiredAccessToken: true,
  });
}

export async function updateUser(
  profileSchemaInputs: ProfileSchema,
): Promise<UpdateUserOutputs> {
  const parseResult = profileSchema.safeParse(profileSchemaInputs);

  if (!parseResult.success) {
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/user/update",
    options: {
      method: "POST",
      body: JSON.stringify(parseResult.data),
    },
    isRequiredAccessToken: true,
  });
}
