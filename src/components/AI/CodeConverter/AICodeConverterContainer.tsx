"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useMenu from "@/hooks/useMenu";
import { codeConvertSchema } from "@/lib/validation/ai/codeConverter/codeConverter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AICodeConverterContainerProps {}

function AICodeConverterContainer({}: AICodeConverterContainerProps) {
  const { title, content } = useMenu();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof codeConvertSchema>>({
    resolver: zodResolver(codeConvertSchema),
    defaultValues: {
      code: "",
      codeType: "",
      targetCodeType: "",
    },
  });

  async function onSubmit(data: z.infer<typeof codeConvertSchema>) {
    console.log(data);
    // setIsLoading(true);
    // toast.promise(erdGenerate(data), {
    //   loading: "생성 중...",
    //   success: (data: ErdGenereateOutputs) => {
    //     const { image } = data;
    //     const encryptedImage = CryptoUtils.getInstance().encryptAes(image);
    //     router.push(`/ai/erd/result/${encryptedImage}`);
    //     return <b>이미지가 생성되었습니다.</b>;
    //   },
    //   error: (error) => {
    //     setIsLoading(false);
    //     return <b>{error}</b>;
    //   },
    // });
  }

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="flex flex-col items-center px-10 pb-2 pt-10">
        <h1 className="text-4xl">{title}</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
      </div>
      <div className="mx-auto w-full px-4 py-0 lg:w-auto lg:p-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col justify-center sm:flex-row">
              <FormItem className="mb-5 mr-0 flex-1 sm:mb-0 sm:mr-10">
                <FormControl>
                  <div className="flex min-h-[22rem] flex-col items-center lg:min-h-[26rem]">
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
                              <SelectItem value="Python">Python</SelectItem>
                              <SelectItem value="Java">Java</SelectItem>
                              <SelectItem value="Go">Go</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <Textarea
                      {...form.register("code")}
                      name="query"
                      placeholder={`# Program to perform different set operations like in mathematics

# define three sets
E = {0, 2, 4, 6, 8};
N = {1, 2, 3, 4, 5};

# set union
print("Union of E and N is",E | N)

# set intersection
print("Intersection of E and N is",E & N)

# set difference
print("Difference of E and N is",E - N)

# set symmetric difference
print("Symmetric difference of E and N is",E ^ N)`}
                      className="min-h-[22rem] lg:min-h-[26rem]"
                    ></Textarea>
                  </div>
                </FormControl>
                {/* <FormMessage>{form.formState.errors.code?.message}</FormMessage> */}
              </FormItem>
              <div className="flex min-h-[22rem] flex-1 flex-col items-center lg:min-h-[26rem] lg:w-[50rem]">
                <div>1</div>
                <div className="h-full w-full rounded-md border"></div>
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              type="submit"
              size="2xl"
              variant="default"
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
