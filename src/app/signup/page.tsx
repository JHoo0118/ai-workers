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
import { useAuth } from "@/context/AuthContext";
import { SignupSchema, signupSchema } from "@/lib/validation/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

const SignupPage = () => {
  const { signup } = useAuth();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    await signup(data);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-md bg-card p-8 shadow-md dark:bg-secondary">
        <h1 className="text-3xl">AI Workers 회원가입</h1>
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
              <FormLabel>사용자명</FormLabel>
              <FormControl>
                <Input type="username" {...form.register("username")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.username?.message}
              </FormMessage>
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
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" {...form.register("confirmPassword")} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.confirmPassword?.message}
              </FormMessage>
            </FormItem>
            <LoadingButton
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              계정 생성
            </LoadingButton>
          </form>
        </Form>
        <h3>
          이미 계정이 있으신가요?{" "}
          <span className="cursor-pointer text-teal-400 underline">
            <Link href="/login">로그인</Link>
          </span>
        </h3>
      </div>
      <Button variant="link" className="mt-4">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
};

export default SignupPage;
