"use client";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useMenu from "@/hooks/useMenu";
import { CryptoUtils } from "@/lib/utils/crypto";
import { erdSchema } from "@/lib/validation/ai/erd/erdSchema";
import { erdGenerate } from "@/service/ai/erd/erd";
import { ErdGenereateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AIErdContainerProps {}

function AIErdContainer({}: AIErdContainerProps) {
  const { title, content } = useMenu();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof erdSchema>>({
    resolver: zodResolver(erdSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(data: z.infer<typeof erdSchema>) {
    setIsLoading(true);
    toast.promise(erdGenerate(data), {
      loading: "생성 중...",
      success: (data: ErdGenereateOutputs) => {
        const { image } = data;
        const encryptedImage = CryptoUtils.getInstance().encryptAes(image);
        router.push(`/ai/erd/result/${encryptedImage}`);
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
                      {...form.register("query")}
                      name="query"
                      placeholder={`// Example 1:\nCREATE TABLE Student_info(\n\tCollege_Id number(2),\n\tCollege_name varchar(30),\n\tBranch varchar(10)\n);\n\n // Example 2:\nSELECT Emp_Id, Emp_Salary FROM Employee;\n\n// Example 3:\nINSERT INTO Student (Stu_id, Stu_Name, Stu_Marks, Stu_Age) VALUES (104, Anmol, 89, 19);`}
                      className="min-h-[22rem] w-full lg:min-h-[26rem] lg:w-[50rem]"
                    ></Textarea>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.query?.message}
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

export default AIErdContainer;
