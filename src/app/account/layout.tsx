import AccountSidebar from "@/components/Account/AccountSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "계정",
    template: "AI Workers | %s",
  },
  description: "AI Workers",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountSidebar>{children}</AccountSidebar>;
}
