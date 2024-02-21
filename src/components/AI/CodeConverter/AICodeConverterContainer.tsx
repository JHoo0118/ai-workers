"use client";
import CodeEditor from "@/components/AceEditor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useMenu from "@/hooks/useMenu";
import { lang } from "@/lib/data/convertLang";
import { codeConvertSchema } from "@/lib/validation/ai/codeConverter/codeConverterSchema";
import { codeConvertGenerate } from "@/service/ai/codeConvert/codeConvert";
import { CodeConvertGenereateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { z } from "zod";

interface AICodeConverterContainerProps {}

function AICodeConverterContainer({}: AICodeConverterContainerProps) {
  const { title, content } = useMenu();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>("");
  const [targetCodeInput, setTargetCodeInput] = useState<string>("");
  const form = useForm<z.infer<typeof codeConvertSchema>>({
    resolver: zodResolver(codeConvertSchema),
    defaultValues: {
      code: codeInput,
      codeType: "python",
      targetCodeType: "java",
    },
  });

  async function onSubmit(data: z.infer<typeof codeConvertSchema>) {
    data.code = codeInput;
    console.log(data);
    if (data.code.length === 0) {
      toast.error("코드를 입력해 주세요.");
      return;
    }
    if (data.codeType === data.targetCodeType) {
      toast.error("변환할 언어와 변환하고 싶은 언어는 다르게 설정해 주세요.");
      return;
    }
    setIsLoading(true);
    setTargetCodeInput("");
    toast.promise(codeConvertGenerate(data), {
      loading: "변환 중...",
      success: (data: CodeConvertGenereateOutputs) => {
        const { result } = data;
        setTargetCodeInput(result);
        setIsLoading(false);
        return <b>코드가 변환되었습니다.</b>;
      },
      error: (error) => {
        setIsLoading(false);
        return <b>{error}</b>;
      },
    });
  }

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="flex flex-col items-center px-10 pb-2 pt-10">
        <h1 className="text-4xl">{title}</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
      </div>
      <div className="mx-auto w-full px-4 py-0 lg:w-auto lg:min-w-[62rem] lg:p-10 xl:min-w-[76rem]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col justify-center sm:flex-row">
              <FormItem className="mb-5 mr-0 flex-1 sm:mb-0 sm:mr-10">
                <FormControl>
                  <div className="flex min-h-[22rem] flex-col items-start justify-between lg:min-h-[26rem]">
                    <FormField
                      control={form.control}
                      name="codeType"
                      render={({ field }) => (
                        <FormItem className="mb-2 w-1/2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="변환할 언어" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {lang.map((l) => (
                                <SelectItem key={l.label} value={l.value}>
                                  {l.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <CodeEditor
                      placeholder={`Your input code here.\n\nExample\n# Program to perform different set operations like in mathematics\n\n# define three sets
E = {0, 2, 4, 6, 8};
N = {1, 2, 3, 4, 5};

# set union
print("Union of E and N is",E | N)

# set intersection
print("Intersection of E and N is",E & N)

# set difference
print("Difference of E and N is",E - N)`}
                      onChange={setCodeInput}
                      language={form.getValues("codeType")}
                      value={codeInput}
                    />
                  </div>
                </FormControl>
              </FormItem>
              <div className="relative flex min-h-[22rem] flex-1 flex-col items-start justify-between lg:min-h-[26rem] lg:w-[50rem]">
                <FormField
                  control={form.control}
                  name="targetCodeType"
                  render={({ field }) => (
                    <FormItem className="mb-2 w-1/2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="변환할 언어" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lang.map((l) => (
                            <SelectItem key={l.label} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <CodeEditor
                  readOnly={true}
                  language={form.getValues("targetCodeType")}
                  value={targetCodeInput}
                />
                {isLoading && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1.5 transform">
                    <HashLoader size={100} color="#2DD4BF" />
                  </div>
                )}

                {/* <div className="h-full w-full rounded-md border"></div> */}
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              type="submit"
              size="2xl"
              variant="default"
              disabled={isLoading}
            >
              변환하기
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AICodeConverterContainer;
