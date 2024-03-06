import Footer from "@/components/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Policy",
    template: "AI Workers | %s",
  },
  description: "AI Workers",
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <Footer />
    </section>
  );
}
