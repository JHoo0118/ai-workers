import AIDocsSummaryAgentContainer from "@/components/AI/Docs/AIDocsSummaryAgentContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent 문서 요약 & 질문",
};

function AIDocsSummaryAgentPage() {
  return (
    <AIDocsSummaryAgentContainer
      acceptedFileType=".pdf, .docx, .txt, .rtf"
      multiple={false}
    />
  );
}

export default AIDocsSummaryAgentPage;
