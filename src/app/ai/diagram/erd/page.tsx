import AIErdContainer from "@/components/AI/Diagram/Erd/AIErdContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI ERD 생성",
};

function AIErdPage() {
  return <AIErdContainer />;
}

export default AIErdPage;
