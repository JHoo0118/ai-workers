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

const AIDocsMenus: Menu[] = [
  {
    id: "aidocsc1",
    title: "AI 문서 요약 & 질문",
    content:
      "AI가 원하는 문서를 요약해 줍니다. AI에게 요약된 문서에 대해 질문해 보세요.",
    href: "/ai/docs/summary",
  },
  {
    id: "aidocsc2",
    title: "AI 문서 요약 & 질문 (Agent)",
    content:
      "문서 요약 Agent가 원하는 문서를 요약해 줍니다. 요약된 문서에 대해 질문해 보세요.",
    href: "/ai/docs/summary-agent",
  },
];

const AIDiagramsMenus: Menu[] = [
  {
    id: "aidiagramsc1",
    title: "AI ERD 이미지 생성",
    content: "DDL, DML문을 작성하시면 ERD 이미지를 생성합니다.",
    href: "/ai/diagram/erd",
  },
  {
    id: "aidiagramsc2",
    title: "AI Sequence Diagram 이미지 생성  ",
    content: "주어진 상황에 맞는 Sequence Diagram을 생성합니다.",
    href: "/ai/diagram/seq",
  },
];

const AICodeMenus: Menu[] = [
  {
    id: "aicodec1",
    title: "AI Code 변환",
    content: "변환할 코드와 언어를 선택하면 코드를 변경해 줍니다.",
    href: "/ai/code/codeconvert",
  },
  {
    id: "aicodec2",
    title: "AI Backend Code 생성  ",
    content: "원하는대로 백엔드 코드를 생성해 줍니다.",
    href: "/ai/code/apigen",
  },
  {
    id: "aicodec3",
    title: "AI Entity Code 생성  ",
    content: "SQL문을 입력하시면 Entity Code를 생성해 줍니다.",
    href: "/ai/code/sqlentity",
  },
];

const AIDbMenus: Menu[] = [
  {
    id: "aidbc1",
    title: "AI DB 설계 및 디자인",
    content: "원하는대로 DB 설계와 디자인을 도와줍니다. ",
    href: "/ai/db/sql",
  },
];

const AIMenus: Menu[] = [
  ...AIDocsMenus,
  ...AIDiagramsMenus,
  ...AICodeMenus,
  ...AIDbMenus,
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
    title: "AI Documents",
    content: "AI Documents",
    href: "/ai/docs/summary",
    type: "dropdown",
    children: [...AIDocsMenus],
  },
  {
    id: "ai2",
    title: "AI Diagrams",
    content: "AI Diagrams",
    href: "/ai/diagram/erd",
    type: "dropdown",
    children: [...AIDiagramsMenus],
  },
  {
    id: "ai3",
    title: "AI Codes",
    content: "AI Codes",
    href: "/ai/code/codeconvert",
    type: "dropdown",
    children: [...AICodeMenus],
  },
  {
    id: "ai4",
    title: "AI DB",
    content: "AI DB",
    href: "/ai/db/sql",
    type: "dropdown",
    children: [...AIDbMenus],
  },
];
