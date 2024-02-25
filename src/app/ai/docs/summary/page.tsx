import AIDocsSummaryContainer from "@/components/AI/Docs/AIDocsSummaryContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 문서 요약 & 질문",
};

function AIDocsSummaryPage() {
  return (
    <AIDocsSummaryContainer
      acceptedFileType=".pdf, .docx, .txt, .rtf"
      multiple={false}
    />
  );
}

export default AIDocsSummaryPage;
