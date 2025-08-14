import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "./theme-toggle-button";
import Link from "next/link";
import { BarChart2 } from "lucide-react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn("py-4 px-6 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50", className)}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
            <h1 className="text-xl font-bold bg-primary-gradient text-transparent bg-clip-text">
            تطبيق الفواتير
            </h1>
        </Link>
        <div className="flex items-center gap-2">
            <Link href="/stats" className="p-2 rounded-md hover:bg-accent" aria-label="الإحصائيات">
                <BarChart2 className="h-5 w-5" />
            </Link>
            <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
