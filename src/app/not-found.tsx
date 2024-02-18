import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Page404: React.FC = () => (
  <div className="nc-Page404">
    <div className="container relative py-16 lg:py-20">
      {/* HEADER */}
      <header className="mx-auto max-w-2xl space-y-7 text-center">
        <h2 className="text-7xl md:text-8xl">🪔</h2>
        <h1 className="text-8xl font-semibold tracking-widest md:text-9xl">
          404
        </h1>
        <span className="block text-sm font-medium tracking-wider text-neutral-800 sm:text-base dark:text-neutral-200">
          {`페이지를 찾을 수 없습니다.`}
        </span>
        <Button variant="link" className="mt-4">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </header>
    </div>
  </div>
);

export default Page404;
