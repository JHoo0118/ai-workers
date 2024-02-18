import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "로그인",
    template: "AI Workers | %s",
  },
  description: "AI Workers",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="h-screen w-full">{children}</section>;
}
