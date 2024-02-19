import AICodeConverterContainer from "@/components/AI/CodeConverter/AICodeConverterContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 코드 변환",
};

function AICodeConverter() {
  return <AICodeConverterContainer />;
}

export default AICodeConverter;
