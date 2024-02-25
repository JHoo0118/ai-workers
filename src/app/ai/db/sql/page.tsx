import AIDBSqlContainer from "@/components/AI/DB/SQL/AIDBSqlContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI DB 설계 및 디자인",
};

function AIDBSqlPage() {
  return <AIDBSqlContainer />;
}

export default AIDBSqlPage;
