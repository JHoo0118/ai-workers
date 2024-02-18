"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { FORWARD_URL } from "@/const/const";
import { useAuth } from "@/context/AuthContext";
import { LoginSchema, loginSchema } from "@/lib/validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const forwardUrl = searchParams.get(FORWARD_URL);
  const { login } = useAuth();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await login(
      data,
      !!!forwardUrl
        ? "/"
        : typeof forwardUrl === "string"
          ? forwardUrl
          : forwardUrl[0],
    );
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-md bg-card p-8 shadow-md dark:bg-secondary">
        <h1 className="text-3xl">AI Workers 로그인</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input type="email" {...form.register("email")} />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...form.register("password")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
            <LoadingButton
              className="w-full"
              type="submit"
              loading={form.formState.isSubmitting}
            >
              로그인
            </LoadingButton>
          </form>
        </Form>
        <h3>
          아직 계정이 없으신가요?{" "}
          <span className="cursor-pointer text-teal-400 underline">
            <Link href="/signup">회원가입</Link>
          </span>
        </h3>
      </div>
      <Button variant="link" className="mt-4">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
};

export default LoginPage;