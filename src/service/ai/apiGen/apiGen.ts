import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  ApiGenSchema,
  apiGenSchema,
} from "@/lib/validation/ai/apiGen/apiGenSchema";
import { ApiGenGenerateOutputs } from "@/types/ai-types";

export async function apiGenerate(
  apiGenSchemaInputs: ApiGenSchema,
): Promise<ApiGenGenerateOutputs> {
  const parseResult = apiGenSchema.safeParse(apiGenSchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/apigen/generate",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parseResult.data),
    },
    isRequiredAccessToken: true,
  });
}
