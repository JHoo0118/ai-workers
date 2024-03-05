"use client";
import CodeEditor from "@/components/AceEditor/CodeEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useMenu from "@/hooks/useMenu";
import { framework, getLangByFramework } from "@/lib/data/framework";
import { cn } from "@/lib/utils/utils";
import { apiGenSchema } from "@/lib/validation/ai/code/apiGen/apiGenSchema";
import { apiGenerate } from "@/service/ai/code/apiGen/apiGen";
import { ApiGenGenerateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { z } from "zod";

interface AIApiGenContainerProps {}

function AIApiGenContainer({}: AIApiGenContainerProps) {
  const { title, content } = useMenu();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const form = useForm<z.infer<typeof apiGenSchema>>({
    resolver: zodResolver(apiGenSchema),
    defaultValues: {
      input: "",
      framework: "FastAPI",
    },
  });
  const resultSectionRef = useRef<HTMLDivElement>(null);

  async function onSubmit(data: z.infer<typeof apiGenSchema>) {
    setIsLoading(true);
    setGeneratedCode("");
    toast.promise(apiGenerate(data), {
      loading: "생성 중입니다...시간이 1분 정도 소요될 수 있습니다.",
      success: (data: ApiGenGenerateOutputs) => {
        const { backendCode } = data;
        setIsLoading(false);
        setGeneratedCode(backendCode);
        return <b>코드가 생성되었습니다.</b>;
      },
      error: (error) => {
        setIsLoading(false);
        return <b>{error}</b>;
      },
    });
  }

  useEffect(() => {
    if (generatedCode.trim().length > 0) {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [generatedCode]);

  return (
    <>
      <div className="relative flex h-full flex-col items-center">
        <div className="flex flex-col items-center px-10 py-4 pt-10">
          <h1 className="text-4xl">{title}</h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
        </div>
        <div className="mx-auto w-full px-4 py-0 md:min-w-[50rem] lg:w-auto lg:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem className="mb-2 w-1/2">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="프레임워크" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {framework.map((f) => (
                          <SelectItem key={f.label} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormItem>
                <FormControl>
                  <Textarea
                    {...form.register("input")}
                    name="input"
                    placeholder={`// Example:\nCreate something that stores crypto price data in a database`}
                    className="min-h-[10rem] w-full resize-none"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.input?.message}
                </FormMessage>
              </FormItem>
              <Button
                className="mt-4 w-full"
                type="submit"
                size="2xl"
                variant="default"
                disabled={isLoading}
              >
                생성하기
              </Button>
            </form>
          </Form>
          {isLoading && (
            <div className="mt-20 flex justify-center">
              <HashLoader size={100} color="#2DD4BF" />
            </div>
          )}
          {generatedCode.trim().length !== 0 && (
            <div className="mt-24 flex justify-center">
              <ArrowDownCircleIcon
                className="animate-bounce cursor-pointer"
                size={100}
                color="#2DD4BF"
                onClick={() =>
                  resultSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
      <section
        ref={resultSectionRef}
        className={cn(
          "h-screen-nav",
          generatedCode.trim().length === 0 && "hidden",
        )}
      >
        <div className="m-auto flex h-full w-full md:items-center lg:w-2/3">
          <CodeEditor
            height="42rem"
            readOnly={true}
            language={getLangByFramework(form.getValues("framework"))}
            value={generatedCode}
          />
        </div>
      </section>
    </>
  );
}

export default AIApiGenContainer;
