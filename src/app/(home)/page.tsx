import GridMenuItem from "@/components/GridMenuItem";
import { gridMenus } from "@/lib/data/menu";

export default function Home() {
  return (
    <section className="flex w-full max-w-screen-2xl flex-col p-4 pt-8">
      <h1 className=" text-center text-2xl font-semibold md:text-3xl lg:text-4xl">
        다양한 AI 툴을 이용해 보세요.
      </h1>
      <span className="mb-10 mt-2 block text-center text-base font-normal text-neutral-500 dark:text-neutral-400 sm:text-xl md:mt-3">
        다양한 도구를 설치 없이 사용 가능
      </span>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {gridMenus.map((gridMenu) => (
          <GridMenuItem menu={gridMenu} key={gridMenu.id} />
        ))}
      </div>
    </section>
  );
}
