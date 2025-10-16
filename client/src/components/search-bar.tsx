import { useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { detectSearchType } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

export function SearchBar({ variant = "compact" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const type = detectSearchType(query);
    
    if (!type) {
      toast({
        title: "Invalid search",
        description: "Please enter a valid block number, transaction hash, or address",
        variant: "destructive",
      });
      return;
    }

    switch (type) {
      case "block":
        setLocation(`/block/${query.trim()}`);
        break;
      case "transaction":
        setLocation(`/tx/${query.trim()}`);
        break;
      case "address":
        setLocation(`/address/${query.trim()}`);
        break;
    }
    
    setQuery("");
  };

  if (variant === "hero") {
    return (
      <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Block / Txn Hash / Address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-24 h-14 text-base bg-card border-card-border"
            data-testid="input-search-hero"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            data-testid="button-search-hero"
          >
            Search
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by Block / Txn Hash / Address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-3 bg-card border-card-border"
          data-testid="input-search-compact"
        />
      </div>
    </form>
  );
}
