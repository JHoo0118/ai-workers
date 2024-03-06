import PdfMergeContainer from "@/components/Pdf/PdfMergeContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 합치기",
};

export default function PdfMergePage() {
  return <PdfMergeContainer acceptedFileType=".pdf" maxAllowedFileCount={10} />;
}
