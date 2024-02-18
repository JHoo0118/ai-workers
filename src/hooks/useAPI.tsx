import { BaseResponse } from "@/model/common";
import { useEffect, useState } from "react";
import { z } from "zod";

type RequestFn<T> = (params: T) => Promise<any>;

interface RequestType {
  url: string;
  requestInit: RequestInit;
  validationSchema?: z.ZodObject<any>;
}

export default function useAPI<T>({
  url,
  requestInit,
  validationSchema,
}: RequestType) {
  const defaultErrorMessage = "오류가 발생했습니다.";
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    request();
  });

  async function request<TResponse>(): Promise<void> {
    setIsLoading(true);
    if (validationSchema && requestInit.body) {
      const parseResult = validationSchema.safeParse(requestInit.body);

      if (!parseResult.success) {
        setError(
          parseResult.error.issues
            ? JSON.stringify(parseResult.error?.issues)
            : "Invalid input",
        );
        setIsLoading(false);
        return;
      }
    }
    try {
      const resp = await fetch(url, requestInit);
      const respJson: BaseResponse<T> = await resp.json();

      if (!respJson.ok) {
        setError(respJson.message ?? defaultErrorMessage);
      }
    } catch (err: any) {
      setError(err.message ?? defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  return { response, error, isLoading };
}
