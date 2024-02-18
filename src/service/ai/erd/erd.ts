import { fetchInterceptors } from "@/lib/utils/fetch";
import { ErdSchema, erdSchema } from "@/lib/validation/ai/erd/erdSchema";
import { ErdGenereateOutputs } from "@/types/ai-types";

export async function erdGenerate(
  erdSchemaInputs: ErdSchema,
): Promise<ErdGenereateOutputs> {
  const parseResult = erdSchema.safeParse(erdSchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/erd/generate",
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
