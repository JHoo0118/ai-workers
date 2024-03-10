"use client";
import withDragAndDropFiles, {
  AcceptedFile,
  DragAndDropFilesComponentProps,
  DragAndDropFilesWrappedProps,
} from "@/hoc/withDragAndDropFiles";
import useMenu from "@/hooks/useMenu";
import { cn } from "@/lib/utils/utils";
import { pdfMerge } from "@/service/pdf/pdf";
import { PdfMergeOutputs } from "@/types/pdf-types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import DragAndDropPdf from "../DragAndDrop/DragAndDropPdf";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface PdfMergeContainerProps
  extends DragAndDropFilesWrappedProps,
    DragAndDropFilesComponentProps {}

function PdfMergeContainer({
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
}: PdfMergeContainerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { title, content } = useMenu();
  async function handleSubmitMergePdfFiles(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    toast.promise(
      pdfMerge(
        files.map((acceptedFile: AcceptedFile) => acceptedFile.file),
      ).finally(() => setLoading(false)),
      {
        loading: "병합 중...",
        success: (data: PdfMergeOutputs) => {
          router.push(`/pdf/merge/result/${data.filename}`);
          return <b>PDF가 병합되었습니다.</b>;
        },
        error: (error) => <b>{error}</b>,
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
            여러 PDF 파일 선택
          </Button>
          <h3 className="mt-4 text-sm">또는 PDF를 여기에 두기</h3>
        </div>
      )}

      <DragAndDropPdf
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
        loading={loading}
        sideBarContent={
          <div className="flex h-full flex-col justify-between px-4 py-2">
            <div>
              <h1 className="mb-6 mt-2 text-3xl">{title}</h1>
              <Card className="rounded-none border-teal-400 bg-teal-400 text-black">
                <CardContent className="p-5">
                  드래그하여 원하는 대로 PDF의 순서를 변경하실 수 있습니다.
                </CardContent>
              </Card>
            </div>
            <Button
              className="mt-10"
              disabled={files?.length <= 1 || loading}
              onClick={handleSubmitMergePdfFiles}
              variant="default"
              size="2xl"
            >
              {loading && <Loader2 className="mr-4 animate-spin" />}
              병합하기
            </Button>
          </div>
        }
      />

      {dragActive && (
        <h1 className="pointer-events-none absolute z-10 flex h-full items-center justify-center text-7xl text-white">
          파일을 여기에 두세요.
        </h1>
      )}
    </div>
  );
}

export default withDragAndDropFiles(PdfMergeContainer);
