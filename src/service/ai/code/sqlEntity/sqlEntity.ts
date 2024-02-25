import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  SqlToEntitySchema,
  sqlToEntitySchema,
} from "@/lib/validation/ai/code/sqlEntity/sqlEntitySchema";
import { SqlToEntityOutputs } from "@/types/ai-types";

export async function sqlToEntity(
  sqlToEntitySchemaInputs: SqlToEntitySchema,
): Promise<SqlToEntityOutputs> {
  const parseResult = sqlToEntitySchema.safeParse(sqlToEntitySchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/code/sqlentity/generate",
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
