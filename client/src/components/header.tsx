import { Link } from "wouter";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import { Box } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-home">
            <Box className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Zama Explorer</span>
          </Link>
          
          <div className="flex-1 flex items-center justify-center px-4">
            <SearchBar variant="compact" />
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
