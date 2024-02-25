import AISqlEntityContainer from "@/components/AI/Code/SqlEntity/AISqlEntityContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI API 생성",
};

function AISqlEntityPage() {
  return <AISqlEntityContainer />;
}

export default AISqlEntityPage;
