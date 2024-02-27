"use client";

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
import { ProfileSchema, profileSchema } from "@/lib/validation/profileSchema";
import { updateUser } from "@/service/user/user";
import { UpdateUserOutputs } from "@/types/user-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SettingsContainer() {
  const { user, renewalUser } = useAuth();
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileSchema) => {
    toast.promise(updateUser(data), {
      loading: "업데이트 중입니다...",
      success: (data: UpdateUserOutputs) => {
        const resultUser = data;
        renewalUser(resultUser);
        form.setValue("username", user?.username ?? "");
        return <b>성공적으로 업데이트 되었습니다.</b>;
      },
      error: (error) => {
        return <b>{error}</b>;
      },
    });
  };

  useEffect(() => {
    form.setValue("email", user?.email ?? "");
    form.setValue("username", user?.username ?? "");
  }, [form, user?.email, user?.username]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 max-w-[30rem] space-y-6"
      >
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...form.register("email")} disabled readOnly />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input type="username" {...form.register("username")} />
          </FormControl>
          <FormMessage>{form.formState.errors.username?.message}</FormMessage>
        </FormItem>

        <LoadingButton
          type="submit"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
        >
          저장
        </LoadingButton>
      </form>
    </Form>
  );
}
