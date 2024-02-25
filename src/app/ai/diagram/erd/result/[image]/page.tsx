"use client";

import { Button } from "@/components/ui/button";
import { CryptoUtils } from "@/lib/utils/crypto";
import { ArrowLeftIcon, Download } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ErdResultPageProps {
  params: { image: string };
}

export default function ErdResultPage({
  params: { image: encryptedImage },
}: ErdResultPageProps) {
  const router = useRouter();
  const [prevImage, setPrevImage] = useState<string>("");

  useEffect(() => {
    if (encryptedImage.length > 0) {
      const result = CryptoUtils.getInstance().decryptAes(encryptedImage);
      setPrevImage(result);
    }
  }, [encryptedImage]);

  function handleSubmitDownloadImageButton() {
    fetch(prevImage)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const pFilename = uuidv4();

        link.href = url;
        link.download = `${pFilename.split("-")[0]}.png`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  function back() {
    router.back();
  }

  return (
    <div className="flex h-full flex-col items-center p-10">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="mb-4 text-2xl sm:text-4xl">
            ERD 이미지가 생성되었습니다.
          </h1>
          {prevImage.length > 0 && (
            <Image
              className="mb-10"
              src={prevImage}
              alt="ERD image"
              width={400}
              height={300}
            />
          )}
          <div className="flex flex-col sm:flex-row">
            <Button
              className="mb-4 sm:mr-4"
              onClick={back}
              type="button"
              size="2xl"
              variant="ghost"
            >
              <ArrowLeftIcon className="mr-2" /> 다시 만들기
            </Button>
            <Button
              onClick={handleSubmitDownloadImageButton}
              disabled={!!!prevImage}
              type="button"
              size="2xl"
              variant="default"
              className="mb-4"
            >
              <Download className="mr-2" /> ERD 다운로드
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
