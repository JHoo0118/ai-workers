"use client";
import withDragAndDropFiles, {
  AcceptedFile,
  DragAndDropFilesComponentProps,
  DragAndDropFilesWrappedProps,
} from "@/hoc/withDragAndDropFiles";
import useMenu from "@/hooks/useMenu";
import { cn } from "@/lib/utils/utils";
import { pdfToWord } from "@/service/pdf/pdf";
import { PdfToWordOutputs } from "@/types/pdf-types";
import { FileInputIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DragAndDropPdf from "../DragAndDrop/DragAndDropPdf";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface PdfToWordContainerProps
  extends DragAndDropFilesWrappedProps,
    DragAndDropFilesComponentProps {}

function PdfToWordContainer({
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
}: PdfToWordContainerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { title, content } = useMenu();

  async function handleSubmitMergePdfFiles(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    toast.promise(
      pdfToWord(
        files.map((acceptedFile: AcceptedFile) => acceptedFile.file),
      ).finally(() => setLoading(false)),
      {
        loading: "변환 중...",
        success: (data: PdfToWordOutputs) => {
          router.push(`/pdf/pdf_to_word/result/${data.result[0]}`);
          return <b>PDF가 변환되었습니다.</b>;
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
            variant="default"
            onClick={openFileExplorer}
          >
            PDF 파일 선택
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
        sortable={false}
        sideBarContent={
          <div className="flex h-full flex-col justify-between px-4 py-2">
            <div>
              <h1 className="mb-6 mt-2 text-3xl">{title}</h1>
              <Card className="mb-4 rounded-none border-gray-500 bg-gray-500 text-white">
                <CardContent className="p-5">
                  DOCX 파일로 변환합니다.
                </CardContent>
              </Card>
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
              disabled={files?.length <= 0 || loading}
              onClick={handleSubmitMergePdfFiles}
              variant="default"
              size="2xl"
            >
              {loading && <Loader2 className="mr-4 animate-spin" />}
              변환하기
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

export default withDragAndDropFiles(PdfToWordContainer);
