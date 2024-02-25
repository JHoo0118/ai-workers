import { Menu } from "@/lib/data/menu";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GridMenuItemProps {
  menu: Menu;
}

export default function GridMenuItem({
  menu: { title, content, href },
}: GridMenuItemProps) {
  return (
    <Link href={href}>
      <Card className="flex min-h-60 flex-col justify-between bg-gray-100 dark:bg-card">
        <CardHeader>
          <CardTitle className="line-clamp-3">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
