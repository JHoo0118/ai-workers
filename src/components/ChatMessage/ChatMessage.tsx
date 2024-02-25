import { cn } from "@/lib/utils/utils";
import { Message } from "ai/react";

import { BotIcon, UserIcon } from "lucide-react";
import MarkdownRenderer from "../Markdown/MarkdownRenderer";

export default function ChatMessage({
  message: { role, content },
  isError,
}: {
  message: Pick<Message, "role" | "content">;
  isError?: React.ReactNode;
}) {
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "flex flex-1 items-start gap-3 py-8 pl-6 pr-10 text-sm ",
        isAiMessage
          ? "bg-gray-300 dark:bg-secondary"
          : "bg-gray-200 dark:bg-card",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-2",
          isAiMessage
            ? "bg-gray-100 dark:bg-card"
            : "bg-blue-200 dark:bg-primary",
        )}
      >
        {isAiMessage ? (
          <BotIcon className="h-6 w-6" />
        ) : (
          <UserIcon className="h-6 w-6" />
        )}
      </div>

      {!!isError ? (
        <div className="flex flex-row">
          <div className="mr-4 flex flex-col items-start justify-start">
            <span className="block font-bold">
              {isAiMessage ? "AI Workers 봇" : "나"}
            </span>
            <p className="whitespace-pre-line break-all text-left">{content}</p>
          </div>
          {isError}
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start">
          <span className="block font-bold">
            {isAiMessage ? "AI Workers 봇" : "나"}
          </span>
          <p className="whitespace-pre-line break-all text-left">
            <MarkdownRenderer markdown={content} />
          </p>
        </div>
      )}
    </div>
  );
}
