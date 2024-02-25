"use client";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useMenu from "@/hooks/useMenu";
import { CryptoUtils } from "@/lib/utils/crypto";
import { sequenceDiagramSchema } from "@/lib/validation/ai/diagram/seq/seqDiagramSchema";
import { sequenceDiagramGenerate } from "@/service/ai/diagram/seq/seq";
import { SeqDiagramGenerateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AISequenceDiagramContainerProps {}

function AISequenceDiagramContainer({}: AISequenceDiagramContainerProps) {
  const { title, content } = useMenu();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof sequenceDiagramSchema>>({
    resolver: zodResolver(sequenceDiagramSchema),
    defaultValues: {
      request: "",
    },
  });

  async function onSubmit(data: z.infer<typeof sequenceDiagramSchema>) {
    setIsLoading(true);
    toast.promise(sequenceDiagramGenerate(data), {
      loading: "생성 중...",
      success: (data: SeqDiagramGenerateOutputs) => {
        const { image } = data;
        const encryptedImage = CryptoUtils.getInstance().encryptAes(image);
        router.push(`/ai/diagram/seq/result/${encryptedImage}`);
        return <b>이미지가 생성되었습니다.</b>;
      },
      error: (error) => {
        setIsLoading(false);
        return <b>{error}</b>;
      },
    });
  }

  return (
    <div className="relative flex h-full flex-col items-center">
      {isLoading ? (
        <Loading message={"생성 중입니다. 잠시만 기다려 주세요."} />
      ) : (
        <>
          <div className="flex flex-col items-center px-10 py-4 pt-10">
            <h1 className="text-4xl">{title}</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          </div>
          <div className="mx-auto w-full px-4 py-0 lg:w-auto lg:p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...form.register("request")}
                      name="request"
                      placeholder={`Client는 Authorization Server에 Access Token을 요청합니다. 이 경우에 포함된 파라미터는 grant_type입니다. 이에 응답하여, Authorization Server는 Client에 Access Token을 전달합니다. 이 프로세스가 실패하면, 연결이 종료됩니다. 마지막으로 Client는 Resource Server에 보호된 리소스를 획득하도록 요청하고, Resource Server는 요청된 리소스를 Client에 전달합니다.`}
                      className="min-h-[10rem] w-full lg:min-h-[12rem] lg:w-[50rem]"
                    ></Textarea>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.request?.message}
                  </FormMessage>
                </FormItem>
                <Button
                  className="mt-4 w-full"
                  type="submit"
                  size="2xl"
                  variant="default"
                >
                  생성하기
                </Button>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}

export default AISequenceDiagramContainer;
