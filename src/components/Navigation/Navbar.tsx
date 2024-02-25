"use client";

import { useAuth } from "@/context/AuthContext";
import { menus } from "@/lib/data/menu";
import Link from "next/link";
import ThemeToggleButton from "../Button/ThemeToggleButton";
import Logo from "../Logo/Logo";
import { Button } from "../ui/button";
import { DropdownIcon } from "./DropdownIcon";
import NavItem from "./NavItem";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="flex h-nav flex-1 items-center justify-between px-6">
      <Logo />
      <nav className="flex w-full items-center justify-between">
        <ul className="flex items-center gap-4 p-4">
          {menus.map((menu) => (
            <NavItem menu={menu} key={menu.id} />
          ))}
        </ul>
        {user ? (
          <div className="flex items-center justify-center">
            <DropdownIcon />
            <ThemeToggleButton />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Button className="mr-4" asChild variant="ghost">
              <Link href="/login">로그인</Link>
            </Button>
            <Button className="mr-4" asChild>
              <Link href="/signup">가입하기</Link>
            </Button>
            <ThemeToggleButton />
          </div>
        )}
      </nav>
    </div>
  );
}
