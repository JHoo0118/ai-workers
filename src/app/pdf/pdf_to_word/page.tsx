import PdfToWordContainer from "@/components/Pdf/PdfToWordContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF에서 WORD로 문서 변환",
};

export default function PdfToWordPage() {
  return (
    <PdfToWordContainer
      acceptedFileType=".pdf"
      maxAllowedFileCount={1}
      multiple={false}
    />
  );
}
