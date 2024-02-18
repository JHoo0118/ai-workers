import { HashLoader } from "react-spinners";

interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "작업 중입니다...",
}: LoadingProps) {
  return (
    <div className="flex h-full min-h-[20rem] flex-col items-center justify-center">
      <div className="">
        <HashLoader size={100} color="#2DD4BF" />
      </div>
      <h1 className="mt-10 text-3xl">{message}</h1>
    </div>
  );
}
