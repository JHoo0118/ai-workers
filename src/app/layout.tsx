import SWRConfigContext from "@/context/SWRConfigContext";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

import MainHeader from "@/components/Header/MainHeader";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AI Workers",
    template: "AI Workers | %s",
  },
  description: "AI Workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.className}>
      <body className="w-full overflow-auto">
        <AuthProvider>
          <ThemeProvider attribute="class">
            <MainHeader />
            <main className="w-full">
              <Toaster position="top-center" />
              <SWRConfigContext>{children}</SWRConfigContext>
            </main>
            <div id="portal" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
