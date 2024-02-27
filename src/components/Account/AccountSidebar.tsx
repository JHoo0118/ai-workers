"use client";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils/utils";
import { Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

type AccountSidebarMenus = "Settings";

interface AccountSidebarProps {
  children: React.ReactNode;
}

export default function AccountSidebar({ children }: AccountSidebarProps) {
  const [currentMenu, setCurrentMenu] =
    useState<AccountSidebarMenus>("Settings");
  const pathname = usePathname();

  const { user, logout } = useAuth();
  async function onLogout() {
    await logout();
  }

  function isSelected() {
    return pathname.includes(currentMenu.toLowerCase());
  }

  return (
    <div className="flex w-full flex-col sm:flex-row">
      <aside
        id="separator-sidebar"
        className="h-auto w-full border-r sm:h-screen sm:w-64"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto py-4">
          <ul className="space-y-2 px-3 font-medium">
            <li>
              <Link
                className={cn(
                  "group flex items-center rounded-lg p-2 text-primary-foreground transition-colors",
                  isSelected()
                    ? "rounded-lg bg-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
                href="/account/settings"
                onClick={() => setCurrentMenu("Settings")}
              >
                <Settings className="h-6 w-6" />
                <span className="ms-3 flex-1 whitespace-nowrap">Settings</span>
              </Link>
            </li>
          </ul>
          <div className="mt-4 border"></div>
          <ul className="space-y-2 px-3 pt-4 font-medium">
            <li>
              <Button
                asChild
                className="group flex cursor-pointer items-center rounded-lg p-2 text-gray-900 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={logout}
                variant="ghost"
              >
                <div>
                  <LogOut className="h-6 w-6" />
                  <span className="ms-3 flex-1 whitespace-nowrap">Log Out</span>
                </div>
              </Button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="w-full bg-gray-100 dark:bg-card">
        <div className="flex w-full items-center justify-between border-b px-4 py-4">
          <div>{currentMenu}</div>
          <Link
            className="group flex items-center rounded-lg p-2 text-gray-900 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            href="/"
          >
            <Home className="h-6 w-6" />
          </Link>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
