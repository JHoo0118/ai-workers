import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  CodeConvertSchema,
  codeConvertSchema,
} from "@/lib/validation/ai/codeConverter/codeConverterSchema";
import { CodeConvertGenereateOutputs } from "@/types/ai-types";

export async function codeConvertGenerate(
  codeConvertSchemaInputs: CodeConvertSchema,
): Promise<CodeConvertGenereateOutputs> {
  const parseResult = codeConvertSchema.safeParse(codeConvertSchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/codeconvert/generate",
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
