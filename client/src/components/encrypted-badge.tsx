import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getEncryptedTypeLabel } from "@/lib/utils";
import type { EncryptedValue } from "@shared/schema";

interface EncryptedBadgeProps {
  value: EncryptedValue;
}

export function EncryptedBadge({ value }: EncryptedBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className="bg-encrypted/10 border-encrypted text-encrypted dark:bg-encrypted-dark/10 dark:border-encrypted-dark dark:text-encrypted-dark font-mono text-xs gap-1"
          data-testid={`badge-encrypted-${value.type}`}
        >
          <Lock className="h-3 w-3" />
          {value.type}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{getEncryptedTypeLabel(value.type)}</p>
        <p className="text-xs text-muted-foreground mt-1">Handle: {value.handle}</p>
        {value.authorized && (
          <p className="text-xs text-success mt-1">✓ You have access</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
