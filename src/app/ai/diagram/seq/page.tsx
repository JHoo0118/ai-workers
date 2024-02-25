import AISequenceDiagramContainer from "@/components/AI/Diagram/SequenceDiagram/AISequenceDiagramContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sequence Diagram 생성",
};

function AIErdPage() {
  return <AISequenceDiagramContainer />;
}

export default AIErdPage;
