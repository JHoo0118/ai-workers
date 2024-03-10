"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import withDragAndDropFiles, {
  DragAndDropFilesComponentProps,
  DragAndDropFilesWrappedProps,
} from "@/hoc/withDragAndDropFiles";
import useMenu from "@/hooks/useMenu";
import { cn } from "@/lib/utils/utils";
import { docsSummaryAgent } from "@/service/ai/docs/summary";
import { Message } from "ai/react";
import { FileInputIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DragAndDropAIDocsSummaryAgentFile from "./DragAndDropAIDocsSummaryAgentFile";

interface AIDocsSummaryAgentContainerProps
  extends DragAndDropFilesWrappedProps,
    DragAndDropFilesComponentProps {}

function AIDocsSummaryAgentContainer({
  dragActive,
  inputRef,
  files,
  setFiles,
  openFileExplorer,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  removeFile,
  acceptedFileType,
  multiple = true,
}: AIDocsSummaryAgentContainerProps) {
  const { title, content } = useMenu();
  const [loading, setLoading] = useState<boolean>(false);
  const [completedFile, setCompletedFile] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSubmitAIDocsSummary(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    toast.promise(
      docsSummaryAgent(files[0].file).finally(() => setLoading(false)),
      {
        loading: "요약 중...",
        success: () => {
          setMessages([
            {
              id: "0",
              role: "assistant",
              content: "준비가 완료되었습니다. 이제 질문해 주세요.",
            },
          ]);
          setCompletedFile(true);
          return <b>문서가 요약되었습니다.</b>;
        },
        error: (error) => {
          setCompletedFile(false);
          return <b>{error}</b>;
        },
      },
    );
  }

  return (
    <div className="relative flex h-full justify-center">
      {files?.length === 0 && (
        <div className="flex flex-col items-center p-10">
          <h1 className="text-4xl">{title}</h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          <Button
            className={cn("mt-4 min-w-80", !dragActive && "z-10")}
            type="button"
            size="2xl"
            onClick={openFileExplorer}
            variant="default"
          >
            PDF, DOCX, TXT 파일 선택
          </Button>
          <h3 className="mt-4 text-sm">또는 파일을 여기에 두기</h3>
        </div>
      )}

      <DragAndDropAIDocsSummaryAgentFile
        dragActive={dragActive}
        inputRef={inputRef}
        files={files}
        setFiles={setFiles}
        handleChange={handleChange}
        handleDrop={handleDrop}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDragEnter={handleDragEnter}
        removeFile={removeFile}
        acceptedFileType={acceptedFileType}
        completedFile={completedFile}
        setCompletedFile={setCompletedFile}
        messages={messages}
        sideBarContent={
          files &&
          files.length > 0 && (
            <div className="flex h-full flex-col justify-between px-4 py-2">
              <div className="mb-10 sm:mb-0">
                <h1 className="mb-6 mt-2 text-3xl">{title}</h1>
                <Card className="mb-4">
                  <CardContent className="p-5">
                    {files[0].file.name}
                  </CardContent>
                </Card>
                <input
                  placeholder="fileInput"
                  className="hidden"
                  ref={inputRef}
                  type="file"
                  multiple={false}
                  onChange={(e) => {
                    handleChange(e);
                    setCompletedFile(false);
                  }}
                  accept={acceptedFileType}
                />
                <Button
                  className="w-full"
                  type="button"
                  size="lg"
                  onClick={openFileExplorer}
                  disabled={loading}
                >
                  <FileInputIcon className="mr-2 h-4 w-4" />
                  파일 변경
                </Button>
              </div>
              <Button
                className="mt-10"
                disabled={files?.length === 0 || loading}
                onClick={handleSubmitAIDocsSummary}
                size="2xl"
                variant="default"
              >
                {loading && <Loader2 className="mr-4 animate-spin" />}
                요약하기
              </Button>
            </div>
          )
        }
      />

      {dragActive && files && files.length === 0 && (
        <h1 className="pointer-events-none absolute z-10 flex h-full items-center justify-center text-7xl text-white">
          파일을 여기에 두세요.
        </h1>
      )}
    </div>
  );
}

export default withDragAndDropFiles(AIDocsSummaryAgentContainer);
