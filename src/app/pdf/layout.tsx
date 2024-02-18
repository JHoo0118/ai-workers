import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "PDF",
    template: "Easy Work | %s",
  },
  description: "Easy Work",
};

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen-nav w-full overflow-auto">{children}</section>
  );
}
