"use client";

import { HashLoader } from "react-spinners";

export default function FullScreenLoading() {
  return (
    <div className="fixed left-0 top-0 z-50 block h-full w-full bg-neutral-800 opacity-75">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <HashLoader size={100} color="#2DD4BF" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
