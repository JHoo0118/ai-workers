"use client";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import ChatMessageLoading from "@/components/ChatMessage/ChatMessageLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACCESS_TOKEN } from "@/const/const";
import useMenu from "@/hooks/useMenu";
import { isAuthenticated } from "@/lib/utils/auth";
import { cn } from "@/lib/utils/utils";
import { refreshTokens } from "@/service/auth/auth";
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import { getCookie } from "cookies-next";
import { StopCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AIDBSqlContainerProps {}

function AIDBSqlContainer({}: AIDBSqlContainerProps) {
  const { title, content } = useMenu();
  const [loading, setLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleSubmitWrapper(
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) {
    e.preventDefault();
    const ok: boolean = await isAuthenticated();
    try {
      if (ok) {
        setIsStreaming(true);
        handleSubmit(e, {
          options: {
            headers: {
              Connection: "keep-alive",
              "Cache-Control": "no-cache, no-transform",
              Authorization: `Bearer ${getCookie(ACCESS_TOKEN) ?? ""}`,
            },
          },
        });
      } else {
        throw error?.message || "오류가 발생했습니다.";
      }
    } catch (error: any) {}
  }

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    stop,
    reload,
  } = useChat({
    api: `/py-api/ai/db/sql/generate`,
    headers: {
      Authorization: `Bearer ${getCookie(ACCESS_TOKEN) ?? ""}`,
    },
    onError: (error: Error) => {
      setIsStreaming(false);
    },
    onResponse: async (response) => {
      if (response.status === 409) {
        try {
          await refreshTokens();
          return;
        } catch {}
      }
    },
    onFinish: (message: Message) => {
      setIsStreaming(false);
    },
  });

  useEffect(() => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        content: "DB 설계 및 디자인 전문가입니다. 무엇을 도와드릴까요?",
      },
    ]);
  }, [setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function onStop() {
    setIsStreaming(false);
    stop();
  }

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";
  const buttonOneRef = useRef<HTMLButtonElement>(null);
  const buttonTwoRef = useRef<HTMLButtonElement>(null);
  const buttonThirdRef = useRef<HTMLButtonElement>(null);

  function onClickExampleButton(number: number) {
    if (number === 1) {
      setInput(buttonOneRef.current?.innerHTML!);
    } else if (number === 2) {
      setInput(buttonTwoRef.current?.innerHTML!);
    } else {
      setInput(buttonThirdRef.current?.innerHTML!);
    }
  }

  return (
    <div className="relative flex h-full flex-col sm:flex-row">
      <div className="flex flex-col items-center px-10 py-4 pt-10 xl:min-w-[32rem]">
        <h1 className="text-4xl">{title}</h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
        <div className="flex flex-col items-center">
          <Button
            ref={buttonOneRef}
            className="w-100 mt-10 whitespace-normal rounded-full"
            variant="secondary"
            onClick={() => onClickExampleButton(1)}
          >
            Create a e-commerce database architecture
          </Button>
          <Button
            ref={buttonTwoRef}
            className="w-100 mt-4 whitespace-normal rounded-full"
            variant="secondary"
            onClick={() => onClickExampleButton(2)}
          >
            Create a SNS like Instagram database architecture
          </Button>
          <Button
            ref={buttonThirdRef}
            className="w-100 mt-4 whitespace-normal rounded-full"
            variant="secondary"
            onClick={() => onClickExampleButton(3)}
          >
            Create a database architecture of OTT such as Netflix and include
            subscription exipred date, regular payment, credit card info and so
            on
          </Button>
        </div>
      </div>
      <div className="my-0 w-full">
        <div className="mx-auto flex max-h-full min-h-full w-full max-w-[120rem] flex-col justify-between rounded-lg bg-gray-100 dark:bg-neutral-800 sm:w-full md:w-full lg:w-full">
          <div ref={scrollRef} className="relative overflow-y-auto">
            {messages.map((message) => (
              <ChatMessage message={message} key={message.id} />
            ))}
            {isLoading && lastMessageIsUser && <ChatMessageLoading />}
            {error && (
              <ChatMessage
                message={{
                  role: "assistant",
                  content: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                }}
              />
            )}
          </div>
          <div className="flex items-center p-6">
            <form
              onSubmit={handleSubmitWrapper}
              className="flex w-full items-center justify-center space-x-2"
            >
              <Input
                className="focus-visible:ring-1"
                value={input}
                onChange={handleInputChange}
                placeholder="메시지를 입력해 주세요."
              />

              <Button
                className={cn("", isStreaming && "hidden")}
                type="submit"
                disabled={isStreaming || isLoading || input?.length === 0}
              >
                보내기
              </Button>
              <Button
                className={cn(
                  "bg-gray-600 text-white hover:bg-gray-700",
                  !isStreaming && "hidden",
                )}
                onClick={onStop}
                disabled={!isStreaming}
                type="button"
                variant="ghost"
              >
                <StopCircleIcon className="h-6 w-6" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIDBSqlContainer;
