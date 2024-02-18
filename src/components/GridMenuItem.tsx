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
      <Card className="min-h-60 bg-gray-100 dark:bg-card">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
