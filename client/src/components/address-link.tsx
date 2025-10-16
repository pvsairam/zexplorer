import { Link } from "wouter";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatHash } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AddressLinkProps {
  address: string;
  short?: boolean;
}

export function AddressLink({ address, short = true }: AddressLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            href={`/address/${address}`} 
            className="font-mono text-sm text-primary hover:underline"
            data-testid={`link-address-${address.slice(0, 8)}`}
          >
            {short ? formatHash(address) : address}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{address}</p>
        </TooltipContent>
      </Tooltip>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 hover-elevate active-elevate-2"
        onClick={copyToClipboard}
        data-testid="button-copy-address"
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
