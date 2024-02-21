import AIApiGenContainer from "@/components/AI/ApiGen/AIApiGenContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI API 생성",
};

function AIApiGenPage() {
  return <AIApiGenContainer />;
}

export default AIApiGenPage;
