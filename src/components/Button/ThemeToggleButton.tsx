import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => {
        if (theme === "dark") {
          setTheme("light");
          toast("라이트 모드로 변경되었습니다.", { icon: "☀️" });
        } else {
          setTheme("dark");
          toast("다크 모드로 변경되었습니다.", {
            icon: "🌙",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="dark: absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
