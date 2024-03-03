import { ReturnType, fetchInterceptors } from "@/lib/utils/fetch";
import { FileDonwloadInputs } from "@/types/file-types";

export async function filePublicDelete({
  filename,
}: FileDonwloadInputs): Promise<boolean> {
  return fetchInterceptors({
    url: `/py-api/file/public/delete/${filename}`,
    options: {
      method: "DELETE",
    },
  });
}

export async function fileDonwload({
  filename,
}: FileDonwloadInputs): Promise<Blob> {
  return fetchInterceptors({
    url: `/py-api/file/download/${filename}`,
    options: {
      method: "GET",
    },
    returnType: ReturnType.BLOB,
  });
}
