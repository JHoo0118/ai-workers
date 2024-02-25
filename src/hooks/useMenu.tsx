import { Menu, gridMenus } from "@/lib/data/menu";
import { usePathname } from "next/navigation";

export default function useMenu() {
  const pathname = usePathname();
  return gridMenus.find((menu: Menu) => pathname === menu.href)!;
}
