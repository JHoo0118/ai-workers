import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  SequenceDiagramSchema,
  sequenceDiagramSchema,
} from "@/lib/validation/ai/diagram/seq/seqDiagramSchema";
import { SeqDiagramGenerateOutputs } from "@/types/ai-types";

export async function sequenceDiagramGenerate(
  sequenceDiagramSchemaInputs: SequenceDiagramSchema,
): Promise<SeqDiagramGenerateOutputs> {
  const parseResult = sequenceDiagramSchema.safeParse(
    sequenceDiagramSchemaInputs,
  );

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/diagram/seqdiagram/generate",
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
