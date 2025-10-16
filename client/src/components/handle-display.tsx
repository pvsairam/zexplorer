import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HandleDisplayProps {
  handle: string;
}

export function HandleDisplay({ handle }: HandleDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(handle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 bg-encrypted/5 dark:bg-encrypted-dark/5 border border-encrypted/20 dark:border-encrypted-dark/20 rounded-md px-3 py-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-mono text-sm text-encrypted dark:text-encrypted-dark" data-testid="text-handle">
            {handle}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Encrypted handle - request decryption to view value</p>
        </TooltipContent>
      </Tooltip>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover-elevate active-elevate-2"
        onClick={copyToClipboard}
        data-testid="button-copy-handle"
      >
        {copied ? (
          <Check className="h-3 w-3 text-success" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
