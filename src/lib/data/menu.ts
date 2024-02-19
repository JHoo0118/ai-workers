import { Route } from "@/routers/types";

export interface Menu {
  id: string;
  title: string;
  content: string;
  href: Route;
  targetBlank?: boolean;
  children?: Menu[];
  type?: "dropdown" | "megaMenu" | "none";
  isNew?: boolean;
}

const pdfMenus: Menu[] = [
  {
    id: "pc1",
    title: "PDF 합치기",
    content: "원하는대로 PDF를 병합하세요.",
    href: "/pdf/merge",
  },
  {
    id: "pc2",
    title: "PDF WORD 변환",
    content: "PDF에서 WORD로 문서를 변환하세요.",
    href: "/pdf/pdf_to_word",
  },
];

const AIMenus: Menu[] = [
  {
    id: "aic1",
    title: "AI 문서 요약",
    content:
      "AI가 원하는 문서를 요약해 줍니다. AI에게 요약된 문서에 대해 질문해 보세요.",
    href: "/ai/docs/summary",
  },
  {
    id: "aic2",
    title: "AI ERD 이미지 생성",
    content: "DDL, DML문을 작성하시면 ERD 이미지를 생성합니다.",
    href: "/ai/erd",
  },
  {
    id: "aic3",
    title: "AI Code 변환",
    content: "변환할 코드와 언어를 선택하면 코드를 변경해 줍니다.",
    href: "/ai/codeconvert",
  },
  {
    id: "aic4",
    title: "AI Backend Code 생성  ",
    content: "원하는대로 백엔드 코드를 생성해 줍니다.",
    href: "/ai/apigen",
  },
];

export const gridMenus: Menu[] = [...pdfMenus, ...AIMenus];

export const menus: Menu[] = [
  {
    id: "p1",
    title: "PDF",
    content: "PDF",
    href: "/pdf/merge",
    type: "dropdown",
    children: [...pdfMenus],
  },
  {
    id: "ai1",
    title: "AI",
    content: "AI",
    href: "/ai/docs/summary",
    type: "dropdown",
    children: [...AIMenus],
  },
];
