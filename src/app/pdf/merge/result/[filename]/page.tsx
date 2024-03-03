"use client";

import { Button } from "@/components/ui/button";
import { decodeURIComponentHelper } from "@/lib/utils/utils";
import { fileDonwload, filePublicDelete } from "@/service/file/file";
import { IsFileExistOutputs } from "@/types/file-types";
import { ArrowLeftCircle, Download, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";

interface PdfMergeResultPageProps {
  params: { filename: string };
}

export default function PdfMergeResultPage({
  params: { filename },
}: PdfMergeResultPageProps) {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<IsFileExistOutputs>(
    `/py-api/file/exist?filename=${filename}`,
    { errorRetryCount: 2 },
  );

  function onClickBackButton() {
    router.back();
  }

  async function onClickDeleteButton() {
    toast.promise(filePublicDelete({ filename }), {
      loading: "삭제 중...",
      success: (result: boolean) => {
        onClickBackButton();
        return <b>{result ? "삭제되었습니다." : "이미 삭제된 파일입니다."}</b>;
      },
      error: (error) => <b>{error}</b>,
    });
  }

  async function handleSubmitDownloadPdfFiles() {
    const blob = await fileDonwload({
      filename,
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const pFilename = decodeURIComponentHelper(filename);

    link.href = url;
    link.download = `${pFilename.split("_")[0]}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col items-center p-10">
      <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        <div
          onClick={onClickBackButton}
          className="mb-6 cursor-pointer sm:mb-0 sm:mr-10"
        >
          <ArrowLeftCircle className="h-10 w-10 transition-colors hover:text-gray-500" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-2xl sm:text-4xl">
            {isLoading
              ? "파일 확인 중..."
              : data?.isExist
                ? "PDF가 병합되었습니다!"
                : "병합된 파일을 찾을 수 없습니다."}
          </h1>
          <Button
            onClick={handleSubmitDownloadPdfFiles}
            disabled={isLoading || data?.isExist != true}
            type="button"
            size="2xl"
            variant="default"
          >
            <Download className="mr-2" /> 병합된 PDF 다운로드
          </Button>
        </div>
        <div
          onClick={onClickDeleteButton}
          className="group relative mt-6 cursor-pointer sm:ml-10 sm:mt-0"
        >
          <Button
            className="h-10 w-10 items-center justify-center rounded-full p-2 text-white transition-colors duration-150"
            variant="destructive"
          >
            <div className="absolute -bottom-6 -left-2 z-20 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-white sm:-top-6">
              파일 삭제
            </div>
            <Trash2Icon className="h-10 w-10" />
          </Button>
        </div>
      </div>
    </div>
  );
}
