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
import useMenu from "@/hooks/useMenu";
import { framework, getLangByFramework } from "@/lib/data/framework";
import { cn } from "@/lib/utils/utils";
import { sqlToEntitySchema } from "@/lib/validation/ai/code/sqlEntity/sqlEntitySchema";
import { sqlToEntity } from "@/service/ai/code/sqlEntity/sqlEntity";
import { SqlToEntityOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { z } from "zod";

interface AISqlEntityContainerProps {}

function AISqlEntityContainer({}: AISqlEntityContainerProps) {
  const { title, content } = useMenu();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sqlInput, setSqlInput] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const form = useForm<z.infer<typeof sqlToEntitySchema>>({
    resolver: zodResolver(sqlToEntitySchema),
    defaultValues: {
      sql: sqlInput,
      framework: "FastAPI",
    },
  });
  const resultSectionRef = useRef<HTMLDivElement>(null);

  async function onSubmit(data: z.infer<typeof sqlToEntitySchema>) {
    data.sql = sqlInput;
    if (data.sql.length === 0) {
      toast.error("필수 항목입니다.");
      return;
    }
    setIsLoading(true);
    setGeneratedCode("");
    toast.promise(sqlToEntity(data), {
      loading: "생성 중입니다...",
      success: (data: SqlToEntityOutputs) => {
        const { result } = data;
        setIsLoading(false);
        setGeneratedCode(result);
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
                  <CodeEditor
                    height="16rem"
                    placeholder={`// Example:\nCREATE TABLE Persons (
  PersonID int,
  LastName varchar(255),
  FirstName varchar(255),
  Address varchar(255),
  City varchar(255)
)`}
                    onChange={setSqlInput}
                    language={"sql"}
                    value={sqlInput}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.sql?.message}</FormMessage>
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
            <div className="mt-12 flex justify-center">
              <HashLoader size={100} color="#2DD4BF" />
            </div>
          )}
          {generatedCode.trim().length !== 0 && (
            <div className="mt-12 flex justify-center">
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
        <div className="group relative m-auto flex h-full w-full transition-opacity md:items-center lg:w-2/3">
          <CodeEditor
            height="42rem"
            readOnly={true}
            language={getLangByFramework(form.getValues("framework"))}
            value={generatedCode}
          />
          {/* <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100">
            123
          </div> */}
        </div>
      </section>
    </>
  );
}

export default AISqlEntityContainer;
